import type { Ref } from 'react';
import { useContent } from '../../content';
import {policyPath} from '../../content/journey';
import { Flow } from '../figures/Flow';
import { SceneShell } from './SceneShell';

export function Policy({ sectionRef }: { sectionRef: Ref<HTMLElement> }) {
  const home = useContent().home;
  const s = { id: 'policy', ...home.scenes.policy };
  return (
    <SceneShell id={s.id} sectionRef={sectionRef} title={s.title} wide>
      {s.body.map((p) => (
        <p key={p} className="t-body mt-6 max-w-[34rem] text-ivory/90">
          {p}
        </p>
      ))}
      <div className="mt-10 rounded-[6px] border border-midnight-rule glass p-5 sm:p-8">
        <p className="t-label text-mist">{home.policyExample}</p>
        <Flow items={policyPath.steps} label="From findings to an institutional decision" />
      </div>
    </SceneShell>
  );
}
