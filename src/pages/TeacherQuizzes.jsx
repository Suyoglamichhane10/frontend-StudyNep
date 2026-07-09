import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaChartLine } from 'react-icons/fa';
import { getTeacherQuizzes, deleteQuiz } from '../services/quizService';
import './TeacherQuizzes.css';

function TeacherQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await getTeacherQuizzes();
      setQuizzes(res.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q._id !== id));
    } catch (err) {
      alert('Failed to delete quiz');
    }
  };

  if (loading) return <div className="loading">Loading quizzes...</div>;

  return (
    <div className="teacher-quizzes">
      <div className="header">
        <h1>My Quizzes</h1>
        <Link to="/create-quiz" className="create-btn">
          <FaPlus /> Create New Quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any quizzes yet.</p>
          <Link to="/create-quiz" className="create-first-btn">Create Your First Quiz</Link>
        </div>
      ) : (
        <div className="quizzes-grid">
          {quizzes.map(quiz => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-header">
                <h3>{quiz.title}</h3>
                <span className={`difficulty ${quiz.difficulty}`}>{quiz.difficulty}</span>
              </div>
              <p className="quiz-subject">{quiz.subject}</p>
              <p className="quiz-description">{quiz.description}</p>
              <div className="quiz-stats">
                <span>📝 {quiz.questions?.length || 0} questions</span>
                <span>⏱️ {quiz.timeLimit} min</span>
                <span>📊 {quiz.attempts || 0} attempts</span>
                <span>⭐ {Math.round(quiz.averageScore || 0)}% avg</span>
              </div>
              <div className="quiz-actions">
                <Link to={`/quiz/${quiz._id}/preview`} className="action-btn preview">
                  <FaEye /> Preview
                </Link>
                <Link to={`/edit-quiz/${quiz._id}`} className="action-btn edit">
                  <FaEdit /> Edit
                </Link>
                <button onClick={() => handleDelete(quiz._id)} className="action-btn delete">
                  <FaTrash /> Delete
                </button>
                <Link to={`/quiz/${quiz._id}/stats`} className="action-btn stats">
                  <FaChartLine /> Stats
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherQuizzes;