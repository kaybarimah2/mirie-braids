import { useEffect, useState } from "react";
import { api } from "../api";
import Reveal from "./Reveal.jsx";
import VideoTestimonials from "./VideoTestimonials.jsx";
import "./Testimonials.css";

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [videoCount, setVideoCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getTestimonials()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));

    api
      .getVideoTestimonials()
      .then((v) => setVideoCount(v.length))
      .catch(() => setVideoCount(0));
  }, []);

  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <Reveal>
          <p className="section-label">Testimonials</p>
          <h2 className="section-title">What Clients Are Saying</h2>
          <p className="section-subtitle">Real reactions, straight from the chair.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <VideoTestimonials />
        </Reveal>

        {!loading && items.length === 0 && videoCount === 0 && (
          <p>Client reviews coming soon.</p>
        )}

        <div className="testimonials__grid">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <div className="testimonial-card">
                <p className="testimonial-card__quote">"{t.message}"</p>
                <p className="testimonial-card__name">— {t.client_name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
