import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/constants';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';
import MyRequestsModal from '../../components/receiver/MyRequestsModal';

// Fix Leaflet default marker icons in React Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Food Pin Icon
const createFoodMarkerIcon = (type) => {
  const isVeg = (type || '').toLowerCase().includes('veg') && !(type || '').toLowerCase().includes('non');
  const color = isVeg ? '#10b981' : '#ff6b4a';
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background: ${color}; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">${isVeg ? '🥬' : '🍲'}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
  });
};

export const FindFood = () => {

  const { user, token } = useAuth();
  const [foodPosts, setFoodPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'grid'
  const [selectedPost, setSelectedPost] = useState(null);

  // Request Food State
  const [requestModalPost, setRequestModalPost] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const [requestNotes, setRequestNotes] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [showMyRequests, setShowMyRequests] = useState(false);

  const handleOpenRequestModal = (post) => {
    setRequestModalPost(post);
    setIsAnonymous(false);
    setRequestedQuantity(1);
    setRequestNotes('');
    setRequestError('');
  };

  const handleCreateFoodRequest = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in as a Receiver or NGO to request food.');
      return;
    }
    setSubmittingRequest(true);
    setRequestError('');

    try {
      const res = await fetch(`${API_BASE_URL}/food-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          food_post_id: requestModalPost.id,
          is_anonymous: isAnonymous,
          requested_quantity: requestedQuantity,
          notes: requestNotes
        })
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setSubmittedRequest(data.data);
        setRequestModalPost(null);
      } else {
        setRequestError(data.message || 'Failed to submit food request');
      }
    } catch (err) {
      console.error('Request error:', err);
      setRequestError('Network error submitting request');
    } finally {
      setSubmittingRequest(false);
    }
  };


  useEffect(() => {
    fetchFoodPosts();
  }, []);

  const fetchFoodPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/food-posts`);
      const data = await res.json();
      if (res.ok && data.foodPosts) {
        setFoodPosts(data.foodPosts);
      }
    } catch (err) {
      console.error('Error fetching food posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Food Listings
  const filteredPosts = foodPosts.filter((post) => {
    const matchesSearch =
      (post.district || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.thana || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.area_ward || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.donor_name || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === 'All' ||
      (post.food_type || '').toLowerCase() === selectedType.toLowerCase();

    const matchesDistrict =
      selectedDistrict === 'All' ||
      (post.district || '').toLowerCase() === selectedDistrict.toLowerCase();

    return matchesSearch && matchesType && matchesDistrict;
  });

  // Calculate default map center (Dhaka fallback or first post location)
  const defaultCenter = [23.8103, 90.4125];
  const validMapPosts = filteredPosts.filter((p) => p.latitude && p.longitude);

  return (
    <div style={{ minHeight: '100vh', background: '#fff9f5', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Title & View Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#2c2320', fontFamily: "'Fraunces', serif" }}>
              📍 Nearby Food Discovery &amp; Visual Map
            </h1>
            <p style={{ margin: '4px 0 0', color: '#6b5d56', fontSize: '14px' }}>
              Explore available meals donated by generous donors across Bangladesh.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {user && (
              <button
                onClick={() => setShowMyRequests(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: '1px solid #ff6b4a',
                  background: '#fff0ec',
                  color: '#d9381e',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(255,107,74,0.15)'
                }}
              >
                📋 My Requests &amp; Pickup Codes
              </button>
            )}

            <div style={{ display: 'flex', background: '#ffffff', border: '1px solid rgba(44,35,32,0.1)', borderRadius: '12px', padding: '4px' }}>
              <button
                onClick={() => setViewMode('map')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 0,
                  background: viewMode === 'map' ? '#ff6b4a' : 'transparent',
                  color: viewMode === 'map' ? '#ffffff' : '#2c2320',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🗺️ Visual Map View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 0,
                  background: viewMode === 'grid' ? '#ff6b4a' : 'transparent',
                  color: viewMode === 'grid' ? '#ffffff' : '#2c2320',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                📋 Grid Cards ({filteredPosts.length})
              </button>
            </div>
          </div>

        </div>

        {/* Filter Controls Bar */}
        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid rgba(44,35,32,0.06)', boxShadow: '0 4px 16px rgba(44,35,32,0.04)', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="🔍 Search by District, Thana, Area, or Donor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #e0d8d3',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Food Type Selector */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Veg', 'Non-Veg', 'Cooked'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '100px',
                  border: '1px solid',
                  borderColor: selectedType === type ? '#ff6b4a' : '#e0d8d3',
                  background: selectedType === type ? '#ffebe6' : '#ffffff',
                  color: selectedType === type ? '#d9381e' : '#6b5d56',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {type === 'Veg' ? '🥬 Veg' : type === 'Non-Veg' ? '🍗 Non-Veg' : type === 'Cooked' ? '🍲 Cooked' : '✨ All Types'}
              </button>
            ))}
          </div>

        </div>

        {/* View Mode 1: Visual Interactive Leaflet Map */}
        {viewMode === 'map' && (
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '12px', border: '1px solid rgba(44,35,32,0.06)', boxShadow: '0 12px 32px rgba(44,35,32,0.08)', marginBottom: '32px' }}>
            <div style={{ width: '100%', height: '520px', borderRadius: '14px', overflow: 'hidden', zIndex: 1 }}>
              <MapContainer
                center={validMapPosts.length > 0 ? [parseFloat(validMapPosts[0].latitude), parseFloat(validMapPosts[0].longitude)] : defaultCenter}
                zoom={12}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {validMapPosts.map((post) => (
                  <Marker
                    key={post.id}
                    position={[parseFloat(post.latitude), parseFloat(post.longitude)]}
                    icon={createFoodMarkerIcon(post.food_type)}
                  >
                    <Popup>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '4px', maxWidth: '240px' }}>
                        <span style={{ background: '#ffe4db', color: '#c8391b', padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, display: 'inline-block', marginBottom: '4px' }}>
                          {post.food_type} • {post.quantity} Meals
                        </span>
                        <h4 style={{ margin: '4px 0', fontSize: '14px', fontWeight: 700, color: '#2c2320' }}>
                          {post.district}, {post.thana}
                        </h4>
                        <p style={{ margin: '4px 0', fontSize: '12px', color: '#6b5d56' }}>
                          📍 {post.area_ward || 'Pickup Point'} {post.road_no ? `, Road ${post.road_no}` : ''}
                        </p>
                        <p style={{ margin: '4px 0 8px', fontSize: '11px', color: '#ff6b4a', fontWeight: 600 }}>
                          ⏰ Expires: {new Date(post.expiry_time).toLocaleString()}
                        </p>
                        <button
                          onClick={() => setSelectedPost(post)}
                          style={{ width: '100%', background: '#ff6b4a', color: '#fff', border: 0, padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          View Full Details →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {/* View Mode 2: Grid Cards */}
        {viewMode === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b5d56' }}>Loading active food posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '16px', color: '#6b5d56' }}>
                No food posts found matching your search.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid rgba(44,35,32,0.06)',
                    padding: '20px',
                    boxShadow: '0 4px 16px rgba(44,35,32,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ background: '#e3f5ea', color: '#227a55', padding: '3px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 700 }}>
                        {post.food_type}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff6b4a', background: '#fff0ec', padding: '3px 10px', borderRadius: '100px' }}>
                        🍲 {post.quantity} Servings
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#2c2320' }}>
                      {post.district}, {post.thana}
                    </h3>
                    <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#6b5d56' }}>
                      📍 {post.area_ward || 'Pickup Point'} {post.road_no ? `, Road ${post.road_no}` : ''} {post.house_no ? `, House ${post.house_no}` : ''}
                    </p>

                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>
                      <strong>Donor:</strong> {post.donor_name || 'Verified Donor'} • 📱 {post.donor_phone || 'Protected'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button
                      onClick={() => setSelectedPost(post)}
                      style={{ flex: 1, background: '#2c2320', color: '#ffffff', border: 0, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      View Details →
                    </button>
                    <button
                      onClick={() => handleOpenRequestModal(post)}
                      style={{ flex: 1, background: '#ff6b4a', color: '#ffffff', border: 0, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      🍱 Request Food
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Selected Post Popup Details Modal */}
        {selectedPost && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 3000 }}>
            <div style={{ width: '100%', maxWidth: '520px', background: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', color: '#2c2320', maxHeight: '90vh', overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eee5e0', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>🍲 Food Donation Listing #{selectedPost.id}</h3>
                <button onClick={() => setSelectedPost(null)} style={{ background: 'transparent', border: 0, fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
              </div>

              <div style={{ display: 'grid', gap: '10px', background: '#fcf8f6', padding: '16px', borderRadius: '14px', border: '1px solid #eee5e0', marginBottom: '16px', fontSize: '13px' }}>
                <div><strong>Food Type:</strong> {selectedPost.food_type}</div>
                <div><strong>Quantity:</strong> {selectedPost.quantity} Servings</div>
                <div><strong>Expiry Date/Time:</strong> {new Date(selectedPost.expiry_time).toLocaleString()}</div>
                <div><strong>District / Thana:</strong> {selectedPost.district}, {selectedPost.thana}</div>
                <div><strong>Full Address:</strong> {selectedPost.area_ward}, Road {selectedPost.road_no || 'N/A'}, House {selectedPost.house_no || 'N/A'}, Floor {selectedPost.floor_flat || 'N/A'}</div>
                <div><strong>Donor Contact:</strong> {selectedPost.donor_name} ({selectedPost.donor_phone})</div>
                {selectedPost.latitude && (
                  <div><strong>GPS Pin:</strong> Lat {selectedPost.latitude}, Lon {selectedPost.longitude}</div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={() => setSelectedPost(null)} style={{ background: '#f3f4f6', color: '#374151', border: 0, borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  Close
                </button>
                <button
                  onClick={() => {
                    const target = selectedPost;
                    setSelectedPost(null);
                    handleOpenRequestModal(target);
                  }}
                  style={{ background: '#ff6b4a', color: '#ffffff', border: 0, borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  🍱 Request This Food
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Modal 1: Request Food Form */}
        {requestModalPost && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 3200 }}>
            <div style={{ width: '100%', maxWidth: '480px', background: '#ffffff', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', color: '#2c2320' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eee5e0', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, fontFamily: "'Fraunces', serif" }}>
                  🍱 Request Food Donation
                </h3>
                <button onClick={() => setRequestModalPost(null)} style={{ background: 'transparent', border: 0, fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
              </div>

              {requestError && (
                <div style={{ background: '#fde8e8', color: '#991b1b', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>
                  ⚠️ {requestError}
                </div>
              )}

              <form onSubmit={handleCreateFoodRequest} style={{ display: 'grid', gap: '16px' }}>
                
                <div style={{ background: '#faf5f2', padding: '12px', borderRadius: '12px', border: '1px solid #eee5e0', fontSize: '13px' }}>
                  <div><strong>Post:</strong> {requestModalPost.food_type} ({requestModalPost.quantity} Servings available)</div>
                  <div><strong>Location:</strong> {requestModalPost.district}, {requestModalPost.thana}</div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    Servings Needed:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={requestModalPost.quantity || 10}
                    value={requestedQuantity}
                    onChange={(e) => setRequestedQuantity(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0d8d3', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    Special Notes for Donor (Optional):
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Estimated pickup time or family member count..."
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0d8d3', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Identity Masking Option */}
                <div style={{ background: '#f3e8ff', border: '1px solid #e9d5ff', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="isAnonymousToggle"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                  />
                  <label htmlFor="isAnonymousToggle" style={{ fontSize: '13px', cursor: 'pointer', color: '#581c87', fontWeight: 600 }}>
                    🕵️ Request Anonymously (Identity Masking)
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 400, color: '#7e22ce', marginTop: '2px' }}>
                      When checked, your real name &amp; contact info remain encrypted &amp; hidden publicly as "Anonymous Receiver".
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setRequestModalPost(null)} style={{ background: '#f3f4f6', color: '#374151', border: 0, borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingRequest} style={{ background: '#ff6b4a', color: '#ffffff', border: 0, borderRadius: '10px', padding: '10px 22px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                    {submittingRequest ? 'Submitting...' : 'Confirm Food Request →'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* Modal 2: Pickup Code Confirmation Screen */}
        {submittedRequest && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 3400 }}>
            <div style={{ width: '100%', maxWidth: '440px', background: '#ffffff', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', color: '#2c2320', textAlign: 'center' }}>
              
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
              <h3 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 800, fontFamily: "'Fraunces', serif", color: '#166534' }}>
                Food Request Submitted!
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#6b5d56' }}>
                Save or screenshot your unique 6-digit pickup code below. You must present this code to the donor when collecting food.
              </p>

              {/* Pickup Code Display Badge */}
              <div style={{ background: '#fff0ec', border: '3px dashed #ff6b4a', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#6b5d56' }}>
                  YOUR SECURE PICKUP CODE
                </div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#d9381e', letterSpacing: '3px', fontFamily: 'monospace', margin: '6px 0' }}>
                  {submittedRequest.pickup_code}
                </div>
                {submittedRequest.is_anonymous && (
                  <div style={{ fontSize: '11px', color: '#6b21a8', fontWeight: 700, marginTop: '4px' }}>
                    🕵️ Identity Masked (Anonymous Mode Active)
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setSubmittedRequest(null);
                    setShowMyRequests(true);
                  }}
                  style={{ background: '#2c2320', color: '#ffffff', border: 0, borderRadius: '10px', padding: '12px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  View My Requests &amp; Pickup Codes
                </button>
                <button
                  onClick={() => setSubmittedRequest(null)}
                  style={{ background: '#ff6b4a', color: '#ffffff', border: 0, borderRadius: '10px', padding: '12px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Receiver Requests Drawer / Modal */}
        <MyRequestsModal
          isOpen={showMyRequests}
          onClose={() => setShowMyRequests(false)}
          token={token}
        />

      </div>
    </div>
  );
};

export default FindFood;

