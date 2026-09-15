import { useState } from "react";
import { bookStyleLink } from "../utils/whatsapp";
import { assetUrl } from "../api";
import "./ServiceCard.css";

export default function ServiceCard({ service, index }) {
  const [active, setActive] = useState(false);
  // Touch devices simulate a hover event right before the click on first tap,
  // which fights with the click toggle below (flash on, flash off). Only
  // real hover-capable pointers (mouse/trackpad) should use these handlers.
  const supportsHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  return (
    <div
      className={`service-card ${active ? "service-card--active" : ""}`}
      style={{ transitionDelay: `${index * 40}ms` }}
      onMouseEnter={() => supportsHover && setActive(true)}
      onMouseLeave={() => supportsHover && setActive(false)}
      onClick={() => setActive((v) => !v)}
    >
      <div className="service-card__image">
        {service.image_path ? (
          <img src={assetUrl(service.image_path)} alt={service.name} />
        ) : (
          <div className="service-card__placeholder">{service.name}</div>
        )}
      </div>

      <div className="service-card__overlay">
        <h3>{service.name}</h3>
        <p className="service-card__price">{service.price_text}</p>
        <a
          href={bookStyleLink(service.name)}
          target="_blank"
          rel="noreferrer"
          className="btn btn-gold service-card__cta"
          onClick={(e) => e.stopPropagation()}
        >
          Book This Style
        </a>
      </div>

      <div className="service-card__tag">
        <span>{service.name}</span>
        <strong>{service.price_text}</strong>
      </div>
    </div>
  );
}
