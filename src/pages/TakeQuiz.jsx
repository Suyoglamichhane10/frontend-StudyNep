import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaClock, FaCheckCircle, FaTimesCircle, FaArrowRight, 
  FaArrowLeft, FaFlag, FaPause, FaPlay, FaSave, FaListUl,
  FaQuestionCircle, FaChevronRight, FaChevronLeft
} from 'react-icons/fa';
import { getQuizById, submitQuizAttempt } from '../services/quizService';
import './TakeQuiz.css';

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && timeLeft > 0 && timerActive) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, timeLeft, timerActive]);

  const fetchQuiz = async () => {
    try {
      const res = await getQuizById(id);
      setQuiz(res.data);
      setTimeLeft(res.data.timeLimit * 60);
      setAnswers(new Array(res.data.questions.length).fill(null));
    } catch (err) {
      setError('Failed to load quiz');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleFlagQuestion = (questionIndex) => {
    if (flaggedQuestions.includes(questionIndex)) {
      setFlaggedQuestions(flaggedQuestions.filter(q => q !== questionIndex));
    } else {
      setFlaggedQuestions([...flaggedQuestions, questionIndex]);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestion(index);
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const handleAutoSubmit = () => {
    const unansweredCount = answers.filter(a => a === null).length;
    if (unansweredCount > 0) {
      if (window.confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`)) {
        submitQuiz();
      } else {
        setTimerActive(true);
      }
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = answers.map((answer, idx) => ({
        questionId: quiz.questions[idx]._id,
        selectedAnswer: answer,
      }));
      
      const timeTaken = (quiz.timeLimit * 60) - timeLeft;
      
      const res = await submitQuizAttempt(id, {
        answers: formattedAnswers,
        timeTaken,
      });
      
      navigate(`/quiz/results/${id}`, { 
        state: { 
          result: res.data,
          quizTitle: quiz.title,
          questions: quiz.questions,
          userAnswers: answers
        } 
      });
    } catch (err) {
      alert('Failed to submit quiz. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0) {
      setShowConfirm(true);
    } else {
      submitQuiz();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getProgressPercentage = () => {
    const answered = answers.filter(a => a !== null).length;
    return (answered / quiz.questions.length) * 100;
  };

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const getAnswerStatus = (index) => {
    if (answers[index] !== null) return 'answered';
    if (flaggedQuestions.includes(index)) return 'flagged';
    return 'unanswered';
  };

  if (loading) {
    return (
      <div className="takequiz-loading">
        <div className="loading-spinner"></div>
        <p>Loading your quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="takequiz-error">
        <FaTimesCircle className="error-icon" />
        <p>{error}</p>
        <button onClick={() => navigate('/quiz')} className="back-btn">Back to Quizzes</button>
      </div>
    );
  }

  if (!quiz) return null;

  const currentQ = quiz.questions[currentQuestion];
  const answeredCount = answers.filter(a => a !== null).length;
  const totalQuestions = quiz.questions.length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className="takequiz-page">
      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-info">
          <span className="quiz-badge">{quiz.subject}</span>
          <h1>{quiz.title}</h1>
          <p className="quiz-description">{quiz.description || 'Test your knowledge with this quiz'}</p>
        </div>
        <div className="quiz-controls">
          <div className={`timer ${timeLeft < 60 ? 'urgent' : ''}`}>
            <FaClock className="timer-icon" />
            <span className="timer-text">{formatTime(timeLeft)}</span>
            <button onClick={toggleTimer} className="timer-toggle" title={timerActive ? 'Pause timer' : 'Resume timer'}>
              {timerActive ? <FaPause /> : <FaPlay />}
            </button>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
            title="Toggle question navigator"
          >
            <FaListUl />
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-header">
          <div className="progress-stats">
            <span className="progress-label">Progress</span>
            <span className="progress-count">{answeredCount} / {totalQuestions} answered</span>
          </div>
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="quiz-main">
        {/* Sidebar */}
        {showSidebar && (
          <div className="question-sidebar">
            <div className="sidebar-header">
              <h3>Questions</h3>
              <span className="question-count">{totalQuestions}</span>
            </div>
            <div className="question-grid">
              {quiz.questions.map((_, idx) => {
                const status = getAnswerStatus(idx);
                const isActive = currentQuestion === idx;
                return (
                  <button
                    key={idx}
                    className={`question-nav-btn ${status} ${isActive ? 'active' : ''}`}
                    onClick={() => handleJumpToQuestion(idx)}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                    {status === 'flagged' && <FaFlag className="flag-indicator" />}
                    {status === 'answered' && <FaCheckCircle className="check-indicator" />}
                  </button>
                );
              })}
            </div>
            <div className="sidebar-legend">
              <div className="legend-item">
                <span className="legend-dot answered"></span>
                <span>Answered</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot flagged"></span>
                <span>Flagged</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot unanswered"></span>
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        )}

        {/* Question Area */}
        <div className="question-container">
          <div className="question-header">
            <div className="question-meta">
              <span className="question-number">
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
              <span className="question-status">
                {answers[currentQuestion] !== null ? (
                  <span className="status-answered"><FaCheckCircle /> Answered</span>
                ) : flaggedQuestions.includes(currentQuestion) ? (
                  <span className="status-flagged"><FaFlag /> Flagged</span>
                ) : (
                  <span className="status-unanswered"><FaQuestionCircle /> Unanswered</span>
                )}
              </span>
            </div>
            <button 
              className={`flag-btn ${flaggedQuestions.includes(currentQuestion) ? 'flagged' : ''}`}
              onClick={() => handleFlagQuestion(currentQuestion)}
            >
              <FaFlag /> {flaggedQuestions.includes(currentQuestion) ? 'Flagged' : 'Flag for review'}
            </button>
          </div>

          <div className="question-content">
            <div className="question-text">
              <h2>{currentQ.text}</h2>
            </div>

            <div className="options-list">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentQuestion] === idx;
                const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                return (
                  <button
                    key={idx}
                    className={`option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(currentQuestion, idx)}
                  >
                    <span className={`option-letter ${isSelected ? 'selected' : ''}`}>
                      {letters[idx]}
                    </span>
                    <span className="option-text">{option}</span>
                    {isSelected && <FaCheckCircle className="check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="question-navigation">
            <button 
              className="nav-btn prev" 
              onClick={handlePrev} 
              disabled={currentQuestion === 0}
            >
              <FaChevronLeft /> Previous
            </button>
            <div className="nav-center">
              <span className="nav-indicator">
                {currentQuestion + 1} / {totalQuestions}
              </span>
            </div>
            <button 
              className="nav-btn next" 
              onClick={handleNext}
              disabled={currentQuestion === totalQuestions - 1}
            >
              Next <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="quiz-footer">
        <div className="footer-stats">
          <div className="footer-stat">
            <FaCheckCircle className="stat-icon answered" />
            <span>{answeredCount} answered</span>
          </div>
          <div className="footer-stat">
            <FaFlag className="stat-icon flagged" />
            <span>{flaggedQuestions.length} flagged</span>
          </div>
          <div className="footer-stat">
            <FaClock className="stat-icon time" />
            <span>{formatTime(timeLeft)} remaining</span>
          </div>
        </div>
        <button 
          className="submit-btn" 
          onClick={handleSubmit}
          disabled={submitting}
        >
          <FaSave /> {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3>Submit Quiz?</h3>
            <p>You have <strong>{answers.filter(a => a === null).length}</strong> unanswered question(s).</p>
            <p className="modal-sub">Are you sure you want to submit?</p>
            <div className="modal-actions">
              <button onClick={() => setShowConfirm(false)} className="cancel-btn">
                Continue Quiz
              </button>
              <button onClick={submitQuiz} className="confirm-btn">
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TakeQuiz;