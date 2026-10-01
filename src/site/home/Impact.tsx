import type { Ref } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../content';
import {impactOutcomes} from '../../content/journey';
import { SceneShell } from './SceneShell';

export function Impact({ sectionRef }: { sectionRef: Ref<HTMLElement> }) {
  const s = { id: 'impact', ...useContent().home.scenes.impact };
  return (
    <SceneShell id={s.id} sectionRef={sectionRef} title={s.title} last>
      {s.body.map((p) => (
        <p key={p} className="t-body mt-6 max-w-[34rem] text-ivory/90">
          {p}
        </p>
      ))}
      <ul className="mt-8 grid gap-3" aria-label="Public value we aim to demonstrate">
        {impactOutcomes.map((o) => (
          <li key={o.id} className="rounded-[6px] border border-midnight-rule glass p-5">
            <h3 className="t-h3 text-ivory">{o.title}</h3>
            <p className="t-ui mt-2 text-ivory/90">{o.change}</p>
            <p className="t-ui mt-3 text-mist">
              <span className="t-label block text-signal">How it can be shown</span>
              {o.shown}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/about" className="btn btn-solid">
          Meet the institute
        </Link>
        <Link to="/contact" className="btn btn-line">
          Discuss a challenge
        </Link>
      </div>
    </SceneShell>
  );
}
