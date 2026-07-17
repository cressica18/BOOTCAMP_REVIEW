import React from 'react';
import './ErrorMessage.css';

export default function ErrorMessage({ message, onClose }) {
  return (
    <div className="error-message">
      <div className="error-icon">⚠</div>
      <span className="error-text">{message}</span>
      <button className="error-close" onClick={onClose} aria-label="Close error">×</button>
    </div>
  );
}