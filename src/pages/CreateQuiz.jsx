import { useState } from 'react';
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { createQuiz } from '../services/quizService';
import './CreateQuiz.css';

function CreateQuiz() {
  const [quiz, setQuiz] = useState({
    title: '',
    subject: '',
    description: '',
    difficulty: 'medium',
    timeLimit: 30,
    questions: [
      {
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'medium',
      }
    ]
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: '',
          difficulty: 'medium',
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (quiz.questions.length === 1) {
      setMessage('At least one question is required');
      return;
    }
    const newQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateOption = (qIndex, optIndex, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!quiz.title || !quiz.subject) {
      setMessage('Please fill in title and subject');
      return;
    }
    
    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      if (!q.text) {
        setMessage(`Question ${i + 1} has no text`);
        return;
      }
      if (q.options.some(opt => !opt)) {
        setMessage(`Question ${i + 1} has empty options`);
        return;
      }
    }
    
    setSaving(true);
    try {
      await createQuiz(quiz);
      setMessage('Quiz created successfully!');
      setTimeout(() => {
        window.location.href = '/teacher/quizzes';
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create quiz');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-quiz-page">
      <h1>Create New Quiz</h1>
      <p>Create engaging quizzes for your students</p>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="quiz-form">
        <div className="form-section">
          <h2>Quiz Information</h2>
          <div className="form-group">
            <label>Quiz Title *</label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              placeholder="e.g., Mathematics Midterm Quiz"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                value={quiz.subject}
                onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
                placeholder="e.g., Mathematics"
              />
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <select value={quiz.difficulty} onChange={(e) => setQuiz({ ...quiz, difficulty: e.target.value })}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Limit (minutes)</label>
              <input
                type="number"
                value={quiz.timeLimit}
                onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })}
                min="5"
                max="120"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={quiz.description}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              placeholder="Describe what this quiz covers..."
              rows="3"
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Questions</h2>
            <button type="button" className="add-question-btn" onClick={addQuestion}>
              <FaPlus /> Add Question
            </button>
          </div>

          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="question-card">
              <div className="question-header">
                <h3>Question {qIndex + 1}</h3>
                <button type="button" className="remove-btn" onClick={() => removeQuestion(qIndex)}>
                  <FaTrash />
                </button>
              </div>
              
              <div className="form-group">
                <label>Question Text</label>
                <textarea
                  value={question.text}
                  onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                  placeholder="Enter your question here..."
                  rows="2"
                />
              </div>
              
              <div className="options-section">
                <label>Options</label>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="option-input">
                    <span className="option-letter">{String.fromCharCode(65 + optIndex)}.</span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    />
                    <button
                      type="button"
                      className={`correct-btn ${question.correctAnswer === optIndex ? 'active' : ''}`}
                      onClick={() => updateQuestion(qIndex, 'correctAnswer', optIndex)}
                    >
                      {question.correctAnswer === optIndex ? '✓ Correct' : 'Set Correct'}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty (for this question)</label>
                  <select
                    value={question.difficulty}
                    onChange={(e) => updateQuestion(qIndex, 'difficulty', e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Explanation (optional)</label>
                  <input
                    type="text"
                    value={question.explanation}
                    onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                    placeholder="Explain why this answer is correct..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="save-quiz-btn" disabled={saving}>
            <FaSave /> {saving ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateQuiz;