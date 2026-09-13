import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export const Analytics = () => {
  return (
    <AdminLayout title="Analytics & Impact Metrics">
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid rgba(44,35,32,0.06)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2c2320', margin: '0 0 8px' }}>📈 Impact &amp; Growth Analytics</h2>
        <p style={{ color: '#6b5d56', margin: 0 }}>View real-time charts for meal rescue rates across Dhaka, Chittagong, and Sylhet divisions.</p>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
