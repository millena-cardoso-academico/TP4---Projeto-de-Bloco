import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [signed, setSigned] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return !!user;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? user : null;
  });

  async function signIn(username, password) {
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });

      if (response.status === 200) {
        localStorage.setItem('currentUser', username);
        setSigned(true);
        setCurrentUser( username );
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Credenciais inválidas');
      } else {
        console.error('Erro ao conectar com o servidor:', error);
      }
      return false;
    }
  }

  function signOut() {
    localStorage.removeItem('currentUser');
    setSigned(false);
    setCurrentUser(null);
    window.location.reload();
  }

  async function register(username, password) {
    try {
      const response = await axios.post('http://localhost:3001/register', { username, password });

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error('Usuário já existe');
      } else {
        console.error('Erro ao conectar com o servidor:', error);
      }
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{ signed, signIn, signOut, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
