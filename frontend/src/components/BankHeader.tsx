import { useNavigate } from "react-router-dom";

interface BankHeaderProps {
  showLogout?: boolean;
}

export default function BankHeader({ showLogout }: BankHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="bank-header">
      <div className="bank-header__inner">
        <div className="bank-header__brand" onClick={() => navigate("/")}>
          <span className="bank-header__logo">JKB</span>
          <span className="bank-header__name">Jack Ka Bank</span>
        </div>
        <div className="bank-header__right">
          <span className="bank-header__secure" aria-hidden="true">
            🔒 Secure
          </span>
          {showLogout && (
            <button type="button" className="bank-header__logout" onClick={handleLogout}>
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
