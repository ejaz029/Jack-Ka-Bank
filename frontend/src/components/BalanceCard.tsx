interface BalanceCardProps {
  balance: string | null;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  if (!balance) {
    return (
      <p className="hint" style={{ margin: 0 }}>
        Click &quot;Check Balance&quot; to view your current balance.
      </p>
    );
  }

  return (
    <div>
      <p className="account-card__label">Available balance</p>
      <p className="account-card__balance" style={{ margin: 0 }}>
        ₹ {balance}
      </p>
    </div>
  );
}
