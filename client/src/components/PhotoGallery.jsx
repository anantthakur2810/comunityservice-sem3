import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { IconYouTube, IconArrowRight } from './Icons.jsx';
import gallery from '../data/gallery.js';

const columns = 5;

export default function PhotoGallery({ limit }) {
  const photos = limit ? gallery.slice(0, limit) : gallery;

  return (
    <section className="section section-tinted gallery-section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <h2 className="section-title">
                Life at DPS Shiksha Samiti <span className="title-dot">.</span>
              </h2>
              <p className="section-subtitle">
                काम की झलक — real moments from our classes, camps and celebrations, straight
                from the ground in Sadarpur.
              </p>
            </div>
            <a
              href="https://www.youtube.com/@dpsngo"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              <IconYouTube size={17} /> Watch our reels <IconArrowRight size={16} />
            </a>
          </div>
        </Reveal>

        <div className="photo-grid">
          {photos.map((p, i) => (
            <Reveal key={p.id} delay={(i % columns) * 90}>
              <a
                className="photo-tile hover-lift"
                href={p.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${p.en} — watch the reel`}
              >
                <img src={p.src} alt={p.en} loading="lazy" />
                <span className="photo-date">{p.date}</span>
                <span className="photo-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                    <path d="M8 5.14v13.72L19 12 8 5.14z" />
                  </svg>
                </span>
                <span className="photo-caption">
                  <strong>{p.en}</strong>
                  <em>{p.hi}</em>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        {limit && (
          <Reveal>
            <div className="gallery-more">
              <Link to="/about" className="btn btn-outline">
                More of our work <IconArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
