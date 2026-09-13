import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../App.css';

// Figma Vector SVG Icons
const Icons = {
  Brand: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Home: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Users: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Ngo: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
    </svg>
  ),
  Reports: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Analytics: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Alerts: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Settings: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Logout: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b5d56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
};

export const AdminLayout = ({ children, title = 'Users & Staff' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Home', path: '/admin/dashboard', IconComponent: Icons.Home },
    { label: 'Users & Staff', path: '/admin/users', IconComponent: Icons.Users },
    { label: 'NGO Panel', path: '/admin/ngo-queue', IconComponent: Icons.Ngo },
    { label: 'Reports', path: '/admin/reports', IconComponent: Icons.Reports },
    { label: 'Analytics', path: '/admin/analytics', IconComponent: Icons.Analytics },
    { label: 'Bot & Fraud Alerts', path: '/admin/bot-alerts', IconComponent: Icons.Alerts },
    { label: 'Settings', path: '/admin/settings', IconComponent: Icons.Settings }
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
          {/* Figma Brand Header */}
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid rgba(44,35,32,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 10
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
                boxShadow: '0px 6px 7px rgba(255,107,74,0.6)'
              }}
            >
              <Icons.Brand />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#2c2320', fontFamily: "'Fraunces', serif" }}>
              ShareMeal
            </span>
          </div>

          {/* Figma Side Nav Tabs */}
          <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const { IconComponent } = item;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '10px 12px',
                    height: '40px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease-in-out',
                    background: isActive ? '#ff6b4a' : 'transparent',
                    color: isActive ? '#ffffff' : '#6b5d56',
                    boxShadow: isActive ? '0px 8px 9px rgba(255,107,74,0.55)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18 }}>
                      <IconComponent color={isActive ? '#ffffff' : '#6b5d56'} />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  {isActive && <Icons.ChevronRight />}
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
              marginBottom: 4
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#ffe4db',
                color: '#c8391b',
                fontWeight: 700,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
            >
              {getInitials(user?.name)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#2c2320', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Admin Superuser'}
              </div>
              <div style={{ fontSize: 12, color: '#6b5d56' }}>Admin</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              height: '40px',
              padding: '10px 12px',
              borderRadius: '12px',
              border: 0,
              background: 'transparent',
              color: '#6b5d56',
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#f7f2ef')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18 }}>
              <Icons.Logout color="#6b5d56" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Figma Top Header Bar */}
        <header
          style={{
            height: '56px',
            background: '#ffffff',
            borderBottom: '1px solid rgba(44,35,32,0.05)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexShrink: 0,
            boxSizing: 'border-box'
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#2c2320', fontFamily: "'Fraunces', serif" }}>
            {title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Notifications Button */}
            <div
              style={{
                position: 'relative',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(44,35,32,0.05)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                cursor: 'pointer'
              }}
            >
              <Icons.Bell />
              <div
                style={{
                  position: 'absolute',
                  top: -2,
                  left: 26,
                  background: '#ff6b4a',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}
              >
                7
              </div>
            </div>

            {/* Profile Avatar Circle */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#ffe4db',
                color: '#c8391b',
                fontWeight: 700,
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
