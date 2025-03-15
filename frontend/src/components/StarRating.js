import React from 'react';

const StarRating = ({ value, onChange, readonly }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          className={`text-2xl ${
            star <= value ? 'text-yellow-400' : 'text-gray-300'
          } ${!readonly && 'hover:text-yellow-400'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;