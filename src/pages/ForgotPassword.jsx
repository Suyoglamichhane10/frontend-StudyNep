import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import './Login.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await forgotPassword(email);
      setStatus(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send the reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="login-page"><div className="login-card">
    <div className="login-header"><h2>Forgot password?</h2><p>Enter your account email and we’ll send a reset link.</p></div>
    {status && <div className="success-alert">{status}</div>}
    {error && <div className="error-alert">{error}</div>}
    <form onSubmit={handleSubmit}>
      <div className="form-group"><input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading || !!status} /></div>
      <button className="login-btn" disabled={loading || !!status}>{loading ? 'Sending...' : 'Send reset link'}</button>
    </form>
    <div className="signup-prompt"><p><Link to="/login">Back to login</Link></p></div>
  </div></div>;
}

export default ForgotPassword;
