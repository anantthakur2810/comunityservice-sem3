import { useEffect, useState } from 'react';
import { admin } from '../api.js';
import { IconYouTube, IconInstagram } from '../components/Icons.jsx';

/**
 * Admin manager for social posts: paste a YouTube/Instagram link, preview it,
 * save it. Also syncs the NGO's YouTube channel with one click.
 */
export default function PostsManager({ onChanged }) {
  const [posts, setPosts] = useState([]);
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const load = async () => {
    try {
      const { posts: list } = await admin.posts();
      setPosts(list || []);
      if (onChanged) onChanged(list || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runPreview = async () => {
    setError('');
    setInfo('');
    setPreview(null);
    if (!url.trim()) return;
    setPreviewing(true);
    try {
      const { preview: p } = await admin.previewPost(url.trim());
      setPreview(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setPreviewing(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSaving(true);
    try {
      await admin.createPost(url.trim(), caption.trim());
      setUrl('');
      setCaption('');
      setPreview(null);
      setInfo('Post added — it is live on the homepage now.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    setError('');
    setInfo('');
    setSyncing(true);
    try {
      const { added, total } = await admin.syncPosts();
      setInfo(added > 0 ? `Synced ${added} new video(s) from YouTube (${total} total).` : 'Already up to date — no new videos.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleRemove = async (post) => {
    if (!window.confirm('Remove this post from the site? The original stays on YouTube/Instagram.')) return;
    setError('');
    try {
      await admin.deletePost(post.id);
      setPosts((list) => list.filter((p) => p.id !== post.id));
      if (onChanged) onChanged(posts.filter((p) => p.id !== post.id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <button className="btn btn-primary" onClick={handleSync} disabled={syncing}>
          {syncing ? 'Syncing…' : '↻ Sync YouTube channel'}
        </button>
        <span className="muted">
          Pulls the latest public videos from youtube.com/@dpsngo. The site also syncs itself
          once a day.
        </span>
      </div>

      {error && <p className="form-error">⚠️ {error}</p>}
      {info && <p className="form-success">✓ {info}</p>}

      <form className="card form admin-form" onSubmit={handleSave}>
        <h3>Add a post</h3>
        <label className="field">
          <span className="field-label">Post link (YouTube video/short or Instagram reel/post)</span>
          <input
            className="field-input"
            placeholder="https://www.youtube.com/shorts/… or https://www.instagram.com/reel/…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={runPreview}
          />
        </label>
        <label className="field">
          <span className="field-label">Caption (optional)</span>
          <input
            className="field-input"
            placeholder="e.g. Evening class at Sadarpur"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </label>

        {previewing && <p className="muted">Fetching preview…</p>}
        {preview && (
          <div className="post-preview card">
            {preview.thumbnailUrl ? (
              <img src={preview.thumbnailUrl} alt="" />
            ) : (
              <span className="post-thumb-fallback">
                {preview.platform === 'youtube' ? <IconYouTube size={30} /> : <IconInstagram size={30} />}
              </span>
            )}
            <div>
              <strong>{preview.title || (preview.platform === 'youtube' ? 'YouTube video' : 'Instagram reel/post')}</strong>
              {preview.author && <div className="muted">{preview.author}</div>}
              <div className="muted">
                {preview.platform} · {preview.kind}
              </div>
            </div>
          </div>
        )}

        <div className="admin-form-actions">
          <button className="btn btn-primary" disabled={saving || !url.trim()}>
            {saving ? 'Saving…' : 'Save & publish'}
          </button>
        </div>
      </form>

      {posts.length === 0 ? (
        <p className="empty-state">No posts yet. Sync the channel or add a link above.</p>
      ) : (
        <ul className="admin-list">
          {posts.map((post) => (
            <li key={post.id} className="card admin-list-item">
              <div className="admin-list-main post-row">
                {post.thumbnailUrl ? (
                  <img className="post-row-thumb" src={post.thumbnailUrl} alt="" loading="lazy" />
                ) : (
                  <span className="post-row-thumb post-thumb-fallback">
                    {post.platform === 'youtube' ? <IconYouTube size={22} /> : <IconInstagram size={22} />}
                  </span>
                )}
                <div>
                  <h4>{post.title || '(untitled)'}</h4>
                  <div className="admin-list-meta">
                    <span className="tag">{post.platform}</span>
                    <span className="tag">{post.kind}</span>
                    <span className="tag">{post.source === 'auto' ? 'auto-synced' : 'manual'}</span>
                    <a href={post.url} target="_blank" rel="noreferrer" className="muted">
                      open original ↗
                    </a>
                  </div>
                </div>
              </div>
              <div className="admin-list-actions">
                <button className="btn btn-small btn-danger" onClick={() => handleRemove(post)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
