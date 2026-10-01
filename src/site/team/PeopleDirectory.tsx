import { Link } from 'react-router-dom';
import type { PeopleGroup } from './groups';
import { PersonPortrait } from './PersonPortrait';

/**
 * A ruled directory in the manner of an institute's faculty page: each group has its heading in the margin,
 * each person is one row, and the whole row is one link (the name is the accessible name and the only tab stop).
 */
export function PeopleDirectory({ groups }: { groups: PeopleGroup[] }) {
  return (
    <div className="grid gap-y-16 md:gap-y-20">
      {groups.map((g) => {
        const headingId = `people-group-${g.group}`;
        return (
          <section key={g.group} aria-labelledby={headingId} className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
            <h2 id={headingId} className="font-serif text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-[400] leading-tight tracking-[-0.012em] lg:col-span-3">
              {g.label}
            </h2>
            <ul className="border-t border-midnight/25 lg:col-span-9">
              {g.people.map((p) => (
                <li key={p.slug} className="group relative border-b border-midnight/20 transition-colors focus-within:bg-white/60 hover:bg-white/60">
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 gap-y-3 px-1 py-6 sm:px-3 md:py-7 lg:grid-cols-[auto_minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-x-8">
                    <PersonPortrait person={p} size="md" />
                    <div>
                      <h3 className="font-serif text-[1.375rem] font-[420] leading-snug tracking-[-0.01em] sm:text-[1.625rem]">
                        <Link
                          to={`/people/${p.slug}`}
                          className="underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors after:absolute after:inset-0 group-hover:text-teal-deep group-hover:decoration-current"
                        >
                          {p.name}
                        </Link>
                      </h3>
                      <p className="t-ui mt-1 text-ink-soft">{p.role}</p>
                    </div>
                    {p.practice.length > 0 ? (
                      <p className="t-ui col-start-2 text-ink-soft lg:col-start-3 lg:pt-1.5">
                        <span className="sr-only">Practice areas: </span>
                        {p.practice.join(', ')}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
