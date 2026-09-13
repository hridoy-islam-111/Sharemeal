import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../App.css';

// Figma Donor Vector SVG Icons
const Icons = {
  Brand: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 1.66699V7.50033C2.5 8.41699 3.25 9.16699 4.16667 9.16699H7.5C7.94203 9.16699 8.36595 8.9914 8.67851 8.67884C8.99107 8.36628 9.16667 7.50033V1.66699" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.83301 1.66699V18.3337" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.4997 12.5003V1.66699C16.3946 1.66699 15.3348 2.10598 14.5534 2.88738C13.772 3.66878 13.333 4.72859 13.333 5.83366V10.8337C13.333 11.7503 14.083 12.5003 14.9997 12.5003H17.4997ZM17.4997 12.5003V18.3337" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Home: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Donations: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  PostFood: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  Journey: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  Ratings: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  History: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Notifications: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Profile: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Logout: ({ color = "currentColor" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
};

export const DonorLayout = ({ children, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const isVerified = user?.verification_status === 'verified';

  useEffect(() => {
    // Generate real-time donor notifications feed
    const initialList = [
      {
        id: 1,
        title: isVerified ? '🎉 Profile Approved by Super Admin' : '⏳ NID Verification Pending Review',
        subtitle: isVerified
          ? 'Super Admin verified your NID details! You now have full verified access to post food.'
          : 'Your NID details are uploaded and awaiting Super Admin approval.',
        time: isVerified ? 'Just now' : '15 mins ago',
        unread: true,
        type: 'verification'
      },
      {
        id: 2,
        title: '🍲 Food Donation Request Accepted',
        subtitle: 'Care Bangladesh NGO accepted your food donation post #104 (40 Rice Boxes).',
        time: '1 hour ago',
        unread: false,
        type: 'donation'
      }
    ];
    setNotifications(initialList);
  }, [isVerified]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/donor/dashboard', IconComponent: Icons.Home },
    { label: 'My Donations', path: '/donor/my-donations', IconComponent: Icons.Donations },
    { label: 'Post New Food', path: '/donor/post-food', IconComponent: Icons.PostFood },
    { label: 'Food Journey', path: '/donor/journey', IconComponent: Icons.Journey },
    { label: 'Ratings', path: '/donor/ratings', IconComponent: Icons.Ratings },
    { label: 'History', path: '/donor/history', IconComponent: Icons.History },
    { label: 'Notifications', path: '/donor/notifications', IconComponent: Icons.Notifications },
    { label: 'Profile', path: '/donor/profile', IconComponent: Icons.Profile }
  ];

  const getInitials = (name) => {
    if (!name) return 'PS';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff9f5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Figma 256px Donor Sidebar */}
      <aside
        style={{
          width: '256px',
          background: '#ffffff',
          borderRight: '1px solid rgba(44, 35, 32, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          boxShadow: '1px 0px 0px rgba(44,35,32,0.06)',
          height: '100vh',
          position: 'sticky',
          top: 0
        }}
      >
        <div>
          {/* Centered Brand Navbar Logo Header */}
          <div
            style={{
              height: '60px',
              padding: '0 20px',
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
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0px 6px 7px rgba(255,107,74,0.6)',
                flexShrink: 0
              }}
            >
              <Icons.Brand />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#2c2320', fontFamily: "'Fraunces', serif", lineHeight: 1 }}>
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
                    justifyContent: 'space-between',
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

        {/* Bottom Donor Profile Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(44,35,32,0.05)', marginTop: 'auto' }}>
          <div
            onClick={() => navigate('/donor/profile')}
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 4,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#fcf8f6')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#ffe4db',
                color: '#c8391b',
                fontWeight: 700,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {getInitials(user?.name || 'Abdur Rahman')}
            </div>

            <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#2c2320', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', lineHeight: '18px' }}>
                {user?.name || 'Abdur Rahman'}
              </div>
              <div style={{ fontSize: 12, color: '#6b5d56', lineHeight: '16px' }}>Donor</div>
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

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <header
          style={{
            width: '100%',
            height: '60px',
            background: '#ffffff',
            borderBottom: '1px solid rgba(44,35,32,0.05)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexShrink: 0,
            boxSizing: 'border-box',
            position: 'relative'
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#2c2320', fontFamily: "'Fraunces', serif" }}>
            {title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto', position: 'relative' }}>
            {/* Notification Bell Button */}
            <div
              onClick={() => setShowNotificationPanel(!showNotificationPanel)}
              style={{
                position: 'relative',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(44,35,32,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Click to view notifications"
            >
              <Icons.Notifications color="#6b5d56" />
              {unreadCount > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: -2,
                    left: 24,
                    background: '#ff6b4a',
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: 700,
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    textAlign: 'center'
                  }}
                >
                  {unreadCount}
                </div>
              )}
            </div>

            {/* Avatar Circle */}
            <div
              onClick={() => navigate('/donor/profile')}
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
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {getInitials(user?.name || 'Abdur Rahman')}
            </div>

            {/* Notification Dropdown Panel */}
            {showNotificationPanel && (
              <div
                style={{
                  position: 'absolute',
                  top: '52px',
                  right: 0,
                  width: '360px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(44,35,32,0.08)',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '16px', borderBottom: '1px solid #f0e8e4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcf8f6' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#2c2320' }}>Donor Notifications</h4>
                    <span style={{ fontSize: '12px', color: '#6b5d56' }}>Verification &amp; Donation Updates</span>
                  </div>
                  <button
                    onClick={() => setShowNotificationPanel(false)}
                    style={{ background: 'transparent', border: 0, fontSize: '18px', cursor: 'pointer', color: '#888' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n)));
                        setShowNotificationPanel(false);
                      }}
                      style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #f7f2ef',
                        background: notif.unread ? '#fff7ed' : '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#2c2320' }}>{notif.title}</span>
                        <span style={{ fontSize: '11px', color: '#9a3412', fontWeight: 600 }}>{notif.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6b5d56', lineHeight: '16px' }}>{notif.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Realtime Verified Alert Banner */}
        {isVerified && (
          <div style={{ background: '#ecfdf5', borderBottom: '1px solid #a7f3d0', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#047857', fontWeight: 700 }}>
            <span>🎉 Super Admin approved your profile! You are now a Verified Donor and can post free food.</span>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>✓ Active</span>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#fff9f5' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DonorLayout;
