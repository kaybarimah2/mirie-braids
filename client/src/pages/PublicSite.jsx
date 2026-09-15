import Nav from "../components/Nav.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Services from "../components/Services.jsx";
import Process from "../components/Process.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";
import FloatingWhatsApp from "../components/FloatingWhatsApp.jsx";

export default function PublicSite() {
  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Services />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
