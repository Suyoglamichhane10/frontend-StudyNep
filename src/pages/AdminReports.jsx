import { useState, useEffect } from 'react';
import { getReports } from '../services/adminService';
import './AdminReports.css';

function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        setReports(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="loading">Loading reports...</div>;
  if (error) return <div className="error-alert">{error}</div>;

  return (
    <div className="admin-reports">
      <h1>System Reports</h1>

      <div className="reports-section">
        <h2>Users by Role</h2>
        <div className="stats-mini">
          {reports.usersByRole.map(item => (
            <div key={item._id} className="stat-mini-card">
              <h3>{item._id}</h3>
              <p>{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="reports-section">
        <h2>Recent Users</h2>
        <table className="recent-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {reports.recentUsers.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="reports-section">
        <h2>Recent Materials</h2>
        <table className="recent-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Uploaded By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.recentMaterials.map(mat => (
              <tr key={mat._id}>
                <td>{mat.title}</td>
                <td>{mat.type}</td>
                <td>{mat.uploadedBy?.name || 'Unknown'}</td>
                <td>{new Date(mat.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminReports;