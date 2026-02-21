export default function BankFooter() {
  return (
    <footer className="bank-footer">
      <div className="bank-footer__inner">
        <div className="bank-footer__links">
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy</a>
          <a href="#help">Help</a>
          <a href="#security">Security</a>
        </div>
        <p className="bank-footer__copy">
          © {new Date().getFullYear()} Jack Ka Bank. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
