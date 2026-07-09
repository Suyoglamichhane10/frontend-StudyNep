import { useEffect, useMemo, useState } from 'react';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaDownload,
  FaEye,
  FaFileAlt,
  FaPaperPlane,
  FaSearch,
  FaUpload,
} from 'react-icons/fa';
import { assignmentFileUrl, getAssignments, submitAssignment } from '../services/assignmentService';
import './Assignments.css';

function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [activeFormId, setActiveFormId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [submissionForms, setSubmissionForms] = useState({});
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

  const pendingCount = assignments.filter((item) => !item.mySubmission).length;
  const submittedCount = assignments.filter((item) => item.mySubmission).length;
  const overdueCount = assignments.filter((item) => !item.mySubmission && new Date(item.deadline) < new Date()).length;

  const updateSubmissionForm = (assignmentId, field, value) => {
    setSubmissionForms((current) => ({
      ...current,
      [assignmentId]: {
        note: '',
        file: null,
        ...current[assignmentId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event, assignmentId) => {
    event.preventDefault();
    const current = submissionForms[assignmentId] || {};
    if (!current.file && !current.note) {
      alert('Please upload a file or add a note before submitting.');
      return;
    }

    const data = new FormData();
    if (current.file) data.append('file', current.file);
    if (current.note) data.append('note', current.note);

    try {
      setSubmittingId(assignmentId);
      await submitAssignment(assignmentId, data);
      setActiveFormId(null);
      setSubmissionForms((forms) => ({ ...forms, [assignmentId]: { note: '', file: null } }));
      await fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmittingId(null);
    }
  };

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
          <p>Track deadlines, download task files, and submit your work.</p>
        </div>
      </div>

      {error && <div className="assignments-alert">{error}</div>}

      <div className="assignment-stats">
        <div>
          <span>{assignments.length}</span>
          <p>Total assignments</p>
        </div>
        <div>
          <span>{pendingCount}</span>
          <p>Pending</p>
        </div>
        <div>
          <span>{submittedCount}</span>
          <p>Submitted</p>
        </div>
        <div>
          <span>{overdueCount}</span>
          <p>Overdue</p>
        </div>
      </div>

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
          <p>New assignments from your teachers will appear here.</p>
        </div>
      ) : (
        <div className="assignment-list">
          {filteredAssignments.map((assignment) => {
            const mySubmission = assignment.mySubmission;
            const submissionForm = submissionForms[assignment._id] || {};

            return (
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
                  </div>
                </div>

                <div className="assignment-meta-row">
                  <span>
                    <FaCheckCircle /> {assignment.totalMarks} marks
                  </span>
                  <span className={mySubmission?.status === 'Late' ? 'status late' : mySubmission ? 'status submitted' : 'status pending'}>
                    {mySubmission ? mySubmission.status : 'Not submitted'}
                  </span>
                  <button className="text-btn" onClick={() => setActiveFormId(activeFormId === assignment._id ? null : assignment._id)}>
                    {mySubmission ? 'Update submission' : 'Submit assignment'}
                  </button>
                </div>

                {mySubmission && (
                  <div className="submission-summary">
                    <strong>Your submission</strong>
                    <p>{mySubmission.note || 'No note added.'}</p>
                    {mySubmission.file?.fileId && (
                      <button onClick={() => window.open(assignmentFileUrl(assignment._id, 'submission', mySubmission._id, true), '_blank')}>
                        <FaDownload /> Download submitted file
                      </button>
                    )}
                  </div>
                )}

                {activeFormId === assignment._id && (
                  <form className="submission-form" onSubmit={(event) => handleSubmit(event, assignment._id)}>
                    <label>
                      Submission note
                      <textarea
                        rows="3"
                        value={submissionForm.note || ''}
                        onChange={(event) => updateSubmissionForm(assignment._id, 'note', event.target.value)}
                        placeholder="Add a short note for your teacher"
                      />
                    </label>
                    <label>
                      Upload file
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(event) => updateSubmissionForm(assignment._id, 'file', event.target.files[0] || null)}
                      />
                    </label>
                    <button type="submit" className="submit-btn" disabled={submittingId === assignment._id}>
                      {submittingId === assignment._id ? <FaUpload /> : <FaPaperPlane />}
                      {submittingId === assignment._id ? 'Submitting...' : 'Submit Work'}
                    </button>
                  </form>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

const deadlineLabel = (dateString) => {
  const deadline = new Date(dateString);
  return `Due ${deadline.toLocaleString()}`;
};

const deadlineBadgeClass = (dateString) => {
  return new Date(dateString) < new Date() ? 'deadline-badge overdue' : 'deadline-badge';
};

export default StudentAssignments;
