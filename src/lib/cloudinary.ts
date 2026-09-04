const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dj0n7b4ma";

/** CDN-delivered MP4 — match source 1280w; upscaling to 1920 made scroll-seek heavier. */
export function cloudinaryVideoUrl(
  publicId: string,
  transforms = "q_auto:good,f_mp4,vc_h264,w_1280",
) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transforms}/${publicId}`;
}

/** First-frame poster from Cloudinary (fallback when local JPG unavailable). */
export function cloudinaryVideoPoster(
  publicId: string,
  transforms = "so_0,q_auto,f_jpg,w_1920",
) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transforms}/${publicId}.jpg`;
}

/** Raw files (GLB) on the same cloud. */
export function cloudinaryRawUrl(publicId: string, version?: string) {
  const v = version ? `v${version}/` : "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${v}${publicId}`;
}
