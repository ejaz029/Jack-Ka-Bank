import { useState } from "react";

import api, { getApiErrorMessage } from "../api/client";
import BalanceCard from "../components/BalanceCard";
import CelebrationBackground from "../components/CelebrationBackground";

const SAMPLE_TRANSACTIONS = [
  { date: "Today", description: "Account opened", amount: "+1,00,000.00", type: "credit" as const },
];

export default function DashboardPage() {
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [celebrationKey, setCelebrationKey] = useState(0);

  const checkBalance = async () => {
    setError("");
    try {
      const response = await api.get("/api/account/balance");
      setBalance(response.data.balance);
      setCelebrationKey((prev) => prev + 1);
    } catch (err: any) {
      setError(getApiErrorMessage(err, "Failed to load balance"));
      setBalance(null);
    }
  };

  return (
    <>
      <CelebrationBackground trigger={celebrationKey} />
      <div className="dashboard-wrap">
        <div className="dashboard">
          <div className="dashboard__welcome">
            <h1>Dashboard</h1>
            <p>Manage your account and view your balance</p>
          </div>

          <div className="dashboard__grid">
            <section id="account" className="account-card">
              <span className="account-badge">● Active</span>
              <p className="account-card__label">Primary savings account</p>
              <BalanceCard balance={balance} />
              <div className="account-card__actions">
                <button type="button" className="btn-primary" onClick={checkBalance}>
                  Check Balance
                </button>
                <button type="button" className="btn-secondary" disabled title="Coming soon">
                  Request statement
                </button>
              </div>
              {error && <p className="error" style={{ marginTop: "0.75rem", marginBottom: 0 }}>{error}</p>}
            </section>

            <section id="support" className="support-card">
              <h2 className="support-card__title">Customer support</h2>
              <div className="support-card__row">
                <strong>Phone</strong>
                <span>1800-123-4567</span>
              </div>
              <div className="support-card__row">
                <strong>Email</strong>
                <span>support@jackkabank.com</span>
              </div>
              <div className="support-card__row">
                <strong>Hours</strong>
                <span>Mon–Fri 9:00 AM – 6:00 PM</span>
              </div>
            </section>

            <section id="statements" className="transactions-card">
              <h2 className="transactions-card__title">Recent activity</h2>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_TRANSACTIONS.map((tx, i) => (
                    <tr key={i}>
                      <td>{tx.date}</td>
                      <td>{tx.description}</td>
                      <td className={tx.type === "credit" ? "amount-credit" : "amount-debit"} style={{ textAlign: "right" }}>
                        {tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="transactions-empty">More transactions will appear here as you use your account.</p>
            </section>
          </div>

          <section id="settings" className="dashboard-settings">
            <h2 className="info-card__title">Settings</h2>
            <p className="hint" style={{ margin: 0 }}>Profile and security settings will appear here. (Coming soon.)</p>
          </section>
        </div>
      </div>
    </>
  );
}
