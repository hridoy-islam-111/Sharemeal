import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export const Settings = () => {
  return (
    <AdminLayout title="Platform Settings">
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid rgba(44,35,32,0.06)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2c2320', margin: '0 0 8px' }}>⚙️ System Settings &amp; API Configuration</h2>
        <p style={{ color: '#6b5d56', margin: 0 }}>Configure rate limiters, Google OAuth keys, and email notification webhooks.</p>
      </div>
    </AdminLayout>
  );
};

export default Settings;
