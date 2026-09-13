import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Newsletter state
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Volunteer Modal state
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [volunteerSuccess, setVolunteerSuccess] = useState('');

  // Anonymous Mode interactive demo toggle in dark card
  const [demoAnonymous, setDemoAnonymous] = useState(true);

  // FAQ Data from Figma
  const faqs = [
    {
      q: 'Is the food safe to share?',
      a: 'Every donor sets an expiry window and food type, and verified NGOs perform rapid temperature and condition checks upon collection. All food safety guidelines comply with national food safety standards.'
    },
    {
      q: 'What does Anonymous Mode do?',
      a: 'Anonymous Mode completely masks your name and contact details on public food requests and listings. Donors and community partners see you as "Anonymous Receiver #RX" while maintaining full cryptographic security in our database.'
    },
    {
      q: 'Does it cost anything?',
      a: 'ShareMeal is 100% free for both individuals seeking meals and community partners. Donors contribute surplus food at no charge, and verified NGOs coordinate pickups at zero cost to receivers.'
    },
    {
      q: 'How do you verify NGOs?',
      a: 'NGOs submit government registration documentation and trade licenses during sign-up. Our Super Admin team manually inspects each organization before approving distribution privileges on the network.'
    }
  ];

  // NGO Drives Data from Figma
  const drives = [
    {
      id: 1,
      ngo: 'Robin Hood Army',
      title: 'Weekend Slum Meal Drive',
      date: 'Aug 15',
      day: 'Sat',
      time: '6:00 PM',
      volunteers: '12 volunteers needed',
      color: '#ff6b4a'
    },
    {
      id: 2,
      ngo: 'Feeding India',
      title: 'Ration Kit Distribution',
      date: 'Aug 16',
      day: 'Sun',
      time: '9:30 AM',
      volunteers: '8 volunteers needed',
      color: '#10b981'
    },
    {
      id: 3,
      ngo: 'No Food Waste',
      title: 'Late-Night Community Kitchen',
      date: 'Aug 19',
      day: 'Wed',
      time: '10:00 PM',
      volunteers: '20 volunteers needed',
      color: '#f59e0b'
    }
  ];

  // Trending Posts Data from Figma
  const trendingPosts = [
    {
      id: 1,
      title: 'Garden salad trays',
      tag: 'Veg',
      tagColor: '#10b981',
      tagBg: '#e3f5ea',
      distance: '0.8 km',
      status: 'Collected',
      statusBg: 'rgba(63, 185, 132, 0.15)',
      statusColor: '#15803d',
      timeLeft: '95m left',
      details: '12 meals · Olive Bistro',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Fresh dinner platters',
      tag: 'Cooked',
      tagColor: '#d97706',
      tagBg: '#fef3c7',
      distance: '1.4 km',
      status: 'Available',
      statusBg: '#fff0ec',
      statusColor: '#d9381e',
      timeLeft: '40m left',
      details: '25 meals · The Spice Room',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Grain bowls & greens',
      tag: 'Veg',
      tagColor: '#10b981',
      tagBg: '#e3f5ea',
      distance: '2.1 km',
      status: 'At NGO point',
      statusBg: '#eff6ff',
      statusColor: '#1d4ed8',
      timeLeft: '180m left',
      details: '8 meals · Green Fork',
      image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: 'Surplus produce crate',
      tag: 'Produce',
      tagColor: '#059669',
      tagBg: '#d1fae5',
      distance: '3.0 km',
      status: 'Taken',
      statusBg: '#f3f4f6',
      statusColor: '#4b5563',
      timeLeft: 'Completed',
      details: '30 kg · Sunday Market',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Stories Data from Figma
  const stories = [
    {
      id: 1,
      tag: 'Volunteer',
      tagColor: '#d9381e',
      tagBg: '#ffe4db',
      readTime: '4 min read',
      title: 'How a Tuesday-night surplus fed 40 families',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      tag: 'NGO',
      tagColor: '#1d4ed8',
      tagBg: '#eff6ff',
      readTime: '6 min read',
      title: 'Robin Hood Army on scaling neighbourhood kitchens',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      tag: 'Impact',
      tagColor: '#15803d',
      tagBg: '#dcfce7',
      readTime: '5 min read',
      title: 'The quiet logistics of rescuing fresh produce',
      image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Partners Ticker List
  const partners = [
    'Robin Hood Army',
    'Feeding India',
    'Akshaya Patra',
    'No Food Waste',
    'Rise Against Hunger',
    'The Banyan',
    'Goonj',
    'Uday Foundation',
    'Annakshetra',
    'Care Bangladesh',
    'Dhaka Food Bank',
    'Chittagong Relief Hub'
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  const handleVolunteerSubmit = () => {
    setVolunteerSuccess(`Thank you! You have signed up to volunteer with ${selectedDrive.ngo} for "${selectedDrive.title}".`);
    setTimeout(() => {
      setSelectedDrive(null);
      setVolunteerSuccess('');
    }, 2400);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff9f5', color: '#2c2320', fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden' }}>
      
      {/* ========================================================
          1. NAVIGATION BAR (From Figma Node 8:22362)
      ======================================================== */}
      <nav style={{ width: '100%', background: 'rgba(255, 249, 245, 0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid rgba(44, 35, 32, 0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #ff8461 0%, #f04b28 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', boxShadow: '0 4px 12px rgba(240, 75, 40, 0.35)' }}>
              🍲
            </div>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: 800, color: '#2c2320', letterSpacing: '-0.5px' }}>
              ShareMeal
            </span>
          </Link>

          {/* Center Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex">
            <a href="#how-it-works" style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '14px', fontWeight: 600, transition: 'color 0.2s' }}>
              How it works
            </a>
            <Link to="/find-food" style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '14px', fontWeight: 600, transition: 'color 0.2s' }}>
              Find food
            </Link>
            <Link to="/donate" style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '14px', fontWeight: 600, transition: 'color 0.2s' }}>
              Donate
            </Link>
            <a href="#stories" style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '14px', fontWeight: 600, transition: 'color 0.2s' }}>
              Stories
            </a>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  to={user.role === 'super_admin' ? '/super-admin/dashboard' : `/${user.role}/dashboard`}
                  style={{ textDecoration: 'none', background: '#ffebe6', color: '#d9381e', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700 }}
                >
                  Dashboard ({user.name?.split(' ')[0]})
                </Link>
                <button
                  onClick={logout}
                  style={{ background: 'transparent', border: 0, color: '#6b5d56', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none', color: '#2c2320', fontSize: '14px', fontWeight: 700, padding: '8px 12px' }}>
                  Log in
                </Link>
                <Link
                  to="/signup"
                  style={{
                    textDecoration: 'none',
                    background: '#ff6b4a',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 700,
                    boxShadow: '0 8px 20px rgba(255, 107, 74, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  Get started <span>→</span>
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* ========================================================
          2. HERO SECTION (From Figma Node 8:22390)
      ======================================================== */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '60px 24px 80px' }}>
        
        {/* Ambient Glow Orbs */}
        <div style={{ position: 'absolute', top: '-60px', left: '-100px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(255, 199, 182, 0.45)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '100px', right: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(255, 242, 214, 0.65)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20px', left: '40%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(227, 245, 234, 0.55)', filter: 'blur(75px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          
          {/* Left Column: Copy & CTAs */}
          <div>
            
            {/* Pill Chip */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffe4db', padding: '6px 14px', borderRadius: '100px', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px' }}>✨</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#c8391b', letterSpacing: '0.2px' }}>
                482,000+ meals rescued &amp; counting
              </span>
            </div>

            {/* Main Editorial Headline with Curved Underline */}
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(40px, 5vw, 62px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-1.5px', margin: '0 0 24px', color: '#2c2320' }}>
              Turn today's surplus into{' '}
              <span style={{ position: 'relative', display: 'inline-block', color: '#f04b28' }}>
                someone's meal
                {/* Curved Underline SVG */}
                <svg
                  viewBox="0 0 408 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ position: 'absolute', left: 0, bottom: '-8px', width: '100%', height: '12px', pointerEvents: 'none' }}
                >
                  <path d="M4 10C80 3 260 -2 404 8" stroke="#f04b28" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#6b5d56', margin: '0 0 32px', maxWidth: '480px' }}>
              ShareMeal connects restaurants, homes and events with nearby NGOs and neighbours — so good food finds a plate instead of a bin.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
              <Link
                to="/donate"
                style={{
                  textDecoration: 'none',
                  background: '#ff6b4a',
                  color: '#ffffff',
                  padding: '14px 28px',
                  borderRadius: '100px',
                  fontSize: '15px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 12px 28px rgba(255, 107, 74, 0.4)',
                  transition: 'all 0.2s'
                }}
              >
                <span>🎁</span> Donate food
              </Link>
              <Link
                to="/find-food"
                style={{
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.7)',
                  color: '#c8391b',
                  border: '1.5px solid #ffa286',
                  padding: '14px 28px',
                  borderRadius: '100px',
                  fontSize: '15px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <span>🔍</span> Find a meal
              </Link>
            </div>

            {/* NGO Community Trust Avatars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {['#ff8461', '#f5c14e', '#5ec98f', '#6aa6ee'].map((bg, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: bg,
                      border: '2px solid #fff9f5',
                      marginLeft: idx > 0 ? '-10px' : 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 800
                    }}
                  >
                    👤
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b5d56' }}>
                <strong style={{ color: '#2c2320', fontWeight: 800 }}>1,340 NGOs</strong> collecting daily across 60 cities
              </p>
            </div>

          </div>

          {/* Right Column: Hero Image with Floating Glassmorphic Badges */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            
            {/* Main Picture Frame */}
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                height: '430px',
                borderRadius: '32px',
                overflow: 'hidden',
                background: '#ffe9e2',
                border: '5px solid #ffffff',
                boxShadow: '0 20px 50px -10px rgba(255, 107, 74, 0.25), 0 40px 90px -30px rgba(44, 35, 32, 0.2)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80"
                alt="Fresh prepared meal boxes ready to share"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Top-Left Floating Glass Card: "Live now • 3,235 posts" */}
            <div
              style={{
                position: 'absolute',
                top: '28px',
                left: '-20px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                padding: '14px 18px',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 16px 36px rgba(44, 35, 32, 0.12)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(145deg, #5ec98f 0%, #2f9c66 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '20px',
                  boxShadow: '0 8px 16px rgba(47, 156, 102, 0.35)'
                }}
              >
                🛡️
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#6b5d56', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  Live now
                </div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 800, color: '#2c2320' }}>
                  3,235 posts
                </div>
              </div>
            </div>

            {/* Bottom-Right Floating Glass Card: "Meal #4821 • Received • Delivered to Asha Shelter" */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-10px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                padding: '16px 20px',
                borderRadius: '18px',
                boxShadow: '0 16px 40px rgba(44, 35, 32, 0.12)',
                minWidth: '220px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#2c2320' }}>Meal #4821</span>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span> Received
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b5d56', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span>🚲</span> Delivered to Asha Shelter
              </div>
              {/* Mini progress bar */}
              <div style={{ width: '100%', height: '5px', background: '#f3f4f6', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)' }}></div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          3. CATEGORIES BAR (From Figma Node 8:22482)
      ======================================================== */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          
          {[
            { title: 'Cooked Meals', count: '1,240 live', icon: '🍲', iconBg: '#ffedd5', border: '#fed7aa', link: '/find-food?type=Cooked' },
            { title: 'Fresh Produce', count: '860 live', icon: '🥬', iconBg: '#dcfce7', border: '#bbf7d0', link: '/find-food?type=Veg' },
            { title: 'Bakery & Bread', count: '430 live', icon: '🥖', iconBg: '#fef3c7', border: '#fde68a', link: '/find-food?type=Bakery' },
            { title: 'Packaged Goods', count: '705 live', icon: '🥫', iconBg: '#e0f2fe', border: '#bae6fd', link: '/find-food?type=Packaged' }
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              style={{
                textDecoration: 'none',
                background: '#ffffff',
                border: `1px solid ${cat.border}`,
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 4px 16px rgba(44, 35, 32, 0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: cat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {cat.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#2c2320', marginBottom: '2px' }}>
                  {cat.title}
                </div>
                <div style={{ fontSize: '13px', color: '#6b5d56' }}>
                  {cat.count}
                </div>
              </div>
              <span style={{ color: '#ff6b4a', fontSize: '18px', fontWeight: 800 }}>→</span>
            </Link>
          ))}

        </div>
      </section>

      {/* ========================================================
          4. PARTNER LOGO TICKER (From Figma Node 8:22560)
      ======================================================== */}
      <section style={{ padding: '24px 0 60px', borderTop: '1px solid rgba(44, 35, 32, 0.06)', borderBottom: '1px solid rgba(44, 35, 32, 0.06)', background: '#fdf7f2' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '0 24px', marginBottom: '20px' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#8c7e77' }}>
            Trusted by relief networks feeding communities everyday
          </p>
        </div>

        {/* Marquee Row */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '24px', padding: '10px 24px', scrollbarWidth: 'none' }}>
          {partners.concat(partners).map((partner, idx) => (
            <div
              key={idx}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#ffffff',
                padding: '10px 20px',
                borderRadius: '100px',
                border: '1px solid #eee5e0',
                fontSize: '13px',
                fontWeight: 700,
                color: '#4a3e39',
                boxShadow: '0 2px 8px rgba(44, 35, 32, 0.03)'
              }}
            >
              <span style={{ color: '#ff6b4a' }}>●</span>
              {partner}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          5. HOW IT WORKS / 4 STEPS (From Figma Node 8:22711)
      ======================================================== */}
      <section id="how-it-works" style={{ padding: '90px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f04b28', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '10px' }}>
              <span style={{ width: '24px', height: '2px', background: '#f04b28' }}></span> HOW IT WORKS
            </div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, color: '#2c2320', margin: 0, letterSpacing: '-1px' }}>
              From surplus to shared in four gentle steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            
            {[
              { num: '1', title: 'Post surplus', text: 'Snap a photo, set quantity and pickup window. Live in under 60 seconds.', icon: '📸', color: '#ffedd5', badgeColor: '#c2410c' },
              { num: '2', title: 'Get matched', text: 'Nearby verified NGOs and receivers are notified through smart radius alerts.', icon: '🔔', color: '#fef3c7', badgeColor: '#b45309' },
              { num: '3', title: 'Collect safely', text: 'A volunteer picks it up or routes it to a safe neighborhood collection point.', icon: '🛡️', color: '#dcfce7', badgeColor: '#15803d' },
              { num: '4', title: 'Someone eats', text: 'Track every meal to its plate with proof of receipt and community impact.', icon: '🍲', color: '#e0f2fe', badgeColor: '#0369a1' }
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(44, 35, 32, 0.06)',
                  borderRadius: '24px',
                  padding: '30px 24px',
                  position: 'relative',
                  boxShadow: '0 8px 24px rgba(44, 35, 32, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      {step.icon}
                    </div>
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: '36px', fontWeight: 800, color: '#f1e8e2' }}>
                      {step.num}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#2c2320', margin: '0 0 10px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#6b5d56', margin: 0 }}>
                    {step.text}
                  </p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ========================================================
          6. TRENDING FOOD POSTS (From Figma Node 8:22782)
      ======================================================== */}
      <section style={{ padding: '40px 24px 90px', background: '#fdf9f6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f04b28', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>
                <span style={{ width: '24px', height: '2px', background: '#f04b28' }}></span> LIVE NEAR YOU
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(30px, 4vw, 40px)', fontWeight: 800, color: '#2c2320', margin: 0 }}>
                Trending food posts
              </h2>
            </div>
            <Link to="/find-food" style={{ textDecoration: 'none', color: '#f04b28', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Browse all posts <span>→</span>
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
            {trendingPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(44, 35, 32, 0.07)',
                  boxShadow: '0 8px 24px rgba(44, 35, 32, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Photo with pill badges */}
                  <div style={{ position: 'relative', height: '175px', width: '100%', overflow: 'hidden' }}>
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '12px', left: '12px', background: post.tagBg, color: post.tagColor, padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 800 }}>
                      {post.tag}
                    </span>
                    <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#ffffff', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                      📍 {post.distance}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div style={{ padding: '18px 18px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ background: post.statusBg, color: post.statusColor, padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 800 }}>
                        {post.status}
                      </span>
                      <span style={{ fontSize: '12px', color: '#888', fontWeight: 600 }}>
                        ⏰ {post.timeLeft}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#2c2320', margin: '0 0 6px' }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6b5d56', margin: 0 }}>
                      {post.details}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '0 18px 18px' }}>
                  <button
                    onClick={() => navigate('/find-food')}
                    style={{
                      width: '100%',
                      background: '#ff6b4a',
                      color: '#ffffff',
                      border: 0,
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(255, 107, 74, 0.25)'
                    }}
                  >
                    Request food →
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          7. ANONYMOUS RECEIVER SPOTLIGHT (From Figma Node 8:22899)
      ======================================================== */}
      <section style={{ padding: '60px 24px 90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div
            style={{
              background: '#1d1917',
              borderRadius: '32px',
              padding: 'clamp(32px, 6vw, 64px)',
              color: '#ffffff',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)'
            }}
          >
            {/* Ambient Background Glows */}
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(240, 75, 40, 0.2)', filter: 'blur(70px)' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '10%', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', filter: 'blur(70px)' }} />

            {/* Left Column: Copy & Checklist */}
            <div style={{ position: 'relative', zIndex: 5 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, color: '#fba58f', marginBottom: '18px' }}>
                <span>🔒</span> 100% PRIVATE OPTION
              </div>

              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-1px' }}>
                Find a meal with <span style={{ color: '#f04b28' }}>no judgment, no trace</span>
              </h2>

              <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#a89d97', margin: '0 0 32px', maxWidth: '440px' }}>
                Anonymous Mode hides your name from donors and NGOs. Pick up food with a private secure 6-digit code without ever revealing who you are.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                {[
                  'Name stays hidden',
                  'Verified for safety',
                  'Turn on/off anytime',
                  'Encrypted database'
                ].map((perk, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, color: '#e5ded9' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(240, 75, 40, 0.25)', color: '#ff8461', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                      ✓
                    </span>
                    {perk}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive Anonymous Card Simulation */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 5 }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '24px',
                  padding: '24px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #ff8461 0%, #f04b28 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      🕵️
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Verified Receiver</div>
                      <div style={{ fontSize: '12px', color: '#9c8e87' }}>#RX-2048</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '20px' }}>🛡️</span>
                </div>

                {/* Simulated Mode Box */}
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#9c8e87', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Identity Status
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: demoAnonymous ? '#34d399' : '#ffffff' }}>
                      {demoAnonymous ? '🕵️ Anonymous Mode Enabled' : 'Public Profile'}
                    </span>
                    {/* Toggle Button */}
                    <button
                      onClick={() => setDemoAnonymous(!demoAnonymous)}
                      style={{
                        width: '48px',
                        height: '26px',
                        borderRadius: '100px',
                        background: demoAnonymous ? '#ff6b4a' : '#4b5563',
                        border: 0,
                        padding: '3px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: demoAnonymous ? 'flex-end' : 'flex-start',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '12px', color: '#a89d97' }}>
                  🔒 Your identity is safe with us. End-to-end encrypted.
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          8. UPCOMING NGO DRIVES (From Figma Node 8:22956)
      ======================================================== */}
      <section style={{ padding: '0 24px 90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f04b28', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>
                <span style={{ width: '24px', height: '2px', background: '#f04b28' }}></span> GET INVOLVED
              </div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(30px, 4vw, 40px)', fontWeight: 800, color: '#2c2320', margin: 0 }}>
                Upcoming NGO drives
              </h2>
            </div>
            <span style={{ color: '#f04b28', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              See the calendar →
            </span>
          </div>

          {/* 3 Drives Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {drives.map((drive) => (
              <div
                key={drive.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(44, 35, 32, 0.07)',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 8px 24px rgba(44, 35, 32, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Date & Time Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff0ec', padding: '6px 14px', borderRadius: '12px', border: '1px solid #ffdecb' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#d9381e' }}>{drive.date}</span>
                      <span style={{ fontSize: '12px', color: '#888' }}>({drive.day})</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#6b5d56' }}>
                      ⏰ {drive.time}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#ff6b4a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    {drive.ngo}
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2c2320', margin: '0 0 10px' }}>
                    {drive.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b5d56', marginBottom: '20px' }}>
                    <span>👥</span> {drive.volunteers}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDrive(drive)}
                  style={{
                    width: '100%',
                    background: '#2c2320',
                    color: '#ffffff',
                    border: 0,
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  Volunteer for this drive →
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          9. IMPACT BANNER (From Figma Node 8:23045)
      ======================================================== */}
      <section style={{ padding: '0 24px 90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div
            style={{
              background: 'linear-gradient(135deg, #e05333 0%, #c43818 100%)',
              borderRadius: '32px',
              padding: 'clamp(40px, 6vw, 70px) 32px',
              color: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(224, 83, 51, 0.35)'
            }}
          >
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, margin: '0 0 14px', letterSpacing: '-1px' }}>
              Every meal shared is a small act of repair
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255, 255, 255, 0.85)', margin: '0 auto 48px', maxWidth: '520px' }}>
              Numbers we're proud of — and a bin we're happy to leave empty.
            </p>

            {/* 4 Impact Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
              
              {[
                { number: '482,000+', title: 'Meals rescued', sub: 'and served to date' },
                { number: '1,340', title: 'Partner NGOs', sub: 'verified & active' },
                { number: '96%', title: 'Reach their plate', sub: 'tracked to receipt' },
                { number: '62 t', title: 'CO₂ saved', sub: 'from landfill each month' }
              ].map((stat, idx) => (
                <div key={idx} style={{ borderRight: idx < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none', padding: '0 12px' }}>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '6px' }}>
                    {stat.number}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '2px' }}>
                    {stat.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)' }}>
                    {stat.sub}
                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          10. LATEST STORIES (From Figma Node 8:23083)
      ======================================================== */}
      <section id="stories" style={{ padding: '0 24px 90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f04b28', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>
              <span style={{ width: '24px', height: '2px', background: '#f04b28' }}></span> FROM THE FIELD
            </div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(30px, 4vw, 40px)', fontWeight: 800, color: '#2c2320', margin: 0 }}>
              Latest stories
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {stories.map((story) => (
              <div
                key={story.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid rgba(44, 35, 32, 0.06)',
                  boxShadow: '0 8px 24px rgba(44, 35, 32, 0.04)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
              >
                <div style={{ height: '210px', width: '100%', overflow: 'hidden' }}>
                  <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ background: story.tagBg, color: story.tagColor, padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 800 }}>
                      {story.tag}
                    </span>
                    <span style={{ fontSize: '12px', color: '#888' }}>
                      🕒 {story.readTime}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 800, color: '#2c2320', lineHeight: 1.4, margin: '0 0 12px' }}>
                    {story.title}
                  </h3>
                  <span style={{ color: '#ff6b4a', fontSize: '13px', fontWeight: 700 }}>
                    Read story →
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          11. FAQ ACCORDION (From Figma Node 8:23137)
      ======================================================== */}
      <section style={{ padding: '0 24px 90px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
          
          {/* Left Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f04b28', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>
              <span style={{ width: '24px', height: '2px', background: '#f04b28' }}></span> GOOD TO KNOW
            </div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 800, color: '#2c2320', margin: '0 0 16px', letterSpacing: '-1px' }}>
              Questions, answered
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#6b5d56', margin: '0 0 24px', maxWidth: '380px' }}>
              Still wondering about something? Our support team and community champions reply promptly.
            </p>
            <a href="mailto:support@sharemeal.org" style={{ textDecoration: 'none', color: '#f04b28', fontWeight: 700, fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Visit the help centre <span>→</span>
            </a>
          </div>

          {/* Right Column: Accordion Items */}
          <div style={{ display: 'grid', gap: '14px' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(44, 35, 32, 0.08)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(44, 35, 32, 0.02)'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#2c2320' }}>
                    {faq.q}
                  </span>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: openFaq === idx ? '#ffe4db' : '#f3f4f6', color: openFaq === idx ? '#c8391b' : '#6b5d56', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '0 24px 20px', fontSize: '14px', lineHeight: 1.6, color: '#6b5d56', borderTop: '1px solid #f7f3f0' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          12. DUAL CTA SECTION (From Figma Node 8:23189)
      ======================================================== */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Card 1: Give Food */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #fed7aa',
              borderRadius: '28px',
              padding: '36px',
              boxShadow: '0 8px 24px rgba(240, 75, 40, 0.06)'
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px' }}>
              🎁
            </div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 800, color: '#2c2320', margin: '0 0 10px' }}>
              I have food to give
            </h3>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#6b5d56', margin: '0 0 24px' }}>
              Post surplus from your kitchen, restaurant or event. Local verified groups pick it up fast.
            </p>
            <Link
              to="/donate"
              style={{
                textDecoration: 'none',
                background: '#2c2320',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Become a donor <span>→</span>
            </Link>
          </div>

          {/* Card 2: Need Food */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #bbf7d0',
              borderRadius: '28px',
              padding: '36px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.06)'
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px' }}>
              🍲
            </div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 800, color: '#2c2320', margin: '0 0 10px' }}>
              I need a meal
            </h3>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#6b5d56', margin: '0 0 24px' }}>
              Find verified food nearby — publicly or fully anonymous. Free, confidential and reliable.
            </p>
            <Link
              to="/find-food"
              style={{
                textDecoration: 'none',
                background: '#15803d',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Find food now <span>→</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================
          13. NEWSLETTER / DIGEST (From Figma Node 8:23227)
      ======================================================== */}
      <section style={{ padding: '0 24px 90px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          
          <div
            style={{
              background: '#ffffff',
              borderRadius: '32px',
              padding: '48px 32px',
              textAlign: 'center',
              border: '1px solid rgba(44, 35, 32, 0.06)',
              boxShadow: '0 20px 50px rgba(44, 35, 32, 0.06)'
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#fff0ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 18px' }}>
              💌
            </div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: '#2c2320', margin: '0 0 10px' }}>
              Get the good-news digest
            </h2>
            <p style={{ fontSize: '15px', color: '#6b5d56', margin: '0 auto 28px', maxWidth: '440px' }}>
              One warm email a month — meals rescued, stories from neighbours, and new collection hubs near you.
            </p>

            {subscribed ? (
              <div style={{ background: '#dcfce7', color: '#15803d', padding: '14px 24px', borderRadius: '100px', display: 'inline-block', fontSize: '14px', fontWeight: 700 }}>
                🎉 You're on the list! Thank you for supporting the movement.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '480px', margin: '0 auto', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    padding: '12px 20px',
                    borderRadius: '100px',
                    border: '1.5px solid #e5ded9',
                    fontSize: '14px',
                    outlineColor: '#ff6b4a'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#ff6b4a',
                    color: '#ffffff',
                    border: 0,
                    padding: '12px 26px',
                    borderRadius: '100px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255, 107, 74, 0.3)'
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* ========================================================
          14. FOOTER (From Figma Node 8:23245)
      ======================================================== */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #eee5e0', padding: '70px 24px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '60px' }}>
            
            {/* Col 1: Brand Info */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff8461 0%, #f04b28 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px' }}>
                  🍲
                </div>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 800, color: '#2c2320' }}>
                  ShareMeal
                </span>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#6b5d56', margin: '0 0 20px' }}>
                A community food-sharing network on a mission to eliminate food waste and ensure no neighbour goes hungry.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['🕊️', '📘', '📸'].map((icon, idx) => (
                  <div key={idx} style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#faf5f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', cursor: 'pointer', border: '1px solid #eee5e0' }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2: Platform */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#2c2320', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
                Platform
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px', fontSize: '13px', color: '#6b5d56' }}>
                <li><Link to="/find-food" style={{ textDecoration: 'none', color: 'inherit' }}>Find food</Link></li>
                <li><Link to="/donate" style={{ textDecoration: 'none', color: 'inherit' }}>Donate food</Link></li>
                <li><Link to="/ngo/login" style={{ textDecoration: 'none', color: 'inherit' }}>For NGOs</Link></li>
                <li><a href="#how-it-works" style={{ textDecoration: 'none', color: 'inherit' }}>How it works</a></li>
                <li><span style={{ color: '#aaa' }}>Pricing (Free)</span></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#2c2320', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
                Company
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px', fontSize: '13px', color: '#6b5d56' }}>
                <li><a href="#how-it-works" style={{ textDecoration: 'none', color: 'inherit' }}>About us</a></li>
                <li><a href="#stories" style={{ textDecoration: 'none', color: 'inherit' }}>Stories</a></li>
                <li><span style={{ color: '#aaa' }}>Careers</span></li>
                <li><span style={{ color: '#aaa' }}>Press kit</span></li>
                <li><a href="mailto:contact@sharemeal.org" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</a></li>
              </ul>
            </div>

            {/* Col 4: Support */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#2c2320', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
                Support &amp; Trust
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px', fontSize: '13px', color: '#6b5d56' }}>
                <li><a href="mailto:help@sharemeal.org" style={{ textDecoration: 'none', color: 'inherit' }}>Help centre</a></li>
                <li><span style={{ color: '#6b5d56' }}>Safety protocols</span></li>
                <li><span style={{ color: '#6b5d56' }}>Privacy policy</span></li>
                <li><span style={{ color: '#6b5d56' }}>Terms of service</span></li>
                <li><Link to="/admin/login" style={{ textDecoration: 'none', color: '#ff6b4a', fontWeight: 700 }}>Admin Portal</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Row */}
          <div style={{ borderTop: '1px solid #f1edeb', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '12px', color: '#8c7e77' }}>
            <div>
              © 2026 ShareMeal. Made with care for fuller plates.
            </div>
            <div>
              Feeding communities across <strong style={{ color: '#2c2320' }}>60 cities</strong>
            </div>
          </div>

        </div>
      </footer>

      {/* Volunteer Signup Modal */}
      {selectedDrive && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 3000 }}>
          <div style={{ width: '100%', maxWidth: '440px', background: '#ffffff', borderRadius: '24px', padding: '28px', color: '#2c2320', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: "'Fraunces', serif" }}>
                Volunteer for Drive
              </h3>
              <button onClick={() => setSelectedDrive(null)} style={{ background: 'transparent', border: 0, fontSize: '20px', cursor: 'pointer', color: '#888' }}>✕</button>
            </div>

            {volunteerSuccess ? (
              <div style={{ background: '#dcfce7', color: '#15803d', padding: '16px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>
                🎉 {volunteerSuccess}
              </div>
            ) : (
              <div>
                <div style={{ background: '#faf5f2', padding: '14px', borderRadius: '14px', marginBottom: '16px', fontSize: '13px' }}>
                  <div style={{ fontWeight: 800, color: '#ff6b4a', marginBottom: '4px' }}>{selectedDrive.ngo}</div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#2c2320', marginBottom: '4px' }}>{selectedDrive.title}</div>
                  <div style={{ color: '#6b5d56' }}>📅 {selectedDrive.date} ({selectedDrive.day}) at {selectedDrive.time}</div>
                </div>

                <p style={{ fontSize: '13px', color: '#6b5d56', marginBottom: '20px' }}>
                  Your contact details will be shared with {selectedDrive.ngo} for pickup/serving coordination.
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setSelectedDrive(null)} style={{ background: '#f3f4f6', color: '#374151', border: 0, padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button onClick={handleVolunteerSubmit} style={{ background: '#ff6b4a', color: '#ffffff', border: 0, padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    Confirm Sign-up →
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
