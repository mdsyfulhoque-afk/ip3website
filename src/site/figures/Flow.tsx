import type { ReactNode } from 'react';

export interface FlowItem {
  id: string;
  title: string;
  text: string;
  choices?: readonly string[];
}

interface FlowProps {
  items: readonly FlowItem[];
  /** The last step is the point of the sequence (a decision, people reached) and takes the amber accent. */
  accentLast?: boolean;
  label: string;
  footer?: ReactNode;
}

/**
 * A true sequence: steps connected by a line. Horizontal on wide screens, vertical on narrow ones.
 * Rendered as an ordered list so the order is announced.
 */
export function Flow({ items, accentLast = true, label }: FlowProps) {
  return (
    <ol aria-label={label} className="flow mt-8 grid gap-0 lg:mt-10 lg:gap-6" style={{ ['--cols' as string]: items.length }}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const accent = accentLast && last;
        return (
          <li key={item.id} className="flow-item relative pb-8 pl-9 lg:pb-0 lg:pl-0 lg:pt-9">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1 block h-3.5 w-3.5 rounded-full border-2 lg:top-0 ${
                accent ? 'border-amber bg-amber' : 'border-signal bg-midnight'
              }`}
            />
            {!last ? <span aria-hidden="true" className="flow-line absolute bg-midnight-rule" /> : null}
            <h3 className={`t-h3 ${accent ? 'text-amber' : 'text-ivory'}`}>{item.title}</h3>
            <p className="t-ui mt-2 text-mist">{item.text}</p>
            {item.choices ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {item.choices.map((c) => (
                  <li key={c} className="t-label rounded-full border border-midnight-rule bg-midnight-raised px-3 py-1 font-medium text-ivory/90">
                    {c}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
