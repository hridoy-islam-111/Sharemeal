import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const SignupForm = ({ role, onSubmit, loading, error }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [nid, setNid] = useState('');
  const [nidPdf, setNidPdf] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const roleLabels = {
    donor: 'I want to Donate',
    receiver: 'I want to Find Food',
    ngo: 'I am an NGO / Organization'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      phone,
      email,
      address,
      nid,
      nidPdf,
      password,
      role,
      agreed
    });
  };

  return (
    <div>
      <div className="auth-form-header">
        <h1>Your details</h1>
        <div>
          <span className={`auth-selected-role-pill ${role}`}>
            Signing up as {roleLabels[role]}
          </span>
        </div>
      </div>

      <button type="button" className="auth-google-btn" style={{ marginTop: 14 }}>
        <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        Sign up with Google
      </button>

      <div className="auth-divider">or</div>

      {error && (
        <div style={{ marginBottom: 12, padding: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: 13, borderRadius: 10 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label>Full Name <span className="required">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon">👤</span>
            <input
              type="text"
              placeholder="Abdur Rahman"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label>Mobile Number <span className="required">*</span></label>
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
          <label>Email Address <span className="required">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon">✉️</span>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label>Address</label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon">📍</span>
            <input
              type="text"
              placeholder="Street, City, State"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label>NID / ID Number <span className="required">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon">🛡️</span>
            <input
              type="text"
              placeholder="1234567890123"
              value={nid}
              onChange={(e) => setNid(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label>NID / ID Document (PDF or Image) <span className="required">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon">📤</span>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setNidPdf(e.target.files[0] || null)}
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label>Password <span className="required">*</span></label>
          <div className="auth-input-wrapper">
            <span className="auth-input-icon">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ border: 0, background: 'transparent', paddingRight: 12, cursor: 'pointer', fontSize: 14 }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0', fontSize: 12, color: '#6b5d56' }}>
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ accentColor: '#ff684e' }}
          />
          <label htmlFor="agreeTerms" style={{ textTransform: 'none', fontWeight: 400, margin: 0, cursor: 'pointer' }}>
            I agree to ShareMeal's <span style={{ color: '#f04b28', fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: '#f04b28', fontWeight: 600 }}>Privacy Policy</span>
          </label>
        </div>

        <button type="submit" disabled={loading} className="auth-primary-btn">
          {loading ? 'Creating Account...' : 'Create Account →'}
        </button>
      </form>

      <p className="auth-switch-text">
        Already have an account?{' '}
        <Link to="/login" className="auth-switch-link">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
