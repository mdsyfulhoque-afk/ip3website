import type { ReactNode, Ref } from 'react';

interface SceneShellProps {
  id: string;
  sectionRef: Ref<HTMLElement>;
  title: string;
  children: ReactNode;
  /** Wide scenes carry diagrams and use the full grid instead of the left text column. */
  wide?: boolean;
  /** Extra bottom room so the final scene can rest before the page turns to paper. */
  last?: boolean;
}

/**
 * One scene of the journey. The text is ordinary document flow, so the story reads
 * the same whether or not the 3D scene is running.
 */
export function SceneShell({ id, sectionRef, title, children, wide, last }: SceneShellProps) {
  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scene relative flex min-h-[100svh] items-end lg:items-center ${last ? 'pb-[16svh]' : ''}`}
    >
      <div className={`${wide ? 'scrim-wide' : 'scrim-left'} pointer-events-none absolute inset-0`} aria-hidden="true" />
      <div className="scene-pad wrap relative py-[8svh] lg:py-[12svh]">
        <div className={wide ? '' : 'max-w-[34rem] lg:max-w-[36rem]'}>
          <h2 id={`${id}-title`} className={`t-scene text-ivory ${wide ? 'max-w-[34rem] lg:max-w-[40rem]' : ''}`}>
            {title}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}
