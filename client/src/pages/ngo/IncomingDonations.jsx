import React, { useState } from 'react';
import foodPostService from '../../services/foodPostService';

export const IncomingDonations = () => {
  const [foodPosts, setFoodPosts] = useState([]);
  const [radius, setRadius] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const findDonations = () => {
    if (!navigator.geolocation) {
      setError('Location access is not available in this browser.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        try {
          const lat = Number(coords.latitude);
          const lon = Number(coords.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            setError('Invalid location received. Please try again.');
            setLoading(false);
            return;
          }
          foodPostService.getNearbyPosts({ latitude: lat, longitude: lon, radius })
            .then((data) => setFoodPosts(data.foodPosts || []))
            .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || 'Unable to load nearby donations.'))
            .finally(() => setLoading(false));
        } catch (err) {
          setError('Error processing your location. Please try again.');
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError('Please allow location access to search nearby donations.');
      }
    );
  };

  return (
    <div className="page-content" style={{ maxWidth: '980px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: '"Playfair Display", Georgia, serif' }}>Available Surplus Donations</h1>
          <p style={{ color: '#756c69' }}>Browse available donor posts near your NGO location.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select value={radius} onChange={(event) => setRadius(Number(event.target.value))} aria-label="Search radius">
            <option value="5000">5 km</option>
            <option value="10000">10 km</option>
            <option value="25000">25 km</option>
          </select>
          <button className="continue-button" type="button" onClick={findDonations}>Find nearby donations</button>
        </div>
      </div>
      {loading && <p className="status-message">Searching nearby donations...</p>}
      {error && <p className="status-message">{error}</p>}
      {!loading && !error && foodPosts.length === 0 && <p className="empty-state">Start a search to view available donations.</p>}
      <div className="post-list" style={{ marginTop: '20px' }}>
        {foodPosts.map((post) => (
          <article className="saved-post" key={post.id}>
            <div>
              <strong>{post.food_type || 'Food donation'} · {post.quantity}</strong>
              <span>{post.donor_name || 'Verified donor'} · {post.district || 'Location provided'}</span>
              <small>Expires {post.expiry_time ? new Date(post.expiry_time).toLocaleString() : 'soon'}</small>
            </div>
            <strong>{(Number(post.distance_meters || 0) / 1000).toFixed(1)} km</strong>
          </article>
        ))}
      </div>
    </div>
  );
};

export default IncomingDonations;
