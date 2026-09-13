import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AuthHeroPanel from '../../components/auth/AuthHeroPanel';
import LoginForm from '../../components/auth/LoginForm';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (credentials) => {
    setError('');
    setLoading(true);

    try {
      const data = await login(credentials);
      const role = data.user?.role || 'donor';

      if (redirectTarget) {
        navigate(redirectTarget);
      } else if (role === 'donor') {
        navigate('/donor/profile');
      } else if (role === 'ngo') {
        navigate('/ngo/dashboard');
      } else if (role === 'receiver') {
        navigate('/receiver/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken) => {
    setError('');
    setLoading(true);

    try {
      const data = await googleLogin(idToken, 'donor');
      const role = data.user?.role || 'donor';

      if (redirectTarget) {
        navigate(redirectTarget);
      } else if (role === 'donor') {
        navigate('/donor/profile');
      } else if (role === 'ngo') {
        navigate('/ngo/dashboard');
      } else if (role === 'receiver') {
        navigate('/receiver/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      {/* Reusable Left Hero Panel */}
      <AuthHeroPanel
        title="Welcome back!"
        subtitle="Your community is waiting. Log back in to rescue food and feed people."
      />

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <Link to="/" className="auth-back-link">
          ← Back to home
        </Link>

        <LoginForm
          title="Log in"
          subtitle="Good to see you again."
          onSubmit={handleLoginSubmit}
          onGoogleSuccess={handleGoogleSuccess}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Login;
