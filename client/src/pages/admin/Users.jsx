import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/constants';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../App.css';

export const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusMsg, setStatusMsg] = useState('');

  // Selected User Profile Pop-up Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [passwordResetStatus, setPasswordResetStatus] = useState('');
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (userId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ngo-verify/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification update failed');
      setStatusMsg(`User ID #${userId} status updated to ${newStatus}`);
      await fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleAdminResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedUser || !adminNewPassword) return;

    setPasswordResetLoading(true);
    setPasswordResetStatus('');

    try {
      const res = await fetch(`${API_BASE_URL}/admin/reset-password/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: adminNewPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset failed');

      setPasswordResetStatus(`✅ Password updated to "${adminNewPassword}"!`);
      setSelectedUser({ ...selectedUser, plain_password: adminNewPassword });
      setAdminNewPassword('');
      await fetchUsers();
    } catch (err) {
      setPasswordResetStatus(`❌ ${err.message}`);
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').includes(search);
    const matchesRole = roleFilter === 'all' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout title="Users & Staff">
      <div style={{ maxWidth: '1110px', margin: '0 auto' }}>

        {statusMsg && (
          <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>
            {statusMsg}
          </div>
        )}

        {/* Figma 42px Search Bar & Dropdown Control Bar */}
        <div style={{ display: 'flex', gap: '12px', height: '42px', marginBottom: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '42px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search name, email or mobile…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 16px',
                borderRadius: '12px',
                border: '1px solid rgba(44, 35, 32, 0.1)',
                background: '#ffffff',
                fontSize: '14px',
                color: '#2c2320',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ width: '160px', height: '42px' }}>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 16px',
                borderRadius: '12px',
                border: '1px solid rgba(44, 35, 32, 0.1)',
                background: '#ffffff',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2c2320',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="all">All Roles</option>
              <option value="donor">Donor</option>
              <option value="receiver">Food Receiver</option>
              <option value="ngo">NGO Partner</option>
              <option value="admin">Super Admin</option>
            </select>
          </div>
        </div>

        {/* Figma SectionCard Table */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(44, 35, 32, 0.05)',
            overflow: 'hidden',
            boxShadow: '0px 2px 4px rgba(44,35,32,0.03), 0px 12px 28px -12px rgba(255,107,74,0.18)'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    height: '40px',
                    background: '#fcf8f6',
                    borderBottom: '1px solid rgba(44, 35, 32, 0.05)',
                    color: '#6b5d56',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}
                >
                  <th style={{ padding: '0 20px', verticalAlign: 'middle' }}>User Details</th>
                  <th style={{ padding: '0 20px', verticalAlign: 'middle' }}>Role</th>
                  <th style={{ padding: '0 20px', verticalAlign: 'middle' }}>Mobile</th>
                  <th style={{ padding: '0 20px', verticalAlign: 'middle' }}>Verification Status</th>
                  <th style={{ padding: '0 20px', verticalAlign: 'middle', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#6b5d56', fontSize: '14px' }}>Loading users database...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#6b5d56', fontSize: '14px' }}>No users match your search.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        height: '56px',
                        borderBottom: '1px solid rgba(44, 35, 32, 0.05)',
                        transition: 'background 0.15s'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#fcf8f6')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '0 20px', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#2c2320', lineHeight: '20px' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b5d56', lineHeight: '16px' }}>{user.email || 'No email registered'}</div>
                      </td>

                      <td style={{ padding: '0 20px', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            background: user.role === 'admin' ? '#ffe4db' : user.role === 'ngo' ? '#dcfce7' : user.role === 'donor' ? '#ffe4db' : '#fef3c7',
                            color: user.role === 'admin' ? '#c8391b' : user.role === 'ngo' ? '#15803d' : user.role === 'donor' ? '#c8391b' : '#b45309',
                            padding: '4px 12px',
                            borderRadius: '100px',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'inline-block',
                            textTransform: 'capitalize'
                          }}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td style={{ padding: '0 20px', verticalAlign: 'middle', fontSize: '14px', color: '#2c2320' }}>
                        {user.phone}
                      </td>

                      <td style={{ padding: '0 20px', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            background: user.verification_status === 'verified' ? '#ecfdf5' : '#fff7ed',
                            color: user.verification_status === 'verified' ? '#047857' : '#c2410c',
                            border: user.verification_status === 'verified' ? '1px solid #a7f3d0' : '1px solid #fed7aa',
                            padding: '4px 12px',
                            borderRadius: '100px',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {user.verification_status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </td>

                      <td style={{ padding: '0 20px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(user);
                              setPasswordResetStatus('');
                              setAdminNewPassword('');
                            }}
                            style={{
                              background: '#ff684e',
                              color: '#ffffff',
                              border: 0,
                              borderRadius: '8px',
                              padding: '6px 14px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              boxShadow: '0px 2px 4px rgba(255,104,78,0.25)'
                            }}
                          >
                            👤 View Profile &amp; Pass
                          </button>

                          {user.verification_status !== 'verified' ? (
                            <button
                              type="button"
                              onClick={() => handleVerify(user.id, 'verified')}
                              style={{
                                background: '#10b981',
                                color: '#ffffff',
                                border: 0,
                                borderRadius: '8px',
                                padding: '6px 14px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              ✓ Verify User
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleVerify(user.id, 'pending')}
                              style={{
                                background: '#ef4444',
                                color: '#ffffff',
                                border: 0,
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: 'pointer'
                              }}
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Super Admin Pop-up Modal: User Full Profile & Password Display */}
      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: '540px', background: '#ffffff', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', color: '#2c2320' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eee5e0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>👤</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>User Profile &amp; Security Credentials</h3>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'transparent', border: 0, fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
            </div>

            {/* Profile Details Card */}
            <div style={{ display: 'grid', gap: '10px', fontSize: '13px', background: '#fcf8f6', padding: '16px', borderRadius: '14px', border: '1px solid #eee5e0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b5d56' }}>User ID:</span>
                <strong>#{selectedUser.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b5d56' }}>Full Name:</span>
                <strong>{selectedUser.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b5d56' }}>System Role:</span>
                <strong style={{ textTransform: 'capitalize', color: '#f04b28' }}>{selectedUser.role}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b5d56' }}>Mobile Number:</span>
                <strong>{selectedUser.phone}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b5d56' }}>Email Address:</span>
                <strong>{selectedUser.email || 'None'}</strong>
              </div>
              
              {/* Password Display Field */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #f0e8e4' }}>
                <span style={{ color: '#9a3412', fontWeight: 700 }}>🔑 Account Password:</span>
                <span style={{ fontFamily: 'monospace', background: '#ffe4db', color: '#c8391b', padding: '3px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '14px' }}>
                  {selectedUser.plain_password || 'Secret123!'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b5d56' }}>NID Number:</span>
                <strong>{selectedUser.nid || 'Not provided'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b5d56' }}>Pickup Address:</span>
                <strong>{selectedUser.address || 'Not provided'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b5d56' }}>Verification Status:</span>
                <strong style={{ color: selectedUser.verification_status === 'verified' ? '#047857' : '#c2410c' }}>
                  {selectedUser.verification_status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                </strong>
              </div>
            </div>

            {/* Super Admin Password Change Form */}
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#9a3412', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚙️ Change Password for {selectedUser.name}
              </div>

              {passwordResetStatus && (
                <div style={{ fontSize: '12px', padding: '8px', borderRadius: '8px', background: '#ffffff', border: '1px solid #fdba74', marginBottom: '10px' }}>
                  {passwordResetStatus}
                </div>
              )}

              <form onSubmit={handleAdminResetPassword} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Enter new password"
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  required
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #fdba74', fontSize: '13px', background: '#ffffff', outline: 'none' }}
                />
                <button
                  type="submit"
                  disabled={passwordResetLoading}
                  style={{ background: '#ea580c', color: '#ffffff', border: 0, borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {passwordResetLoading ? 'Updating...' : 'Set Password'}
                </button>
              </form>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                style={{ background: '#f3f4f6', color: '#374151', border: 0, borderRadius: '10px', padding: '10px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close Pop-up
              </button>

              {selectedUser.verification_status !== 'verified' && (
                <button
                  type="button"
                  onClick={() => {
                    handleVerify(selectedUser.id, 'verified');
                    setSelectedUser(null);
                  }}
                  style={{ background: '#10b981', color: '#ffffff', border: 0, borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Approve &amp; Verify User →
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
