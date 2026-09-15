import Reveal from "./Reveal.jsx";
import { GENERAL_BOOKING_LINK } from "../utils/whatsapp";
import "./Contact.css";

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container contact__inner">
        <Reveal>
          <p className="section-label" style={{ color: "var(--gold-soft)" }}>
            Contact
          </p>
          <h2 className="contact__title">Ready for Beautiful Braids?</h2>
          <p className="contact__desc">
            Message us on WhatsApp with your preferred style, date, and location —
            we proudly serve Accra & environs, right at your doorstep.
          </p>
          <a href={GENERAL_BOOKING_LINK} target="_blank" rel="noreferrer" className="btn btn-gold contact__cta">
            Chat on WhatsApp
          </a>
          <p className="contact__area">📍 Service Area: Accra & Environs, Ghana</p>
        </Reveal>
      </div>
    </section>
  );
}
