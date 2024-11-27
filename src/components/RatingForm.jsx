import React, { useState } from 'react';

function RatingForm({ onSubmit }) {
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && rating <= 5) {
      onSubmit(rating);
    } else {
      alert('Por favor, selecione uma avaliação entre 1 e 5.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            className={`text-3xl ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
          >
            ★
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Enviar Avaliação
      </button>
    </form>
  );
}

export default RatingForm;
