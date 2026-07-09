import { useState, useEffect } from 'react';
import { 
  FaSearch, FaFilePdf, FaVideo, FaLink, FaDownload, FaEye, 
  FaCalendarAlt, FaFilter, FaUser, FaTimes, FaFileAlt 
} from 'react-icons/fa';
import { getMaterials } from '../services/materialService';
import './StudentMaterials.css';

function StudentMaterials() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjects, setSubjects] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
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
      setError('Failed to load materials');
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
      // Open with token in URL (backend now accepts query token)
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
      <div className="student-materials-loading">
        <div className="loading-spinner"></div>
        <p>Loading study materials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-materials-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={fetchMaterials} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="student-materials-page">
      <div className="materials-header">
        <h1>📚 Study Materials</h1>
        <p>Access notes, video lectures, and resources shared by your teachers</p>
      </div>

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

      <div className="results-count">
        Found {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'}
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="no-materials">
          <div className="no-materials-icon">📭</div>
          <h3>No materials found</h3>
          <p>Try adjusting your search or filter criteria</p>
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
                    <FaUser /> {material.uploadedBy?.name || 'Teacher'}
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
              </div>
            </div>
          ))}
        </div>
      )}

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
                      <button 
                        onClick={() => handleView(selectedMaterial)} 
                        className="preview-btn"
                      >
                        <FaEye /> Open PDF
                      </button>
                      <button 
                        onClick={() => handleDownload(selectedMaterial)} 
                        className="preview-btn download"
                      >
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
    </div>
  );
}

export default StudentMaterials;