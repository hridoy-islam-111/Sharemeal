import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Top Navigation Bar Component
 */
export const Navbar = () => {
  const { user, logout } = useAuth();

  // TODO: Add mobile navigation drawer and active link styling
  return (
    <nav style={{ width: '100%', background: 'rgba(255, 249, 245, 0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid rgba(44, 35, 32, 0.06)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff8461 0%, #f04b28 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', boxShadow: '0 4px 12px rgba(240, 75, 40, 0.3)' }}>
            🍲
          </div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 800, color: '#2c2320', letterSpacing: '-0.5px' }}>
            ShareMeal
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/how-it-works" style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '14px', fontWeight: 600 }}>
            How it works
          </Link>
          <Link to="/find-food" style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '14px', fontWeight: 600 }}>
            Find food
          </Link>
          <Link
            to={user ? (user.role === 'donor' ? '/donor/profile' : `/${user.role}/dashboard`) : '/donate'}
            style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '14px', fontWeight: 600 }}
          >
            Donate
          </Link>
          <Link to="/stories" style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '14px', fontWeight: 600 }}>
            Stories
          </Link>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to={user.role === 'super_admin' ? '/super-admin/dashboard' : `/${user.role}/dashboard`}
                style={{ textDecoration: 'none', background: '#ffebe6', color: '#d9381e', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700 }}
              >
                Dashboard ({user.name?.split(' ')[0] || user.role})
              </Link>
              <button
                onClick={logout}
                style={{ background: 'transparent', border: 0, color: '#6b5d56', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" style={{ textDecoration: 'none', color: '#2c2320', fontSize: '14px', fontWeight: 700, padding: '6px 12px' }}>
                Log in
              </Link>
              <Link
                to="/signup"
                style={{
                  textDecoration: 'none',
                  background: '#ff6b4a',
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(255, 107, 74, 0.3)'
                }}
              >
                Get started →
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
