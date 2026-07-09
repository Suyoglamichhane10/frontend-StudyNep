import { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaClock, FaFlag, FaCheckCircle, FaRegCircle, 
  FaEdit, FaTrash, FaBrain, FaFire, FaStar, FaRocket,
  FaBookOpen, FaPlus, FaFilter, FaSort, FaSearch, FaBell, FaHourglassHalf
} from 'react-icons/fa';
import { getSubjects, createSubject, updateSubject, deleteSubject, logStudySession } from '../services/subjectService';
import './Studyplanner.css';

function Studyplanner() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [logModal, setLogModal] = useState({ open: false, subjectId: null, subjectName: '' });
  const [logHours, setLogHours] = useState(0);
  
  const [newSubject, setNewSubject] = useState({
    name: '',
    examDate: '',
    priority: 'Medium',
    hoursPerDay: '',
    description: '',
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (subjects.length > 0) {
      generateRecommendations();
    }
  }, [subjects]);

  // ---------- Helper functions ----------
  const calculateTotalRequired = (subject) => {
    if (!subject.examDate || !subject.hoursPerDay) return 0;
    const today = new Date().setHours(0,0,0,0);
    const exam = new Date(subject.examDate).setHours(0,0,0,0);
    const daysLeft = Math.ceil((exam - today) / (1000*60*60*24));
    if (daysLeft <= 0) return subject.hoursPerDay; // overdue, daily target remains
    return subject.hoursPerDay * daysLeft;
  };

  const calculateProgress = (subject) => {
    const total = subject.totalRequired || 1;
    const studied = subject.studiedHours || 0;
    return Math.min(100, Math.round((studied / total) * 100));
  };

  const fetchSubjects = async () => {
    try {
      const res = await getSubjects();
      const processed = res.data.map(sub => {
        const totalReq = calculateTotalRequired(sub);
        const studied = sub.studiedHours || 0;
        return {
          ...sub,
          studiedHours: studied,
          totalRequired: totalReq,
          progressPercent: calculateProgress({ ...sub, totalRequired: totalReq, studiedHours: studied }),
          isOverdue: new Date(sub.examDate) < new Date() && !sub.completed,
        };
      });
      setSubjects(processed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    const activeSubjects = subjects.filter(s => !s.completed && !s.isOverdue);
    
    const sorted = [...activeSubjects].sort((a, b) => {
      const aDate = new Date(a.examDate).setHours(0, 0, 0, 0);
      const bDate = new Date(b.examDate).setHours(0, 0, 0, 0);
      const aDaysLeft = Math.ceil((aDate - today) / (1000 * 60 * 60 * 24));
      const bDaysLeft = Math.ceil((bDate - today) / (1000 * 60 * 60 * 24));
      
      const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const aScore = (priorityWeight[a.priority] || 1) * (aDaysLeft > 0 ? 10 / aDaysLeft : 10);
      const bScore = (priorityWeight[b.priority] || 1) * (bDaysLeft > 0 ? 10 / bDaysLeft : 10);
      
      return bScore - aScore;
    });
    
    setRecommendations(sorted.slice(0, 3));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.examDate || !newSubject.hoursPerDay) return;
    try {
      if (editingSubject) {
        const res = await updateSubject(editingSubject._id, {
          ...newSubject,
          hoursPerDay: parseFloat(newSubject.hoursPerDay),
        });
        setSubjects(subjects.map(sub => sub._id === editingSubject._id ? res.data : sub));
        setEditingSubject(null);
      } else {
        const res = await createSubject({
          ...newSubject,
          hoursPerDay: parseFloat(newSubject.hoursPerDay),
        });
        setSubjects([...subjects, res.data]);
      }
      resetForm();
    } catch (err) {
      alert('Failed to save subject');
    }
  };

  const resetForm = () => {
    setNewSubject({ name: '', examDate: '', priority: 'Medium', hoursPerDay: '', description: '' });
    setShowForm(false);
    setEditingSubject(null);
  };

  const handleLogStudy = async () => {
    if (!logModal.subjectId || logHours <= 0) return;
    try {
      await logStudySession(logModal.subjectId, logHours);
      await fetchSubjects(); // refresh data
      setLogModal({ open: false, subjectId: null, subjectName: '' });
      setLogHours(0);
    } catch (err) {
      alert('Failed to log study session');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const subject = subjects.find(s => s._id === id);
      await updateSubject(id, { ...subject, completed: !completed });
      await fetchSubjects();
    } catch (err) {
      alert('Failed to update subject');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setNewSubject({
      name: subject.name,
      examDate: subject.examDate ? subject.examDate.split('T')[0] : '',
      priority: subject.priority,
      hoursPerDay: subject.hoursPerDay || '',
      description: subject.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      await deleteSubject(id);
      setSubjects(subjects.filter(sub => sub._id !== id));
    } catch (err) {
      alert('Failed to delete subject');
    }
  };

  const getFilteredAndSortedSubjects = () => {
    let filtered = [...subjects];
    
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    switch(filter) {
      case 'active':
        filtered = filtered.filter(s => !s.completed && !s.isOverdue);
        break;
      case 'completed':
        filtered = filtered.filter(s => s.completed);
        break;
      case 'high':
        filtered = filtered.filter(s => s.priority === 'High' && !s.completed && !s.isOverdue);
        break;
      case 'urgent':
        const today = new Date();
        filtered = filtered.filter(s => {
          if (s.completed || s.isOverdue) return false;
          const examDate = new Date(s.examDate);
          const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
          return daysLeft <= 3 && daysLeft >= 0;
        });
        break;
      case 'overdue':
        filtered = filtered.filter(s => s.isOverdue && !s.completed);
        break;
      default:
        break;
    }
    
    switch(sortBy) {
      case 'priority':
        const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
        filtered.sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0));
        break;
      case 'date':
        filtered.sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'hours':
        filtered.sort((a, b) => (b.hoursPerDay || 0) - (a.hoursPerDay || 0));
        break;
      default:
        break;
    }
    return filtered;
  };

  const getDaysUntilExam = (examDate) => {
    if (!examDate) return null;
    const today = new Date().setHours(0, 0, 0, 0);
    const exam = new Date(examDate).setHours(0, 0, 0, 0);
    return Math.ceil((exam - today) / (1000 * 60 * 60 * 24));
  };

  const filteredSubjects = getFilteredAndSortedSubjects();
  
  const totalSubjects = subjects.length;
  const completedCount = subjects.filter(s => s.completed).length;
  const activeCount = subjects.filter(s => !s.completed && !s.isOverdue).length;
  const highPriorityCount = subjects.filter(s => s.priority === 'High' && !s.completed && !s.isOverdue).length;
  const urgentCount = subjects.filter(s => {
    if (s.completed || s.isOverdue) return false;
    const daysLeft = getDaysUntilExam(s.examDate);
    return daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
  }).length;
  const overdueCount = subjects.filter(s => s.isOverdue && !s.completed).length;

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading your study plan...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <FaBrain className="error-icon" />
      <p>{error}</p>
      <button onClick={fetchSubjects} className="retry-btn">Retry</button>
    </div>
  );

  return (
    <div className="studyplanner-page">
      {/* Header */}
      <div className="planner-header">
        <div className="header-left">
          <h1>Study Planner</h1>
          <p>Organize your subjects, track progress, and ace your exams</p>
        </div>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Add Subject
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="stats-dashboard">
        <div className="stat-card"><div className="stat-icon blue"><FaBookOpen /></div><div className="stat-info"><span className="stat-value">{totalSubjects}</span><span className="stat-label">Total Subjects</span></div></div>
        <div className="stat-card"><div className="stat-icon green"><FaCheckCircle /></div><div className="stat-info"><span className="stat-value">{completedCount}</span><span className="stat-label">Completed</span></div></div>
        <div className="stat-card"><div className="stat-icon orange"><FaFire /></div><div className="stat-info"><span className="stat-value">{activeCount}</span><span className="stat-label">Active</span></div></div>
        <div className="stat-card"><div className="stat-icon black"><FaFlag /></div><div className="stat-info"><span className="stat-value">{highPriorityCount}</span><span className="stat-label">High Priority</span></div></div>
        <div className="stat-card urgent"><div className="stat-icon"><FaBell /></div><div className="stat-info"><span className="stat-value">{urgentCount}</span><span className="stat-label">Urgent</span></div></div>
        {overdueCount > 0 && <div className="stat-card overdue"><div className="stat-icon"><FaHourglassHalf /></div><div className="stat-info"><span className="stat-value">{overdueCount}</span><span className="stat-label">Overdue</span></div></div>}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="recommendations">
          <div className="rec-header"><FaBrain className="rec-icon" /><div><h3>Smart Recommendations</h3><p>Based on your deadlines and priorities</p></div></div>
          <div className="rec-list">
            {recommendations.map((subject, index) => {
              const daysLeft = getDaysUntilExam(subject.examDate);
              const isUrgent = daysLeft !== null && daysLeft <= 3;
              return (
                <div key={subject._id} className={`rec-item ${isUrgent ? 'urgent' : ''}`}>
                  <div className="rec-rank"><span>{index + 1}</span>{index === 0 && <FaStar className="star" />}</div>
                  <div className="rec-content">
                    <h4>{subject.name}</h4>
                    <div className="rec-meta">
                      <span className={`priority-badge ${subject.priority.toLowerCase()}`}>{subject.priority}</span>
                      {daysLeft !== null && <span className={`days-badge ${isUrgent ? 'urgent' : ''}`}>{daysLeft <= 0 ? 'Today!' : `${daysLeft} days left`}</span>}
                    </div>
                  </div>
                  <button className="rec-action" onClick={() => setLogModal({ open: true, subjectId: subject._id, subjectName: subject.name })}>
                    Log Study <FaRocket />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="planner-controls">
        <div className="search-box"><FaSearch /><input type="text" placeholder="Search subjects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <div className="controls-group">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Subjects</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent (3 days)</option>
            <option value="overdue">Overdue</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="priority">Sort by Priority</option>
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="hours">Sort by Hours</option>
          </select>
          <div className="view-toggle">
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>📱 Grid</button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>📋 List</button>
          </div>
        </div>
      </div>

      {/* Subjects List */}
      {filteredSubjects.length === 0 ? (
        <div className="empty-state"><FaBookOpen className="empty-icon" /><h3>No subjects found</h3><p>Click the "Add Subject" button to start planning your studies</p></div>
      ) : (
        <div className={`subjects-container ${viewMode}`}>
          {filteredSubjects.map(subject => {
            const daysLeft = getDaysUntilExam(subject.examDate);
            const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
            const isOverdue = daysLeft !== null && daysLeft < 0;
            const progress = subject.progressPercent || 0;
            const totalRequired = subject.totalRequired || subject.hoursPerDay;
            const studied = subject.studiedHours || 0;
            
            let daysDisplay = '';
            let daysClass = '';
            if (isOverdue) {
              daysDisplay = 'Deadline passed!';
              daysClass = 'overdue';
            } else if (daysLeft !== null) {
              daysDisplay = `${daysLeft} days left`;
              daysClass = isUrgent ? 'urgent' : '';
            }
            
            return (
              <div key={subject._id} className={`subject-card ${subject.completed ? 'completed' : ''} ${subject.isOverdue ? 'overdue' : ''} priority-${subject.priority.toLowerCase()}`}>
                <div className="card-header">
                  <div className="card-title">
                    <button onClick={() => handleToggleComplete(subject._id, subject.completed)} className={`complete-btn ${subject.completed ? 'completed' : ''}`}>
                      {subject.completed ? <FaCheckCircle /> : <FaRegCircle />}
                    </button>
                    <h3>{subject.name}</h3>
                  </div>
                  <span className={`priority-tag ${subject.priority.toLowerCase()}`}>{subject.priority}</span>
                </div>

                <div className="card-details">
                  <div className="detail detail-calendar">
                    <FaCalendarAlt />
                    <span>{new Date(subject.examDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail detail-clock">
                    <FaClock />
                    <span>{subject.hoursPerDay} hours/day</span>
                  </div>
                  {daysLeft !== null && (
                    <div className={`detail detail-days ${daysClass}`}>
                      <FaFlag />
                      <span>{daysDisplay}</span>
                    </div>
                  )}
                </div>

                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progress: {studied.toFixed(1)} / {totalRequired.toFixed(1)} hrs</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                {subject.description && <p className="description">{subject.description}</p>}

                <div className="card-actions">
                  {!subject.completed && !subject.isOverdue && (
                    <button className="log-study-btn" onClick={() => setLogModal({ open: true, subjectId: subject._id, subjectName: subject.name })}>
                      + Log Study
                    </button>
                  )}
                  <button onClick={() => handleEdit(subject)} className="edit-btn"><FaEdit /> Edit</button>
                  <button onClick={() => handleDelete(subject._id)} className="delete-btn"><FaTrash /> Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2><button className="close-btn" onClick={resetForm}>×</button></div>
            <form onSubmit={handleAddSubject}>
              <div className="form-group"><label>Subject Name</label><input type="text" name="name" value={newSubject.name} onChange={handleInputChange} required /></div>
              <div className="form-row"><div className="form-group"><label>Exam Date</label><input type="date" name="examDate" value={newSubject.examDate} onChange={handleInputChange} required /></div><div className="form-group"><label>Hours/Day</label><input type="number" name="hoursPerDay" value={newSubject.hoursPerDay} onChange={handleInputChange} step="0.5" min="0.5" required /></div></div>
              <div className="form-group"><label>Priority</label><select name="priority" value={newSubject.priority} onChange={handleInputChange}><option value="High">🔴 High Priority</option><option value="Medium">🟡 Medium Priority</option><option value="Low">🟢 Low Priority</option></select></div>
              <div className="form-group"><label>Description (Optional)</label><textarea name="description" value={newSubject.description} onChange={handleInputChange} rows="3" /></div>
              <div className="form-actions"><button type="submit" className="submit-btn">{editingSubject ? 'Update Subject' : 'Add Subject'}</button><button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Log Study Modal */}
      {logModal.open && (
        <div className="modal-overlay" onClick={() => setLogModal({ open: false, subjectId: null, subjectName: '' })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Log Study Session</h2><button className="close-btn" onClick={() => setLogModal({ open: false, subjectId: null, subjectName: '' })}>×</button></div>
            <div className="form-group"><label>Subject: {logModal.subjectName}</label></div>
            <div className="form-group"><label>Hours Studied</label><input type="number" step="0.5" min="0.5" value={logHours} onChange={(e) => setLogHours(parseFloat(e.target.value))} /></div>
            <div className="form-actions"><button className="submit-btn" onClick={handleLogStudy}>Log Hours</button><button className="cancel-btn" onClick={() => setLogModal({ open: false, subjectId: null, subjectName: '' })}>Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Studyplanner;