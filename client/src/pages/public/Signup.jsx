import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const Signup = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('donor');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [nid, setNid] = useState('');
  const [nidPdf, setNidPdf] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('address', address);
      formData.append('nid', nid);
      formData.append('password', password);
      formData.append('role', role);
      if (nidPdf) {
        formData.append('nidPdf', nidPdf);
      }

      const data = await register(formData);
      const userRole = data.user?.role || role;

      if (userRole === 'donor') navigate('/donor/post-food');
      else if (userRole === 'receiver') navigate('/receiver/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roleLabels = {
    donor: 'I want to Donate',
    receiver: 'I want to Find Food',
  };

  return (
    <div className="auth-split-container">
      {/* Left Hero Panel */}
      <div className="auth-hero-panel">
        <div className="auth-hero-circle-1" />
        <div className="auth-hero-circle-2" />
        <div className="auth-hero-circle-3" />

        <div className="auth-hero-header">
          <div className="auth-logo-badge">🍲</div>
          <h2 className="auth-brand-name">ShareMeal</h2>
        </div>

        <div className="auth-hero-center">
          <div className="auth-icon-circles">
            <div className="auth-icon-inner-1">
              <div className="auth-icon-inner-2">
                🥗
              </div>
            </div>

            <div className="auth-badge-float-1">
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>482k+ meals</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>rescued to date</div>
            </div>

            <div className="auth-badge-float-2">
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>NGO Partner</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>verified portal</div>
            </div>
          </div>

          <h1 className="auth-hero-title">Join the movement.</h1>
          <p className="auth-hero-subtitle">
            Turn surplus into someone's meal. Sign up in under a minute.
          </p>
        </div>

        <div className="auth-hero-footer-pills">
          <div className="auth-pill"><span>🛡️</span> Verified & Safe</div>
          <div className="auth-pill"><span>🤝</span> Free Forever</div>
          <div className="auth-pill"><span>📍</span> 60+ Cities</div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        {step === 1 ? (
          <Link to="/" className="auth-back-link">
            ← Back to home
          </Link>
        ) : (
          <button type="button" onClick={() => setStep(1)} className="auth-back-link">
            ← Change role
          </button>
        )}

        {/* Progress Stepper */}
        <div className="auth-stepper">
          <div className={`auth-step-pill ${step >= 1 ? 'active' : ''}`}>
            <div className="auth-step-num">1</div>
            <span>Choose role</span>
          </div>
          <div className="auth-step-arrow">→</div>
          <div className={`auth-step-pill ${step >= 2 ? 'active' : ''}`}>
            <div className="auth-step-num">2</div>
            <span>Your details</span>
          </div>
        </div>

        {/* STEP 1: Choose Role (Public roles only: Donor & Receiver) */}
        {step === 1 && (
          <div>
            <div className="auth-form-header">
              <h1>Create account</h1>
              <p>Who are you joining as?</p>
            </div>

            <div className="auth-role-cards">
              {/* Option 1: Donor */}
              <div
                className={`auth-role-card ${role === 'donor' ? 'selected-donor' : ''}`}
                onClick={() => setRole('donor')}
              >
                <div className="auth-role-left">
                  <div className="auth-role-icon donor">🤝</div>
                  <div className="auth-role-info">
                    <h3>I want to Donate</h3>
                    <p>Share surplus food with your community</p>
                  </div>
                </div>
                <div className={`auth-role-radio ${role === 'donor' ? 'checked' : ''}`} />
              </div>

              {/* Option 2: Find Food (Receiver) */}
              <div
                className={`auth-role-card ${role === 'receiver' ? 'selected-receiver' : ''}`}
                onClick={() => setRole('receiver')}
              >
                <div className="auth-role-left">
                  <div className="auth-role-icon receiver">🔍</div>
                  <div className="auth-role-info">
                    <h3>I want to Find Food</h3>
                    <p>Find meals nearby, stay anonymous if you wish</p>
                  </div>
                </div>
                <div className={`auth-role-radio ${role === 'receiver' ? 'checked' : ''}`} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="auth-primary-btn"
            >
              Continue →
            </button>

            <p className="auth-switch-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">
                Log in
              </Link>
            </p>
          </div>
        )}

        {/* STEP 2: Your Details */}
        {step === 2 && (
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
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
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
        )}
      </div>
    </div>
  );
};

export default Signup;
