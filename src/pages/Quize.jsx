import { useState, useEffect } from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle, FaArrowRight, FaArrowLeft, FaTrophy, FaRedo, FaHistory } from 'react-icons/fa';
import { getQuizzes, getQuizById, submitQuizAttempt, getUserAttempts } from '../services/quizService';
import './Quiz.css';

function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [showAttempts, setShowAttempts] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
    fetchAttempts();
  }, []);

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timerActive && timeLeft === 0) {
      handleQuizComplete();
    }
    return () => clearTimeout(timer);
  }, [timerActive, timeLeft]);

  const fetchQuizzes = async () => {
    try {
      const res = await getQuizzes();
      setQuizzes(res.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes');
    }
  };

  const fetchAttempts = async () => {
    try {
      const res = await getUserAttempts();
      setAttempts(res.data);
    } catch (err) {
      console.error('Error fetching attempts:', err);
    }
  };

  const startQuiz = async () => {
    if (!selectedQuizId) {
      alert('Please select a quiz');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await getQuizById(selectedQuizId);
      const quiz = res.data;
      setQuizTitle(quiz.title);
      setQuestions(quiz.questions);
      setTimeLeft(quiz.timeLimit * 60);
      setQuizStarted(true);
      setTimerActive(true);
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizComplete = async () => {
    setTimerActive(false);
    
    let correctCount = 0;
    const answersArray = questions.map((q, idx) => {
      const userAnswer = selectedAnswers[q._id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: q._id,
        selectedAnswer: userAnswer !== undefined ? userAnswer : -1,
        isCorrect,
      };
    });
    
    const totalQuestions = questions.length;
    const percent = (correctCount / totalQuestions) * 100;
    setPercentage(percent);
    setScore(correctCount);
    
    // Prepare detailed results for display
    const detailedResults = questions.map((q, idx) => {
      const userAnswer = selectedAnswers[q._id];
      const isCorrect = userAnswer === q.correctAnswer;
      return {
        question: q.text,
        userAnswer: userAnswer !== undefined ? q.options[userAnswer] : 'Not answered',
        correctAnswer: q.options[q.correctAnswer],
        isCorrect,
        explanation: q.explanation || 'No explanation available'
      };
    });
    setResults(detailedResults);
    setQuizCompleted(true);
    
    // Submit attempt to backend
    try {
      await submitQuizAttempt(selectedQuizId, {
        answers: answersArray,
        timeTaken: (questions[0]?.timeLimit * 60 || 0) - timeLeft,
      });
      fetchAttempts(); // refresh attempts list
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setSelectedQuizId('');
    setQuestions([]);
    setScore(0);
    setPercentage(0);
    setResults([]);
    setQuizTitle('');
    setError('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (!quizStarted && !quizCompleted) {
    return (
      <div className="quiz-page">
        <div className="quiz-setup">
          <h1>📝 Take a Quiz</h1>
          <p>Test your knowledge with available quizzes</p>

          {error && <div className="error-alert">{error}</div>}

          <div className="setup-form">
            <div className="form-group">
              <label>Select Quiz</label>
              <select value={selectedQuizId} onChange={(e) => setSelectedQuizId(e.target.value)}>
                <option value="">Choose a quiz</option>
                {quizzes.map(quiz => (
                  <option key={quiz._id} value={quiz._id}>
                    {quiz.title} ({quiz.subject}) - {quiz.questions?.length || 0} questions
                  </option>
                ))}
              </select>
            </div>

            <button className="start-quiz-btn" onClick={startQuiz}>
              Start Quiz <FaArrowRight />
            </button>
          </div>

          {/* Show past attempts */}
          <div className="past-attempts">
            <button className="toggle-attempts" onClick={() => setShowAttempts(!showAttempts)}>
              <FaHistory /> {showAttempts ? 'Hide Past Attempts' : 'Show Past Attempts'}
            </button>
            {showAttempts && (
              <div className="attempts-list">
                <h3>Your Previous Quiz Results</h3>
                {attempts.length === 0 ? (
                  <p>No past attempts yet.</p>
                ) : (
                  <ul>
                    {attempts.map(attempt => (
                      <li key={attempt._id}>
                        <strong>{attempt.quiz?.title || 'Quiz'}</strong> - Score: {attempt.score}/{attempt.totalQuestions} ({Math.round(attempt.percentage)}%)
                        <br />
                        <small>Completed: {new Date(attempt.completedAt).toLocaleDateString()}</small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="quiz-tips">
            <h3>📌 Quiz Tips</h3>
            <ul>
              <li>Read each question carefully</li>
              <li>Timer starts when you begin</li>
              <li>Review your answers before submitting</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-page">
        <div className="quiz-results">
          <div className="results-header">
            <FaTrophy className="trophy-icon" />
            <h1>Quiz Completed!</h1>
            <p>{quizTitle}</p>
          </div>

          <div className="score-card">
            <div className="score-circle">
              <span className="score-value">{Math.round(percentage)}%</span>
            </div>
            <div className="score-details">
              <div className="detail">
                <FaCheckCircle className="correct-icon" />
                <span>{score} Correct</span>
              </div>
              <div className="detail">
                <FaTimesCircle className="incorrect-icon" />
                <span>{questions.length - score} Incorrect</span>
              </div>
            </div>
          </div>

          <div className="results-breakdown">
            <h2>Detailed Results</h2>
            {results.map((result, idx) => (
              <div key={idx} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="result-question">
                  <span className="question-number">{idx + 1}.</span>
                  <span className="question-text">{result.question}</span>
                </div>
                <div className="result-answers">
                  <p><strong>Your answer:</strong> <span className={result.isCorrect ? 'correct-text' : 'incorrect-text'}>{result.userAnswer}</span></p>
                  <p><strong>Correct answer:</strong> <span className="correct-text">{result.correctAnswer}</span></p>
                  {result.explanation && <p className="explanation">{result.explanation}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button className="retake-btn" onClick={resetQuiz}>
              <FaRedo /> Take Another Quiz
            </button>
            <button className="review-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Review Answers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-info">
            <span className="subject-badge">{quizTitle}</span>
          </div>
          <div className="quiz-timer">
            <FaClock />
            <span className={timeLeft < 60 ? 'urgent' : ''}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${getProgressPercentage()}%` }}></div>
          </div>
          <span className="progress-text">Question {currentQuestion + 1} of {questions.length}</span>
        </div>

        <div className="question-container">
          <h2 className="question-text">{currentQ?.text}</h2>
          <div className="options-grid">
            {currentQ?.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-btn ${selectedAnswers[currentQ._id] === idx ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQ._id, idx)}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                <span className="option-text">{option}</span>
                {selectedAnswers[currentQ._id] === idx && <FaCheckCircle className="check-icon" />}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button className="nav-btn prev" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
            <FaArrowLeft /> Previous
          </button>
          <button className="nav-btn next" onClick={handleNextQuestion}>
            {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next'} <FaArrowRight />
          </button>
        </div>

        <div className="quiz-stats">
          <div className="stat">
            <span>Answered: {Object.keys(selectedAnswers).length}/{questions.length}</span>
          </div>
          <div className="stat">
            <span>Remaining: {questions.length - Object.keys(selectedAnswers).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;