import React from 'react';

interface BrandFilmSectionProps {
  kicker?: string;
  heading?: string;
  lead?: string;
  videoSrc?: string;
  posterSrc?: string;
}

export const BrandFilmSection: React.FC<BrandFilmSectionProps> = ({
  kicker = 'IP3 in motion',
  heading = 'From the factory floor to the data room.',
  lead = 'Thirty seconds on how we work: start with the system, test what can be checked, and stay until policy works on the ground.',
  videoSrc = '/videos/ip3-reel.mp4',
  posterSrc = '/videos/ip3-reel-poster.webp',
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const webmSrc = videoSrc.replace(/\.mp4$/, '.webm');

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-[#050a12] to-[#0f1419] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#ff7e67] mb-4">
            {kicker}
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 max-w-3xl">
            {heading}
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            {lead}
          </p>
        </div>

        {/* Video Container */}
        <div className="relative rounded-lg overflow-hidden aspect-video shadow-2xl bg-black/50 border border-slate-800">
          <video
            ref={videoRef}
            poster={posterSrc}
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={webmSrc} type="video/webm" />
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Play Button Overlay */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              aria-label="Play video"
            >
              <div className="w-16 h-16 rounded-full bg-[#ff7e67] flex items-center justify-center transform hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </button>
          )}

          {/* Pause Button */}
          {isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-[#ff7e67]/90 hover:bg-[#ff7e67] text-white text-sm font-semibold transition-colors flex items-center gap-2"
              aria-label="Pause video"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.75 1a.75.75 0 00-.75.75v16.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V1.75a.75.75 0 00-.75-.75h-1.5zm8 0a.75.75 0 00-.75.75v16.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V1.75a.75.75 0 00-.75-.75h-1.5z" />
              </svg>
              Pause
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
