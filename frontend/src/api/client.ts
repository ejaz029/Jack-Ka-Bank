import axios from "axios";

export const PRODUCTION_BACKEND = "https://jack-ka-bank.onrender.com";

const BACKEND_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? PRODUCTION_BACKEND : "");

// Render free tier can take 30–60s to wake; use a long timeout so first request can succeed
const REQUEST_TIMEOUT_MS = 65_000;

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  timeout: REQUEST_TIMEOUT_MS,
});

export function getApiErrorMessage(error: any, fallback: string): string {
  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach backend. The server may be waking up (free tier)—open the health link below, wait for it to load, then try again. Or check VITE_API_URL and that the backend is running.";
  }

  const detail = error?.response?.data?.detail;
  if (!detail) {
    const status = error?.response?.status;
    return status ? `${fallback} (HTTP ${status})` : fallback;
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const first = detail[0] ?? {};
    if (typeof first === "string") {
      return String(first);
    }
    if (first?.msg || first?.loc) {
      const field = Array.isArray(first.loc) ? first.loc[first.loc.length - 1] : "field";
      const msg = first.msg ? String(first.msg) : "Invalid value";
      return `${field}: ${msg}`;
    }
    return fallback;
  }

  if (detail?.msg) {
    return String(detail.msg);
  }

  return fallback;
}

export default api;