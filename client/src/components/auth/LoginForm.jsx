import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export const LoginForm = ({ onSubmit, onGoogleSuccess, loading, error, title = "Log in", subtitle = "Good to see you again." }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ phone, password });
  };

  return (
    <div>
      <div className="auth-form-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (onGoogleSuccess && credentialResponse.credential) {
              onGoogleSuccess(credentialResponse.credential);
            }
          }}
          onError={() => {
            console.error('Google Sign-In failed');
          }}
          text="continue_with"
          theme="outline"
          shape="pill"
          width="100%"
        />
      </div>

      <div className="auth-divider">or</div>

      {error && (
        <div style={{ marginBottom: 12, padding: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, borderRadius: 10 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label>Phone Number <span className="required">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon">📞</span>
            <input
              type="text"
              placeholder="01712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label>Password <span className="required">*</span></label>
          <div className="auth-input-wrapper" style={{ position: 'relative' }}>
            <span className="auth-input-icon">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 0,
                fontSize: '16px',
                cursor: 'pointer',
                opacity: 0.8
              }}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0', fontSize: 13, color: '#6b5d56' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input type="checkbox" style={{ accentColor: '#f04b28' }} />
            Remember me
          </label>
          <a href="#forgot" style={{ color: '#f04b28', fontWeight: 600, textDecoration: 'none' }}>
            Forgot password?
          </a>
        </div>

        <button type="submit" disabled={loading} className="auth-primary-btn">
          {loading ? 'Logging In...' : 'Log In →'}
        </button>
      </form>

      <p className="auth-switch-text">
        Don't have an account?{' '}
        <Link to="/signup" className="auth-switch-link">
          Sign up free
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
