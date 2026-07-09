import { useState, useEffect } from 'react';
import { 
  FaUpload, FaFilePdf, FaVideo, FaLink, FaDownload, FaEye, 
  FaTrash, FaPlus, FaTimes, FaSearch, FaFilter,
  FaCalendarAlt, FaUser, FaFileAlt
} from 'react-icons/fa';
import { getMaterials, uploadPDF, uploadLink, deleteMaterial } from '../services/materialService';
import './TeacherMaterials.css';

function TeacherMaterials() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploadType, setUploadType] = useState('PDF');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    file: null,
    fileUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchTerm, selectedType, selectedSubject]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await getMaterials();
      setMaterials(res.data);
      
      const uniqueSubjects = [...new Set(res.data.map(m => m.subject).filter(Boolean))];
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = [...materials];

    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(m => m.type === selectedType);
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(m => m.subject === selectedSubject);
    }

    setFilteredMaterials(filtered);
  };

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const handleView = (material) => {
    const token = getAuthToken();
    if (!token) {
      alert('Please login to view materials');
      return;
    }

    if (material.type === 'PDF') {
      const viewUrl = `${API_BASE_URL}/materials/view/${material._id}?token=${token}`;
      window.open(viewUrl, '_blank');
    } else if (material.type === 'Video' || material.type === 'Link') {
      window.open(material.fileUrl, '_blank');
    } else {
      setSelectedMaterial(material);
      setShowPreview(true);
    }
  };

  const handleDownload = (material) => {
    const token = getAuthToken();
    if (!token) {
      alert('Please login to download materials');
      return;
    }

    if (material.type === 'PDF') {
      const downloadUrl = `${API_BASE_URL}/materials/download/${material._id}?token=${token}`;
      window.open(downloadUrl, '_blank');
    } else if (material.type === 'Link') {
      window.open(material.fileUrl, '_blank');
    } else if (material.type === 'Video') {
      window.open(material.fileUrl, '_blank');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file: file, title: formData.title || file.name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject) {
      alert('Please fill in title and subject');
      return;
    }

    setUploading(true);
    
    try {
      if (uploadType === 'PDF') {
        if (!formData.file) {
          alert('Please select a file');
          setUploading(false);
          return;
        }
        const data = new FormData();
        data.append('file', formData.file);
        data.append('title', formData.title);
        data.append('subject', formData.subject);
        await uploadPDF(data);
      } else {
        if (!formData.fileUrl) {
          alert('Please enter a URL');
          setUploading(false);
          return;
        }
        await uploadLink({
          title: formData.title,
          subject: formData.subject,
          type: uploadType,
          fileUrl: formData.fileUrl,
        });
      }
      
      setFormData({ title: '', subject: '', file: null, fileUrl: '' });
      setShowForm(false);
      fetchMaterials();
      alert('Material uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMaterial(id);
      fetchMaterials();
      setShowDeleteConfirm(null);
      alert('Material deleted successfully');
    } catch (err) {
      alert('Delete failed');
    }
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'PDF': return <FaFilePdf className="type-icon pdf" />;
      case 'Video': return <FaVideo className="type-icon video" />;
      case 'Link': return <FaLink className="type-icon link" />;
      default: return <FaFileAlt className="type-icon" />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'PDF': return '#dc2626';
      case 'Video': return '#8b5cf6';
      case 'Link': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const typeOptions = [
    { value: 'all', label: 'All Types', icon: '📁' },
    { value: 'PDF', label: 'PDF Documents', icon: '📄' },
    { value: 'Video', label: 'Video Lectures', icon: '🎥' },
    { value: 'Link', label: 'External Links', icon: '🔗' },
  ];

  if (loading) {
    return (
      <div className="teacher-materials-loading">
        <div className="loading-spinner"></div>
        <p>Loading your materials...</p>
      </div>
    );
  }

  return (
    <div className="teacher-materials-page">
      <div className="materials-header">
        <div>
          <h1>📚 Study Materials</h1>
          <p>Manage and share study resources with your students</p>
        </div>
        <button className="upload-btn" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> {showForm ? 'Cancel' : 'Upload New Material'}
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="upload-form-container">
          <div className="upload-form">
            <h3>Upload New Material</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Type *</label>
                <div className="type-selector">
                  <button 
                    type="button"
                    className={`type-option ${uploadType === 'PDF' ? 'active' : ''}`}
                    onClick={() => setUploadType('PDF')}
                  >
                    📄 PDF Document
                  </button>
                  <button 
                    type="button"
                    className={`type-option ${uploadType === 'Video' ? 'active' : ''}`}
                    onClick={() => setUploadType('Video')}
                  >
                    🎥 Video Lecture
                  </button>
                  <button 
                    type="button"
                    className={`type-option ${uploadType === 'Link' ? 'active' : ''}`}
                    onClick={() => setUploadType('Link')}
                  >
                    🔗 External Link
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  required 
                  placeholder="e.g., Physics Chapter 1 Notes"
                />
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input 
                  type="text" 
                  value={formData.subject} 
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
                  required 
                  placeholder="e.g., Mathematics, Physics, CSIT"
                />
              </div>

              {uploadType === 'PDF' && (
                <div className="form-group">
                  <label>PDF File *</label>
                  <div className="file-input-wrapper">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      id="pdf-file"
                      required
                    />
                    <label htmlFor="pdf-file" className="file-label">
                      {formData.file ? formData.file.name : 'Choose PDF file'}
                    </label>
                  </div>
                  <small className="form-hint">Upload PDF, DOC, or DOCX files (Max 10MB)</small>
                </div>
              )}

              {(uploadType === 'Video' || uploadType === 'Link') && (
                <div className="form-group">
                  <label>{uploadType === 'Video' ? 'Video URL' : 'Link URL'} *</label>
                  <input 
                    type="url" 
                    value={formData.fileUrl} 
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })} 
                    required 
                    placeholder={uploadType === 'Video' ? 'https://youtube.com/...' : 'https://...'}
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Material'}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="materials-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-dropdown">
            <FaFilter className="filter-icon" />
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-dropdown">
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="all">📖 All Subjects</option>
              {subjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Found {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'}
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="no-materials">
          <div className="no-materials-icon">📭</div>
          <h3>No materials found</h3>
          <p>Click "Upload New Material" to add your first study resource</p>
        </div>
      ) : (
        <div className="materials-grid">
          {filteredMaterials.map(material => (
            <div key={material._id} className="material-card">
              <div className="material-type-badge" style={{ backgroundColor: getTypeColor(material.type) }}>
                {material.type}
              </div>
              <div className="material-icon">{getFileIcon(material.type)}</div>
              <div className="material-content">
                <h3>{material.title}</h3>
                <p className="material-subject">{material.subject}</p>
                <div className="material-meta">
                  <span className="material-date">
                    <FaCalendarAlt /> {formatDate(material.createdAt)}
                  </span>
                  <span className="material-uploader">
                    <FaUser /> You
                  </span>
                </div>
              </div>
              <div className="material-actions">
                <button onClick={() => handleView(material)} className="view-btn">
                  <FaEye /> View
                </button>
                <button onClick={() => handleDownload(material)} className="download-btn">
                  <FaDownload /> {material.type === 'Link' ? 'Visit' : 'Download'}
                </button>
                <button onClick={() => setShowDeleteConfirm(material._id)} className="delete-btn">
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Section */}
      <div className="materials-stats">
        <div className="stat-item">
          <span className="stat-number">{materials.length}</span>
          <span className="stat-label">Total Resources</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{materials.filter(m => m.type === 'PDF').length}</span>
          <span className="stat-label">PDF Notes</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{materials.filter(m => m.type === 'Video').length}</span>
          <span className="stat-label">Video Lectures</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{materials.filter(m => m.type === 'Link').length}</span>
          <span className="stat-label">External Links</span>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedMaterial && (
        <div className="preview-modal" onClick={() => setShowPreview(false)}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>{selectedMaterial.title}</h3>
              <button className="close-modal" onClick={() => setShowPreview(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="preview-body">
              {selectedMaterial.type === 'PDF' && (
                <div className="pdf-preview">
                  <div className="pdf-placeholder">
                    <FaFilePdf className="pdf-icon-large" />
                    <p>PDF Document</p>
                    <div className="preview-actions">
                      <button onClick={() => handleView(selectedMaterial)} className="preview-btn">
                        <FaEye /> Open PDF
                      </button>
                      <button onClick={() => handleDownload(selectedMaterial)} className="preview-btn download">
                        <FaDownload /> Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {selectedMaterial.type === 'Video' && (
                <div className="video-preview">
                  <video 
                    src={selectedMaterial.fileUrl} 
                    controls 
                    className="video-player"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {selectedMaterial.type === 'Link' && (
                <div className="link-preview">
                  <div className="link-icon-large">🔗</div>
                  <h4>External Resource</h4>
                  <a href={selectedMaterial.fileUrl} target="_blank" rel="noopener noreferrer" className="visit-link">
                    Visit Website <FaLink />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-modal" onClick={() => setShowDeleteConfirm(null)}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon">🗑️</div>
            <h3>Delete Material?</h3>
            <p>Are you sure you want to delete this material? This action cannot be undone.</p>
            <div className="delete-actions">
              <button className="cancel-delete" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="confirm-delete" onClick={() => handleDelete(showDeleteConfirm)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherMaterials;