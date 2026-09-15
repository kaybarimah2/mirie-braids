import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GENERAL_BOOKING_LINK } from "../utils/whatsapp";
import "./Hero.css";

const SLIDES = ["/hero/A1.jpg", "/hero/A2.jpg", "/hero/A3.jpg"];
const INTERVAL = 5000;

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="hero">
      <div className="hero__bg">
        {SLIDES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Mirie Braids client styled hair"
            className={i === active ? "active" : ""}
          />
        ))}
        <div className="hero__overlay" />
      </div>

      <div className="container hero__inner">
        <motion.p
          className="section-label hero__label"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Professional Home Braiding Service
        </motion.p>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Mirie Braids
        </motion.h1>

        <motion.p
          className="hero__tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Beautiful Braids, Beautiful You
        </motion.p>

        <motion.p
          className="hero__desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          We come to your comfort zone — expert braiding, right at your doorstep,
          anywhere in Accra & environs.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <a href={GENERAL_BOOKING_LINK} target="_blank" rel="noreferrer" className="btn btn-primary">
            Book on WhatsApp
          </a>
          <a href="#services" className="btn btn-outline">
            Explore Styles
          </a>
        </motion.div>

        <div className="hero__dots">
          {SLIDES.map((src, i) => (
            <button
              key={src}
              className={i === active ? "active" : ""}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
