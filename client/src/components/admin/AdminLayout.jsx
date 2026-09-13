import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/constants';
import '../../App.css';

// Figma Vector SVG Icons
const Icons = {
  Brand: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 1.66699V7.50033C2.5 8.41699 3.25 9.16699 4.16667 9.16699H7.5C7.94203 9.16699 8.36595 8.9914 8.67851 8.67884C8.99107 8.36628 9.16667 7.94235 9.16667 7.50033V1.66699" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
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

// Initial Notification Feed with Activity Lifecycles
const initialNotifications = [
  {
    id: 1,
    type: 'donor_posted',
    title: '🍲 Donor Posted Free Food',
    subtitle: 'Priya Sharma posted 40 Fresh Meal Boxes in Dhanmondi',
    time: '10 mins ago',
    unread: true,
    thread: [
      { step: 1, label: 'Food Posted by Donor', detail: 'Priya Sharma submitted post #104 (40 Rice & Curry Boxes)', status: 'completed', time: '10 mins ago' },
      { step: 2, label: 'NGO Accepted', detail: 'Care Bangladesh NGO accepted donation request', status: 'completed', time: '8 mins ago' },
      { step: 3, label: 'Picked to Hub', detail: 'Collection Staff Ramesh picked up food from Dhanmondi Hub', status: 'completed', time: '4 mins ago' },
      { step: 4, label: 'Distributed', detail: 'Successfully Distributed to 40 beneficiaries at Lalmatia Center', status: 'completed', time: 'Just now' }
    ]
  },
  {
    id: 2,
    type: 'new_donor',
    title: '👤 New Donor Joined',
    subtitle: 'Abdur Rahman registered as Verified Donor',
    time: '25 mins ago',
    unread: true,
    thread: [
      { step: 1, label: 'Account Registered', detail: 'Abdur Rahman submitted registration with mobile 01700998877', status: 'completed', time: '25 mins ago' },
      { step: 2, label: 'NID Document Uploaded', detail: 'NID Document #1992837102 uploaded for verification', status: 'completed', time: '20 mins ago' },
      { step: 3, label: 'Super Admin Approval', detail: 'Super Admin verified profile & granted food posting access', status: 'completed', time: '15 mins ago' }
    ]
  },
  {
    id: 3,
    type: 'new_receiver',
    title: '👤 New Food Receiver Joined',
    subtitle: 'Karim Ahmed registered as Food Receiver',
    time: '1 hour ago',
    unread: true,
    thread: [
      { step: 1, label: 'Receiver Account Created', detail: 'Karim Ahmed registered from Mirpur-10', status: 'completed', time: '1 hour ago' },
      { step: 2, label: 'Location Verified', detail: 'GPS Address verified for food distribution point', status: 'completed', time: '45 mins ago' }
    ]
  },
  {
    id: 4,
    type: 'receiver_requested',
    title: '📦 Receiver Requested Food',
    subtitle: 'Rahim requested 15 Warm Meal Packets in Uttara',
    time: '2 hours ago',
    unread: false,
    thread: [
      { step: 1, label: 'Food Request Created', detail: 'Rahim requested 15 emergency meal packets for family', status: 'completed', time: '2 hours ago' },
      { step: 2, label: 'NGO Accepted', detail: 'Anjuman Mokhles NGO assigned distribution request #209', status: 'completed', time: '1.5 hours ago' },
      { step: 3, label: 'Picked to Hub', detail: 'Distributor Staff Tanvir loaded meals at Sector 4 Hub', status: 'completed', time: '1 hour ago' },
      { step: 4, label: 'Distributed', detail: 'Handed over directly to Rahim at Uttara distribution spot', status: 'completed', time: '30 mins ago' }
    ]
  }
];

export const AdminLayout = ({ children, title = 'Users & Staff' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Profile modal & notification panel states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [otpSentMsg, setOtpSentMsg] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleNotificationClick = (notif) => {
    setSelectedNotification(notif);
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const [profileOtpStep, setProfileOtpStep] = useState(1);
  const [profileOtpCode, setProfileOtpCode] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileOtpMsg, setProfileOtpMsg] = useState('');
  const [profileOtpErr, setProfileOtpErr] = useState('');
  const [profilePreviewUrl, setProfilePreviewUrl] = useState(null);

  const handleForgotPasswordClick = async () => {
    setOtpLoading(true);
    setProfileOtpMsg('');
    setProfileOtpErr('');
    setProfilePreviewUrl(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'hridoy.islam.webflow@gmail.com' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      setProfileOtpCode('');
      setProfileOtpMsg(`✉️ 6-digit OTP code sent to hridoy.islam.webflow@gmail.com. Please check your email inbox and enter the code below.`);
      if (data.previewUrl) setProfilePreviewUrl(data.previewUrl);
      setProfileOtpStep(2);
    } catch (err) {
      setProfileOtpErr(`❌ ${err.message}`);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleProfileResetPassword = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setProfileOtpMsg('');
    setProfileOtpErr('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'hridoy.islam.webflow@gmail.com',
          otp: profileOtpCode,
          newPassword: profileNewPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      setProfileOtpMsg('🎉 Password successfully reset! You can now log in with your new password.');
      setProfileNewPassword('');
    } catch (err) {
      setProfileOtpErr(`❌ ${err.message}`);
    } finally {
      setOtpLoading(false);
    }
  };

  const navItems = [
    { label: 'Home', path: '/admin/dashboard', IconComponent: Icons.Home },
    { label: 'Users', path: '/admin/users', IconComponent: Icons.Users },
    { label: 'NGO Panel', path: '/admin/ngo-queue', IconComponent: Icons.Ngo },
    { label: 'Reports', path: '/admin/reports', IconComponent: Icons.Reports },
    { label: 'Analytics', path: '/admin/analytics', IconComponent: Icons.Analytics },
    { label: 'Bot & Fraud Alerts', path: '/admin/bot-alerts', IconComponent: Icons.Alerts },
    { label: 'Settings', path: '/admin/settings', IconComponent: Icons.Settings }
  ];

  const getInitials = (name) => {
    if (!name) return 'HI';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f2ef', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Figma 256px Sidebar anchored to bottom */}
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

        {/* Bottom Profile Footer Anchored to Bottom */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(44,35,32,0.05)', marginTop: 'auto' }}>
          {/* Interactive Hridoy Islam Profile Box */}
          <div
            onClick={() => setShowProfileModal(true)}
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
            title="Click to view email, forget password, and notification settings"
          >
            {/* Centered HI Initial Avatar */}
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
              {getInitials(user?.name || 'Hridoy Islam')}
            </div>

            <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#2c2320', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', lineHeight: '18px' }}>
                {user?.name ? user.name.replace(/\s*\(Super Admin\)/i, '') : 'Hridoy Islam'}
              </div>
              <div style={{ fontSize: 12, color: '#6b5d56', lineHeight: '16px' }}>Admin</div>
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
        {/* Figma Top Header Bar */}
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
            {/* Notifications Button */}
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
              title="Click to view notifications and activity lifecycles"
            >
              <Icons.Bell />
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
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#2c2320' }}>Platform Notifications</h4>
                    <span style={{ fontSize: '12px', color: '#6b5d56' }}>Realtime Donor &amp; Receiver Activity</span>
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
                        handleNotificationClick(notif);
                        setShowNotificationPanel(false);
                      }}
                      style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #f7f2ef',
                        background: notif.unread ? '#fff7ed' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#fcf8f6')}
                      onMouseOut={(e) => (e.currentTarget.style.background = notif.unread ? '#fff7ed' : '#ffffff')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#2c2320' }}>{notif.title}</span>
                        <span style={{ fontSize: '11px', color: '#9a3412', fontWeight: 600 }}>{notif.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6b5d56', lineHeight: '16px' }}>{notif.subtitle}</p>
                      <div style={{ marginTop: 8, fontSize: '11px', color: '#ff6b4a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>View Activity Thread Lifecycle →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#fff9f5' }}>
          {children}
        </main>
      </div>

      {/* Activity Lifecycle Thread Modal */}
      {selectedNotification && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 3000 }}>
          <div style={{ width: '100%', maxWidth: '520px', background: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', color: '#2c2320' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eee5e0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#2c2320' }}>{selectedNotification.title}</h3>
                <span style={{ fontSize: '12px', color: '#6b5d56' }}>Activity Lifecycle Thread • {selectedNotification.time}</span>
              </div>
              <button onClick={() => setSelectedNotification(null)} style={{ background: 'transparent', border: 0, fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
            </div>

            <p style={{ fontSize: '14px', color: '#2c2320', fontWeight: 600, background: '#fcf8f6', padding: '12px 16px', borderRadius: '12px', border: '1px solid #eee5e0', marginBottom: '20px' }}>
              {selectedNotification.subtitle}
            </p>

            {/* Lifecycle Timeline Thread */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '8px', position: 'relative', marginBottom: '24px' }}>
              {selectedNotification.thread.map((item, idx) => (
                <div key={item.step} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative' }}>
                  {/* Vertical connecting line */}
                  {idx < selectedNotification.thread.length - 1 && (
                    <div style={{ position: 'absolute', left: '13px', top: '26px', bottom: '-16px', width: '2px', background: '#10b981' }} />
                  )}

                  {/* Step status circle */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#10b981',
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      flexShrink: 0,
                      zIndex: 1,
                      boxShadow: '0 2px 6px rgba(16,185,129,0.4)'
                    }}
                  >
                    ✓
                  </div>

                  <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>Step {item.step}: {item.label}</span>
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>{item.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: '16px' }}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {(selectedNotification.type === 'new_donor' || selectedNotification.type === 'new_receiver') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNotification(null);
                    navigate('/admin/users');
                  }}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 0,
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(16,185,129,0.3)'
                  }}
                >
                  👤 Inspect Profile &amp; Verify User →
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                style={{ background: '#ff6b4a', color: '#ffffff', border: 0, borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Thread Lifecycle
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Pop-up Modal when clicking on Hridoy Islam Profile */}
      {showProfileModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 2000 }}>
          <div style={{ width: '100%', maxWidth: '460px', background: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', color: '#2c2320' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eee5e0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffe4db', color: '#c8391b', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  HI
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#2c2320' }}>Hridoy Islam</h3>
                  <span style={{ fontSize: '12px', color: '#6b5d56' }}>Super Admin</span>
                </div>
              </div>
              <button onClick={() => setShowProfileModal(false)} style={{ background: 'transparent', border: 0, fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
            </div>

            {/* Email Field */}
            <div style={{ background: '#fcf8f6', padding: '14px 16px', borderRadius: '12px', border: '1px solid #eee5e0', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6b5d56', fontWeight: 600 }}>📧 Gmail Account:</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2c2320' }}>hridoy.islam.webflow@gmail.com</span>
            </div>

            {/* Notification On / Off Switch */}
            <div style={{ background: '#fcf8f6', padding: '14px 16px', borderRadius: '12px', border: '1px solid #eee5e0', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6b5d56', fontWeight: 600 }}>🔔 Admin Notifications:</span>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                style={{
                  background: notificationsEnabled ? '#10b981' : '#d1d5db',
                  color: '#ffffff',
                  border: 0,
                  borderRadius: '100px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                {notificationsEnabled ? '✓ Enabled (On)' : '✕ Muted (Off)'}
              </button>
            </div>

            {/* Forget Password Form */}
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#9a3412', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🔑 Password Recovery via OTP
              </div>

              {profileOtpMsg && (
                <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: 10, borderRadius: 8, fontSize: 12, marginBottom: 10, fontWeight: 600 }}>
                  {profileOtpMsg}
                  {profilePreviewUrl && (
                    <div style={{ marginTop: 6 }}>
                      <a href={profilePreviewUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#ea580c', textDecoration: 'underline', fontWeight: 700 }}>
                        📩 Click here to open sent email preview (Simulated Inbox) →
                      </a>
                    </div>
                  )}
                </div>
              )}
              {profileOtpErr && <div style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: 10, borderRadius: 8, fontSize: 12, marginBottom: 10, fontWeight: 600 }}>{profileOtpErr}</div>}

              {profileOtpStep === 1 ? (
                <div>
                  <p style={{ fontSize: '12px', color: '#7c2d12', margin: '0 0 10px' }}>
                    Generate a 6-digit OTP reset code for your super admin account.
                  </p>
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    disabled={otpLoading}
                    style={{
                      width: '100%',
                      background: '#ea580c',
                      color: '#ffffff',
                      border: 0,
                      borderRadius: '8px',
                      padding: '9px 14px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {otpLoading ? 'Generating OTP...' : '🔑 Generate OTP Code'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProfileResetPassword} style={{ display: 'grid', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#9a3412', display: 'block', marginBottom: 4 }}>
                      6-DIGIT OTP CODE
                    </label>
                    <input
                      type="text"
                      value={profileOtpCode}
                      onChange={(e) => setProfileOtpCode(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fdba74', fontSize: '13px', background: '#ffffff', outline: 'none', fontWeight: 700, letterSpacing: 2, textAlign: 'center' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#9a3412', display: 'block', marginBottom: 4 }}>
                      ENTER NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={profileNewPassword}
                      onChange={(e) => setProfileNewPassword(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fdba74', fontSize: '13px', background: '#ffffff', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setProfileOtpStep(1)}
                      style={{ background: '#f3f4f6', color: '#374151', border: 0, borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={otpLoading}
                      style={{ flex: 1, background: '#10b981', color: '#ffffff', border: 0, borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {otpLoading ? 'Updating Password...' : 'Confirm & Set New Password →'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Close Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                style={{ background: '#f3f4f6', color: '#374151', border: 0, borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close Settings
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
