// src/components/Student/GradeEntryForm.jsx
import { useState } from 'react';

export default function GradeEntryForm({ assessmentId, maxPoints, onSubmit }) {
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!score) {
      alert('Please enter a score');
      return;
    }
    onSubmit({ assessmentId, score, feedback });
    // Reset form (Optional - can be removed if form is controlled by parent)
    setScore('');
    setFeedback('');
  };

  return (
    <div className="grade-entry-form">
      <h2>Submit Grade</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="score">Score (out of {maxPoints}):</label>
          <input
            type="number"
            id="score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            min="0"
            max={maxPoints}
            step="0.5"
            placeholder="Enter score"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="feedback">Feedback:</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add instructor feedback (optional)"
            rows="4"
          />
        </div>
        <button type="submit" className="btn-primary">Submit Grade</button>
      </form>
    </div>
  );
}
