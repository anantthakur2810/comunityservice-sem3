import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRequirements, getStats } from '../api.js';
import Reveal, { useInView, useCountUp } from '../components/Reveal.jsx';
import SocialFeed from '../components/SocialFeed.jsx';
import {
  IconGraduationCap,
  IconHeart,
  IconUsers,
  IconBookOpen,
  IconArrowRight,
  IconSparkles,
} from '../components/Icons.jsx';

const pillars = [
  {
    Icon: IconGraduationCap,
    title: 'Education for Every Child',
    text: 'Free evening classes and school supplies for underprivileged children in Sadarpur.',
    color: 'green',
  },
  {
    Icon: IconHeart,
    title: 'Health & Nutrition',
    text: 'Health check-up camps and awareness sessions for mothers and children in the community.',
    color: 'amber',
  },
  {
    Icon: IconUsers,
    title: 'Women Empowerment',
    text: 'Skills, education and support programmes that help women stand on their own feet.',
    color: 'teal',
  },
];

const marqueeItems = [
  'Education for every child',
  'Health camps',
  'Women empowerment',
  'Volunteer with us',
  'Donate supplies',
  'Community first',
];

function Stat({ label, value, suffix = '', Icon }) {
  const [ref, inView] = useInView();
  const count = useCountUp(value, { start: inView });
  return (
    <div ref={ref} className="stat">
      <span className="stat-icon">
        <Icon size={22} />
      </span>
      <span className="stat-value">
        {count}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function SkeletonCards({ count = 3 }) {
  return (
    <div className="card-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton-card">
          <div className="skeleton skeleton-line w40" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line w70" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [requirements, setRequirements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    Promise.all([getRequirements(), getStats()])
      .then(([reqRes, statsRes]) => {
        setRequirements(reqRes.requirements || []);
        setStats(statsRes.stats || null);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      {/* ================================ HERO ================================ */}
      <section className="hero">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="hero-badge hero-enter" style={{ animationDelay: '0ms' }}>
              <IconSparkles size={14} /> NGO · Noida, Sector 45
            </span>
            <h1 className="hero-enter" style={{ animationDelay: '120ms' }}>
              Education for <span className="accent">every child</span>
            </h1>
            <p className="hero-enter" style={{ animationDelay: '240ms' }}>
              DPS Shiksha Samiti is a community NGO in Sadarpur, Noida working to bring quality
              education, health and opportunity to underprivileged children — and to connect
              willing supporters with the people who need them.
            </p>
            <div className="hero-actions hero-enter" style={{ animationDelay: '360ms' }}>
              <Link to="/volunteer" className="btn btn-primary btn-shine">
                Become a Volunteer
              </Link>
              <Link to="/support" className="btn btn-outline-light">
                Support Our Work
              </Link>
            </div>
          </div>
          <div className="hero-enter hero-quote-wrap" style={{ animationDelay: '480ms' }}>
            <div className="card hero-quote">
              <IconBookOpen size={26} className="quote-icon" />
              <p className="quote-text">
                “शिक्षा ही एकमात्र ऐसी पूंजी है, जो लुटती नहीं, बल्कि बढ़ती है”
              </p>
              <p className="quote-translation">
                Education is the only capital that never gets stolen — it only grows.
              </p>
            </div>
            <div className="hero-float-note">
              <span className="pulse-dot" /> Always open for volunteers &amp; donors
            </div>
          </div>
        </div>
      </section>

      {/* ============================ LIVE STATS ============================== */}
      <section className="stats-band">
        <div className="container stats-grid">
          <Stat
            label="Volunteers registered"
            value={stats?.volunteers ?? 0}
            Icon={IconUsers}
          />
          <Stat
            label="Current needs listed"
            value={stats?.requirements ?? 0}
            Icon={IconBookOpen}
          />
          <Stat
            label="Community supporters"
            value={(stats?.volunteers ?? 0) + (stats?.enquiries ?? 0)}
            Icon={IconHeart}
          />
        </div>
      </section>

      {/* ============================== MARQUEE =============================== */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-star">✦</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* ============================ WHAT WE DO ============================== */}
      <section className="section">
        <div className="container">
          <Reveal>
            <h2 className="section-title">
              What We Do <span className="title-dot">.</span>
            </h2>
          </Reveal>
          <div className="card-grid">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 120}>
                <div className={`card pillar-card pillar-${p.color}`}>
                  <span className="pillar-icon">
                    <p.Icon size={30} />
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== CURRENT REQUIREMENTS ======================== */}
      <section className="section section-tinted">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <h2 className="section-title">
                What We Need Right Now <span className="title-dot">.</span>
              </h2>
              <Link to="/support" className="text-link">
                How to help <IconArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
          {loadError ? (
            <p className="empty-state">⚠️ {loadError}</p>
          ) : loading ? (
            <SkeletonCards />
          ) : requirements.length === 0 ? (
            <p className="empty-state">No current requirements listed yet.</p>
          ) : (
            <div className="list">
              {requirements.map((r, i) => (
                <Reveal key={r.id} delay={i * 100}>
                  <div className="card list-item hover-lift">
                    <div>
                      <h3>{r.title}</h3>
                      <p>{r.description}</p>
                    </div>
                    {r.category && <span className={`tag tag-${(r.category || '').toLowerCase()}`}>{r.category}</span>}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====================== REELS & POSTS (live feed) ====================== */}
      <SocialFeed />

      {/* ================================= CTA ================================ */}
      <section className="cta">
        <div className="hero-blob hero-blob-4" />
        <div className="container cta-inner">
          <Reveal>
            <h2>Every contribution changes a child's story</h2>
            <p>
              Volunteer your time, donate supplies, or spread the word — it takes a village to
              raise a child, and this is ours.
            </p>
            <div className="hero-actions">
              <Link to="/volunteer" className="btn btn-light btn-shine">Volunteer</Link>
              <Link to="/support" className="btn btn-outline-light">Donate / Support</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}