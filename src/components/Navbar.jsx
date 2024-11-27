import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar({ toggleTheme, theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const { signed, signOut } = useAuth();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3" onClick={handleLinkClick}>
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white dark:text-gray-800">
            DigiFlix
          </span>
        </Link>
        <button
          onClick={handleToggle}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Abrir menu principal</span>
          {isOpen ? (
            <svg
              className="w-6 h-6 text-white dark:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-white dark:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        <div
          className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0">
            <li>
              <Link
                to="/"
                onClick={handleLinkClick}
                className="block py-2 px-3 text-white dark:text-gray-800 rounded hover:bg-gray-700 dark:hover:bg-gray-300 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
              >
                Início
              </Link>
            </li>
            {signed && (
              <li>
                <Link
                  to="/mylist"
                  onClick={handleLinkClick}
                  className="block py-2 px-3 text-white dark:text-gray-800 rounded hover:bg-gray-700 dark:hover:bg-gray-300 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                >
                  Minha Lista
                </Link>
              </li>
            )}
            <li className="mt-4 md:mt-0 md:ml-4 flex items-center space-x-4">
              {signed ? (
                <button
                  onClick={() => {
                    signOut();
                    handleLinkClick();
                  }}
                  className="text-white dark:text-gray-800 hover:underline"
                >
                  Sair
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="text-white dark:text-gray-800 hover:underline"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleLinkClick}
                    className="text-white dark:text-gray-800 hover:underline"
                  >
                    Registrar
                  </Link>
                </>
              )}
            </li>
            <li className="mt-4 md:mt-0 md:ml-4">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-full md:w-auto rounded text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors duration-300"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
