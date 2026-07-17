import React from 'react';
import ReviewCard from './ReviewCard.jsx';
import './ReviewList.css';

export default function ReviewList({ reviews, onDelete }) {
  if (reviews.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">EMPTY</div>
        <h3 className="empty-title">NO REVIEWS DETECTED</h3>
        <p className="empty-text">System awaiting input. Submit a review to begin transmission.</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      {reviews.map((review, index) => (
        <ReviewCard
          key={review.id}
          review={review}
          onDelete={onDelete}
          style={{ '--delay': `${index * 0.05}s` }}
        />
      ))}
    </div>
  );
}