import type { Ref } from 'react';
import { useContent } from '../../content';
import {evidenceLayers} from '../../content/journey';
import { useMotion } from '../../lib/motion';
import { storyStore, useFocus } from '../../lib/storyStore';
import { LayerStack } from '../figures/LayerStack';
import { SceneShell } from './SceneShell';

export function Evidence({ sectionRef }: { sectionRef: Ref<HTMLElement> }) {
  const { use3D } = useMotion();
  const focus = useFocus();
  const active = focus && focus.group === 'evidence' ? focus.index : null;
  const s = { id: 'evidence', ...useContent().home.scenes.evidence };

  return (
    <SceneShell id={s.id} sectionRef={sectionRef} title={s.title}>
      {s.body.map((p) => (
        <p key={p} className="t-body mt-5 text-ivory/90 first:mt-6">
          {p}
        </p>
      ))}

      {!use3D ? <LayerStack items={evidenceLayers} group="evidence" caption="Five evidence layers: field research, survey data, administrative data, maps and spatial data, and evaluation methods." /> : null}

      <ul className="mt-8 grid gap-2" aria-label="Kinds of evidence">
        {evidenceLayers.map((layer, i) => {
          const pressed = active === i;
          return (
            <li key={layer.id}>
              <button
                type="button"
                aria-pressed={pressed}
                onClick={() => storyStore.setFocus(pressed ? null : { group: 'evidence', index: i })}
                className={`w-full rounded-[4px] border px-4 py-3 text-left transition-colors ${
                  pressed
                    ? 'border-signal bg-midnight-raised'
                    : 'border-midnight-rule bg-midnight/70 hover:border-signal/60'
                }`}
              >
                <span className={`t-label block ${pressed ? 'text-signal' : 'text-ivory'}`}>{layer.name}</span>
                <span className="t-ui mt-0.5 block text-mist">{layer.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </SceneShell>
  );
}
