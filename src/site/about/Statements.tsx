const statement =
  'font-serif font-[350] text-[clamp(1.5rem,1.05rem+1.4vw,2.125rem)] leading-[1.32] tracking-[-0.012em] text-pretty max-w-[28em]';

interface Item {
  id: string;
  title: string;
  text: string;
}

/** Vision and mission, each set as one large serif statement under a ruled heading. */
export function Statements({ items }: { items: Item[] }) {
  const shown = items.filter((i) => i.text.trim());
  if (shown.length === 0) return null;
  return (
    <div>
      {shown.map((s) => (
        <section key={s.id} aria-labelledby={s.id} className="grid gap-5 border-t border-midnight/25 py-10 first:pt-10 last:pb-0 lg:grid-cols-12 lg:gap-10 lg:py-14 lg:last:pb-0">
          <h2 id={s.id} className="t-h3 lg:col-span-3">
            {s.title}
          </h2>
          <p className={`${statement} lg:col-span-9`}>{s.text}</p>
        </section>
      ))}
    </div>
  );
}
