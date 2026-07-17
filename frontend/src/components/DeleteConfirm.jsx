import React from 'react';
import './DeleteConfirm.css';

export default function DeleteConfirm({ onConfirm, onCancel, reviewerName }) {
  return (
    <div className="delete-confirm-overlay">
      <div className="delete-confirm-modal">
        <div className="modal-header">
          <span className="warning-icon">⚠</span>
          <h3 className="modal-title">CONFIRM DELETION</h3>
        </div>
        <p className="modal-text">
          Delete review from <strong>{reviewerName}</strong>? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            CANCEL
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}