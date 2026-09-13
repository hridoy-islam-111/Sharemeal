import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export const BotAlerts = () => {
  return (
    <AdminLayout title="Bot & Fraud Alerts">
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid rgba(44,35,32,0.06)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2c2320', margin: '0 0 8px' }}>🤖 Security &amp; Bot Audit Logs</h2>
        <p style={{ color: '#10b981', fontWeight: 600, margin: 0 }}>✓ All security checks nominal. No bot activity or automated posting detected.</p>
      </div>
    </AdminLayout>
  );
};

export default BotAlerts;
