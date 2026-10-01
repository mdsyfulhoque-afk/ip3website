interface Audience {
  name: string;
  text: string;
}

/** Who IP3 works with: a two-column ruled list, so the four entries read as one list, not four cards. */
export function AudienceList({ items }: { items: Audience[] }) {
  return (
    <ul role="list" className="grid md:grid-cols-2 md:gap-x-12">
      {items.map((a) => (
        <li key={a.name} className="border-t border-midnight/25 py-7 md:py-8">
          <h3 className="t-h3">{a.name}</h3>
          <p className="t-ui mt-3 max-w-[34rem] text-ink-soft">{a.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** Institutions IP3 has confirmed it may name. A plain list in type, not a wall of logos. */
export function WorksWith({ heading, names, note }: { heading: string; names: string[]; note: string }) {
  if (names.length === 0) return null;
  return (
    <section aria-labelledby="works-with-title" className="mt-12 grid gap-5 border-t border-midnight/25 pt-8 lg:mt-16 lg:grid-cols-12 lg:gap-10">
      <h3 id="works-with-title" className="t-h3 lg:col-span-4">
        {heading}
      </h3>
      <div className="lg:col-span-8">
        <ul role="list" className="flex flex-wrap gap-x-10 gap-y-2 font-serif text-[clamp(1.25rem,1.05rem+0.9vw,1.75rem)] leading-snug">
          {names.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        {note ? <p className="t-ui mt-5 text-ink-soft">{note}</p> : null}
      </div>
    </section>
  );
}
