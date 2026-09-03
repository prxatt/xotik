const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dj0n7b4ma";

/** CDN-delivered MP4 — auto quality, H.264, capped width for fast scroll scrub. */
export function cloudinaryVideoUrl(
  publicId: string,
  transforms = "q_auto:good,f_mp4,vc_auto,w_1920",
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
