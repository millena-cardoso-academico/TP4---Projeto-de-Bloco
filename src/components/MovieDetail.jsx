import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import RatingForm from '../components/RatingForm';

function MovieDetail() {
  const { id } = useParams();
  const API_KEY = 'b7971bb1312f288fe017f07f7b667df3';
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const { signed } = useAuth();
  const currentUser = localStorage.getItem('currentUser');
  const [isWatched, setIsWatched] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: API_KEY,
              language: 'pt-BR',
              append_to_response: 'credits,videos',
            },
          }
        );

        setMovie(response.data);
        setCast(response.data.credits.cast);

        if (signed && currentUser) {
          const responseWatched = await axios.get(`http://localhost:3001/watched/${currentUser}`);
          const watchedMovies = responseWatched.data.watchedMovies || [];
          setIsWatched(watchedMovies.includes(parseInt(id)));

          const responseRating = await axios.get(`http://localhost:3001/ratings/${currentUser}/${id}`);
          if (responseRating.data && responseRating.data.rating != null) {
            setUserRating(responseRating.data.rating);
            setHasRated(true);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, API_KEY, signed, currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-gray-500 dark:text-gray-400">Carregando...</span>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-gray-500 dark:text-gray-400">Filme não encontrado.</span>
      </div>
    );
  }

  const handleMarkAsWatched = async () => {
    try {
      await axios.post('http://localhost:3001/watched', {
        username: currentUser,
        movie_id: id,
      });
      setIsWatched(true);
    } catch (error) {
      console.error('Erro ao marcar o filme como visto:', error);
    }
  };

  const handleRatingSubmit = async (rating) => {
    try {
      await axios.post('http://localhost:3001/ratings', {
        username: currentUser,
        movie_id: id,
        rating,
      });
      setUserRating(rating);
      setHasRated(true);
    } catch (error) {
      console.error('Erro ao enviar a avaliação:', error);
    }
  };

  const formattedDate = new Date(movie.release_date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-gray-700 dark:bg-gray-300 p-8 rounded-lg shadow-2xl">
      <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
        &larr; Voltar
      </Link>
      <div className="mt-4 flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-auto rounded"
            loading="lazy"
          />
          {isWatched && (
            <div className="absolute top-4 right-4">
              <span role="img" aria-label="Visto" className="text-3xl">
                👁️
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 md:mt-0 md:ml-6 md:w-2/3">
          <h1 className="text-3xl font-bold text-white dark:text-gray-800">{movie.title}</h1>
          <p className="mt-2 text-gray-300 dark:text-gray-700">{movie.overview}</p>
          <div className="mt-4">
            <span className="font-semibold text-white dark:text-gray-800">Lançamento:</span>{' '}
            <span className="text-gray-300 dark:text-gray-700">{formattedDate}</span>
          </div>
          <div className="mt-2">
            <span className="font-semibold text-white dark:text-gray-800">Duração:</span>{' '}
            <span className="text-gray-300 dark:text-gray-700">{movie.runtime} minutos</span>
          </div>
          <div className="mt-2">
            <span className="font-semibold text-white dark:text-gray-800">Gêneros:</span>{' '}
            {movie.genres.map((genre) => (
              <span key={genre.id} className="text-gray-300 dark:text-gray-700 mr-2">
                {genre.name}
              </span>
            ))}
          </div>
          <div className="mt-2">
            <span className="font-semibold text-white dark:text-gray-800">Avaliação TMDB:</span>{' '}
            <span className="text-gray-300 dark:text-gray-700">{movie.vote_average} / 10</span>
          </div>

          {signed && !isWatched && (
            <button
              onClick={handleMarkAsWatched}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Marcar como visto
            </button>
          )}

          {signed && isWatched && (
            <div className="mt-4">
              <h2 className="text-xl font-bold text-white dark:text-gray-800">Sua Avaliação:</h2>
              {!hasRated ? (
                <RatingForm onSubmit={handleRatingSubmit} />
              ) : (
                <div className="mt-2">
                  <p className="text-gray-300 dark:text-gray-700">
                    Você avaliou este filme com {userRating} de 5.
                  </p>
                  <button
                    onClick={() => setHasRated(false)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Editar Avaliação
                  </button>
                </div>
              )}
            </div>
          )}

          {movie.videos && movie.videos.results.length > 0 && (
            <div className="mt-4">
              <a
                href={`https://www.youtube.com/watch?v=${movie.videos.results[0].key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-indigo-600 dark:bg-indigo-400 text-white dark:text-black rounded hover:bg-indigo-700 dark:hover:bg-indigo-500"
              >
                Assistir Trailer
              </a>
            </div>
          )}

          {cast.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white dark:text-gray-800">Elenco</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cast.slice(0, 12).map((actor) => (
                  <div key={actor.cast_id} className="bg-gray-800 dark:bg-gray-200 p-4 rounded">
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                          : 'https://via.placeholder.com/185x278?text=Sem+Imagem'
                      }
                      alt={actor.name}
                      className="w-full h-auto rounded"
                      loading="lazy"
                    />
                    <div className="mt-2">
                      <p className="text-white dark:text-gray-800 font-semibold">{actor.name}</p>
                      <p className="text-gray-300 dark:text-gray-700 text-sm">
                        como {actor.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
