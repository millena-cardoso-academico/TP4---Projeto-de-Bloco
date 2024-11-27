import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

function Carousel({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setSlidesToShow(5);
      } else if (window.innerWidth >= 1024) {
        setSlidesToShow(4);
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(1);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - slidesToShow : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex >= slides.length - slidesToShow;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (!slides.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="text-gray-500 dark:text-gray-400">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="w-full relative" {...handlers}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / slidesToShow}%` }}
            >
              <Link to={`/movie/${slide.id}`} className="block relative">
                <div className="bg-gray-700 dark:bg-gray-300 p-4 rounded-lg flex flex-col items-center hover:scale-105 transform transition-transform duration-300">
                  <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden rounded relative">
                    <img
                      src={slide.image || 'https://via.placeholder.com/300x450?text=Sem+Imagem'}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {slide.isWatched && (
                      <div className="absolute top-2 right-2">
                        <span role="img" aria-label="Visto" className="text-3xl">
                          👁️
                        </span>
                      </div>
                    )}
                  </div>
                  <h3
                    className="text-lg mt-4 text-center text-white dark:text-gray-800 overflow-hidden w-full"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {slide.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-indigo-600 dark:bg-indigo-400 text-white dark:text-black p-2 rounded-full shadow hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Slide Anterior"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-indigo-600 dark:bg-indigo-400 text-white dark:text-black p-2 rounded-full shadow hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Próximo Slide"
      >
        &#10095;
      </button>
    </div>
  );
}

export default Carousel;
