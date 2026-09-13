import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import VerificationBanner from '../../components/common/VerificationBanner';
import { API_BASE_URL } from '../../utils/constants';
import '../../App.css';

export const Profile = () => {
  const { user, token } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [nid, setNid] = useState(user?.nid || '');
  const [nidPdf, setNidPdf] = useState(null);
  
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setNid(user.nid || '');
    }
  }, [user]);

  const isVerified = user?.verification_status === 'verified';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('nid', nid);
      if (nidPdf) {
        formData.append('nidPdf', nidPdf);
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');

      setStatus('Profile updated successfully! Your verification details are under review.');
    } catch (err) {
      setError(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff9f5', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Verification Notification Banner */}
      <VerificationBanner />

      <div style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Profile Card Header */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(44,35,32,0.04)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#ffe4db',
                  color: '#c8391b',
                  fontSize: 22,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}
              >
                {name ? name.substring(0, 2).toUpperCase() : 'PS'}
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#2c2320', margin: 0 }}>
                  {name || 'Donor Profile'}
                </h1>
                <p style={{ fontSize: '13px', color: '#6b5d56', margin: '2px 0 0' }}>
                  {user?.role ? user.role.toUpperCase() : 'DONOR'} ACCOUNT
                </p>
              </div>
            </div>

            <div
              style={{
                background: isVerified ? '#ecfdf5' : '#fff7ed',
                border: isVerified ? '1px solid #a7f3d0' : '1px solid #fed7aa',
                color: isVerified ? '#047857' : '#c2410c',
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {isVerified ? '✅ Verified Donor' : '⏳ Pending NID Verification'}
            </div>
          </div>
        </div>

        {/* Profile Editor Form */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(44,35,32,0.04)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#2c2320', margin: '0 0 16px', borderBottom: '1px solid #f4ece8', pb: '12px' }}>
            Edit Account &amp; Verification Details
          </h2>

          {status && (
            <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
              {status}
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: '#2c2320' }}>
                <span>Full Name *</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0d8d3', fontSize: 14 }}
                />
              </label>

              <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: '#2c2320' }}>
                <span>Mobile Number *</span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0d8d3', fontSize: 14 }}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: '#2c2320' }}>
                <span>Email Address *</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0d8d3', fontSize: 14 }}
                />
              </label>

              <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: '#2c2320' }}>
                <span>NID / ID Number *</span>
                <input
                  type="text"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  required
                  placeholder="1234567890"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0d8d3', fontSize: 14 }}
                />
              </label>
            </div>

            <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: '#2c2320' }}>
              <span>Pickup Address</span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House, Road, Area, City"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0d8d3', fontSize: 14 }}
              />
            </label>

            <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: '#2c2320' }}>
              <span>NID Document (PDF or Image)</span>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => setNidPdf(e.target.files[0] || null)}
                style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid #e0d8d3', fontSize: 13 }}
              />
              <span style={{ fontSize: 11, color: '#888', fontWeight: 400 }}>
                Upload your official NID document for team verification. (Max 10MB)
              </span>
            </label>

            <button
              type="submit"
              disabled={saving}
              style={{
                background: '#ff684e',
                color: '#ffffff',
                border: 0,
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '12px',
                boxShadow: '0 4px 12px rgba(255, 104, 78, 0.3)'
              }}
            >
              {saving ? 'Saving Profile...' : 'Save Profile Changes →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
