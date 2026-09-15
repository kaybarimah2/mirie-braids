import { supabase } from "./supabase";

const BUCKET = "media";

function unwrap({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

async function uploadToStorage(file) {
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
  const key = `${Date.now()}-${Math.random().toString(16).slice(2, 10)}${ext ? `.${ext}` : ""}`;
  const { error } = await supabase.storage.from(BUCKET).upload(key, file, { contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

async function deleteFromStorage(publicUrl) {
  if (!publicUrl) return;
  const marker = `/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const key = publicUrl.slice(idx + marker.length);
  await supabase.storage.from(BUCKET).remove([key]);
}

export function assetUrl(path) {
  return path;
}

export const api = {
  getServices: async () =>
    unwrap(await supabase.from("services").select("*").order("sort_order").order("id")),
  getTestimonials: async () =>
    unwrap(await supabase.from("testimonials").select("*").order("sort_order").order("id", { ascending: false })),
  getVideoTestimonials: async () =>
    unwrap(await supabase.from("video_testimonials").select("*").order("sort_order").order("id")),

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  },
  logout: () => supabase.auth.signOut(),
  getSession: async () => (await supabase.auth.getSession()).data.session,
  changePassword: async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  },

  createService: async ({ name, price_text, file }) => {
    const image_path = file ? await uploadToStorage(file) : null;
    return unwrap(await supabase.from("services").insert({ name, price_text, image_path }).select().single());
  },
  updateService: async (id, { name, price_text, file, existingImagePath }) => {
    const patch = { name, price_text };
    if (file) {
      patch.image_path = await uploadToStorage(file);
      if (existingImagePath) deleteFromStorage(existingImagePath).catch(() => {});
    }
    return unwrap(await supabase.from("services").update(patch).eq("id", id).select().single());
  },
  deleteService: async (id, image_path) => {
    if (image_path) deleteFromStorage(image_path).catch(() => {});
    unwrap(await supabase.from("services").delete().eq("id", id));
  },

  createTestimonial: async (data) =>
    unwrap(await supabase.from("testimonials").insert(data).select().single()),
  updateTestimonial: async (id, data) =>
    unwrap(await supabase.from("testimonials").update(data).eq("id", id).select().single()),
  deleteTestimonial: async (id) => unwrap(await supabase.from("testimonials").delete().eq("id", id)),

  createVideoTestimonial: async ({ file, caption }) => {
    const video_path = await uploadToStorage(file);
    return unwrap(
      await supabase.from("video_testimonials").insert({ video_path, caption: caption || null }).select().single()
    );
  },
  updateVideoTestimonial: async (id, { file, caption, existingVideoPath }) => {
    const patch = { caption: caption || null };
    if (file) {
      patch.video_path = await uploadToStorage(file);
      if (existingVideoPath) deleteFromStorage(existingVideoPath).catch(() => {});
    }
    return unwrap(await supabase.from("video_testimonials").update(patch).eq("id", id).select().single());
  },
  deleteVideoTestimonial: async (id, video_path) => {
    if (video_path) deleteFromStorage(video_path).catch(() => {});
    unwrap(await supabase.from("video_testimonials").delete().eq("id", id));
  },
};
