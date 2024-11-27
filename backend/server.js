const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: 'http://localhost:5173', 
    optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

const db = new sqlite3.Database(':memory:'); 

// Criar tabela de usuários
db.serialize(() => {
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
});

// Criar tabela de filmes vistos
db.serialize(() => {
  db.run(`
    CREATE TABLE watched_movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      movie_id INTEGER,
      UNIQUE(user_id, movie_id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

// **Novo**: Criar tabela de avaliações
db.serialize(() => {
  db.run(`
    CREATE TABLE ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      movie_id INTEGER,
      rating INTEGER,
      UNIQUE(user_id, movie_id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

// Endpoint para marcar um filme como visto
app.post('/watched', (req, res) => {
  const { username, movie_id } = req.body;

  // Obter o ID do usuário a partir do nome de usuário
  db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Erro no servidor' });
    } else if (user) {
      // Inserir registro na tabela watched_movies
      const stmt = db.prepare('INSERT INTO watched_movies (user_id, movie_id) VALUES (?, ?)');
      stmt.run(user.id, movie_id, function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'Filme já marcado como visto' });
          } else {
            res.status(500).json({ error: 'Erro no servidor' });
          }
        } else {
          res.status(200).json({ message: 'Filme marcado como visto' });
        }
      });
      stmt.finalize();
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  });
});

// Endpoint para obter filmes vistos pelo usuário
app.get('/watched/:username', (req, res) => {
  const { username } = req.params;

  db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Erro no servidor' });
    } else if (user) {
      db.all('SELECT movie_id FROM watched_movies WHERE user_id = ?', [user.id], (err, rows) => {
        if (err) {
          res.status(500).json({ error: 'Erro no servidor' });
        } else {
          const movieIds = rows.map(row => row.movie_id);
          res.status(200).json({ watchedMovies: movieIds });
        }
      });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  });
});

// Endpoint para enviar ou atualizar uma avaliação
app.post('/ratings', (req, res) => {
  const { username, movie_id, rating } = req.body;

  // Validar o valor da avaliação
  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: 'A avaliação deve ser um número entre 1 e 5' });
    return;
  }

  db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Erro no servidor' });
    } else if (user) {
      // Inserir ou atualizar a avaliação
      const stmt = db.prepare('INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)');
      stmt.run(user.id, movie_id, rating, function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            // Atualizar a avaliação existente
            const updateStmt = db.prepare('UPDATE ratings SET rating = ? WHERE user_id = ? AND movie_id = ?');
            updateStmt.run(rating, user.id, movie_id, function (err) {
              if (err) {
                res.status(500).json({ error: 'Erro no servidor' });
              } else {
                res.status(200).json({ message: 'Avaliação atualizada com sucesso' });
              }
            });
            updateStmt.finalize();
          } else {
            res.status(500).json({ error: 'Erro no servidor' });
          }
        } else {
          res.status(200).json({ message: 'Avaliação registrada com sucesso' });
        }
      });
      stmt.finalize();
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  });
});

// Endpoint para obter a avaliação de um usuário para um filme específico
app.get('/ratings/:username/:movie_id', (req, res) => {
  const { username, movie_id } = req.params;

  db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Erro no servidor' });
    } else if (user) {
      db.get('SELECT rating FROM ratings WHERE user_id = ? AND movie_id = ?', [user.id, movie_id], (err, row) => {
        if (err) {
          res.status(500).json({ error: 'Erro no servidor' });
        } else if (row) {
          res.status(200).json({ rating: row.rating });
        } else {
          res.status(200).json({ rating: null });
        }
      });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  });
});

// Endpoint de registro
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  stmt.run(username, password, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Usuário já existe' });
      } else {
        res.status(500).json({ error: 'Erro no servidor' });
      }
    } else {
      res.status(200).json({ message: 'Usuário registrado com sucesso' });
    }
  });
  stmt.finalize();
});

// Endpoint de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Erro no servidor' });
    } else if (row) {
      res.status(200).json({ message: 'Login bem-sucedido' });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
