import { useEffect, useState } from 'react';
import Reveal from './Reveal.jsx';
import { getPosts, youtubeEmbedUrl, instagramEmbedUrl } from '../api.js';
import { IconYouTube, IconInstagram, IconArrowRight } from './Icons.jsx';

const columns = 5;

function PostTile({ post, index }) {
  const [playing, setPlaying] = useState(false);
  const isYouTube = post.platform === 'youtube';
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : '';

  return (
    <Reveal delay={(index % columns) * 90}>
      <div className="photo-tile post-tile hover-lift">
        {playing ? (
          isYouTube ? (
            <iframe
              src={`${youtubeEmbedUrl(post.externalId)}&autoplay=1`}
              title={post.title || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <iframe src={instagramEmbedUrl(post.externalId)} title="Instagram post" frameBorder="0" allowFullScreen />
          )
        ) : (
          <button
            type="button"
            className="post-thumb"
            onClick={() => setPlaying(true)}
            aria-label={post.title ? `Play ${post.title}` : 'Play video'}
          >
            {post.thumbnailUrl ? (
              <img src={post.thumbnailUrl} alt={post.title || 'Post'} loading="lazy" />
            ) : (
              <span className="post-thumb-fallback">
                {isYouTube ? <IconYouTube size={34} /> : <IconInstagram size={34} />}
              </span>
            )}
            <span className="photo-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                <path d="M8 5.14v13.72L19 12 8 5.14z" />
              </svg>
            </span>
          </button>
        )}
        {date && <span className="photo-date">{date}</span>}
        {post.title && (
          <span className="photo-caption">
            <strong>{post.title}</strong>
          </span>
        )}
        <span className="post-badge">
          {isYouTube ? <IconYouTube size={12} /> : <IconInstagram size={12} />}
          {post.source === 'auto' ? 'auto' : post.kind}
        </span>
      </div>
    </Reveal>
  );
}

export default function SocialFeed({ limit }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPosts(limit || 24)
      .then((res) => setPosts(res.posts || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <section className="section section-tinted gallery-section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div>
              <h2 className="section-title">
                Reels &amp; Posts <span className="title-dot">.</span>
              </h2>
              <p className="section-subtitle">
                Latest videos and social posts from DPS Shiksha Samiti — new YouTube uploads
                appear here automatically.
              </p>
            </div>
            <a
              href="https://www.youtube.com/@dpsngo"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              <IconYouTube size={17} /> YouTube <IconArrowRight size={16} />
            </a>
          </div>
        </Reveal>

        {error ? (
          <p className="empty-state">⚠️ {error}</p>
        ) : loading ? (
          <div className="photo-grid">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="photo-tile skeleton-card">
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line w70" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="empty-state">No posts yet — add one from the admin panel.</p>
        ) : (
          <div className="photo-grid">
            {posts.map((p, i) => (
              <PostTile key={p.id} post={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
