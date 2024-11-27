import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function WatchedMoviesList() {
  const { signed } = useAuth();
  const currentUser = localStorage.getItem('currentUser');
  const [watchedMovies, setWatchedMovies] = useState([]);
  const API_KEY = 'b7971bb1312f288fe017f07f7b667df3';

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      try {
        if (signed && currentUser) {
          const response = await axios.get(`http://localhost:3001/watched/${currentUser}`);
          const movieIds = response.data.watchedMovies || [];

          const moviePromises = movieIds.map(async (id) => {
            const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
              params: {
                api_key: API_KEY,
                language: 'pt-BR',
              },
            });
            return movieResponse.data;
          });

          const movies = await Promise.all(moviePromises);
          setWatchedMovies(movies);
        }
      } catch (error) {
        console.error('Erro ao buscar filmes assistidos:', error);
      }
    };

    fetchWatchedMovies();
  }, [signed, currentUser, API_KEY]);

  if (!signed) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-gray-500 dark:text-gray-400">Você precisa estar logado para ver sua lista.</span>
      </div>
    );
  }

  if (!watchedMovies.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-gray-500 dark:text-gray-400">Nenhum filme marcado como visto.</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white dark:text-gray-800 mb-8">Minha Lista</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {watchedMovies.map((movie) => (
          <div key={movie.id} className="bg-gray-700 dark:bg-gray-300 p-4 rounded-lg">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto rounded hover:scale-105 transform transition-transform duration-300"
                loading="lazy"
              />
              <h3 className="text-lg mt-2 text-center text-white dark:text-gray-800">{movie.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WatchedMoviesList;
