import { Link } from 'react-router-dom';
import type { Sector, ServiceLine } from '../../content';
import { plainTitle } from './serviceUtils';

/**
 * Which sectors each service line is most often used in.
 * From 1360px up it is a real table (row and column headers, one mark per cell); below that,
 * eight narrow columns cannot hold readable sector names, so each service lists its sectors instead.
 */
export function ServiceMatrix({ services, sectors }: { services: ServiceLine[]; sectors: Sector[] }) {
  const used = (service: ServiceLine, slug: string) => service.sectors.includes(slug);

  return (
    <>
      <table className="mt-14 hidden w-full table-fixed border-collapse text-left min-[1360px]:table">
        <caption className="sr-only">Sectors in which each service line is most often used</caption>
        <colgroup>
          <col className="w-[15rem] min-[1500px]:w-[19rem]" />
          {sectors.map((s) => (
            <col key={s.slug} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="pb-5 align-bottom">
              <span className="sr-only">Service line</span>
            </th>
            {sectors.map((s) => (
              <th key={s.slug} scope="col" className="border-l border-midnight-rule/70 px-3 pb-5 align-bottom font-normal leading-snug">
                <Link
                  to={`/sectors/${s.slug}`}
                  className="t-label text-[0.8125rem] text-mist underline decoration-transparent underline-offset-4 transition-colors [overflow-wrap:anywhere] hover:text-ivory hover:decoration-current"
                >
                  {s.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map((svc) => (
            <tr key={svc.slug} className="border-t border-midnight-rule transition-colors hover:bg-midnight-raised/60">
              <th scope="row" className="py-6 pr-8 text-left align-middle font-normal">
                <Link
                  to={`/services/${svc.slug}`}
                  className="font-serif text-xl leading-snug text-ivory underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:decoration-current"
                >
                  {plainTitle(svc.title)}
                </Link>
              </th>
              {sectors.map((s) => (
                <td key={s.slug} className="border-l border-midnight-rule/70 px-3 py-6 align-middle">
                  {used(svc, s.slug) ? (
                    <>
                      <span aria-hidden="true" className="block h-3.5 w-3.5 rounded-full bg-signal" />
                      <span className="sr-only">Most often used</span>
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true" className="block h-px w-3.5 bg-midnight-rule" />
                      <span className="sr-only">Not listed</span>
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="mt-12 border-t border-midnight-rule min-[1360px]:hidden">
        {services.map((svc) => {
          const names = svc.sectors.map((slug) => sectors.find((s) => s.slug === slug)).filter((s): s is Sector => Boolean(s));
          return (
            <li key={svc.slug} className="border-b border-midnight-rule py-7">
              <h3 className="font-serif text-xl leading-snug">
                <Link to={`/services/${svc.slug}`} className="underline decoration-transparent decoration-1 underline-offset-4 hover:decoration-current">
                  {plainTitle(svc.title)}
                </Link>
              </h3>
              {names.length ? (
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Sectors for ${plainTitle(svc.title)}`}>
                  {names.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/sectors/${s.slug}`}
                        className="t-label inline-flex min-h-11 items-center rounded-full border border-midnight-rule px-4 py-1.5 text-mist transition-colors hover:border-ivory hover:text-ivory"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}
