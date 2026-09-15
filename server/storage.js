const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = "media";

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  if (!buckets.find((b) => b.name === BUCKET)) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (createError) throw createError;
  }
}

async function uploadFile(buffer, originalName, contentType) {
  const ext = originalName.includes(".") ? originalName.split(".").pop() : "";
  const key = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext ? `.${ext}` : ""}`;

  const { error } = await supabase.storage.from(BUCKET).upload(key, buffer, {
    contentType,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

async function deleteFile(publicUrl) {
  if (!publicUrl) return;
  const marker = `/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const key = publicUrl.slice(idx + marker.length);
  const { error } = await supabase.storage.from(BUCKET).remove([key]);
  if (error) throw error;
}

module.exports = { ensureBucket, uploadFile, deleteFile };
