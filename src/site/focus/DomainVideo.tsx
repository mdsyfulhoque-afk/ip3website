/**
 * A plain video with native controls. It never autoplays and loads nothing until the visitor presses play.
 * The caption is visible and the fallback link covers browsers that cannot play the file.
 */
export function DomainVideo({ src, title }: { src: string; title: string }) {
  return (
    <figure className="max-w-[56rem]">
      <video src={src} controls preload="none" playsInline className="aspect-video w-full bg-midnight" aria-label={`A video from IP3 on ${title}`}>
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
