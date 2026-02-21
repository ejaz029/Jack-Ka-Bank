import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8001",
  withCredentials: true,
});

export function getApiErrorMessage(error: any, fallback: string): string {
  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach backend. Ensure API is running (default http://localhost:8001).";
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
