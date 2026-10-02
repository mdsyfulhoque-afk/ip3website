import { Photo } from '../components/Photo';

const KEYS = ['findings-2024', 'roundtable-2019', 'mission-2021', 'workshop-wall', 'fsi-lecture-2013'];

/** Real photographs of the team at work: consultations, field missions, workshops and training. */
export function AtWork() {
  return (
    <section aria-labelledby="at-work-title" className="on-night band border-t border-midnight-rule">
      <div className="wrap">
        <div className="max-w-[44rem]">
          <h2 id="at-work-title" className="t-h2">
            In the room
          </h2>
          <p className="t-lead mt-4 text-mist">Consultations, field missions, design workshops and training: where evidence meets the people who will use it.</p>
        </div>
        <div className="mt-12 grid gap-x-6 gap-y-10 text-mist sm:grid-cols-2 lg:grid-cols-3">
          {KEYS.map((k, i) => (
            <Photo
              key={k}
              photoKey={k}
              className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}
              // The wide photo spans two columns at 2:1; its neighbour is square so the first row lines up.
              imgClassName={i === 0 ? 'aspect-[16/9] lg:aspect-[2/1]' : i === 1 ? 'aspect-[4/3] lg:aspect-square' : 'aspect-[4/3]'}
              sizes={i === 0 ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
