import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/constants';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

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
  const [foodPosts, setFoodPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'grid'
  const [selectedPost, setSelectedPost] = useState(null);

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

                  <button
                    onClick={() => setSelectedPost(post)}
                    style={{ width: '100%', background: '#2c2320', color: '#ffffff', border: 0, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    View Details &amp; Location →
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Selected Post Popup Modal */}
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
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FindFood;
