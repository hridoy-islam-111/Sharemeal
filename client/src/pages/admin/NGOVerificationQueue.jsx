import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/constants';
import '../../App.css';

export const NGOVerificationQueue = () => {
  const { token } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchQueue = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ngo-queue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPendingUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching verification queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [token]);

  const handleVerify = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/ngo-verify/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'verified' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      setStatusMsg(`Approved user #${id}!`);
      await fetchQueue();
    } catch (err) {
      alert(err.message || 'Error verifying user');
    }
  };

  return (
    <AdminLayout title="NGO & User Verification Queue">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#2c2320', margin: '0 0 4px', fontFamily: "'Fraunces', serif" }}>
            Pending Verification Requests
          </h1>
          <p style={{ fontSize: 14, color: '#6b5d56', margin: 0 }}>
            Inspect pending NID submissions and approve verified accounts.
          </p>
        </div>

        {statusMsg && (
          <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: 12, borderRadius: 12, fontSize: 13, marginBottom: 16 }}>
            {statusMsg}
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(44,35,32,0.06)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(44,35,32,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#fcf8f6', borderBottom: '1px solid #f0e8e4', color: '#6b5d56', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 20px' }}>User Details</th>
                <th style={{ padding: '14px 20px' }}>Role</th>
                <th style={{ padding: '14px 20px' }}>Mobile</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: 32, textAlign: 'center', color: '#888' }}>Loading queue...</td>
                </tr>
              ) : pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: 32, textAlign: 'center', color: '#6b5d56' }}>🎉 No pending verification requests! All accounts are verified.</td>
                </tr>
              ) : (
                pendingUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f8f3f0' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#2c2320' }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: '#6b5d56' }}>{user.email || 'No email'}</div>
                    </td>
                    <td style={{ padding: '16px 20px', textTransform: 'capitalize' }}>{user.role}</td>
                    <td style={{ padding: '16px 20px' }}>{user.phone}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ background: '#fff7ed', color: '#c2410c', padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                        ⏳ Pending
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleVerify(user.id)}
                        style={{ background: '#10b981', color: '#fff', border: 0, borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        ✓ Approve &amp; Verify
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
};

export default NGOVerificationQueue;
