const Logo = ({ width = 40, height = 40 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="20" y="30" width="60" height="40" rx="4" fill="#1E3A8A" />
    <rect x="25" y="25" width="50" height="40" rx="4" fill="#DC2626" />
    <line x1="30" y1="32" x2="70" y2="32" stroke="#FCD34D" strokeWidth="2" />
    <line x1="30" y1="40" x2="70" y2="40" stroke="#FCD34D" strokeWidth="2" />
    <line x1="30" y1="48" x2="70" y2="48" stroke="#FCD34D" strokeWidth="2" />
    <line x1="30" y1="56" x2="60" y2="56" stroke="#FCD34D" strokeWidth="2" />
    <path
      d="M70 25 L80 15 L90 25 L85 30 L80 25 L75 30 L70 25Z"
      fill="#DC2626"
    />
    <path
      d="M72 18 L78 10 L84 18 L81 22 L78 18 L75 22 L72 18Z"
      fill="#1E3A8A"
    />
    <circle cx="82" cy="18" r="3" fill="#FCD34D" />
  </svg>
);

export default Logo;