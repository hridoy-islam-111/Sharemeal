import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export const Reports = () => {
  return (
    <AdminLayout title="System Reports">
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid rgba(44,35,32,0.06)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2c2320', margin: '0 0 8px' }}>📊 Audit &amp; Platform Reports</h2>
        <p style={{ color: '#6b5d56', margin: 0 }}>Generate CSV/PDF summaries of food rescues, NGO distributions, and donor contributions.</p>
      </div>
    </AdminLayout>
  );
};

export default Reports;
