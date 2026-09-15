import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServicesTab from "./ServicesTab.jsx";
import TestimonialsTab from "./TestimonialsTab.jsx";
import VideoTestimonialsTab from "./VideoTestimonialsTab.jsx";
import "./admin.css";

const TABS = {
  services: { label: "Services & Pricing", Component: ServicesTab },
  testimonials: { label: "Testimonials", Component: TestimonialsTab },
  videoTestimonials: { label: "Video Testimonials", Component: VideoTestimonialsTab },
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("services");
  const navigate = useNavigate();
  const username = localStorage.getItem("mirie_admin_username") || "Admin";
  const ActiveTab = TABS[tab].Component;

  function logout() {
    localStorage.removeItem("mirie_admin_token");
    localStorage.removeItem("mirie_admin_username");
    navigate("/admin/login");
  }

  return (
    <div className="admin">
      <header className="admin-header">
        <div className="admin-header__inner">
          <strong>Mirie Braids — Admin</strong>
          <div>
            <span style={{ marginRight: 16, fontSize: "0.9rem" }}>Hi, {username}</span>
            <button className="admin-btn admin-btn--secondary" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </header>

      <nav className="admin-tabs">
        {Object.entries(TABS).map(([key, { label }]) => (
          <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </nav>

      <div className="admin-content">
        <ActiveTab />
      </div>
    </div>
  );
}
