// Backend se baat karne wali ek hi jagah: token save, auto-refresh, upload.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const url = (p) => (p && p.startsWith('/uploads') ? BASE + p : p);
const get = (k) => localStorage.getItem(k);
export const isLoggedIn = () => !!get('access');
export const logout = () => { localStorage.removeItem('access'); localStorage.removeItem('refresh'); };

function save(t) { localStorage.setItem('access', t.accessToken); localStorage.setItem('refresh', t.refreshToken); }
const json = { 'Content-Type': 'application/json' };

export async function login(email, password) {
  let r;
  try {
    r = await fetch(BASE + '/auth/login', { method: 'POST', headers: json, body: JSON.stringify({ email, password }) });
  } catch {
    throw new Error(`Can't reach the server at ${BASE}. Check that the backend is running.`);
  }
  if (!r.ok) throw new Error('Email or password is incorrect.');
  save(await r.json());
}

async function refresh() {
  const refreshToken = get('refresh');
  if (!refreshToken) return false;
  const r = await fetch(BASE + '/auth/refresh', { method: 'POST', headers: json, body: JSON.stringify({ refreshToken }) });
  if (!r.ok) return false;
  save(await r.json());
  return true;
}

export async function api(path, { method = 'GET', body, form } = {}, retry = true) {
  const headers = { Authorization: 'Bearer ' + get('access') };
  if (body) headers['Content-Type'] = 'application/json';
  const r = await fetch(BASE + path, { method, headers, body: form ?? (body ? JSON.stringify(body) : undefined) });
  if (r.status === 401 && retry) {
    if (await refresh()) return api(path, { method, body, form }, false);
    logout();
    location.reload();
  }
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    const fields = e.fields ? ' ' + Object.entries(e.fields).map(([k, v]) => `${k}: ${v}`).join(', ') : '';
    throw new Error((e.error || e.message || `Request failed (${r.status})`) + fields);
  }
  return r.status === 204 ? null : r.json();
}

export function upload(file) {
  const form = new FormData();
  form.append('file', file);
  return api('/upload/image', { method: 'POST', form });
}
