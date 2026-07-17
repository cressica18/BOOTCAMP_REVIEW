import React from 'react';
import './StarRating.css';

/**
 * StarRating Component - Displays rating as stars
 * @param rating - Current rating value (1-5)
 * @param interactive - If true, stars are clickable
 * @param onChange - Handler for interactive mode
 * @param size - Optional size modifier (small, medium, large)
 */
export default function StarRating({ rating, interactive = false, onChange, size = 'medium' }) {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`star-rating star-rating--${size}`}>
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'star--filled' : 'star--empty'} ${interactive ? 'star--interactive' : ''}`}
          onClick={() => handleClick(star)}
          role={interactive ? 'button' : 'img'}
          aria-label={`${rating} out of 5 stars`}
        >
          ★
        </span>
      ))}
    </div>
  );
}