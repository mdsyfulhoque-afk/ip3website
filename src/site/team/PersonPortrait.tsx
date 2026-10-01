import { Monogram } from '../components/ui';
import { initialsOf } from './initials';

interface Subject {
  name: string;
  /** Empty means no photograph: a monogram is drawn instead. */
  portrait: string;
}

const PX = { sm: 40, md: 64, lg: 112 } as const;
const DIMS = { sm: 'h-10 w-10', md: 'h-16 w-16', lg: 'h-28 w-28' } as const;

/** List-sized portrait: the supplied photograph if there is one, otherwise the shared monogram. Decorative, because the name sits beside it. */
export function PersonPortrait({ person, size = 'md' }: { person: Subject; size?: 'sm' | 'md' | 'lg' }) {
  const url = person.portrait.trim();
  if (url) {
    return (
      <img
        src={url}
        alt=""
        width={PX[size]}
        height={PX[size]}
        loading="lazy"
        decoding="async"
        className={`${DIMS[size]} shrink-0 rounded-full border border-teal-deep/40 object-cover`}
      />
    );
  }
  return <Monogram name={person.name} size={size} />;
}

const PLATE = 'h-44 w-44 shrink-0 rounded-full sm:h-52 sm:w-52';

/** The large portrait on a person's own page. A photograph carries the name as its alternative text; the monogram is decorative. */
export function PortraitPlate({ person }: { person: Subject }) {
  const url = person.portrait.trim();
  if (url) {
    return <img src={url} alt={`Portrait of ${person.name}`} width={208} height={208} decoding="async" className={`${PLATE} border border-teal-deep/40 object-cover`} />;
  }
  return (
    <span
      aria-hidden="true"
      className={`${PLATE} inline-flex items-center justify-center border border-teal-deep/40 bg-stone font-serif text-[4.25rem] font-light leading-none text-teal-deep sm:text-[5rem]`}
    >
      {initialsOf(person.name)}
    </span>
  );
}
