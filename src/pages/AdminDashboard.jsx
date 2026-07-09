import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../services/adminService';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-alert">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Students</h3>
          <p>{stats.totalStudents}</p>
        </div>
        <div className="stat-card">
          <h3>Teachers</h3>
          <p>{stats.totalTeachers}</p>
        </div>
        <div className="stat-card">
          <h3>Admins</h3>
          <p>{stats.totalAdmins}</p>
        </div>
        <div className="stat-card">
          <h3>Materials</h3>
          <p>{stats.totalMaterials}</p>
        </div>
        <div className="stat-card">
          <h3>Subjects</h3>
          <p>{stats.totalSubjects}</p>
        </div>
        <div className="stat-card">
          <h3>Feedback</h3>
          <p>{stats.totalFeedback}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/users" className="action-btn">Manage Users</Link>
          <Link to="/admin/reports" className="action-btn">View Reports</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;