import './DashboardLayout.css';
import Sidebar from './Sidebar';

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content-area">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;