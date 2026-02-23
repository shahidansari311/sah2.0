/**
 * RankSense AI — API service layer
 * All backend calls go through this module.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Token helpers ──────────────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem("rs_token");
}

export function setToken(token) {
  localStorage.setItem("rs_token", token);
}

export function removeToken() {
  localStorage.removeItem("rs_token");
}

// ── Fetch wrapper ──────────────────────────────────────────────────────────

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      message = json.detail || json.message || message;
    } catch (_) {}
    throw new Error(message);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// ── Auth ───────────────────────────────────────────────────────────────────

export async function apiRegister(name, email, password) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function apiLogin(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiGetMe() {
  return request("/auth/me");
}

// ── Resume Analysis ────────────────────────────────────────────────────────

export async function apiAnalyzeResumes(files, jobTitle = "", jobDesc = "") {
  const token = getToken();
  const form = new FormData();
  for (const file of files) form.append("files", file);
  if (jobTitle) form.append("job_title", jobTitle);
  if (jobDesc) form.append("job_desc", jobDesc);

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      message = json.detail || message;
    } catch (_) {}
    throw new Error(message);
  }

  return res.json();
}

// ── Batches (history) ──────────────────────────────────────────────────────

export async function apiGetBatches() {
  return request("/batches");
}

export async function apiGetBatch(batchId) {
  return request(`/batches/${batchId}`);
}

export async function apiGetLatestBatch() {
  return request("/latest-batch");
}

// ── Health ─────────────────────────────────────────────────────────────────

export async function apiHealth() {
  return request("/health");
}
