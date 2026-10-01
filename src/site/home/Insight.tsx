import type { Ref } from 'react';
import { useContent } from '../../content';

import { CostBenefitChart } from '../figures/CostBenefitChart';
import { ImpactChart } from '../figures/ImpactChart';
import { SceneShell } from './SceneShell';

export function Insight({ sectionRef }: { sectionRef: Ref<HTMLElement> }) {
  const s = { id: 'insight', ...useContent().home.scenes.insight };
  return (
    <SceneShell id={s.id} sectionRef={sectionRef} title={s.title} wide>
      {s.body.map((p) => (
        <p key={p} className="t-body mt-6 max-w-[34rem] text-ivory/90">
          {p}
        </p>
      ))}
      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-[6px] border border-midnight-rule glass p-5 sm:p-7">
          <ImpactChart />
        </div>
        <div className="rounded-[6px] border border-midnight-rule glass p-5 sm:p-7">
          <CostBenefitChart />
        </div>
      </div>
    </SceneShell>
  );
}
