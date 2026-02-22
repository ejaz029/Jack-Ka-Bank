import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? "https://jack-ka-bank.onrender.com" : "/api");

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export function getApiErrorMessage(error: any, fallback: string): string {
  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach backend. Check the API URL and that the backend is running.";
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