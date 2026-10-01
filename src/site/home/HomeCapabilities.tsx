import { useEffect } from 'react';
import { useContent } from '../../content';
import { Dots, SectionHead } from '../components/ui';

/** The six things clients hire IP3 for, each written as the client's problem. Native <details>, so it works without JavaScript. */
export function HomeCapabilities() {
  const { home, capabilities } = useContent();

  // A link such as /#capability-diagnose opens that row. Without JavaScript the first row is open and the rest are one click away.
  useEffect(() => {
    const openTarget = () => {
      const el = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (el?.id.startsWith('capability-')) el.querySelector('details')?.setAttribute('open', '');
    };
    openTarget();
    window.addEventListener('hashchange', openTarget);
    return () => window.removeEventListener('hashchange', openTarget);
  }, []);

  return (
    <section id="what-we-do" aria-labelledby="what-we-do-title" className="on-paper band">
      <div className="wrap">
        <SectionHead id="what-we-do-title" title={home.capabilitiesHeading} lead={home.capabilitiesSub} />
        <ul className="mt-12 border-t border-midnight/20 lg:mt-16">
          {capabilities.map((c, i) => (
            <li key={c.slug} id={`capability-${c.slug}`} className="border-b border-midnight/20">
              <details className="group" open={i === 0}>
                <summary className="grid cursor-pointer gap-2 py-7 pr-1 md:grid-cols-12 md:gap-6 md:py-9">
                  <span className="t-label text-teal-deep md:col-span-2 md:pt-2">{c.label}</span>
                  <span className="md:col-span-9">
                    <span className="t-h3 block">{c.title}</span>
                    <span className="mt-2 block font-serif text-lg italic leading-snug text-ink-soft sm:text-xl">“{c.need}”</span>
                  </span>
                  <span aria-hidden="true" className="hidden justify-self-end md:col-span-1 md:block">
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-midnight/30">
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                        <path d="M2 6 H10" />
                        <path d="M6 2 V10" className="transition-opacity group-open:opacity-0" />
                      </svg>
                    </span>
                  </span>
                </summary>
                <div className="grid gap-6 pb-10 md:grid-cols-12 md:gap-6">
                  <p className="t-body md:col-span-5 md:col-start-3">{c.text}</p>
                  <div className="md:col-span-5">
                    <p className="t-label text-teal-deep">What you receive</p>
                    <div className="mt-3">
                      <Dots items={c.deliverables} />
                    </div>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
