import { useEffect, useState } from "react";
import { api } from "../api";

const EMPTY = { client_name: "", message: "" };

export default function TestimonialsTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function load() {
    api.getTestimonials().then(setItems);
  }

  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.updateTestimonial(editingId, form);
      } else {
        await api.createTestimonial(form);
      }
      setForm(EMPTY);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({ client_name: item.client_name, message: item.message });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this testimonial?")) return;
    await api.deleteTestimonial(id);
    load();
  }

  return (
    <div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Testimonial" : "Add a Testimonial"}</h3>
        {error && <p className="admin-error">{error}</p>}

        <div className="admin-field">
          <label>Client Name</label>
          <input
            value={form.client_name}
            onChange={(e) => setForm({ ...form, client_name: e.target.value })}
            required
          />
        </div>

        <div className="admin-field">
          <label>Message</label>
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="admin-btn" type="submit">
            {editingId ? "Save Changes" : "Add Testimonial"}
          </button>
          {editingId && (
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {items.map((item) => (
        <div className="admin-card" key={item.id}>
          <div className="admin-card__body">
            <strong>{item.client_name}</strong>
            <div>"{item.message}"</div>
          </div>
          <div className="admin-card__actions">
            <button className="admin-btn admin-btn--secondary" onClick={() => startEdit(item)}>
              Edit
            </button>
            <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
