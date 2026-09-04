const TOKEN_KEY = 'dps_ngo_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`/api${path}`, { ...options, headers });
  } catch {
    throw new Error('Could not reach the server. Is it running on port 5000?');
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

/* ------------------------------- public API ------------------------------- */
export const getRequirements = () => request('/requirements');
export const getActivities = () => request('/activities');
export const getStats = () => request('/stats');
export const submitVolunteer = (payload) =>
  request('/volunteers', { method: 'POST', body: JSON.stringify(payload) });
export const submitEnquiry = (payload) =>
  request('/enquiries', { method: 'POST', body: JSON.stringify(payload) });

/* -------------------------------- admin API ------------------------------- */
export const adminLogin = (password) =>
  request('/admin/login', { method: 'POST', body: JSON.stringify({ password }) });

export const admin = {
  volunteers: () => request('/admin/volunteers'),
  deleteVolunteer: (id) => request(`/admin/volunteers/${id}`, { method: 'DELETE' }),

  enquiries: () => request('/admin/enquiries'),
  updateEnquiry: (id, patch) =>
    request(`/admin/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteEnquiry: (id) => request(`/admin/enquiries/${id}`, { method: 'DELETE' }),

  requirements: () => request('/admin/requirements'),
  createRequirement: (payload) =>
    request('/admin/requirements', { method: 'POST', body: JSON.stringify(payload) }),
  updateRequirement: (id, patch) =>
    request(`/admin/requirements/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteRequirement: (id) => request(`/admin/requirements/${id}`, { method: 'DELETE' }),

  activities: () => request('/admin/activities'),
  createActivity: (payload) =>
    request('/admin/activities', { method: 'POST', body: JSON.stringify(payload) }),
  updateActivity: (id, patch) =>
    request(`/admin/activities/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteActivity: (id) => request(`/admin/activities/${id}`, { method: 'DELETE' }),
};