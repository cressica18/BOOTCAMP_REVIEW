import React, { useState } from 'react';
import StarRating from './StarRating.jsx';
import DeleteConfirm from './DeleteConfirm.jsx';
import './ReviewCard.css';

export default function ReviewCard({ review, onDelete, style }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(review.id);
    setShowConfirm(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <article className="review-card" style={style}>
        <div className="card-header">
          <div className="card-meta">
            <span className="week-badge">WEEK {review.weekNumber}</span>
            <span className="card-date">{formatDate(review.createdAt)}</span>
          </div>
          <button
            className="btn btn-danger"
            onClick={() => setShowConfirm(true)}
            aria-label={`Delete review from ${review.reviewerName}`}
          >
            DELETE
          </button>
        </div>

        <div className="card-content">
          <h3 className="reviewer-name">{review.reviewerName}</h3>
          <StarRating rating={review.rating} />
          <p className="review-text">{review.reviewText}</p>
        </div>
      </article>

      {showConfirm && (
        <DeleteConfirm
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          reviewerName={review.reviewerName}
        />
      )}
    </>
  );
}