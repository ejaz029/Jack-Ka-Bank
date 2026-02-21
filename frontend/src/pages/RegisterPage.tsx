import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api, { getApiErrorMessage } from "../api/client";
import BankFooter from "../components/BankFooter";
import BankHeader from "../components/BankHeader";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uname: "",
    password: "",
    email: "",
    phone: "",
    role: "customer",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string>("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!agreeTerms) {
      setError("Please accept the terms and conditions to continue.");
      return;
    }

    try {
      await api.post("/api/auth/register", formData);
      navigate("/login");
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Registration failed"));
    }
  };

  return (
    <main className="page">
      <BankHeader />
      <div className="page-auth">
        <section className="card">
          <h1 className="card__title">Create your account</h1>
          <p className="hint" style={{ margin: "0 0 1.25rem" }}>
            Open a Jack Ka Bank account in a few steps.
          </p>
          <form onSubmit={onSubmit} className="form">
            <input
              placeholder="Username"
              value={formData.uname}
              onChange={(e) => setFormData({ ...formData, uname: e.target.value })}
              required
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password (min 8 characters)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <p className="password-hint">Use at least 8 characters. Avoid sharing your password.</p>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
            />
            <input
              placeholder="Phone (e.g. +919876543210)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              aria-label="Account type"
            >
              <option value="customer">Savings account (Customer)</option>
            </select>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit">Create account</button>
          </form>
          <p className="hint" style={{ marginTop: "1rem", marginBottom: 0 }}>
            Already have an account? <Link to="/login" style={{ color: "var(--bank-accent)", fontWeight: 600 }}>Sign in</Link>
          </p>
        </section>
      </div>
      <BankFooter />
    </main>
  );
}
