import { Link } from 'react-router-dom';
import './StudyNeplogo.css';

// Import your image from assets folder
import navIcon from '../assets/l.png';

function StudyNepLogo({ showIcon = true, showText = true, variant = 'default', size = 'md' }) {
  // variant: 'default', 'light', 'dark', 'gradient'
  // size: 'sm', 'md', 'lg', 'xl'

  const getSizeClass = () => {
    switch(size) {
      case 'sm': return 'logo-sm';
      case 'lg': return 'logo-lg';
      case 'xl': return 'logo-xl';
      default: return 'logo-md';
    }
  };

  const getVariantClass = () => {
    switch(variant) {
      case 'light': return 'logo-light';
      case 'dark': return 'logo-dark';
      case 'gradient': return 'logo-gradient';
      default: return 'logo-default';
    }
  };

  return (
    <div className={`studynep-logo ${getSizeClass()} ${getVariantClass()}`}>
      <Link to="/" className="logo-link">
        {showIcon && (
          <img 
            src={navIcon} 
            alt="StudyNep Icon" 
            className="logo-icon"
          />
        )}
        {showText && (
          <h1 className="logo-text">
            Study<span>Nep</span>
          </h1>
        )}
      </Link>
    </div>
  );
}

export default StudyNepLogo;