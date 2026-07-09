import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Userprofile.css';

const UserProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get API URLs
  const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
  const SERVER_URL = import.meta.env?.VITE_SERVER_URL || 'http://localhost:5000';

  // Helper function to construct full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend the server URL
    return `${SERVER_URL}${imagePath}`;
  };

  // Fetch user profile from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }
        
        console.log('Fetching user profile from:', `${API_URL}/users/profile`);
        
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Profile fetch response:', response.data);
        
        if (response.data.success) {
          const profileData = response.data.data;
          setUserData({
            name: profileData.name || '',
            email: profileData.email || '',
            role: profileData.role || '',
            studentId: profileData.studentId || '',
            teacherId: profileData.teacherId || '',
            department: profileData.department || '',
            semester: profileData.semester || '',
            batch: profileData.batch || '',
            phone: profileData.phone || '',
            address: profileData.address || '',
            dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '',
            bio: profileData.bio || '',
            joinDate: profileData.joinDate || profileData.createdAt || new Date().toISOString().split('T')[0],
            avatar: profileData.avatar || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          fullError: error
        });
        setError(error.response?.data?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user, API_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, GIF, and WEBP images are allowed');
        return;
      }
      
      setSelectedImage(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        setError('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file) => {
    try {
      setUploadingImage(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Starting avatar upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        apiUrl: `${API_URL}/users/avatar`
      });

      const formData = new FormData();
      formData.append('avatar', file);
      
      console.log('FormData created, sending request...');
      
      const response = await axios.post(`${API_URL}/users/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
          // Don't set Content-Type header - axios/browser will set it automatically with boundary
        },
        timeout: 30000
      });
      
      console.log('Upload response:', response.data);
      
      if (response.data.success && response.data.data.avatar) {
        console.log('Avatar URL from server:', response.data.data.avatar);
        setUploadingImage(false);
        return response.data.data.avatar;
      } else {
        throw new Error(response.data.message || 'Upload failed - no success flag');
      }
    } catch (error) {
      setUploadingImage(false);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to upload image';
      console.error('Error uploading avatar:', {
        message: errorMsg,
        status: error.response?.status,
        data: error.response?.data,
        fullError: error
      });
      throw new Error(errorMsg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      let avatarUrl = userData.avatar;
      
      console.log('Form submit started, image selected:', !!selectedImage);
      
      // Upload image if selected
      if (selectedImage) {
        try {
          console.log('Uploading image...');
          const uploadedAvatarUrl = await uploadAvatar(selectedImage);
          if (!uploadedAvatarUrl) {
            throw new Error('No avatar URL returned from server');
          }
          avatarUrl = uploadedAvatarUrl;
          console.log('Avatar uploaded successfully:', avatarUrl);
        } catch (uploadError) {
          console.error('Avatar upload failed:', uploadError);
          setError(`Failed to upload image: ${uploadError.message || 'Unknown error'}`);
          setLoading(false);
          return;
        }
      }
      
      // Prepare update data
      const updateData = {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        dateOfBirth: userData.dateOfBirth,
        bio: userData.bio,
        avatar: avatarUrl
      };
      
      if (userData.role === 'student') {
        updateData.studentId = userData.studentId;
        updateData.semester = userData.semester;
        updateData.batch = userData.batch;
        updateData.department = userData.department;
      } else if (userData.role === 'teacher') {
        updateData.teacherId = userData.teacherId;
        updateData.qualification = userData.qualification;
        updateData.department = userData.department;
      }
      
      console.log('Sending profile update:', updateData);
      
      // Update profile
      const response = await axios.put(`${API_URL}/users/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000
      });
      
      console.log('Profile update response:', response.data);
      
      if (response.data.success) {
        const updatedUser = response.data.data;
        
        // Update local state
        setUserData(prev => ({
          ...prev,
          ...updatedUser,
          dateOfBirth: updatedUser.dateOfBirth ? updatedUser.dateOfBirth.split('T')[0] : prev.dateOfBirth
        }));
        
        // Update auth context
        if (updateUser) {
          await updateUser(updatedUser);
        }
        
        // Update localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedStoredUser = { ...storedUser, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(updatedStoredUser));
        
        // Reset form state
        setSelectedImage(null);
        setImagePreview(null);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        fullError: error
      });
      setError(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = () => {
    switch(userData.role) {
      case 'student':
        return { text: 'Student', class: 'student-badge', icon: '🎓' };
      case 'teacher':
        return { text: 'Teacher', class: 'teacher-badge', icon: '👨‍🏫' };
      case 'admin':
        return { text: 'Admin', class: 'admin-badge', icon: '👑' };
      default:
        return { text: 'User', class: '', icon: '👤' };
    }
  };

  if (loading && !userData.name) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-cover"></div>
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt={userData.name} 
                  className="profile-avatar"
                  title="New avatar preview"
                />
              ) : userData.avatar ? (
                <img 
                  src={getImageUrl(userData.avatar)} 
                  alt={userData.name} 
                  className="profile-avatar"
                  onError={(e) => {
                    console.error('Failed to load avatar:', userData.avatar);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {userData.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              {isEditing && (
                <label className={`avatar-upload-btn ${uploadingImage ? 'uploading' : ''}`}>
                  {uploadingImage ? (
                    <span className="upload-spinner">⏳</span>
                  ) : (
                    <FaCamera />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    hidden
                    disabled={uploadingImage}
                  />
                </label>
              )}
            </div>
            <div className="profile-info">
              <h1>{userData.name || 'User Name'}</h1>
              <span className={`role-badge ${getRoleBadge().class}`}>
                {getRoleBadge().icon} {getRoleBadge().text}
              </span>
              <p className="profile-email">{userData.email}</p>
            </div>
          </div>
        </div>

        <div className="profile-content">
          {error && (
            <div className="alert alert-error">
              {error}
              <button className="alert-close" onClick={() => setError('')}>×</button>
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              {success}
              <button className="alert-close" onClick={() => setSuccess('')}>×</button>
            </div>
          )}

          <div className="profile-actions">
            <button 
              className={`edit-toggle-btn ${isEditing ? 'edit-mode' : ''}`}
              onClick={() => {
                setIsEditing(!isEditing);
                setError('');
                setSuccess('');
                if (isEditing) {
                  setSelectedImage(null);
                  setImagePreview(null);
                }
              }}
            >
              {isEditing ? <FaTimes /> : <FaEdit />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            {isEditing && (
              <button type="submit" form="profile-form" className="save-btn" disabled={loading || uploadingImage}>
                <FaSave /> {loading ? 'Saving...' : uploadingImage ? 'Uploading Image...' : 'Save Changes'}
              </button>
            )}
          </div>

          <form id="profile-form" onSubmit={handleSubmit}>
            <div className="profile-sections">
              <div className="profile-section">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      disabled={true}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+977 98XXXXXXXX"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={userData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Your address"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={userData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>

              {userData.role === 'student' && (
                <div className="profile-section">
                  <h3>Educational Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Student ID</label>
                      <input
                        type="text"
                        name="studentId"
                        value={userData.studentId}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="e.g., STD-2024-001"
                      />
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <input
                        type="text"
                        name="department"
                        value={userData.department}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div className="form-group">
                      <label>Semester</label>
                      <select
                        name="semester"
                        value={userData.semester}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select Semester</option>
                        <option value="1st Semester">1st Semester</option>
                        <option value="2nd Semester">2nd Semester</option>
                        <option value="3rd Semester">3rd Semester</option>
                        <option value="4th Semester">4th Semester</option>
                        <option value="5th Semester">5th Semester</option>
                        <option value="6th Semester">6th Semester</option>
                        <option value="7th Semester">7th Semester</option>
                        <option value="8th Semester">8th Semester</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Batch</label>
                      <input
                        type="text"
                        name="batch"
                        value={userData.batch}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="e.g., 2024-2028"
                      />
                    </div>
                  </div>
                </div>
              )}

              {userData.role === 'teacher' && (
                <div className="profile-section">
                  <h3>Professional Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Teacher ID</label>
                      <input
                        type="text"
                        name="teacherId"
                        value={userData.teacherId}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="e.g., TCH-2024-001"
                      />
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <input
                        type="text"
                        name="department"
                        value={userData.department}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Qualification</label>
                      <input
                        type="text"
                        name="qualification"
                        value={userData.qualification}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="e.g., M.Sc. in Computer Science"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="profile-section">
                <h3>Account Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <FaCalendarAlt />
                    <div>
                      <label>Member Since</label>
                      <p>{userData.joinDate ? new Date(userData.joinDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaUser />
                    <div>
                      <label>Account Type</label>
                      <p>{userData.role?.toUpperCase() || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;