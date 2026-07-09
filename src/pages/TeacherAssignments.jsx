import { useEffect, useMemo, useState } from 'react';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaDownload,
  FaEdit,
  FaEye,
  FaFileAlt,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUpload,
  FaUsers,
} from 'react-icons/fa';
import {
  assignmentFileUrl,
  createAssignment,
  deleteAssignment,
  getAssignments,
  updateAssignment,
} from '../services/assignmentService';
import './Assignments.css';

const emptyForm = {
  title: '',
  subject: '',
  instructions: '',
  deadline: '',
  totalMarks: 100,
  resourceUrl: '',
  file: null,
};

function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await getAssignments();
      setAssignments(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const subjects = useMemo(
    () => [...new Set(assignments.map((assignment) => assignment.subject).filter(Boolean))],
    [assignments]
  );

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        assignment.title.toLowerCase().includes(query) ||
        assignment.subject.toLowerCase().includes(query) ||
        assignment.instructions.toLowerCase().includes(query);
      const matchesSubject = subjectFilter === 'all' || assignment.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    });
  }, [assignments, searchTerm, subjectFilter]);

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (assignment) => {
    setEditingId(assignment._id);
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      instructions: assignment.instructions,
      deadline: formatForInput(assignment.deadline),
      totalMarks: assignment.totalMarks,
      resourceUrl: assignment.resourceUrl || '',
      file: null,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    setFormData((current) => ({ ...current, file: event.target.files[0] || null }));
  };

  const buildPayload = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });
    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await updateAssignment(editingId, buildPayload());
      } else {
        await createAssignment(buildPayload());
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      await fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not save assignment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment and its submissions?')) return;

    try {
      await deleteAssignment(id);
      await fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete assignment');
    }
  };

  const upcomingCount = assignments.filter((item) => new Date(item.deadline) >= new Date()).length;
  const lateSubmissionCount = assignments.reduce(
    (total, item) => total + (item.submissions || []).filter((submission) => submission.status === 'Late').length,
    0
  );

  if (loading) {
    return (
      <div className="assignments-loading">
        <div className="loading-spinner"></div>
        <p>Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="assignments-page">
      <div className="assignments-header">
        <div>
          <h1>Assignments</h1>
          <p>Create coursework, set deadlines, and review student submissions.</p>
        </div>
        <button className="primary-action" onClick={showForm ? () => setShowForm(false) : openCreateForm}>
          {showForm ? <FaTimes /> : <FaPlus />}
          {showForm ? 'Close' : 'Create Assignment'}
        </button>
      </div>

      {error && <div className="assignments-alert">{error}</div>}

      <div className="assignment-stats">
        <div>
          <span>{assignments.length}</span>
          <p>Total assignments</p>
        </div>
        <div>
          <span>{upcomingCount}</span>
          <p>Upcoming deadlines</p>
        </div>
        <div>
          <span>{assignments.reduce((total, item) => total + (item.submissions?.length || 0), 0)}</span>
          <p>Submissions</p>
        </div>
        <div>
          <span>{lateSubmissionCount}</span>
          <p>Late submissions</p>
        </div>
      </div>

      {showForm && (
        <form className="assignment-form" onSubmit={handleSubmit}>
          <div className="form-title-row">
            <h2>{editingId ? 'Edit Assignment' : 'New Assignment'}</h2>
            {editingId && <span>Existing attachment stays unless you choose a new file.</span>}
          </div>

          <div className="assignment-form-grid">
            <label>
              Title
              <input name="title" value={formData.title} onChange={handleChange} required />
            </label>
            <label>
              Subject
              <input name="subject" value={formData.subject} onChange={handleChange} required />
            </label>
            <label>
              Deadline
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Total marks
              <input
                type="number"
                min="0"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            Instructions
            <textarea
              name="instructions"
              rows="5"
              value={formData.instructions}
              onChange={handleChange}
              required
            />
          </label>

          <div className="assignment-form-grid">
            <label>
              Reference URL
              <input
                type="url"
                name="resourceUrl"
                value={formData.resourceUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>
            <label>
              Attachment
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={saving}>
              <FaUpload />
              {saving ? 'Saving...' : editingId ? 'Update Assignment' : 'Publish Assignment'}
            </button>
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="assignment-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search assignments..."
          />
        </div>
        <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
          <option value="all">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="empty-state">
          <FaFileAlt />
          <h3>No assignments found</h3>
          <p>Create an assignment to start collecting student work.</p>
        </div>
      ) : (
        <div className="assignment-list">
          {filteredAssignments.map((assignment) => (
            <article className="assignment-card" key={assignment._id}>
              <div className="assignment-card-main">
                <div>
                  <span className={deadlineBadgeClass(assignment.deadline)}>
                    <FaCalendarAlt />
                    {deadlineLabel(assignment.deadline)}
                  </span>
                  <h2>{assignment.title}</h2>
                  <p className="assignment-subject">{assignment.subject}</p>
                  <p className="assignment-instructions">{assignment.instructions}</p>
                </div>
                <div className="assignment-card-actions">
                  {assignment.attachment?.fileId && (
                    <>
                      <button onClick={() => window.open(assignmentFileUrl(assignment._id), '_blank')}>
                        <FaEye /> View
                      </button>
                      <button onClick={() => window.open(assignmentFileUrl(assignment._id, 'attachment', '', true), '_blank')}>
                        <FaDownload /> Download
                      </button>
                    </>
                  )}
                  {assignment.resourceUrl && (
                    <button onClick={() => window.open(assignment.resourceUrl, '_blank')}>
                      <FaEye /> Link
                    </button>
                  )}
                  <button onClick={() => openEditForm(assignment)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="danger-btn" onClick={() => handleDelete(assignment._id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>

              <div className="assignment-meta-row">
                <span>
                  <FaCheckCircle /> {assignment.totalMarks} marks
                </span>
                <span>
                  <FaUsers /> {assignment.submissions?.length || 0} submissions
                </span>
                <button className="text-btn" onClick={() => setExpandedId(expandedId === assignment._id ? null : assignment._id)}>
                  {expandedId === assignment._id ? 'Hide submissions' : 'View submissions'}
                </button>
              </div>

              {expandedId === assignment._id && (
                <div className="submissions-panel">
                  {(assignment.submissions || []).length === 0 ? (
                    <p>No student submissions yet.</p>
                  ) : (
                    assignment.submissions.map((submission) => (
                      <div className="submission-row" key={submission._id}>
                        <div>
                          <strong>{submission.student?.name || 'Student'}</strong>
                          <span>{submission.student?.email}</span>
                          <p>{submission.note || 'No note added.'}</p>
                        </div>
                        <div className="submission-actions">
                          <span className={submission.status === 'Late' ? 'status late' : 'status submitted'}>
                            {submission.status}
                          </span>
                          {submission.file?.fileId && (
                            <button
                              onClick={() =>
                                window.open(
                                  assignmentFileUrl(assignment._id, 'submission', submission._id, true),
                                  '_blank'
                                )
                              }
                            >
                              <FaDownload /> File
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const formatForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const deadlineLabel = (dateString) => {
  const deadline = new Date(dateString);
  return `Due ${deadline.toLocaleString()}`;
};

const deadlineBadgeClass = (dateString) => {
  return new Date(dateString) < new Date() ? 'deadline-badge overdue' : 'deadline-badge';
};

export default TeacherAssignments;
