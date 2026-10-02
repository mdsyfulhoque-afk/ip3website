import type { AboutContent } from '../../content';

/**
 * The chairman's short video message. Renders nothing until a video is uploaded in the editor
 * (About → Chairman → Video). The video never autoplays and loads only when played.
 */
export function ChairmanVideo({ chairman, className = '' }: { chairman: AboutContent['chairman']; className?: string }) {
  const src = chairman.video?.trim();
  if (!src) return null;
  return (
    <figure className={className}>
      <video controls preload="none" playsInline poster={chairman.poster?.trim() || undefined} className="aspect-video w-full rounded-sm bg-midnight object-cover">
        <source src={src} />
        <a href={src}>Watch the message from {chairman.name}</a>
      </video>
      <figcaption className="t-ui mt-3 text-ink-soft">A message from {chairman.name}</figcaption>
    </figure>
  );
}
