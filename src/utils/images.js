const CLOUD_PATH = '/wiooqx7y/image/upload/';
export function optimizedImage(source, width = 800) {
  if (!source) return '';
  try {
    const url = new URL(source);
    if (url.origin !== 'https://res.cloudinary.com' || !url.pathname.startsWith(CLOUD_PATH))
      return source;
    url.pathname = url.pathname.replace(
      CLOUD_PATH,
      `${CLOUD_PATH}f_auto,q_auto,c_limit,w_${Math.min(1600, Math.max(64, width))}/`,
    );
    return url.href;
  } catch {
    return source;
  }
}
export function imageSources(source) {
  return [400, 800, 1200].map((width) => `${optimizedImage(source, width)} ${width}w`).join(', ');
}
