import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../utils/constants';
import '../../App.css';

const API_URL = `${API_BASE_URL}/food-posts`;

const emptyForm = {
  donor_id: '',
  food_type: 'Veg',
  quantity: '',
  expiry_time: '',
  district: 'Dhaka',
  thana: '',
  area_ward: '',
  road_no: '',
  house_no: '',
  floor_flat: '',
  latitude: '',
  longitude: '',
};

const foodTypes = [
  { name: 'Veg', className: 'veg' },
  { name: 'Non-veg', className: 'nonVeg' },
  { name: 'Cooked', className: 'cooked' },
];

export const PostFood = () => {
  const [form, setForm] = useState(emptyForm);
  const [foodPosts, setFoodPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('Loading food posts...');
  const [saving, setSaving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const loadFoodPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not load food posts.');
      setFoodPosts(data.foodPosts || []);
      setStatus('');
    } catch (error) {
      setStatus(error.message || 'Cannot connect to the backend.');
    }
  };

  useEffect(() => {
    loadFoodPosts();
  }, []);

  const changeField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  // Device GPS Auto-Location Fetcher
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setGpsLoading(false);
      },
      (error) => {
        alert('Could not get device location: ' + error.message);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const saveFoodPost = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus('');

    const payload = {
      ...form,
      donor_id: Number(form.donor_id) || 1,
      quantity: Number(form.quantity),
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
    };
    const isEditing = Boolean(editingId);

    try {
      const response = await fetch(isEditing ? `${API_URL}/${editingId}` : API_URL, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not save food post.');
      setStatus(data.message);
      setForm(emptyForm);
      setEditingId(null);
      await loadFoodPosts();
    } catch (error) {
      setStatus(error.message || 'Could not save food post.');
    } finally {
      setSaving(false);
    }
  };

  const editFoodPost = (foodPost) => {
    setEditingId(foodPost.id);
    setForm({
      donor_id: foodPost.donor_id || '',
      food_type: foodPost.food_type || 'Veg',
      quantity: foodPost.quantity || '',
      expiry_time: foodPost.expiry_time ? new Date(foodPost.expiry_time).toISOString().slice(0, 16) : '',
      district: foodPost.district || 'Dhaka',
      thana: foodPost.thana || '',
      area_ward: foodPost.area_ward || '',
      road_no: foodPost.road_no || '',
      house_no: foodPost.house_no || '',
      floor_flat: foodPost.floor_flat || '',
      latitude: foodPost.latitude ?? '',
      longitude: foodPost.longitude ?? '',
    });
    setStatus(`Editing food post #${foodPost.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteFoodPost = async (id) => {
    if (!window.confirm('Delete this food post?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not delete food post.');
      setStatus(data.message);
      await loadFoodPosts();
    } catch (error) {
      setStatus(error.message || 'Could not delete food post.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <section className="post-card">
        <div className="steps">
          <div className="step current"><span>1</span><p>Food Info</p><b>&gt;</b></div>
          <div className="step"><span>2</span><p>Pickup Details</p><b>&gt;</b></div>
          <div className="step"><span>3</span><p>Photo &amp; Notes</p></div>
        </div>

        <form className="form-content" onSubmit={saveFoodPost}>
          <h2>{editingId ? 'Update your food post' : 'What are you sharing?'}</h2>
          
          <label className="field-label">Food Type</label>
          <div className="food-types">
            {foodTypes.map((food) => (
              <button
                className={`food-type ${food.className} ${form.food_type === food.name ? 'selected' : ''}`}
                key={food.name}
                onClick={() => setForm((current) => ({ ...current, food_type: food.name }))}
                type="button"
              >
                <span className="food-icon">🥗</span>
                <span>{food.name}</span>
              </button>
            ))}
          </div>

          <div className="form-grid">
            <label><span>Donor ID</span><input name="donor_id" onChange={changeField} placeholder="e.g. 1" required value={form.donor_id} /></label>
            <label><span>Quantity</span><input min="1" name="quantity" onChange={changeField} placeholder="e.g. 12 meals" required type="number" value={form.quantity} /></label>
            <label><span>Expiry time</span><input name="expiry_time" onChange={changeField} required type="datetime-local" value={form.expiry_time} /></label>
          </div>

          <hr style={{ margin: '20px 0 16px', border: 0, borderTop: '1px solid #eee9e7' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#2c2320' }}>📍 Exact Pickup Address Details</h3>
            
            {/* Device Location Button Only */}
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={gpsLoading}
              style={{
                background: form.latitude ? '#059669' : '#ff684e',
                color: '#fff',
                border: 0,
                borderRadius: 10,
                padding: '8px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              📍 {gpsLoading ? 'Detecting Location...' : form.latitude ? `✅ GPS Attached (${form.latitude}, ${form.longitude})` : 'Use My Device Location'}
            </button>
          </div>

          {/* Bangladesh Detailed Address Fields */}
          <div className="form-grid">
            <label>
              <span>District *</span>
              <input name="district" onChange={changeField} placeholder="e.g. Dhaka, Chittagong, Sylhet" required value={form.district} />
            </label>

            <label>
              <span>Thana / Upazila *</span>
              <input name="thana" onChange={changeField} placeholder="e.g. Dhanmondi, Gulshan, Mirpur" required value={form.thana} />
            </label>

            <label>
              <span>Area / Ward</span>
              <input name="area_ward" onChange={changeField} placeholder="e.g. Ward 15, Green Road" value={form.area_ward} />
            </label>

            <label>
              <span>Road No.</span>
              <input name="road_no" onChange={changeField} placeholder="e.g. Road 4/A" value={form.road_no} />
            </label>

            <label>
              <span>House No. / Building</span>
              <input name="house_no" onChange={changeField} placeholder="e.g. House 12" value={form.house_no} />
            </label>

            <label>
              <span>Floor / Flat No.</span>
              <input name="floor_flat" onChange={changeField} placeholder="e.g. 3rd Floor, Flat B-3" value={form.floor_flat} />
            </label>
          </div>

          <div className="form-actions">
            <button className="continue-button" disabled={saving} type="submit">{saving ? 'Saving...' : editingId ? 'Update food' : 'Post food'}</button>
            {editingId && (
              <button className="cancel-button" onClick={() => { setEditingId(null); setForm(emptyForm); }} type="button">Cancel</button>
            )}
          </div>
        </form>
      </section>

      <section className="posts-section">
        <div className="posts-heading">
          <h2>Your food posts</h2>
          <button className="refresh-button" onClick={loadFoodPosts} type="button">Refresh</button>
        </div>
        {status && <p className="status-message">{status}</p>}
        {foodPosts.length === 0 && !status ? (
          <p className="empty-state">No food posts yet. Add your first donation above.</p>
        ) : (
          <div className="post-list">
            {foodPosts.map((post) => (
              <article className="saved-post" key={post.id}>
                <div>
                  <strong>{post.food_type} ({post.quantity} meals)</strong>
                  <span>Expires: {new Date(post.expiry_time).toLocaleString()}</span>
                  <div style={{ fontSize: 12, color: '#4a3f3a', marginTop: 4 }}>
                    📍 <strong>Address:</strong> {[post.house_no, post.road_no, post.floor_flat, post.area_ward, post.thana, post.district].filter(Boolean).join(', ') || 'Address not specified'}
                  </div>
                  {post.latitude && post.longitude && (
                    <small style={{ color: '#059669', fontWeight: 600 }}>📍 GPS Pin: {post.latitude}, {post.longitude}</small>
                  )}
                </div>
                <div className="post-buttons">
                  <button onClick={() => editFoodPost(post)} type="button">Edit</button>
                  <button className="delete-button" onClick={() => deleteFoodPost(post.id)} type="button">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PostFood;
