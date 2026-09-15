import { useEffect, useState } from "react";
import { api, assetUrl } from "../api";

const EMPTY = { name: "", price_text: "", file: null };

export default function ServicesTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  function load() {
    api.getServices().then(setItems);
  }

  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("price_text", form.price_text);
      if (form.file) fd.append("image", form.file);

      if (editingId) {
        await api.updateService(editingId, fd);
      } else {
        await api.createService(fd);
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
    setForm({ name: item.name, price_text: item.price_text, file: null });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this style?")) return;
    await api.deleteService(id);
    load();
  }

  return (
    <div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Style" : "Add a New Style"}</h3>
        {error && <p className="admin-error">{error}</p>}

        <div className="admin-field">
          <label>Style Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Bohemian Braids"
            required
          />
        </div>

        <div className="admin-field">
          <label>Starting Price (e.g. GH₵150+)</label>
          <input
            value={form.price_text}
            onChange={(e) => setForm({ ...form, price_text: e.target.value })}
            placeholder="GH₵150+"
            required
          />
        </div>

        <div className="admin-field">
          <label>Photo {editingId ? "(leave blank to keep current)" : ""}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="admin-btn" type="submit">
            {editingId ? "Save Changes" : "Add Style"}
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
          {item.image_path ? (
            <img src={assetUrl(item.image_path)} alt={item.name} />
          ) : (
            <div className="admin-card" style={{ width: 72, height: 72 }} />
          )}
          <div className="admin-card__body">
            <strong>{item.name}</strong>
            <div>{item.price_text}</div>
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
