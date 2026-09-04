import { useCallback, useEffect, useState } from 'react';
import { admin, getToken, setToken, clearToken } from '../api.js';
import AdminLogin from './AdminLogin.jsx';
import ContentManager from './ContentManager.jsx';

const requirementFields = [
  { key: 'title', label: 'Title *', required: true },
  { key: 'description', label: 'Description', textarea: true },
  { key: 'category', label: 'Category' },
];

const activityFields = [
  { key: 'title', label: 'Title *', required: true },
  { key: 'description', label: 'Description', textarea: true },
  { key: 'date', label: 'Date' },
];

const enquiryStatus = ['new', 'contacted', 'resolved'];

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '';
  }
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(Boolean(getToken()));
  const [tab, setTab] = useState('enquiries');

  const [volunteers, setVolunteers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');

  const failIfUnauthorized = (err) => {
    setError(err.message);
    if (err.message === 'Unauthorized') {
      clearToken();
      setAuthed(false);
    }
  };

  const load = useCallback(async () => {
    setError('');
    try {
      const [v, e, r, a] = await Promise.all([
        admin.volunteers(),
        admin.enquiries(),
        admin.requirements(),
        admin.activities(),
      ]);
      setVolunteers(v.volunteers || []);
      setEnquiries(e.enquiries || []);
      setRequirements(r.requirements || []);
      setActivities(a.activities || []);
    } catch (err) {
      failIfUnauthorized(err);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  if (!authed) {
    return (
      <AdminLogin
        onLogin={(token) => {
          setToken(token);
          setAuthed(true);
        }}
      />
    );
  }

  const handleLogout = () => {
    clearToken();
    setAuthed(false);
  };

  const handleEnquiryStatus = async (id, status) => {
    try {
      await admin.updateEnquiry(id, { status });
      setEnquiries((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
    } catch (err) {
      failIfUnauthorized(err);
    }
  };

  const handleDelete = async (fn, id, setter) => {
    try {
      await fn(id);
      setter((list) => list.filter((item) => item.id !== id));
    } catch (err) {
      failIfUnauthorized(err);
    }
  };

  const refreshRequirements = async () => {
    try {
      const { requirements: r } = await admin.requirements();
      setRequirements(r);
    } catch (err) {
      failIfUnauthorized(err);
    }
  };
  const refreshActivities = async () => {
    try {
      const { activities: a } = await admin.activities();
      setActivities(a);
    } catch (err) {
      failIfUnauthorized(err);
    }
  };

  const tabs = [
    { id: 'enquiries', label: `Support Enquiries${enquiries.length ? ` (${enquiries.length})` : ''}` },
    { id: 'volunteers', label: `Volunteers${volunteers.length ? ` (${volunteers.length})` : ''}` },
    { id: 'requirements', label: 'Requirements' },
    { id: 'activities', label: 'Activities' },
  ];

  return (
    <div className="page">
      <section className="page-hero">
        <div className="container admin-hero">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage enquiries, volunteers and website content.</p>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {error && <p className="form-error">⚠️ {error}</p>}

          <div className="tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'enquiries' && (
            <div>
              {enquiries.length === 0 ? (
                <p className="empty-state">No support enquiries yet.</p>
              ) : (
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Contact</th>
                        <th>Details</th>
                        <th>Received</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map((e) => (
                        <tr key={e.id}>
                          <td><strong>{e.name}</strong></td>
                          <td><span className="tag">{e.type}</span></td>
                          <td>
                            <a href={`mailto:${e.email}`}>{e.email}</a>
                            {e.phone && <div className="muted">{e.phone}</div>}
                          </td>
                          <td className="table-details">
                            {e.amount && <div>Donation: {e.amount}</div>}
                            {e.message && <div className="muted">{e.message}</div>}
                          </td>
                          <td className="muted">{formatDate(e.createdAt)}</td>
                          <td>
                            <select
                              className="field-input status-select"
                              value={e.status}
                              onChange={(ev) => handleEnquiryStatus(e.id, ev.target.value)}
                            >
                              {enquiryStatus.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <button
                              className="btn btn-small btn-danger"
                              onClick={() => handleDelete(admin.deleteEnquiry, e.id, setEnquiries)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'volunteers' && (
            <div>
              {volunteers.length === 0 ? (
                <p className="empty-state">No volunteer registrations yet.</p>
              ) : (
                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Skills</th>
                        <th>Availability</th>
                        <th>Message</th>
                        <th>Registered</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {volunteers.map((v) => (
                        <tr key={v.id}>
                          <td><strong>{v.name}</strong></td>
                          <td>
                            <a href={`mailto:${v.email}`}>{v.email}</a>
                            {v.phone && <div className="muted">{v.phone}</div>}
                          </td>
                          <td>{v.skills || '—'}</td>
                          <td>{v.availability || '—'}</td>
                          <td className="table-details muted">{v.message || '—'}</td>
                          <td className="muted">{formatDate(v.createdAt)}</td>
                          <td>
                            <button
                              className="btn btn-small btn-danger"
                              onClick={() => handleDelete(admin.deleteVolunteer, v.id, setVolunteers)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'requirements' && (
            <ContentManager
              fields={requirementFields}
              items={requirements}
              onCreate={async (form) => {
                await admin.createRequirement(form);
                await refreshRequirements();
              }}
              onUpdate={async (id, form) => {
                await admin.updateRequirement(id, form);
                await refreshRequirements();
              }}
              onRemove={async (id) => {
                await admin.deleteRequirement(id);
                setRequirements((list) => list.filter((r) => r.id !== id));
              }}
              emptyText="No requirements listed yet. Add the first one!"
            />
          )}

          {tab === 'activities' && (
            <ContentManager
              fields={activityFields}
              items={activities}
              onCreate={async (form) => {
                await admin.createActivity(form);
                await refreshActivities();
              }}
              onUpdate={async (id, form) => {
                await admin.updateActivity(id, form);
                await refreshActivities();
              }}
              onRemove={async (id) => {
                await admin.deleteActivity(id);
                setActivities((list) => list.filter((a) => a.id !== id));
              }}
              emptyText="No activities listed yet. Add the first one!"
            />
          )}
        </div>
      </section>
    </div>
  );
}