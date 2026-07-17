import React from 'react';
import './WeekFilter.css';

export default function WeekFilter({ weeks, selectedWeek, onChange }) {
  const handleChange = (e) => {
    const value = e.target.value;
    onChange(value ? Number(value) : null);
  };

  return (
    <div className="week-filter">
      <label className="filter-label" htmlFor="week-select">
        FILTER BY WEEK
      </label>
      <select
        id="week-select"
        value={selectedWeek || ''}
        onChange={handleChange}
        className="select"
      >
        <option value="">ALL WEEKS</option>
        {weeks.map((week) => (
          <option key={week} value={week}>
            WEEK {week}
          </option>
        ))}
      </select>
      {selectedWeek && (
        <button
          className="clear-filter"
          onClick={() => onChange(null)}
          aria-label="Clear week filter"
        >
          ×
        </button>
      )}
    </div>
  );
}