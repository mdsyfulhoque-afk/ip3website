interface Item {
  title: string;
  text: string;
}

/** A ruled list: the title sits in the margin column and the explanation reads beside it. */
export function PrincipleList({ items, tone = 'paper' }: { items: Item[]; tone?: 'paper' | 'night' }) {
  const night = tone === 'night';
  const rule = night ? 'border-midnight-rule' : 'border-midnight/20';
  return (
    <ul role="list" className={`border-b ${rule}`}>
      {items.map((p) => (
        <li key={p.title} className={`gs-card grid gap-3 border-t ${rule} py-8 lg:grid-cols-12 lg:gap-10 lg:py-10`}>
          <h3 className={`t-h3 lg:col-span-4 ${night ? 'text-ivory' : ''}`}>{p.title}</h3>
          <p className={`t-body lg:col-span-7 lg:col-start-6 ${night ? 'text-mist' : ''}`}>{p.text}</p>
        </li>
      ))}
    </ul>
  );
}
