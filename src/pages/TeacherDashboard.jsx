import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherDashboard, getStudents } from '../services/teacherService';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([getTeacherDashboard(), getStudents()]);
        setStats(statsRes.data);
        setStudents(studentsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="teacher-dashboard">
      <h1>Teacher Dashboard</h1>
      <div className="teacher-stats">
        <div className="stat-card"><h3>👥 Total Students</h3><p>{stats.totalStudents}</p></div>
        <div className="stat-card"><h3>📚 Materials</h3><p>{stats.activeMaterials}</p></div>
        <div className="stat-card"><h3>💬 Pending Feedback</h3><p>{stats.pendingFeedback}</p></div>
        <div className="stat-card"><h3>📊 Avg. Performance</h3><p>{stats.averagePerformance}%</p></div>
      </div>
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/teacher/materials" className="action-btn">➕ Upload Material</Link>
          <Link to="/teacher/students" className="action-btn">👥 View Students</Link>
        </div>
      </div>
      <div className="performance-table">
        <h2>Student Performance</h2>
        <table>
          <thead><tr><th>Name</th><th>Level</th><th>Progress</th></tr></thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.level}</td>
                <td>{Math.floor(Math.random() * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeacherDashboard;