import { useState, useEffect } from 'react';
import { getStudents } from '../services/teacherService';
import { createFeedback } from '../services/feedbackService';
import './TeacherStudents.css';

function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));

  const getStudentProgress = (student) => {
    if (student.progressPercentage != null) return student.progressPercentage;
    if (student.totalStudyHours != null) return Math.min(100, Math.round((student.totalStudyHours / 200) * 100));
    return 0;
  };

  const sendFeedback = async () => {
    if (!selectedStudent || !feedback) return;
    try {
      await createFeedback({ studentId: selectedStudent._id, message: feedback });
      alert('Feedback sent');
      setFeedback('');
      setSelectedStudent(null);
    } catch (err) {
      alert('Failed to send feedback');
    }
  };

  return (
    <div className="teacher-students">
      <h1>Students</h1>
      <div className="search-bar"><input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <div className="students-container">
        <div className="students-list">
          <h2>All Students ({filtered.length})</h2>
          {filtered.map(s => (
            <div key={s._id} className={`student-card ${selectedStudent?._id === s._id ? 'selected' : ''}`} onClick={() => setSelectedStudent(s)}>
              <div className="student-avatar">👤</div>
              <div className="student-details">
                <h3>{s.name}</h3>
                <p>{s.level}</p>
                <p>{s.email}</p>
              </div>
              <div className="student-progress">
                <div className="progress-circle">
                  <span>{getStudentProgress(s)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedStudent && (
          <div className="feedback-panel">
            <h2>Feedback for {selectedStudent.name}</h2>
            <div className="feedback-form">
              <textarea placeholder="Write your feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} rows="5" />
              <button onClick={sendFeedback} className="send-feedback-btn">Send Feedback</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherStudents;