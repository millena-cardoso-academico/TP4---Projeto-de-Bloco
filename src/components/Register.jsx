import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    const success = await register(username, password);

    if (success) {
      setSuccessMessage('Usuário registrado com sucesso!');
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError('Usuário já existe');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-gray-700 dark:bg-gray-300 rounded">
      <h2 className="text-2xl font-bold mb-4 text-white dark:text-gray-800">Registrar</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      {successMessage && <p className="mb-4 text-green-500">{successMessage}</p>}
      <form onSubmit={handleRegister}>
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
        <div className="mb-4">
          <label className="block text-white dark:text-gray-800 mb-2">Confirmar Senha</label>
          <input
            type="password"
            className="w-full p-2 border rounded text-gray-800 dark:text-white"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}

export default Register;
