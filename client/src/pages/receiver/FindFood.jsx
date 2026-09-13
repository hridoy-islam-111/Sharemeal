import React, { useEffect, useState } from 'react';
import foodPostService from '../../services/foodPostService';
import { useAuth } from '../../context/AuthContext';

export const ReceiverFindFood = () => {
  const { token } = useAuth();
  const [foodPosts, setFoodPosts] = useState([]);
  const [radius, setRadius] = useState(5000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);

  const loadNearbyFood = (latitude, longitude, requestedRadius = radius) => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !Number.isFinite(requestedRadius)) {
      setError('Invalid location or radius provided.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    foodPostService.getNearbyPosts({ latitude, longitude, radius: requestedRadius })
      .then((data) => setFoodPosts(data.foodPosts || []))
      .catch((requestError) => setError(requestError.response?.data?.message || requestError.message || 'Unable to load nearby food.'))
      .finally(() => setLoading(false));
  };

  const findNearbyFood = () => {
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
          const nextLocation = { latitude: lat, longitude: lon };
          setLocation(nextLocation);
          loadNearbyFood(lat, lon);
        } catch (err) {
          setError('Error processing your location. Please try again.');
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError('Please allow location access to search nearby food.');
      }
    );
  };

  useEffect(() => {
    findNearbyFood();
  }, []);

  const formatDistance = (meters) => `${(Number(meters || 0) / 1000).toFixed(1)} km away`;

  return (
    <div className="page-content" style={{ maxWidth: '980px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: '"Playfair Display", Georgia, serif' }}>Find Available Meals</h1>
          <p style={{ color: '#756c69' }}>Search verified food donations near your current location.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label htmlFor="receiver-radius">Radius</label>
          <select id="receiver-radius" value={radius} onChange={(event) => {
            const nextRadius = Number(event.target.value);
            setRadius(nextRadius);
            if (location) loadNearbyFood(location.latitude, location.longitude, nextRadius);
          }}>
            <option value="2000">2 km</option>
            <option value="5000">5 km</option>
            <option value="10000">10 km</option>
            <option value="25000">25 km</option>
          </select>
          <button className="continue-button" type="button" onClick={findNearbyFood}>Use my location</button>
        </div>
      </div>

      {loading && <p className="status-message">Finding available food near you...</p>}
      {error && <p className="status-message">{error}</p>}
      {!token && <p className="status-message">Your session is required for nearby search.</p>}
      {!loading && !error && foodPosts.length === 0 && <p className="empty-state">No available food was found in this radius.</p>}

      <div className="post-list" style={{ marginTop: '20px' }}>
        {foodPosts.map((post) => (
          <article className="saved-post" key={post.id} style={{ alignItems: 'flex-start' }}>
            <div>
              <strong>{post.food_type || 'Food donation'}</strong>
              <span>{post.quantity} · {post.district || 'Location provided by donor'}</span>
              <small>{post.donor_name || 'Verified donor'} · Expires {post.expiry_time ? new Date(post.expiry_time).toLocaleString() : 'soon'}</small>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>{formatDistance(post.distance_meters)}</strong>
              <small>Available for request</small>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ReceiverFindFood;
