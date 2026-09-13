import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/constants';

const statusColors = {
  open: { background: '#fff7ed', color: '#c2410c' },
  under_review: { background: '#eff6ff', color: '#1d4ed8' },
  resolved: { background: '#ecfdf5', color: '#047857' },
  dismissed: { background: '#f3f4f6', color: '#374151' }
};

export const Reports = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load reports');
      setReports(data.data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchReports();
  }, [token]);

  const updateStatus = async (id, nextStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update report');
      setMessage('Report status updated successfully.');
      await fetchReports();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <AdminLayout title="System Reports">
      <div style={{ width: '100%' }}>
        {message && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '12px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '13px', fontWeight: 600 }}>
            {message}
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(44,35,32,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3ece8' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2c2320', margin: '0 0 6px' }}>📊 User Report Moderation</h2>
            <p style={{ margin: 0, color: '#6b5d56' }}>Review user reports, inspect the report reason, and update the moderation status.</p>
          </div>

          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#6b5d56' }}>Loading reports...</div>
          ) : reports.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#6b5d56' }}>No reports have been submitted yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fffaf7', color: '#6b5d56', fontSize: '12px', fontWeight: 700, textAlign: 'left' }}>
                    <th style={{ padding: '14px 18px' }}>Report</th>
                    <th style={{ padding: '14px 18px' }}>Reporter</th>
                    <th style={{ padding: '14px 18px' }}>Reported User</th>
                    <th style={{ padding: '14px 18px' }}>Reason</th>
                    <th style={{ padding: '14px 18px' }}>Status</th>
                    <th style={{ padding: '14px 18px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} style={{ borderTop: '1px solid #f3ece8' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: '#2c2320' }}>#{report.id}</td>
                      <td style={{ padding: '14px 18px', color: '#6b5d56' }}>{report.reporter_name || `User #${report.reporter_id}`}</td>
                      <td style={{ padding: '14px 18px', color: '#6b5d56' }}>{report.reported_name || `User #${report.reported_entity_id}`}</td>
                      <td style={{ padding: '14px 18px', color: '#6b5d56', maxWidth: '260px' }}>{report.reason}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ ...statusColors[report.status] || statusColors.open, display: 'inline-block', padding: '5px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>
                          {report.status?.replace('_', ' ') || 'open'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <select
                          value={report.status || 'open'}
                          onChange={(e) => updateStatus(report.id, e.target.value)}
                          style={{ border: '1px solid #e7ddd7', borderRadius: '8px', padding: '7px 10px', outline: 'none', color: '#2c2320', background: '#fff' }}
                        >
                          <option value="open">Open</option>
                          <option value="under_review">Under review</option>
                          <option value="resolved">Resolved</option>
                          <option value="dismissed">Dismissed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
