import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import './Login.css';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await resetPassword(token, password);
      setStatus(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset your password. Please request a new link.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="login-page"><div className="login-card">
    <div className="login-header"><h2>Set a new password</h2><p>Your new password must be at least 6 characters.</p></div>
    {status && <div className="success-alert">{status}</div>}
    {error && <div className="error-alert">{error}</div>}
    {!status && <form onSubmit={handleSubmit}>
      <div className="form-group"><input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="6" required disabled={loading} /></div>
      <div className="form-group"><input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength="6" required disabled={loading} /></div>
      <button className="login-btn" disabled={loading}>{loading ? 'Updating...' : 'Reset password'}</button>
    </form>}
    <div className="signup-prompt"><p><Link to="/login">Back to login</Link></p></div>
  </div></div>;
}

export default ResetPassword;
