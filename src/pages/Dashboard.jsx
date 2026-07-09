import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSubjects } from '../services/subjectService';
import { getDashboardStats, getRecentActivities } from '../services/progressService.js';
import DailyQuote from '../components/DailyQuote';
import AchievementBadges from '../components/AcheivementBadges';
import StudentFeedback from '../components/StudentFeedback';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, statsRes, activitiesRes] = await Promise.all([
        getSubjects(),
        getDashboardStats(),
        getRecentActivities()
      ]);
      setSubjects(subjectsRes.data);
      setStats(statsRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate days remaining
  const getDaysRemaining = (examDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to get formatted days remaining text
  const getDaysRemainingText = (examDate) => {
    const days = getDaysRemaining(examDate);
    
    if (days < 0) {
      return `📅 Passed`;
    } else if (days === 0) {
      return `🔥 Today!`;
    } else if (days === 1) {
      return `⚠️ Tomorrow`;
    } else if (days <= 3) {
      return `⚠️ ${days} days left`;
    } else if (days <= 7) {
      return `📅 ${days} days left`;
    } else {
      return `📅 ${days} days left`;
    }
  };

  // Get CSS class based on urgency
  const getUrgencyClass = (examDate) => {
    const days = getDaysRemaining(examDate);
    if (days < 0) return 'passed';
    if (days === 0) return 'today';
    if (days <= 3) return 'urgent';
    if (days <= 7) return 'warning';
    return 'normal';
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const upcomingDeadlines = subjects
    .filter(s => !s.completed && new Date(s.examDate) > new Date())
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
    .slice(0, 5);

  const totalHours = stats.totalHours || 0;
  const completedSubjects = stats.completedSubjects || 0;
  const streak = stats.streak || 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Keep up the great work! 🔥</p>
        </div>
        <DailyQuote />
      </div>

      <div className="stats-grid">
        <div className="stat-card"><h3>Total Subjects</h3><p>{stats.totalSubjects || 0}</p></div>
        <div className="stat-card"><h3>Completed</h3><p>{completedSubjects}</p></div>
        <div className="stat-card"><h3>Study Hours</h3><p>{totalHours}h</p></div>
        <div className="stat-card"><h3>Study Streak</h3><p>{streak} days</p></div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>📚 Upcoming Deadlines</h3>
          {upcomingDeadlines.length === 0 ? (
            <p>No upcoming deadlines. Great job!</p>
          ) : (
            upcomingDeadlines.map(s => {
              const daysRemaining = getDaysRemaining(s.examDate);
              return (
                <div key={s._id} className={`deadline-item ${getUrgencyClass(s.examDate)}`}>
                  <span className="deadline-name">{s.name}</span>
                  <span className="deadline-days">
                    {getDaysRemainingText(s.examDate)}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="card">
          <h3>🕒 Recent Activity</h3>
          {activities.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            activities.slice(0, 5).map(a => (
              <div key={a._id} className="activity-item">{a.description}</div>
            ))
          )}
        </div>
      </div>

      {/* Show student feedback on dashboard for students */}
      {user?.role === 'student' && (
        <div className="dashboard-grid">
          <div className="card">
            <StudentFeedback />
          </div>
        </div>
      )}

      <AchievementBadges streak={streak} totalHours={totalHours} completedSubjects={completedSubjects} />
    </div>
  );
}

export default Dashboard;