import { webmFor } from '../components/AmbientVideo';

/**
 * A plain video with native controls. It never autoplays and loads nothing until the visitor presses play.
 * The caption is visible and the fallback link covers browsers that cannot play the file.
 */
export function DomainVideo({ src, title }: { src: string; title: string }) {
  // Films in public/video ship with a poster frame next to them.
  const poster = /^\/video\/[\w-]+\.mp4$/.test(src) ? src.replace(/\.mp4$/, '-poster.webp') : undefined;
  return (
    <figure className="max-w-[56rem]">
      <video poster={poster} controls preload="none" playsInline className="aspect-video w-full bg-midnight" aria-label={`A video from IP3 on ${title}`}>
        {webmFor(src) ? <source src={webmFor(src)} type="video/webm" /> : null}
        <source src={src} />
        <p>
          This video cannot be played in your browser.{' '}
          <a href={src} className="text-teal-deep underline underline-offset-4">
            Open the video file
          </a>
          .
        </p>
      </video>
      <figcaption className="t-ui mt-3 text-ink-soft">A video from IP3 on {title}.</figcaption>
    </figure>
  );
}
