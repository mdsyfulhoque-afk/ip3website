import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { SlideItem } from '../types';
import { VideoModal } from './VideoModal';
import { GetStartedModal } from './GetStartedModal';
import { useCMS } from '../context/CMSContext';

const FALLBACK_SLIDE_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
  2: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop',
  3: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1200&auto=format&fit=crop',
  4: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop',
  5: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
  6: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?q=80&w=1200&auto=format&fit=crop',
  7: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
};

interface PresentationSliderProps {
  slides?: SlideItem[];
  currentSlideId: number;
  onChangeSlide: (id: number) => void;
  autoplayInterval?: number;
}

export const PresentationSlider: React.FC<PresentationSliderProps> = ({
  slides: slidesProp,
  currentSlideId,
  onChangeSlide,
  autoplayInterval = 5000,
}) => {
  const { data } = useCMS();
  // Slides come from MongoDB; the prop is only an explicit override.
  const slides = slidesProp && slidesProp.length > 0 ? slidesProp : data.slides;
  const theme = data.themeConfig || {
    primaryColor: '#ff7e67',
    accentColor: '#2dd4bf',
    heroTitleColor: '#f8fafc',
    heroSubtitleColor: '#94a3b8',
    heroTagColor: '#ff7e67',
    heroButtonBgColor: '#ff7e67',
    heroButtonTextColor: '#070d18',
    heroOverlayStyle: 'none',
  };

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Modal states
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);

  const currentIndex = slides.findIndex((s) => s.id === currentSlideId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentSlide = slides[safeIndex] || slides[0];

  // Dynamic colors resolved from slide-level overrides or global CMS theme settings
  const activeTitleColor = currentSlide.titleColor || theme.heroTitleColor || '#f8fafc';
  const activeSubtitleColor = currentSlide.subtitleColor || theme.heroSubtitleColor || '#94a3b8';
  const activeButtonBg = currentSlide.ctaBgColor || currentSlide.accentColor || theme.heroButtonBgColor || '#ff7e67';
  const activeButtonText = currentSlide.ctaTextColor || theme.heroButtonTextColor || '#070d18';

  const displayImage = currentSlide?.bgImage || FALLBACK_SLIDE_IMAGES[currentSlide?.id] || FALLBACK_SLIDE_IMAGES[1];

  const handleNext = () => {
    setIsAnimating(true);
    const idx = slides.findIndex((s) => s.id === currentSlideId);
    const nxtIdx = (idx + 1) % slides.length;
    onChangeSlide(slides[nxtIdx].id);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    const idx = slides.findIndex((s) => s.id === currentSlideId);
    const prvIdx = (idx - 1 + slides.length) % slides.length;
    onChangeSlide(slides[prvIdx].id);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 400);
  };

  // Autoplay timer with visual progress
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    let stepTimer: ReturnType<typeof setInterval>;

    if (isPlaying && !isVideoOpen && !isGetStartedOpen) {
      const stepMs = 50;
      const increment = (stepMs / autoplayInterval) * 100;

      stepTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + increment;
        });
      }, stepMs);

      timer = setInterval(() => {
        handleNext();
      }, autoplayInterval);
    } else {
      setProgress(0);
    }

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [isPlaying, currentSlideId, isVideoOpen, isGetStartedOpen, autoplayInterval, slides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'p' || e.key === 'P') {
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideId, slides]);

  return (
    <div className="relative w-full h-full min-h-[640px] bg-[#050a12] overflow-hidden select-none font-sans text-slate-100 flex flex-col lg:flex-row items-stretch">
      
      {/* Slide Image Part (Child 1 - div:nth-of-type(1)) - Clean, separate, takes 80% width */}
      <div className="relative w-full lg:w-4/5 lg:basis-4/5 h-[360px] sm:h-[440px] lg:h-full order-1 lg:order-2 overflow-hidden bg-[#020617] flex items-center justify-center flex-1">
        <img
          key={currentSlide.id}
          src={displayImage}
          alt={currentSlide.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-700 ease-out transform ${
            isAnimating ? 'scale-105 opacity-90' : 'scale-100 opacity-100'
          }`}
        />
        {/* Subtle inner edge gradient transition */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#050a12] to-transparent hidden lg:block pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050a12] to-transparent lg:hidden pointer-events-none" />

        {/* Slide Counter Badge */}
        <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050a12]/80 backdrop-blur-md border border-slate-700/60 shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#ff7e67] animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-300">
            {String(safeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Section Content Area Part (Child 2 - div#hero-content-area:nth-of-type(2)) - Exactly 20% width of full section */}
      <div 
        id="hero-content-area"
        className="relative z-10 w-full lg:w-1/5 lg:basis-1/5 lg:max-w-[20%] shrink-0 flex flex-col justify-center items-center p-4 sm:p-5 lg:p-5 xl:p-6 bg-[#050a12] order-2 lg:order-1 overflow-y-auto border-r border-slate-800/80"
      >
        {/* Content Card (Child 1 inside hero-content-area - div#hero-content-card:nth-of-type(1)) */}
        <div 
          id="hero-content-card"
          className={`w-full flex flex-col items-center text-center space-y-4 lg:space-y-5 transition-all duration-500 ease-out transform ${
            isAnimating ? 'scale-[0.98] opacity-0 translate-y-3' : 'scale-100 opacity-100 translate-y-0'
          }`}
        >
          {/* Hero Title */}
          <h1
            className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-serif font-bold tracking-tight leading-[1.2] transition-colors duration-300 text-left w-full"
            style={{
              color: activeTitleColor,
              ...(currentSlide.titleFontSize ? { fontSize: currentSlide.titleFontSize } : {}),
              ...(currentSlide.fontFamily ? { fontFamily: `'${currentSlide.fontFamily}', sans-serif` } : {}),
            }}
          >
            {currentSlide.title}
          </h1>

          {/* Subtitle */}
          {currentSlide.subtitle && (
            <p
              className="text-xs sm:text-sm font-sans font-normal text-slate-300 leading-relaxed transition-colors duration-300 text-left line-clamp-4 lg:line-clamp-6 w-full"
              style={{
                color: activeSubtitleColor,
                ...(currentSlide.subtitleFontSize ? { fontSize: currentSlide.subtitleFontSize } : {}),
              }}
            >
              {currentSlide.subtitle}
            </p>
          )}

          {/* Action Row & Navigation Controls */}
          <div className="pt-2 flex flex-col items-center gap-3 border-t border-slate-800/80 pt-4 w-full">
            <div className="flex flex-col gap-2 w-full items-center">
              <button
                onClick={() => setIsGetStartedOpen(true)}
                style={{
                  backgroundColor: activeButtonBg,
                  color: activeButtonText,
                }}
                className="group w-full px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer border border-[#ff7e67]/50 shadow-md shadow-[#ff7e67]/20"
              >
                <span>{currentSlide.ctaText || 'Get Started'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              {currentSlide.videoUrl && (
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="w-full px-3 py-2 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-slate-800/60 active:scale-[0.98] text-xs font-mono font-medium text-slate-300 border border-slate-700/60 cursor-pointer"
                >
                  <span>Watch Overview</span>
                </button>
              )}
            </div>

            {/* Slide Navigation Prev / Next Controls & Slide Count */}
            <div className="flex items-center justify-between gap-2 pt-1 w-full">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  aria-label="Previous slide"
                  className="w-8 h-8 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/70 flex items-center justify-center text-slate-200 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleNext}
                  aria-label="Next slide"
                  className="w-8 h-8 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/70 flex items-center justify-center text-slate-200 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                {String(safeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Interactive Progress Pagination Bars */}
          <div className="flex items-center justify-center gap-1.5 pt-1 w-full overflow-hidden">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setIsAnimating(true);
                  onChangeSlide(s.id);
                  setProgress(0);
                  setTimeout(() => setIsAnimating(false), 400);
                }}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer relative overflow-hidden flex-1 ${
                  idx === safeIndex ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-600'
                }`}
                aria-label={`Jump to slide ${idx + 1}`}
              >
                {idx === safeIndex && (
                  <span
                    className="absolute inset-y-0 left-0 bg-[#ff7e67] transition-all duration-100 rounded-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        slide={currentSlide}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />

      {/* Get Started Modal */}
      <GetStartedModal
        slide={currentSlide}
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />

    </div>
  );
};

export default PresentationSlider;

