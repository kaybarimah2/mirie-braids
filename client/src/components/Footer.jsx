import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">Mirie Braids</p>
        <div className="footer__socials">
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="Facebook">Facebook</a>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} Mirie Braids. All rights reserved.</p>
      </div>
    </footer>
  );
}
