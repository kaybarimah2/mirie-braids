import { GENERAL_BOOKING_LINK } from "../utils/whatsapp";
import "./FloatingWhatsApp.css";

export default function FloatingWhatsApp() {
  return (
    <a
      href={GENERAL_BOOKING_LINK}
      target="_blank"
      rel="noreferrer"
      className="floating-whatsapp"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor">
        <path d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.4.7 4.7 1.9 6.7L3 29l7-2.3c1.9 1 4 1.6 6 1.6 7 0 12.6-5.6 12.6-12.5S23 3 16 3zm0 22.7c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.2 1.4 1.4-4.1-.2-.4c-1-1.6-1.5-3.4-1.5-5.3 0-5.6 4.6-10.2 10.2-10.2 5.6 0 10.2 4.6 10.2 10.2S21.8 25.7 16 25.7zm5.6-7.6c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" />
      </svg>
    </a>
  );
}
