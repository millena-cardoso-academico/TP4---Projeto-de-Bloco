import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const success = await signIn(username, password);

    if (success) {
      navigate('/');
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-gray-700 dark:bg-gray-300 rounded">
      <h2 className="text-2xl font-bold mb-4 text-white dark:text-gray-800">Login</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-white dark:text-gray-800 mb-2">Usuário</label>
          <input
            type="text"
            className="w-full p-2 border rounded text-gray-800 dark:text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white dark:text-gray-800 mb-2">Senha</label>
          <input
            type="password"
            className="w-full p-2 border rounded text-gray-800 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
