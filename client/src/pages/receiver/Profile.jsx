import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', nid: '' });
  const [nidPdf, setNidPdf] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: user?.address || '',
      nid: user?.nid || ''
    });
  }, [user]);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus('');
    setError('');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (nidPdf) formData.append('nidPdf', nidPdf);

    try {
      const data = await authService.updateProfile(formData);
      updateUser(data.user);
      setStatus('Profile updated. Your identity remains encrypted in storage.');
      setNidPdf(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <h1 style={{ margin: 0, fontFamily: '"Playfair Display", Georgia, serif' }}>Receiver Profile Settings</h1>
      <p style={{ color: '#756c69' }}>Your identity is protected and only shown to you or authorized administrators.</p>
      <form className="post-card" style={{ padding: '20px', marginTop: '20px' }} onSubmit={handleSubmit}>
        {['name', 'phone', 'email', 'address', 'nid'].map((field) => (
          <label className="form-grid" key={field} style={{ display: 'grid', marginBottom: '14px' }}>
            <span>{field === 'nid' ? 'NID / ID Number' : field.charAt(0).toUpperCase() + field.slice(1)}</span>
            <input name={field} value={form[field]} onChange={handleChange} required={field === 'name' || field === 'nid'} />
          </label>
        ))}
        <label style={{ display: 'grid', gap: '6px', marginBottom: '16px' }}>
          <span>Updated verification document</span>
          <input type="file" accept="application/pdf,image/*" onChange={(event) => setNidPdf(event.target.files?.[0] || null)} />
        </label>
        {status && <p style={{ color: '#16855b' }}>{status}</p>}
        {error && <p className="status-message">{error}</p>}
        <button className="continue-button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
      </form>
    </div>
  );
};

export default Profile;
