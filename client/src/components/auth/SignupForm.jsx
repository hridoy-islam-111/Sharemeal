import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export const SignupForm = ({ role, onSubmit, onGoogleSuccess, loading, error }) => {
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

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14, marginBottom: 14 }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (onGoogleSuccess && credentialResponse.credential) {
              onGoogleSuccess(credentialResponse.credential);
            }
          }}
          onError={() => {
            console.error('Google Sign-Up failed');
          }}
          text="signup_with"
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
          <div className="auth-input-wrapper" style={{ position: 'relative' }}>
            <span className="auth-input-icon">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
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
