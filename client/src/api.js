export const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "";
const BASE = `${API_ORIGIN}/api`;

export function assetUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}

function authHeaders() {
  const token = localStorage.getItem("mirie_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  getServices: () => fetch(`${BASE}/services`).then(handle),
  getTestimonials: () => fetch(`${BASE}/testimonials`).then(handle),
  getVideoTestimonials: () => fetch(`${BASE}/video-testimonials`).then(handle),

  login: (username, password) =>
    fetch(`${BASE}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handle),

  changePassword: (currentPassword, newPassword) =>
    fetch(`${BASE}/admin/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ currentPassword, newPassword }),
    }).then(handle),

  createService: (formData) =>
    fetch(`${BASE}/services`, { method: "POST", headers: authHeaders(), body: formData }).then(handle),
  updateService: (id, formData) =>
    fetch(`${BASE}/services/${id}`, { method: "PUT", headers: authHeaders(), body: formData }).then(handle),
  deleteService: (id) =>
    fetch(`${BASE}/services/${id}`, { method: "DELETE", headers: authHeaders() }).then(handle),

  createTestimonial: (data) =>
    fetch(`${BASE}/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handle),
  updateTestimonial: (id, data) =>
    fetch(`${BASE}/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    }).then(handle),
  deleteTestimonial: (id) =>
    fetch(`${BASE}/testimonials/${id}`, { method: "DELETE", headers: authHeaders() }).then(handle),

  createVideoTestimonial: (formData) =>
    fetch(`${BASE}/video-testimonials`, { method: "POST", headers: authHeaders(), body: formData }).then(handle),
  updateVideoTestimonial: (id, formData) =>
    fetch(`${BASE}/video-testimonials/${id}`, { method: "PUT", headers: authHeaders(), body: formData }).then(
      handle
    ),
  deleteVideoTestimonial: (id) =>
    fetch(`${BASE}/video-testimonials/${id}`, { method: "DELETE", headers: authHeaders() }).then(handle),
};
