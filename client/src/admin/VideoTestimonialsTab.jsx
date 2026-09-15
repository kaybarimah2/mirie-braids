import { useEffect, useState } from "react";
import { api, assetUrl } from "../api";

const EMPTY = { caption: "", file: null };

export default function VideoTestimonialsTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [editingVideoPath, setEditingVideoPath] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function load() {
    api.getVideoTestimonials().then(setItems);
  }

  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      setUploading(true);
      if (editingId) {
        await api.updateVideoTestimonial(editingId, { ...form, existingVideoPath: editingVideoPath });
      } else {
        if (!form.file) throw new Error("Please choose a video");
        await api.createVideoTestimonial(form);
      }
      setForm(EMPTY);
      setEditingId(null);
      setEditingVideoPath(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditingVideoPath(item.video_path);
    setForm({ caption: item.caption || "", file: null });
  }

  async function handleDelete(item) {
    if (!confirm("Delete this video?")) return;
    await api.deleteVideoTestimonial(item.id, item.video_path);
    load();
  }

  return (
    <div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Video" : "Add a Customer Video"}</h3>
        {error && <p className="admin-error">{error}</p>}

        <div className="admin-field">
          <label>Video {editingId ? "(leave blank to keep current)" : ""}</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          />
        </div>

        <div className="admin-field">
          <label>Caption (optional — e.g. client's name or style)</label>
          <input
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            placeholder="e.g. Ama — Knotless Braids"
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="admin-btn" type="submit" disabled={uploading}>
            {uploading ? "Uploading…" : editingId ? "Save Changes" : "Add Video"}
          </button>
          {editingId && (
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={() => {
                setEditingId(null);
                setEditingVideoPath(null);
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
          <video
            src={assetUrl(item.video_path)}
            muted
            style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8 }}
          />
          <div className="admin-card__body">{item.caption || <em>No caption</em>}</div>
          <div className="admin-card__actions">
            <button className="admin-btn admin-btn--secondary" onClick={() => startEdit(item)}>
              Edit
            </button>
            <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(item)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
