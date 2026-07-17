import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">LOADING SYSTEM</p>
    </div>
  );
}