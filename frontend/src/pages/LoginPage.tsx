import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api, { getApiErrorMessage, PRODUCTION_BACKEND } from "../api/client";
import BankFooter from "../components/BankFooter";
import BankHeader from "../components/BankHeader";

export default function LoginPage() {
  const navigate = useNavigate();
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/api/auth/login", { uname, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Login failed"));
    }
  };

  return (
    <main className="page">
      <BankHeader />
      <div className="page-auth">
        <section className="card">
          <h1 className="card__title">Sign in to Jack Ka Bank</h1>
          <form onSubmit={onSubmit} className="form">
            <input
              placeholder="Username"
              value={uname}
              onChange={(e) => setUname(e.target.value)}
              required
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <div className="form-footer">
              <label className="checkbox-row" style={{ margin: 0 }}>
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="#forgot">Forgot password?</a>
            </div>
            {error && (
              <>
                <p className="error">{error}</p>
                {error.includes("Cannot reach backend") && (
                  <p className="hint" style={{ marginTop: "0.5rem" }}>
                    <a href={`${PRODUCTION_BACKEND}/api/health`} target="_blank" rel="noopener noreferrer">
                      Wake server (open in new tab)
                    </a>
                    {" — wait until you see {\"status\":\"ok\"}, then try Sign in again."}
                  </p>
                )}
              </>
            )}
            <button type="submit">Sign in</button>
          </form>
          <p className="secure-line">
            🔒 Secure sign-in. We never share your credentials.
          </p>
          <p className="hint" style={{ marginTop: "1rem", marginBottom: 0 }}>
            New customer? <Link to="/register" style={{ color: "var(--bank-accent)", fontWeight: 600 }}>Create an account</Link>
          </p>
        </section>
      </div>
      <BankFooter />
    </main>
  );
}
