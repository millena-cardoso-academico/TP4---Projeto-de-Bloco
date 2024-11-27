import React, { useEffect, useState } from 'react';
import Carousel from './Carousel';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function MovieCarousel() {
  const API_KEY = 'b7971bb1312f288fe017f07f7b667df3';
  const [categories, setCategories] = useState([]);
  const { signed } = useAuth();
  const currentUser = localStorage.getItem('currentUser');
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      try {
        if (signed && currentUser) {
          const response = await axios.get(`http://localhost:3001/watched/${currentUser}`);
          setWatchedMovies(response.data.watchedMovies || []);
        }
      } catch (error) {
        console.error('Erro ao buscar filmes assistidos:', error);
      }
    };

    fetchWatchedMovies();
  }, [signed, currentUser]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const genresResponse = await axios.get(
          'https://api.themoviedb.org/3/genre/movie/list',
          {
            params: {
              api_key: API_KEY,
              language: 'pt-BR',
            },
          }
        );

        const genres = genresResponse.data.genres;

        const promises = genres.map(async (genre) => {
          const moviesResponse = await axios.get(
            'https://api.themoviedb.org/3/discover/movie',
            {
              params: {
                api_key: API_KEY,
                language: 'pt-BR',
                with_genres: genre.id,
              },
            }
          );

          const movies = moviesResponse.data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            image: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
            isWatched: watchedMovies.includes(movie.id),
          }));

          return {
            name: genre.name,
            movies,
          };
        });

        const categoriesData = await Promise.all(promises);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    fetchCategories();
  }, [API_KEY, watchedMovies]);

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar filmes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-800"
        />
      </div>

      {categories.map((category, index) => {
        const filteredMovies = category.movies.filter((movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredMovies.length === 0) return null;

        return (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-800">{category.name}</h2>
            <Carousel slides={filteredMovies} />
          </div>
        );
      })}
    </div>
  );
}

export default MovieCarousel;
