import type { Ref } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../content';

export function Hero({ sectionRef }: { sectionRef: Ref<HTMLElement> }) {
  const { home, sectors, services } = useContent();
  const { hero } = home;
  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="hero relative flex min-h-[100svh] flex-col justify-end pb-[clamp(5rem,12svh,7rem)] pt-32 lg:justify-center lg:pb-24"
    >
      <div className="scrim-left pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="wrap relative">
        <h1 id="hero-title" className="t-display max-w-[15ch] text-ivory sm:max-w-[16ch] lg:max-w-[14ch] xl:max-w-[15ch]">
          {hero.headline}
        </h1>
        <p className="t-lead mt-6 max-w-[32rem] text-ivory/90 sm:mt-8">{hero.support}</p>
        <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
          <Link to={hero.primary.href} className="btn btn-solid">
            {hero.primary.label}
          </Link>
          <Link to={hero.secondary.href} className="btn btn-line">
            {hero.secondary.label}
          </Link>
        </div>
        <p className="t-ui mt-10 max-w-[36rem] text-mist sm:mt-12">{hero.audience}</p>
        <p className="t-ui mt-3 max-w-[36rem] text-mist">
          Or go straight to our{' '}
          <Link to="/sectors" className="text-ivory underline underline-offset-4">
            {sectors.length} sectors
          </Link>{' '}
          and{' '}
          <Link to="/services" className="text-ivory underline underline-offset-4">
            {services.length} services
          </Link>
          .
        </p>
      </div>

      <a
        href="#complexity"
        className="scroll-cue absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-mist no-underline sm:flex"
        aria-label="Scroll to the story"
      >
        <span className="t-label">Scroll</span>
        <span className="relative block h-9 w-px overflow-hidden bg-mist/30" aria-hidden="true">
          <span className="scroll-cue-dot absolute left-0 top-0 block h-3 w-px bg-signal" />
        </span>
      </a>
    </section>
  );
}
