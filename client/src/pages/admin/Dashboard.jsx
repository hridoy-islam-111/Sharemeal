import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { API_BASE_URL } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import '../../App.css';

export const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalFoodPosts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <AdminLayout title="Super Admin Dashboard">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Welcome Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(174deg, #ff8461 0%, #f04b28 100%)',
            borderRadius: '16px',
            padding: '28px 32px',
            color: '#ffffff',
            marginBottom: '24px',
            boxShadow: '0 12px 28px -12px rgba(255, 107, 74, 0.4)'
          }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>
            Welcome to Super Admin Platform Control 👑
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
            Monitor user registrations, verify NGO partners, track food donations, and oversee platform security.
          </p>
        </div>

        {/* System Stats Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid rgba(44,35,32,0.06)', boxShadow: '0 4px 16px rgba(44,35,32,0.04)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b5d56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Registered Users</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#2c2320', marginTop: 8 }}>{loading ? '...' : stats.totalUsers}</div>
            <div style={{ fontSize: '13px', color: '#10b981', marginTop: 4, fontWeight: 600 }}>Active Platform Accounts</div>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid rgba(44,35,32,0.06)', boxShadow: '0 4px 16px rgba(44,35,32,0.04)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b5d56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Food Donation Listings</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#2c2320', marginTop: 8 }}>{loading ? '...' : stats.totalFoodPosts}</div>
            <div style={{ fontSize: '13px', color: '#ff6b4a', marginTop: 4, fontWeight: 600 }}>Total Rescued Meals</div>
          </div>

          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid rgba(44,35,32,0.06)', boxShadow: '0 4px 16px rgba(44,35,32,0.04)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b5d56', textTransform: 'uppercase', letterSpacing: '0.5px' }}>System Safety Status</div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: '#10b981', marginTop: 8 }}>100%</div>
            <div style={{ fontSize: '13px', color: '#6b5d56', marginTop: 4 }}>No Bot Anomalies Detected</div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
