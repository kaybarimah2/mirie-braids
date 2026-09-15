import { useEffect, useState } from "react";
import { api } from "../api";
import Reveal from "./Reveal.jsx";
import ServiceCard from "./ServiceCard.jsx";
import "./Services.css";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getServices()
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="section services">
      <div className="container">
        <Reveal>
          <p className="section-label">Services & Pricing</p>
          <h2 className="section-title">Explore a Style, Then Book It Instantly</h2>
          <p className="section-subtitle">
            Hover or tap any style below to see pricing and book it directly on
            WhatsApp — no forms, no waiting. See something you love elsewhere? Send
            the inspo picture and we'll recreate it for you.
          </p>
        </Reveal>

        {loading && <p>Loading styles…</p>}

        {!loading && services.length === 0 && (
          <p>New styles coming soon — check back shortly.</p>
        )}

        <div className="services__grid">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.05}>
              <ServiceCard service={service} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
