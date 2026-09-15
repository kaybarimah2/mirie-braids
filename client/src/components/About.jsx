import Reveal from "./Reveal.jsx";
import "./About.css";

const POINTS = [
  "Expert & Precise Techniques",
  "Mobile Service in Accra & Environs",
  "Personalized Styling",
  "Neat & Fast Results",
  "Affordable Pricing",
];

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container about__grid">
        <Reveal>
          <div className="about__image">
            <div className="about__image-frame">
              <img src="/about/mirie.jpg" alt="Mirie, founder of Mirie Braids" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div>
            <p className="section-label">Meet Mirie</p>
            <h2 className="section-title">Hi, I'm Mirie — Nice to Meet You!</h2>

            <p style={{ marginBottom: 18 }}>
              Braiding isn't just what I do — it's what I love. I started Mirie Braids
              because I wanted getting your hair done to feel relaxed, not rushed: no
              commute, no waiting room, just you, in your own space, being taken care of.
            </p>

            <p style={{ marginBottom: 28 }}>
              Every knotless braid, twist, and weave I create gets the same patience and
              attention to detail — because you deserve to walk away feeling as
              beautiful as you look. Have a style in mind? Send me the inspiration
              picture and let's bring it to life together.
            </p>

            <p className="about__list-label">Here's what you can expect when you book with me:</p>

            <ul className="about__list">
              {POINTS.map((point) => (
                <li key={point}>
                  <span className="about__dot" />
                  {point}
                </li>
              ))}
            </ul>

            <p className="about__signature">— Mirie</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
