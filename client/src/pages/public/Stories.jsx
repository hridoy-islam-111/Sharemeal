import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

export const Stories = () => {
  const { user, logout } = useAuth();

  // Active Filter Tab state: 'All' | 'Volunteer' | 'Impact' | 'Donor'
  const [activeFilter, setActiveFilter] = useState('All');

  // Mobile menu drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Reader Modal state
  const [selectedStory, setSelectedStory] = useState(null);

  // Newsletter Subscription state
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  // Stories Dataset directly from Figma Node 8:29378
  const allStories = [
    {
      id: 1,
      category: 'Volunteer',
      tagColor: '#6b46c1',
      tagBg: '#f0e9fb',
      tagIcon: '🤝',
      title: 'How a Tuesday-night surplus fed 40 families',
      summary: "A local restaurant's unsold dinner prep became 40 packed meals — and the story of the volunteers who made it happen in under two hours.",
      fullStory: `At 9:45 PM on a quiet Tuesday evening, chef Tariq finished cleaning down the commercial service kitchen. Over 40 portions of freshly prepared saffron rice, grilled skewers, and seasoned lentils remained untouched in the holding warmers. Rather than dumping the untouched trays into the alley trash bins, Tariq opened the ShareMeal app.

Within 4 minutes of posting the surplus, two volunteer cyclists from the local relief chapter received an automated radius alert on their phones. By 10:20 PM, they had loaded insulated thermal panniers and arrived at the community shelter near the central railway hub.

"It's easy to assume surplus is just scraps," explains Meera Iyer, one of the volunteers. "In reality, this was a five-star meal for families who hadn't eaten since morning. When we handed over the hot boxes, a mother told us her children hadn't tasted warm chicken in months. That is what keeps us riding through the dark."

Through ShareMeal's end-to-end tracking, the restaurant received photo proof-of-receipt within 90 minutes. That Tuesday prep didn't just save 28 kg of food from the landfill — it transformed a regular weekday into an unforgettable community moment.`,
      author: 'Meera Iyer',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      date: 'Aug 6, 2026',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80',
      featured: true,
      stats: '40 Meals Rescued · 28 kg CO₂ Diverted'
    },
    {
      id: 2,
      category: 'Impact',
      tagColor: '#227a55',
      tagBg: '#e3f5ea',
      tagIcon: '🌱',
      title: 'ShareMeal on scaling neighbourhood kitchens across 60 cities',
      summary: 'From one pickup point in Bengaluru to a network spanning 60 cities — the inside story of building food infrastructure from scratch.',
      fullStory: `Food waste isn't a production deficit; it's an orchestration challenge. Every single evening, wedding banquets and catering centers discard untouched platters while soup kitchens three neighborhoods over scramble to feed dozens of walk-ins.

When ShareMeal began, our entire infrastructure was a simple group chat and two volunteer motorbikes. Today, the network coordinates verified NGOs, commercial kitchens, and hyper-local volunteers across 60 cities with automated expiry countdowns and radius-based dispatches.

"Our biggest breakthrough was removing friction for restaurant managers," says Arjun Mehta, Head of Community Partnerships. "If logging surplus takes more than 60 seconds, a busy kitchen simply won't do it. By streamlining anonymous receiver options and one-tap pickup codes, we unlocked thousands of commercial donors."

To date, the platform has facilitated over 482,000 rescued meals. As we expand into smaller secondary towns, the vision remains clean and simple: wherever good food is cooked in excess, a gentle channel exists to deliver it directly to a neighbor.`,
      author: 'Arjun Mehta',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      date: 'Aug 3, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
      featured: true,
      stats: '60 Cities · 1,340 Verified Partner NGOs'
    },
    {
      id: 3,
      category: 'Donor',
      tagColor: '#c8391b',
      tagBg: '#ffe9e2',
      tagIcon: '🥬',
      title: 'The quiet logistics of rescuing fresh produce',
      summary: "Vegetables have a ruthless clock. Here's how Sunday Market's partnership with ShareMeal prevents 30 kg of produce from going to waste every single week.",
      fullStory: `Fresh produce doesn't wait for business hours. Ripe tomatoes, crisp greens, and seasonal peppers can go from sellable to discarded in 24 hours simply because they don't fit the cosmetic standard of retail display counters.

Sunday Market vendor Priya Sharma decided to change that pattern. By scheduling a regular Sunday evening pickup window on ShareMeal, her stall's unsold greens are collected by local community kitchens that prepare stews and curries that very night.

"Before this platform, throwing away crates of fresh spinach broke my heart," Priya reflects. "Now, volunteers arrive right as we pack our stall. We know exactly which community kitchen gets the vegetables, and we see photos of the cooked meals shared on the platform."

In six months of consistent donations, Priya's single stall has diverted over 720 kg of fresh vegetables from waste bins into nutrient-dense hot meals.`,
      author: 'Priya Sharma',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      date: 'Jul 28, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
      featured: false,
      stats: '720 kg Greens Saved · 24 Kitchens Fed'
    },
    {
      id: 4,
      category: 'Volunteer',
      tagColor: '#6b46c1',
      tagBg: '#f0e9fb',
      tagIcon: '🤝',
      title: "I volunteered for one week — here's what I saw",
      summary: "A first-person account from a college student who signed up for ShareMeal's volunteer programme and ended up staying for six months.",
      fullStory: `I initially signed up to fulfill a university community service requirement. My assignment was simple: receive alerts on the volunteer app, inspect donated food batches for temperature safety, and carry them to the distribution center near the old city terminal.

On day three, I picked up 25 warm breakfast boxed meals from a bakery. When we arrived at the day-laborers' gathering spot, I saw men who had been standing since 5:00 AM hoping for construction work with empty stomachs.

The dignity in how ShareMeal operates is what struck me most. There are no cameras shoved into people's faces, no chaotic lines. Receivers have verified pickup codes or remain completely anonymous. It's clean, organized, and deeply human. My one-week requirement ended months ago, but I still do Friday morning runs before classes.`,
      author: 'Dev Malhotra',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      date: 'Jul 22, 2026',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
      featured: false,
      stats: '120+ Volunteer Hours · 520 Deliveries'
    },
    {
      id: 5,
      category: 'Impact',
      tagColor: '#227a55',
      tagBg: '#e3f5ea',
      tagIcon: '🌱',
      title: "482,000 meals — and what the number doesn't capture",
      summary: 'A milestone reflection on the numbers, the gaps, and what ShareMeal is still working to solve across expanding relief hubs.',
      fullStory: `Crossing nearly half a million meals rescued is a milestone worth celebrating, but behind the vanity metric lies a more important reality: what still gets lost.

Even with hundreds of active collection routes, over 30% of commercial surplus still goes uncollected simply because of transportation bottlenecks during peak night hours. To solve this, ShareMeal is launching decentralized cold-storage micro-hubs where donors can deposit sealed surplus safely for morning distribution.

"The goal isn't just to report high numbers on a dashboard," explains the engineering and logistics team. "The true test is whether any person in need within 3 kilometers of a restaurant can access food with safety, speed, and absolute dignity."

As we celebrate 482,000 meals, we are doubling down on infrastructure investments, smart temperature sensors, and volunteer stipends to ensure zero nutritious food is ever left behind.`,
      author: 'Arjun Mehta',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      date: 'Jul 15, 2026',
      readTime: '3 min read',
      image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
      featured: false,
      stats: '482k Meals Logged · 96% Receipt Accuracy'
    },
    {
      id: 6,
      category: 'Donor',
      tagColor: '#c8391b',
      tagBg: '#ffe9e2',
      tagIcon: '🍲',
      title: "From catering surplus to community staple: one hotel's story",
      summary: 'The Grand Meridian started posting once a week. Now their kitchen team plans surplus deliberately — and their staff sees it as part of their job.',
      fullStory: `Large banquet hotels face a recurring dilemma: culinary standards demand that event buffets look abundant until the last guest leaves, inevitably producing high-quality leftover trays.

The Grand Meridian's executive sous-chef started by donating Friday wedding surpluses on ShareMeal. The seamless pickup coordination and prompt proof-of-receipt photos won over the hotel general manager. 

"Today, our banquet staff don't see food redistribution as an afterthought," says chef Meera. "It's integrated right into our end-of-shift checklist. Sealed trays are labeled with allergen tags, stored at safe temperatures, and collected within 45 minutes by partner NGO vans."

The hotel has become a beacon for sustainable hospitality in the region, proving that corporate responsibility can be painless, transparent, and immensely rewarding.`,
      author: 'Meera Iyer',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      date: 'Jul 10, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      featured: false,
      stats: '180 Banquet Trays Donated · Zero Waste Hotel'
    }
  ];

  // Filtered Stories list for the grid
  const filteredStories = activeFilter === 'All'
    ? allStories
    : allStories.filter(story => story.category.toLowerCase() === activeFilter.toLowerCase());

  // Two prominent spotlight stories
  const featuredStories = allStories.filter(s => s.featured);

  return (
    <div style={{ minHeight: '100vh', background: '#fff9f5', color: '#2c2320', fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden' }}>
      
      {/* ========================================================
          1. NAVIGATION BAR (Matching Home Pixel-Perfect Navbar)
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
            <Link to="/#how-it-works" className="nav-link-item" style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '14px', fontWeight: 600 }}>
              How it works
            </Link>
            <Link to="/find-food" className="nav-link-item" style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '14px', fontWeight: 600 }}>
              Find food
            </Link>
            <Link
              to={user ? (user.role === 'donor' ? '/donor/profile' : `/${user.role}/dashboard`) : '/donate'}
              className="nav-link-item"
              style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '14px', fontWeight: 600 }}
            >
              Donate
            </Link>
            <Link to="/stories" className="nav-link-item" style={{ textDecoration: 'none', color: '#f04b28', fontSize: '14px', fontWeight: 700 }}>
              Stories
            </Link>
          </div>

          {/* Right Action Buttons (Desktop / Tablet) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="hidden sm:flex">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  to={user.role === 'super_admin' ? '/super-admin/dashboard' : `/${user.role}/dashboard`}
                  style={{ textDecoration: 'none', background: '#ffebe6', color: '#d9381e', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700 }}
                >
                  Dashboard ({user.name?.split(' ')[0] || user.role})
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
                  className="btn-primary-hover"
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
                    gap: '6px'
                  }}
                >
                  Get started <span>→</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            aria-label="Toggle Navigation Menu"
            style={{
              background: 'transparent',
              border: '1px solid rgba(44, 35, 32, 0.15)',
              borderRadius: '10px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#2c2320',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              borderTop: '1px solid rgba(44, 35, 32, 0.08)',
              background: '#fff9f5',
              padding: '16px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
            className="md:hidden"
          >
            <Link
              to="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '15px', fontWeight: 600, padding: '4px 0' }}
            >
              How it works
            </Link>
            <Link
              to="/find-food"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '15px', fontWeight: 600, padding: '4px 0' }}
            >
              Find food
            </Link>
            <Link
              to={user ? (user.role === 'donor' ? '/donor/profile' : `/${user.role}/dashboard`) : '/donate'}
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: 'none', color: '#6b5d56', fontSize: '15px', fontWeight: 600, padding: '4px 0' }}
            >
              Donate
            </Link>
            <Link
              to="/stories"
              onClick={() => setMobileMenuOpen(false)}
              style={{ textDecoration: 'none', color: '#f04b28', fontSize: '15px', fontWeight: 700, padding: '4px 0' }}
            >
              Stories
            </Link>
            <div style={{ height: '1px', background: 'rgba(44, 35, 32, 0.08)', margin: '6px 0' }} />
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  to={user.role === 'super_admin' ? '/super-admin/dashboard' : `/${user.role}/dashboard`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ textDecoration: 'none', background: '#ffebe6', color: '#d9381e', padding: '10px 16px', borderRadius: '100px', fontSize: '14px', fontWeight: 700, textAlign: 'center' }}
                >
                  Dashboard ({user.name?.split(' ')[0] || user.role})
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  style={{ background: 'transparent', border: 0, color: '#6b5d56', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', padding: '8px 0' }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ textDecoration: 'none', color: '#2c2320', fontSize: '14px', fontWeight: 700, textAlign: 'center', padding: '10px 16px' }}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary-hover"
                  style={{
                    textDecoration: 'none',
                    background: '#ff6b4a',
                    color: '#ffffff',
                    padding: '12px 20px',
                    borderRadius: '100px',
                    fontSize: '14px',
                    fontWeight: 700,
                    boxShadow: '0 8px 20px rgba(255, 107, 74, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  Get started <span>→</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ========================================================
          2. STORIES PAGE HERO HEADER (From Figma Node 8:29407)
      ======================================================== */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '60px 24px 48px', textAlign: 'center' }}>
        
        {/* Ambient Glows */}
        <div style={{ position: 'absolute', top: '-60px', left: '-80px', width: '340px', height: '340px', borderRadius: '50%', background: 'rgba(255, 199, 182, 0.5)', filter: 'blur(75px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: '#fff2d6', filter: 'blur(75px)', opacity: 0.7, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          
          {/* Stories from the field Pill Chip */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffe4db', padding: '6px 16px', borderRadius: '100px', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px' }}>📖</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#c8391b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Stories from the field
            </span>
          </div>

          {/* Heading with styled coral accent */}
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(36px, 5.5vw, 60px)', fontWeight: 800, color: '#2c2320', lineHeight: 1.15, margin: '0 0 18px', letterSpacing: '-1.5px' }}>
            Meals, moments &amp; <br />
            <span style={{ color: '#f04b28' }}>the people behind them</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', lineHeight: 1.6, color: '#6b5d56', maxWidth: '600px', margin: '0 auto' }}>
            Real accounts from donors, volunteers, and community members building a more generous city — one meal at a time.
          </p>

        </div>
      </section>

      {/* ========================================================
          3. FEATURED SPOTLIGHT STORIES (From Figma Node 8:29421)
      ======================================================== */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '28px' }}>
            {featuredStories.map((story) => (
              <div
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className="story-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid rgba(44, 35, 32, 0.06)',
                  boxShadow: '0 8px 24px rgba(44, 35, 32, 0.05)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Image with Tag Overlay */}
                  <div className="story-img-wrapper" style={{ position: 'relative', height: '260px', width: '100%', overflow: 'hidden' }}>
                    <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44, 35, 32, 0.65) 0%, rgba(44, 35, 32, 0.1) 50%, transparent 100%)' }} />
                    
                    {/* Badge */}
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px', background: story.tagBg, padding: '4px 12px', borderRadius: '100px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                      <span style={{ fontSize: '11px' }}>{story.tagIcon}</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: story.tagColor }}>
                        {story.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '24px 24px 12px' }}>
                    <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 800, color: '#2c2320', lineHeight: 1.35, margin: '0 0 12px' }}>
                      {story.title}
                    </h2>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#6b5d56', margin: 0 }}>
                      {story.summary}
                    </p>
                  </div>
                </div>

                {/* Author & Read Time Footer */}
                <div style={{ padding: '16px 24px 24px', borderTop: '1px solid #f7f3f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={story.authorAvatar} alt={story.author} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#4a3e39' }}>{story.author}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#8c7e77' }}>
                    <span>📅 {story.date}</span>
                    <span>🕒 {story.readTime}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          4. ALL STORIES FILTERABLE GRID (From Figma Node 8:29487)
      ======================================================== */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Section Title & Filter Tabs Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '18px' }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(24px, 3.5vw, 32px)', fontWeight: 800, color: '#2c2320', margin: 0 }}>
              All Stories
            </h2>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['All', 'Volunteer', 'Impact', 'Donor'].map((tab) => {
                const isActive = activeFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '100px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isActive ? '1px solid #ff6b4a' : '1px solid rgba(44, 35, 32, 0.1)',
                      background: isActive ? '#ff6b4a' : '#ffffff',
                      color: isActive ? '#ffffff' : '#6b5d56',
                      boxShadow: isActive ? '0 4px 14px rgba(255, 107, 74, 0.35)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Column Responsive Stories Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
            {filteredStories.map((story) => (
              <div
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className="story-card"
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(44, 35, 32, 0.06)',
                  boxShadow: '0 8px 24px rgba(44, 35, 32, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Photo with Tag Badge */}
                  <div className="story-img-wrapper" style={{ position: 'relative', height: '185px', width: '100%', overflow: 'hidden' }}>
                    <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '12px', left: '12px', background: story.tagBg, color: story.tagColor, padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                      <span>{story.tagIcon}</span> {story.category}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div style={{ padding: '20px 20px 12px' }}>
                    <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 800, color: '#2c2320', lineHeight: 1.4, margin: '0 0 8px' }}>
                      {story.title}
                    </h3>
                    <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#6b5d56', margin: 0 }}>
                      {story.summary}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div style={{ padding: '14px 20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f7f3f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={story.authorAvatar} alt={story.author} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#4a3e39' }}>{story.author}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#8c7e77', fontWeight: 600 }}>
                    🕒 {story.readTime}
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          5. DUAL CTA SECTION (From Figma Node 8:29647)
      ======================================================== */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
          
          {/* Card 1: Give Food */}
          <div
            className="dual-cta-card"
            style={{
              background: '#ffe9e2',
              border: '1.5px solid #ffffff',
              borderRadius: '32px',
              padding: 'clamp(28px, 4vw, 36px)',
              boxShadow: '0 12px 32px rgba(255, 107, 74, 0.15)'
            }}
          >
            <div className="cta-icon" style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #ff8461 0%, #f04b28 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px', boxShadow: '0 8px 16px rgba(240, 75, 40, 0.35)', color: '#fff' }}>
              🎁
            </div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 800, color: '#2c2320', margin: '0 0 10px' }}>
              I have food to give
            </h3>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#6b5d56', margin: '0 0 24px' }}>
              Post surplus from your kitchen, restaurant or event in under a minute.
            </p>
            <Link
              to={user ? (user.role === 'donor' ? '/donor/profile' : `/${user.role}/dashboard`) : '/donate'}
              className="btn-secondary-hover"
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
            className="dual-cta-card"
            style={{
              background: '#e3f5ea',
              border: '1.5px solid #ffffff',
              borderRadius: '32px',
              padding: 'clamp(28px, 4vw, 36px)',
              boxShadow: '0 12px 32px rgba(47, 156, 102, 0.15)'
            }}
          >
            <div className="cta-icon" style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #5ec98f 0%, #2f9c66 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px', boxShadow: '0 8px 16px rgba(47, 156, 102, 0.35)', color: '#fff' }}>
              🍲
            </div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 800, color: '#2c2320', margin: '0 0 10px' }}>
              I need a meal
            </h3>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#6b5d56', margin: '0 0 24px' }}>
              Find verified food nearby — publicly or fully anonymous. No cost, ever.
            </p>
            <Link
              to="/find-food"
              className="btn-primary-hover"
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
              Find food now <span>→</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================
          6. NEWSLETTER / DIGEST (From Figma Node 8:29685)
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
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#ff6b4a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 18px', color: '#fff', boxShadow: '0 8px 20px rgba(255, 107, 74, 0.35)' }}>
              💌
            </div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: '#2c2320', margin: '0 0 10px' }}>
              Get the good-news digest
            </h2>
            <p style={{ fontSize: '15px', color: '#6b5d56', margin: '0 auto 28px', maxWidth: '440px' }}>
              One warm email a month — meals rescued, stories from the field, and drives near you. No spam.
            </p>

            {subscribed ? (
              <div style={{ background: '#dcfce7', color: '#15803d', padding: '14px 24px', borderRadius: '100px', display: 'inline-block', fontSize: '14px', fontWeight: 700 }}>
                🎉 You're on the list! Thank you for reading community stories.
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
                    border: '1.5px solid #ffc7b6',
                    fontSize: '14px',
                    outlineColor: '#ff6b4a'
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary-hover"
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
          7. 4-COLUMN FOOTER (From Figma Node 8:29703)
      ======================================================== */}
      <footer style={{ background: '#fdf1e9', borderTop: '1px solid #ffe4db', padding: '70px 24px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '48px', marginBottom: '60px' }}>
            
            {/* Col 1: Brand Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff8461 0%, #f04b28 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px' }}>
                  🍲
                </div>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 800, color: '#2c2320' }}>
                  ShareMeal
                </span>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#6b5d56', margin: '0 0 20px' }}>
                A community food-sharing network on a mission to end avoidable food waste — one shared meal at a time.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['🕊️', '📘', '📸'].map((icon, idx) => (
                  <div key={idx} className="footer-social-btn" style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', cursor: 'pointer', border: '1px solid #eee5e0' }}>
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
                <li><Link to="/find-food" className="footer-link" style={{ textDecoration: 'none', color: 'inherit' }}>Find food</Link></li>
                <li>
                  <Link
                    to={user ? (user.role === 'donor' ? '/donor/profile' : `/${user.role}/dashboard`) : '/donate'}
                    className="footer-link"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    Donate food
                  </Link>
                </li>
                <li><Link to="/ngo/login" className="footer-link" style={{ textDecoration: 'none', color: 'inherit' }}>For NGOs</Link></li>
                <li><Link to="/#how-it-works" className="footer-link" style={{ textDecoration: 'none', color: 'inherit' }}>How it works</Link></li>
                <li><span style={{ color: '#aaa' }}>Pricing (Free)</span></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#2c2320', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
                Company
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px', fontSize: '13px', color: '#6b5d56' }}>
                <li><Link to="/#how-it-works" className="footer-link" style={{ textDecoration: 'none', color: 'inherit' }}>About us</Link></li>
                <li><Link to="/stories" className="footer-link" style={{ textDecoration: 'none', color: 'inherit' }}>Stories</Link></li>
                <li><span style={{ color: '#aaa' }}>Careers</span></li>
                <li><span style={{ color: '#aaa' }}>Press kit</span></li>
                <li><a href="mailto:contact@sharemeal.org" className="footer-link" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</a></li>
              </ul>
            </div>

            {/* Col 4: Support */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#2c2320', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
                Support &amp; Trust
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px', fontSize: '13px', color: '#6b5d56' }}>
                <li><a href="mailto:help@sharemeal.org" className="footer-link" style={{ textDecoration: 'none', color: 'inherit' }}>Help centre</a></li>
                <li><span className="footer-link" style={{ color: '#6b5d56', cursor: 'pointer' }}>Safety protocols</span></li>
                <li><span className="footer-link" style={{ color: '#6b5d56', cursor: 'pointer' }}>Privacy policy</span></li>
                <li><span className="footer-link" style={{ color: '#6b5d56', cursor: 'pointer' }}>Terms of service</span></li>
                <li><Link to="/admin/login" className="footer-link" style={{ textDecoration: 'none', color: '#ff6b4a', fontWeight: 700 }}>Admin Portal</Link></li>
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

      {/* ========================================================
          8. STORY READER MODAL (Interactive Reading Experience)
      ======================================================== */}
      {selectedStory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 3000 }}>
          <div style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', background: '#ffffff', borderRadius: '28px', color: '#2c2320', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', position: 'relative' }}>
            
            {/* Header Image */}
            <div style={{ position: 'relative', height: '240px', width: '100%', overflow: 'hidden' }}>
              <img src={selectedStory.image} alt={selectedStory.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => setSelectedStory(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  border: 0,
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: '28px 32px 36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ background: selectedStory.tagBg, color: selectedStory.tagColor, padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 800 }}>
                  {selectedStory.tagIcon} {selectedStory.category}
                </span>
                <span style={{ fontSize: '13px', color: '#888' }}>
                  🕒 {selectedStory.readTime}
                </span>
              </div>

              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: 800, color: '#2c2320', lineHeight: 1.3, margin: '0 0 16px' }}>
                {selectedStory.title}
              </h2>

              {/* Author & Stats Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#faf5f2', borderRadius: '16px', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={selectedStory.authorAvatar} alt={selectedStory.author} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#2c2320' }}>{selectedStory.author}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{selectedStory.date}</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#ff6b4a' }}>
                  ✨ {selectedStory.stats}
                </div>
              </div>

              {/* Story Narrative */}
              <div style={{ fontSize: '15px', lineHeight: 1.8, color: '#4a3e39', whiteSpace: 'pre-line' }}>
                {selectedStory.fullStory}
              </div>

              {/* Close Action */}
              <div style={{ marginTop: '32px', textAlign: 'right' }}>
                <button
                  onClick={() => setSelectedStory(null)}
                  style={{
                    background: '#ff6b4a',
                    color: '#ffffff',
                    border: 0,
                    padding: '12px 24px',
                    borderRadius: '100px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255, 107, 74, 0.3)'
                  }}
                >
                  Close Story
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Stories;
