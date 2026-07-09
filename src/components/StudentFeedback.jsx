import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFeedbackForStudent } from '../services/feedbackService';
import './StudentFeedback.css';

export default function StudentFeedback() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchFeedback();
  }, [user]);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFeedbackForStudent(user._id);
      setFeedbacks(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="student-feedback card">
      <h3>💬 Teacher Feedback</h3>
      {loading ? (
        <p>Loading feedback...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        <ul className="feedback-list">
          {feedbacks.map(f => (
            <li key={f._id} className={`feedback-item ${f.isRead ? '' : 'unread'}`}>
              <div className="feedback-meta">
                <strong>{f.teacher?.name || 'Teacher'}</strong>
                <span className="date">{new Date(f.createdAt).toLocaleString()}</span>
              </div>
              <div className="feedback-message">{f.message}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
