import { useEffect, useState } from "react";
import { GENERAL_BOOKING_LINK } from "../utils/whatsapp";
import "./Nav.css";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__brand">
          Mirie Braids
        </a>

        <nav className={`nav__links ${open ? "nav__links--open" : ""}`}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <a href={GENERAL_BOOKING_LINK} target="_blank" rel="noreferrer" className="btn btn-primary nav__cta">
          Book on WhatsApp
        </a>

        <button className="nav__burger" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
