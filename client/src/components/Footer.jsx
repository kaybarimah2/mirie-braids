import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">Mirie Braids</p>
        <div className="footer__socials">
          <a href="https://www.tiktok.com/@just._mirie" target="_blank" rel="noreferrer" aria-label="TikTok">
            TikTok
          </a>
          <a href="https://snapchat.com/t/Y83xyrD6" target="_blank" rel="noreferrer" aria-label="Snapchat">
            Snapchat
          </a>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} Mirie Braids. All rights reserved.</p>
      </div>
    </footer>
  );
}
