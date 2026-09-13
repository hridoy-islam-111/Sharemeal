import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/constants';
import '../../App.css';

export const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusMsg, setStatusMsg] = useState('');

  // NID Modal state
  const [selectedUser, setSelectedUser] = useState(null);

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

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || '').includes(search);
    const matchesRole = roleFilter === 'all' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#fff9f5', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Figma Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>👑</span>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#2c2320', margin: 0, fontFamily: "'Fraunces', serif" }}>
                Users &amp; Verification Panel
              </h1>
            </div>
            <p style={{ fontSize: 14, color: '#6b5d56', margin: '4px 0 0' }}>
              Inspect registered Donors, Receivers, and NGOs. Verify NID documents to grant full access.
            </p>
          </div>

          <div style={{ background: '#ffe4db', color: '#c8391b', padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>
            Super Admin Access Active
          </div>
        </div>

        {statusMsg && (
          <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: 12, borderRadius: 12, fontSize: 13, marginBottom: 16 }}>
            {statusMsg}
          </div>
        )}

        {/* Search & Filter Controls */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search name, email or mobile number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 260, padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(44,35,32,0.1)', background: '#fff', fontSize: 14 }}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(44,35,32,0.1)', background: '#fff', fontSize: 14, fontWeight: 600, color: '#2c2320' }}
          >
            <option value="all">All Roles</option>
            <option value="donor">Donor</option>
            <option value="receiver">Food Receiver</option>
            <option value="ngo">NGO Partner</option>
            <option value="admin">Super Admin</option>
          </select>
        </div>

        {/* Users Table Card */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(44,35,32,0.06)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(44,35,32,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#fcf8f6', borderBottom: '1px solid #f0e8e4', color: '#6b5d56', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>User Details</th>
                  <th style={{ padding: '14px 20px' }}>Role</th>
                  <th style={{ padding: '14px 20px' }}>Mobile</th>
                  <th style={{ padding: '14px 20px' }}>Verification Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ padding: 32, textAlign: 'center', color: '#888' }}>Loading users database...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: 32, textAlign: 'center', color: '#6b5d56' }}>No users match the search criteria.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #f8f3f0' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: '#2c2320' }}>{user.name}</div>
                        <div style={{ fontSize: 12, color: '#6b5d56' }}>{user.email || 'No email attached'}</div>
                      </td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            background: user.role === 'admin' ? '#ffe4db' : user.role === 'ngo' ? '#dcfce7' : user.role === 'donor' ? '#e0f2fe' : '#fef3c7',
                            color: user.role === 'admin' ? '#c8391b' : user.role === 'ngo' ? '#15803d' : user.role === 'donor' ? '#0369a1' : '#b45309',
                            padding: '4px 10px',
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 700,
                            textTransform: 'capitalize'
                          }}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', color: '#4a3f3a' }}>{user.phone}</td>

                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            background: user.verification_status === 'verified' ? '#ecfdf5' : '#fff7ed',
                            color: user.verification_status === 'verified' ? '#047857' : '#c2410c',
                            border: user.verification_status === 'verified' ? '1px solid #a7f3d0' : '1px solid #fed7aa',
                            padding: '4px 12px',
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          {user.verification_status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </td>

                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            style={{ background: '#f3f4f6', color: '#374151', border: 0, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                          >
                            📄 View NID
                          </button>

                          {user.verification_status !== 'verified' ? (
                            <button
                              type="button"
                              onClick={() => handleVerify(user.id, 'verified')}
                              style={{ background: '#10b981', color: '#fff', border: 0, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                            >
                              ✓ Verify User
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleVerify(user.id, 'pending')}
                              style={{ background: '#ef4444', color: '#fff', border: 0, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
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

      {/* View NID & Details Modal */}
      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: 500, background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 20px 50px rgba(0,0,0,0.3)', color: '#2c2320' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>📄 User NID &amp; Verification Document</h3>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'transparent', border: 0, fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gap: 10, fontSize: 14, background: '#fcf8f6', padding: 16, borderRadius: 12, border: '1px solid #eee5e0', marginBottom: 16 }}>
              <div><strong>Name:</strong> {selectedUser.name}</div>
              <div><strong>Role:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedUser.role}</span></div>
              <div><strong>Mobile:</strong> {selectedUser.phone}</div>
              <div><strong>Email:</strong> {selectedUser.email || 'N/A'}</div>
              <div><strong>NID Number:</strong> {selectedUser.nid || 'Not provided'}</div>
              <div><strong>Address:</strong> {selectedUser.address || 'Not provided'}</div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                style={{ background: '#f3f4f6', color: '#374151', border: 0, borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>

              {selectedUser.verification_status !== 'verified' && (
                <button
                  type="button"
                  onClick={() => {
                    handleVerify(selectedUser.id, 'verified');
                    setSelectedUser(null);
                  }}
                  style={{ background: '#10b981', color: '#fff', border: 0, borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  Approve &amp; Verify Now →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
