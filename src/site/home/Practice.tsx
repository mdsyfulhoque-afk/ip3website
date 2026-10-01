import type { Ref } from 'react';
import { useContent } from '../../content';
import {practiceStages} from '../../content/journey';
import { Flow } from '../figures/Flow';
import { SceneShell } from './SceneShell';

export function Practice({ sectionRef }: { sectionRef: Ref<HTMLElement> }) {
  const s = { id: 'practice', ...useContent().home.scenes.practice };
  return (
    <SceneShell id={s.id} sectionRef={sectionRef} title={s.title} wide>
      {s.body.map((p) => (
        <p key={p} className="t-body mt-6 max-w-[34rem] text-ivory/90">
          {p}
        </p>
      ))}
      <div className="mt-10 rounded-[6px] border border-midnight-rule glass p-5 sm:p-8">
        <Flow items={practiceStages} label="How a policy decision reaches people" />
      </div>
    </SceneShell>
  );
}
