import React, { useState } from 'react';
import StarRating from './StarRating.jsx';
import './ReviewForm.css';

export default function ReviewForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    weekNumber: '',
    reviewerName: '',
    rating: 3,
    reviewText: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' || name === 'weekNumber' ? Number(value) : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.weekNumber || formData.weekNumber < 1 || formData.weekNumber > 52) {
      newErrors.weekNumber = 'Week must be between 1-52';
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating required (1-5)';
    }

    if (!formData.reviewText || formData.reviewText.length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters';
    }

    if (formData.reviewerName && formData.reviewerName.length > 50) {
      newErrors.reviewerName = 'Name max 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await onSubmit(formData);
    if (result.success) {
      setFormData({
        weekNumber: '',
        reviewerName: '',
        rating: 3,
        reviewText: '',
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h2 className="form-title">TRANSMISSION FORM</h2>

      {showSuccess && (
        <div className="success-message">
          REVIEW SUBMITTED SUCCESSFULLY
        </div>
      )}

      <div className="form-grid">
        {/* WEEK NUMBER */}
        <div className="form-group">
          <label className="form-label" htmlFor="weekNumber">
            WEEK NUMBER
          </label>
          <input
            id="weekNumber"
            name="weekNumber"
            type="number"
            min="1"
            max="52"
            value={formData.weekNumber}
            onChange={handleChange}
            className={`input ${errors.weekNumber ? 'input-error' : ''}`}
            placeholder="Enter week (1-52)"
            disabled={loading}
          />
          {errors.weekNumber && <span className="error-text">{errors.weekNumber}</span>}
        </div>

        {/* REVIEWER NAME */}
        <div className="form-group">
          <label className="form-label" htmlFor="reviewerName">
            REVIEWER NAME <span className="optional">(OPTIONAL)</span>
          </label>
          <input
            id="reviewerName"
            name="reviewerName"
            type="text"
            value={formData.reviewerName}
            onChange={handleChange}
            className={`input ${errors.reviewerName ? 'input-error' : ''}`}
            placeholder="Anonymous if empty"
            disabled={loading}
            maxLength="50"
          />
          {errors.reviewerName && <span className="error-text">{errors.reviewerName}</span>}
        </div>
      </div>

      {/* RATING */}
      <div className="form-group">
        <label className="form-label">RATING</label>
        <div className="rating-picker">
          <input
            name="rating"
            type="range"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            className="rating-input"
            disabled={loading}
          />
          <div className="rating-display">
            <StarRating rating={formData.rating} interactive={true} onChange={(r) => setFormData(prev => ({...prev, rating: r}))} />
            <span className="rating-value">{formData.rating} / 5</span>
          </div>
        </div>
        {errors.rating && <span className="error-text">{errors.rating}</span>}
      </div>

      {/* REVIEW TEXT */}
      <div className="form-group">
        <label className="form-label" htmlFor="reviewText">
          REVIEW TEXT
        </label>
        <textarea
          id="reviewText"
          name="reviewText"
          value={formData.reviewText}
          onChange={handleChange}
          className={`textarea ${errors.reviewText ? 'input-error' : ''}`}
          placeholder="Enter your review..."
          rows="4"
          disabled={loading}
        />
        {errors.reviewText && <span className="error-text">{errors.reviewText}</span>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'TRANSMITTING...' : 'SUBMIT REVIEW'}
      </button>
    </form>
  );
}