import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, FaBook, FaCalendarAlt, FaChartBar, FaClock, 
  FaSignOutAlt, FaBrain, FaPlus, FaList, FaChalkboardTeacher, 
  FaUsers, FaUpload, FaCog, FaUserCog, 
  FaFolderOpen, FaBars, FaTimes, FaChevronLeft, FaChevronRight,
  FaUser, FaTasks
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';
import { useState, useEffect } from 'react';
import navIcon from '../assets/l.png';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (!mobile && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  const toggleSidebar = () => {
    console.log('Toggle clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeSidebar();
  };

  if (!user) {
    console.log('No user found');
    return null;
  }

  console.log('Sidebar rendering, isOpen:', isOpen, 'isMobile:', isMobile);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div className="mobile-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed ? (
            <div className="sidebar-brand">
              <img src={navIcon} alt="StudyNep Logo" className="sidebar-logo-circle" />
              <div className="sidebar-brand-text">
                <h2>Study<span>Nep</span></h2>
                <p>Smart Study Planner</p>
              </div>
            </div>
          ) : (
            <div className="sidebar-logo-mini">
              <img src={navIcon} alt="StudyNep Logo" className="sidebar-logo-circle sidebar-logo-mini-img" />
            </div>
          )}
        </div>

        <div className="sidebar-menu">
          {/* STUDENT SECTION */}
          {user.role === 'student' && (
            <>
              {!isCollapsed && <div className="sidebar-section">🎓 Student</div>}
             
              <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard')}`} onClick={closeSidebar}>
                <FaHome />
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
              <Link to="/planner" className={`sidebar-link ${isActive('/planner')}`} onClick={closeSidebar}>
                <FaBook />
                {!isCollapsed && <span>Study Planner</span>}
              </Link>
              <Link to="/schedule" className={`sidebar-link ${isActive('/schedule')}`} onClick={closeSidebar}>
                <FaCalendarAlt />
                {!isCollapsed && <span>Schedule</span>}
              </Link>
              <Link to="/progress" className={`sidebar-link ${isActive('/progress')}`} onClick={closeSidebar}>
                <FaChartBar />
                {!isCollapsed && <span>Progress</span>}
              </Link>
              <Link to="/focus" className={`sidebar-link ${isActive('/focus')}`} onClick={closeSidebar}>
                <FaClock />
                {!isCollapsed && <span>Focus Timer</span>}
              </Link>
              <Link to="/quiz" className={`sidebar-link ${isActive('/quiz')}`} onClick={closeSidebar}>
                <FaBrain />
                {!isCollapsed && <span>Take Quiz</span>}
              </Link>
              <Link to="/student/materials" className={`sidebar-link ${isActive('/student/materials')}`} onClick={closeSidebar}>
                <FaFolderOpen />
                {!isCollapsed && <span>Study Materials</span>}
              </Link>
              <Link to="/student/assignments" className={`sidebar-link ${isActive('/student/assignments')}`} onClick={closeSidebar}>
                <FaTasks />
                {!isCollapsed && <span>Assignments</span>}
              </Link>
               <Link to="/profile" className={`sidebar-link ${isActive('/profile')}`} onClick={closeSidebar}>
                <FaUser />
                {!isCollapsed && <span>My Profile</span>}
              </Link>
            </>
          )}

          {/* TEACHER SECTION */}
          {user.role === 'teacher' && (
            <>
              {!isCollapsed && <div className="sidebar-section">👨‍🏫 Teacher</div>}
             
              <Link to="/teacher/dashboard" className={`sidebar-link ${isActive('/teacher/dashboard')}`} onClick={closeSidebar}>
                <FaChalkboardTeacher />
                {!isCollapsed && <span>Teacher Dashboard</span>}
              </Link>
              <Link to="/teacher/materials" className={`sidebar-link ${isActive('/teacher/materials')}`} onClick={closeSidebar}>
                <FaUpload />
                {!isCollapsed && <span>Materials</span>}
              </Link>
              <Link to="/teacher/students" className={`sidebar-link ${isActive('/teacher/students')}`} onClick={closeSidebar}>
                <FaUsers />
                {!isCollapsed && <span>Students</span>}
              </Link>
              <Link to="/teacher/assignments" className={`sidebar-link ${isActive('/teacher/assignments')}`} onClick={closeSidebar}>
                <FaTasks />
                {!isCollapsed && <span>Assignments</span>}
              </Link>
              {!isCollapsed && <div className="sidebar-section">📝 Quiz Management</div>}
              <Link to="/create-quiz" className={`sidebar-link ${isActive('/create-quiz')}`} onClick={closeSidebar}>
                <FaPlus />
                {!isCollapsed && <span>Create Quiz</span>}
              </Link>
              <Link to="/teacher/quizzes" className={`sidebar-link ${isActive('/teacher/quizzes')}`} onClick={closeSidebar}>
                <FaList />
                {!isCollapsed && <span>My Quizzes</span>}
              </Link>
               <Link to="/profile" className={`sidebar-link ${isActive('/profile')}`} onClick={closeSidebar}>
                <FaUser />
                {!isCollapsed && <span>My Profile</span>}
              </Link>
            </>
          )}

          {/* ADMIN SECTION */}
          {user.role === 'admin' && (
            <>
              {!isCollapsed && <div className="sidebar-section">👑 Admin</div>}
             
              <Link to="/admin/dashboard" className={`sidebar-link ${isActive('/admin/dashboard')}`} onClick={closeSidebar}>
                <FaCog />
                {!isCollapsed && <span>Admin Dashboard</span>}
              </Link>
              <Link to="/admin/users" className={`sidebar-link ${isActive('/admin/users')}`} onClick={closeSidebar}>
                <FaUserCog />
                {!isCollapsed && <span>Manage Users</span>}
              </Link>
              <Link to="/admin/reports" className={`sidebar-link ${isActive('/admin/reports')}`} onClick={closeSidebar}>
                <FaChartBar />
                {!isCollapsed && <span>Reports</span>}
              </Link>
               <Link to="/profile" className={`sidebar-link ${isActive('/profile')}`} onClick={closeSidebar}>
                <FaUser />
                {!isCollapsed && <span>My Profile</span>}
              </Link>
            </>
          )}

          <div className="sidebar-divider"></div>

          {/* Logout */}
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle Button - Desktop Only */}
        {!isMobile && (
          <button className="collapse-toggle" onClick={toggleCollapse}>
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
    </>
  );
}

export default Sidebar;
