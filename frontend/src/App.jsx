import React, { useState, useEffect } from 'react';
import ReviewList from './components/ReviewList.jsx';
import ReviewForm from './components/ReviewForm.jsx';
import WeekFilter from './components/WeekFilter.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [reviews, setReviews] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch reviews on mount and when week filter changes
  useEffect(() => {
    fetchReviews();
  }, [selectedWeek]);

  // Fetch available week numbers
  useEffect(() => {
    fetchWeeks();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedWeek
        ? `${API_URL}/api/reviews?week=${selectedWeek}`
        : `${API_URL}/api/reviews`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setReviews(data.data || []);
    } catch (err) {
      setError(err.message);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/weeks`);
      if (!res.ok) throw new Error('Failed to fetch weeks');
      const data = await res.json();
      setWeeks(data.data || []);
    } catch (err) {
      console.error('Failed to fetch weeks:', err);
    }
  };

  const addReview = async (reviewData) => {
    setFormLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Failed to add review');
      }
      await fetchReviews();
      await fetchWeeks();
      setShowForm(false);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setFormLoading(false);
    }
  };

  const deleteReview = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Failed to delete review');
      }
      await fetchReviews();
      await fetchWeeks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">BOOTCAMP REVIEW</h1>
          <p className="tagline">System Status: ONLINE</p>
        </div>
      </header>

      <main className="main">
        <div className="controls">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'CLOSE' : '+ NEW REVIEW'}
          </button>
          <WeekFilter weeks={weeks} selectedWeek={selectedWeek} onChange={setSelectedWeek} />
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {showForm && (
          <ReviewForm onSubmit={addReview} loading={formLoading} />
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <ReviewList reviews={reviews} onDelete={deleteReview} />
        )}
      </main>

      <footer className="footer">
        <p>// bootcamp review system // data persistence active //</p>
      </footer>
    </div>
  );
}