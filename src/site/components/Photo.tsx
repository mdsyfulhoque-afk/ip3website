import { PHOTOS } from '../../content/photos';

interface PhotoProps {
  /** Key in src/content/photos.ts. Unknown keys render nothing. */
  photoKey: string;
  className?: string;
  /** CSS sizes hint for the responsive source set. */
  sizes?: string;
  caption?: boolean;
  /** Use for the largest image on a page. */
  priority?: boolean;
  /** Extra classes for the image, e.g. a fixed aspect ratio so a grid lines up. */
  imgClassName?: string;
}

/** A real photograph from the team's archive, served as AVIF with a WebP fallback. */
export function Photo({ photoKey, className = '', sizes = '(min-width: 1024px) 50vw, 100vw', caption = true, priority = false, imgClassName = '' }: PhotoProps) {
  const p = PHOTOS[photoKey];
  if (!p) return null;
  const set = (ext: string) => p.widths.map((w) => `/media/${p.key}-${w}.${ext} ${w}w`).join(', ');
  const fallback = p.widths[Math.min(1, p.widths.length - 1)]!;
  return (
    <figure className={className}>
      <picture>
        <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
        <img
          src={`/media/${p.key}-${fallback}.webp`}
          srcSet={set('webp')}
          sizes={sizes}
          width={p.width}
          height={p.height}
          alt={p.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`block h-auto w-full rounded-sm object-cover ${imgClassName}`}
        />
      </picture>
      {caption ? <figcaption className="t-ui mt-3 text-current opacity-75">{p.caption}</figcaption> : null}
    </figure>
  );
}
