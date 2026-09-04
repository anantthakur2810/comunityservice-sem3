import { useState } from 'react';
import { adminLogin } from '../api.js';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await adminLogin(password);
      onLogin(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>Admin Panel</h1>
          <p>Sign in to manage enquiries, volunteers and website content.</p>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <form className="card form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Admin password</span>
              <input
                className="field-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
              />
            </label>
            {error && <p className="form-error">⚠️ {error}</p>}
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}