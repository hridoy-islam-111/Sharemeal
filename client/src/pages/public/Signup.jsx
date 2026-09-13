import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthHeroPanel from '../../components/auth/AuthHeroPanel';
import RoleSelector from '../../components/auth/RoleSelector';
import SignupForm from '../../components/auth/SignupForm';

export const Signup = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('donor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSignupSubmit = async (formData) => {
    setError('');
    setLoading(true);

    try {
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

  const handleGoogleSuccess = async (idToken) => {
    setError('');
    setLoading(true);

    try {
      const data = await googleLogin(idToken, role);
      const userRole = data.user?.role || role;

      if (userRole === 'donor') navigate('/donor/post-food');
      else if (userRole === 'receiver') navigate('/receiver/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      {/* Reusable Left Hero Panel */}
      <AuthHeroPanel
        title="Join the movement."
        subtitle="Turn surplus into someone's meal. Sign up in under a minute."
      />

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

        {/* STEP 1: Role Selector */}
        {step === 1 && (
          <RoleSelector
            role={role}
            setRole={setRole}
            onContinue={() => setStep(2)}
          />
        )}

        {/* STEP 2: Signup Form */}
        {step === 2 && (
          <SignupForm
            role={role}
            onSubmit={handleSignupSubmit}
            onGoogleSuccess={handleGoogleSuccess}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default Signup;
