import { useState } from 'react';

/**
 * Generic admin manager for a list of content items (requirements / activities).
 * Props: fields (config), items, load, create, update, remove, emptyText.
 */
export default function ContentManager({ fields, items, onCreate, onUpdate, onRemove, emptyText }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const emptyForm = () => Object.fromEntries(fields.map((f) => [f.key, '']));
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const startAdd = () => {
    setForm(emptyForm());
    setAdding(true);
    setEditingId(null);
    setError('');
  };

  const startEdit = (item) => {
    setForm(Object.fromEntries(fields.map((f) => [f.key, item[f.key] || ''])));
    setEditingId(item.id);
    setAdding(false);
    setError('');
  };

  const cancel = () => {
    setAdding(false);
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (editingId) {
        await onUpdate(editingId, form);
      } else {
        await onCreate(form);
      }
      cancel();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setError('');
    try {
      await onRemove(item.id);
      if (editingId === item.id) cancel();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="admin-toolbar">
        <button className="btn btn-primary" onClick={startAdd}>
          + Add New
        </button>
      </div>

      {error && <p className="form-error">⚠️ {error}</p>}

      {(adding || editingId) && (
        <form className="card form admin-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit item' : 'Add new item'}</h3>
          {fields.map((f) => (
            <label className="field" key={f.key}>
              <span className="field-label">{f.label}</span>
              {f.textarea ? (
                <textarea
                  className="field-input"
                  rows={3}
                  required={f.required}
                  value={form[f.key] || ''}
                  onChange={update(f.key)}
                />
              ) : (
                <input
                  className="field-input"
                  required={f.required}
                  value={form[f.key] || ''}
                  onChange={update(f.key)}
                />
              )}
            </label>
          ))}
          <div className="admin-form-actions">
            <button className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={cancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <p className="empty-state">{emptyText}</p>
      ) : (
        <ul className="admin-list">
          {items.map((item) => (
            <li key={item.id} className="card admin-list-item">
              <div className="admin-list-main">
                <h4>{item.title}</h4>
                {item.description && <p>{item.description}</p>}
                <div className="admin-list-meta">
                  {fields
                    .filter((f) => f.key !== 'title' && f.key !== 'description' && item[f.key])
                    .map((f) => (
                      <span key={f.key} className="tag">
                        {item[f.key]}
                      </span>
                    ))}
                </div>
              </div>
              <div className="admin-list-actions">
                <button className="btn btn-small" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <button className="btn btn-small btn-danger" onClick={() => handleRemove(item)}>
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