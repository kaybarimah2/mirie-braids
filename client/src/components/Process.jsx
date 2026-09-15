import Reveal from "./Reveal.jsx";
import "./Process.css";

const STEPS = [
  {
    number: "01",
    title: "Explore Styles",
    desc: "Browse our style gallery or send us your own inspiration picture.",
  },
  {
    number: "02",
    title: "Book Your Appointment",
    desc: "Message us on WhatsApp to lock in your style, date, and time.",
  },
  {
    number: "03",
    title: "Sit Back and Relax",
    desc: "We arrive at your home fully equipped and ready to work.",
  },
  {
    number: "04",
    title: "Walk Out in Confidence",
    desc: "Enjoy neat, long-lasting braids for the full length of your style's wear.",
  },
];

export default function Process() {
  return (
    <section id="process" className="section process">
      <div className="container">
        <Reveal>
          <p className="section-label">The Process</p>
          <h2 className="section-title">From Inspiration to Installation</h2>
          <p className="section-subtitle">Simple, home-based, and stress-free.</p>
        </Reveal>

        <div className="process__grid">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1}>
              <div className="process__step">
                <span className="process__number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
