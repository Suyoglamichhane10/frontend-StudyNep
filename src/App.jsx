import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home.jsx';  // Added .jsx
import Login from './pages/Login.jsx';  // Added .jsx
import Register from './pages/Register.jsx';  // Added .jsx
import Resources from './pages/Resources.jsx';  // Added .jsx
import Dashboard from './pages/Dashboard.jsx';  // Added .jsx
import Studyplanner from './pages/Studyplanner.jsx';  // Added .jsx
import Schedule from './pages/Schedule.jsx';  // Added .jsx
import Progress from './pages/Progress.jsx';  // Added .jsx
import FocusTimer from "./pages/FocusTimer.jsx";  // Already has .jsx
import Flashcards from './pages/Flashcards.jsx';  // Added .jsx
import Quiz from './pages/Quize.jsx';  // Added .jsx
import TakeQuiz from './pages/TakeQuiz.jsx';  // Added .jsx
import CreateQuiz from './pages/CreateQuiz.jsx';  // Added .jsx
import TeacherQuizzes from './pages/TeacherQuizzes.jsx';  // Added .jsx
import TeacherDashboard from './pages/TeacherDashboard.jsx';  // Added .jsx
import TeacherMaterials from './pages/TeacherMaterials.jsx';  // Added .jsx
import TeacherStudents from './pages/TeacherStudents.jsx';  // Added .jsx
import TeacherAssignments from './pages/TeacherAssignments.jsx';  // Added .jsx
import AdminDashboard from './pages/AdminDashboard.jsx';  // Added .jsx
import AdminUsers from './pages/AdminUsers.jsx';  // Added .jsx
import AdminReports from './pages/AdminReports.jsx';  // Added .jsx
import Portfolio from './pages/Portfolio.jsx';  // Added .jsx
import About from './pages/About.jsx';  // Added .jsx
import FAQ from './pages/FAQ.jsx';  // Added .jsx
import Contact from './pages/Contact.jsx';  // Added .jsx
import StudentMaterials from './pages/StudentMaterials.jsx';  // Added .jsx
import StudentAssignments from './pages/StudentAssignments.jsx';  // Added .jsx
import UserProfilePage from './pages/Userprofile.jsx';  // Added .jsx

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/resources" element={<PublicLayout><Resources /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />

        {/* Profile Route - Available for all authenticated users */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
            <DashboardLayout><UserProfilePage /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Student Routes - No role restriction, but ProtectedRoute will handle redirects */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout><Dashboard /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/planner" element={
          <ProtectedRoute>
            <DashboardLayout><Studyplanner /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/schedule" element={
          <ProtectedRoute>
            <DashboardLayout><Schedule /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/progress" element={
          <ProtectedRoute>
            <DashboardLayout><Progress /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/student/materials" element={
          <ProtectedRoute>
            <DashboardLayout><StudentMaterials /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/student/assignments" element={
          <ProtectedRoute allowedRoles={['student']}>
            <DashboardLayout><StudentAssignments /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/focus" element={
          <ProtectedRoute>
            <DashboardLayout><FocusTimer /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/quiz" element={
          <ProtectedRoute>
            <DashboardLayout><Quiz /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/quiz/:id" element={
          <ProtectedRoute>
            <DashboardLayout><TakeQuiz /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout><TeacherDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/materials" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout><TeacherMaterials /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/students" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout><TeacherStudents /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/assignments" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout><TeacherAssignments /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/create-quiz" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout><CreateQuiz /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/quizzes" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout><TeacherQuizzes /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminUsers /></DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminReports /></DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
