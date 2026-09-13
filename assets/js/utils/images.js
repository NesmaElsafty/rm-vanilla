/** Map raster sources to generated WebP variants without changing data files. */

function escapeAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

export function toWebp(src) {
  return String(src ?? '').replace(/\.(png|jpe?g)$/i, '.webp');
}

/** Card thumbnail: foo.png|jpg|webp → foo-304.webp (slider card architecture). */
export function toCardWebp(src) {
  const value = String(src ?? '');
  if (/-304\.webp$/i.test(value)) return value;
  return value.replace(/\.(png|jpe?g|webp)$/i, '-304.webp');
}

export function cardImageMarkup(src, className = 'floating-program-card-image') {
  const original = String(src ?? '');
  const webp = escapeAttr(toCardWebp(original));
  const fallback = escapeAttr(toWebp(original) || original);
  return `<picture>
    <source srcset="${webp}" type="image/webp">
    <img src="${fallback}" alt="" class="${className}" width="152" height="152" loading="lazy" decoding="async">
  </picture>`;
}
