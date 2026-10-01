import type { Ref } from 'react';
import { useContent } from '../../content';
import {systems} from '../../content/journey';
import { useMotion } from '../../lib/motion';
import { storyStore, useFocus } from '../../lib/storyStore';
import { LayerStack } from '../figures/LayerStack';
import { SceneShell } from './SceneShell';

export function Complexity({ sectionRef }: { sectionRef: Ref<HTMLElement> }) {
  const { use3D } = useMotion();
  const focus = useFocus();
  const active = focus && focus.group === 'systems' ? focus.index : null;
  const current = active !== null ? systems[active]! : null;
  const s = { id: 'complexity', ...useContent().home.scenes.complexity };

  const related = (i: number) => systems[i]!.relates.map((r) => systems.findIndex((x) => x.id === r));

  return (
    <SceneShell id={s.id} sectionRef={sectionRef} title={s.title}>
      {s.body.map((p) => (
        <p key={p} className="t-body mt-5 text-ivory/90 first:mt-6">
          {p}
        </p>
      ))}

      {!use3D ? <LayerStack items={systems} group="systems" relatedOf={related} caption="Six systems drawn as stacked layers: economy, climate, education, cities, energy and institutions." /> : null}

      <ul className="mt-8 flex flex-wrap gap-2" aria-label="Systems">
        {systems.map((sys, i) => {
          const pressed = active === i;
          return (
            <li key={sys.id}>
              <button
                type="button"
                aria-pressed={pressed}
                onClick={() => storyStore.setFocus(pressed ? null : { group: 'systems', index: i })}
                className={`t-label min-h-11 rounded-full border px-4 transition-colors ${
                  pressed
                    ? 'border-ivory bg-ivory text-midnight'
                    : 'border-ivory/40 bg-midnight/60 text-ivory hover:border-ivory hover:bg-ivory/10'
                }`}
              >
                {sys.name}
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite" className="mt-5 min-h-[7.5rem] max-w-[32rem]">
        {current ? (
          <>
            <p className="t-ui text-ivory">{current.note}</p>
            <p className="t-ui mt-3 text-mist">
              Tied to{' '}
              {current.relates
                .map((r) => systems.find((x) => x.id === r)!.name.toLowerCase())
                .reduce<string[]>((acc, name, i, arr) => {
                  acc.push(i === 0 ? name : i === arr.length - 1 ? ` and ${name}` : `, ${name}`);
                  return acc;
                }, [])
                .join('')}
              .
            </p>
          </>
        ) : null}
      </div>
    </SceneShell>
  );
}
