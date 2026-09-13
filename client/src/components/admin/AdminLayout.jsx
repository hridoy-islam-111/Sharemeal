import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../App.css';

export const AdminLayout = ({ children, title = 'Users & Staff' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Home', path: '/admin/dashboard', icon: '🏠' },
    { label: 'Users & Staff', path: '/admin/users', icon: '👥' },
    { label: 'NGO Panel', path: '/admin/ngo-queue', icon: '🏢' },
    { label: 'Reports', path: '/admin/reports', icon: '📊' },
    { label: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { label: 'Bot & Fraud Alerts', path: '/admin/bot-alerts', icon: '🤖' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' }
  ];

  const getInitials = (name) => {
    if (!name) return 'AS';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f2ef', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Figma 256px Sidebar */}
      <aside
        style={{
          width: '256px',
          background: '#ffffff',
          borderRight: '1px solid rgba(44, 35, 32, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          flexShrink: 0,
          boxShadow: '1px 0px 0px rgba(44,35,32,0.06)'
        }}
      >
        <div>
          {/* Brand Header */}
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid rgba(44,35,32,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: '#ff6b4a',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                color: '#fff',
                fontSize: 18,
                boxShadow: '0px 6px 7px rgba(255,107,74,0.6)'
              }}
            >
              🍲
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#2c2320', fontFamily: "'Fraunces', serif" }}>
              ShareMeal
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    background: isActive ? '#ff6b4a' : 'transparent',
                    color: isActive ? '#ffffff' : '#6b5d56',
                    boxShadow: isActive ? '0px 8px 9px rgba(255,107,74,0.45)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span style={{ fontSize: 12 }}>›</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(44,35,32,0.05)' }}>
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 8
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#ffe4db',
                color: '#c8391b',
                fontWeight: 800,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
            >
              {getInitials(user?.name)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2c2320', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Admin Superuser'}
              </div>
              <div style={{ fontSize: 11, color: '#6b5d56' }}>Super Admin</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '12px',
              border: 0,
              background: 'transparent',
              color: '#6b5d56',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#f7f2ef')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Figma Top Header Bar */}
        <header
          style={{
            height: '60px',
            background: '#ffffff',
            borderBottom: '1px solid rgba(44,35,32,0.05)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexShrink: 0
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#2c2320', fontFamily: "'Fraunces', serif" }}>
            {title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Notifications Button */}
            <div
              style={{
                position: 'relative',
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(44,35,32,0.05)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: 16 }}>🔔</span>
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  background: '#ff6b4a',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 800,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}
              >
                7
              </span>
            </div>

            {/* Profile Avatar Pill */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#ffe4db',
                color: '#c8391b',
                fontWeight: 800,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
            >
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#fff9f5' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
