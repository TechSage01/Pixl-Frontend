// Demo listings store a file name from src/assets; real ones store a full Cloudinary URL.
const localImages = import.meta.glob("../assets/*", { eager: true, import: "default" });

export function resolveImage(img) {
  if (!img) return null;
  if (/^https?:\/\//.test(img)) return img;
  return localImages[`../assets/${img}`] || null;
}

export const naira = (n) => "₦" + Number(n || 0).toLocaleString("en-NG");