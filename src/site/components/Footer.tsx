import { Link } from 'react-router-dom';
import { useContent } from '../../content';
import { LogoMark } from './LogoMark';

export function Footer() {
  const { identity, contact, domains, services } = useContent();
  const year = new Date().getFullYear();

  const col = 'grid gap-0.5';
  const link = 't-ui inline-flex min-h-11 items-center text-ivory no-underline hover:text-signal md:min-h-9';

  return (
    <footer className="bg-midnight-deep text-ivory">
      <div className="wrap grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Link to="/" className="inline-flex items-center gap-3 no-underline" aria-label={`${identity.name}, home`}>
            <LogoMark className="h-9 w-9" />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-2xl font-semibold tracking-tight">{identity.shortName}</span>
              <span className="t-label mt-1 font-medium text-mist">{identity.descriptor}</span>
            </span>
          </Link>
          <p className="t-ui mt-5 max-w-[26rem] text-mist">Independent policy analysis, action research and management consulting.</p>
          <address className="t-ui mt-6 not-italic text-ivory/90">
            {contact.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>

        <nav aria-label="Focus areas" className="md:col-span-2">
          <p className="t-label text-mist">Focus areas</p>
          <ul className={`mt-3 ${col}`}>
            {domains.map((d) => (
              <li key={d.slug}>
                <Link to={`/focus/${d.slug}`} className={link}>
                  {d.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/sectors" className={link}>
                Eight sectors
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Services" className="md:col-span-3">
          <p className="t-label text-mist">Services</p>
          <ul className={`mt-3 ${col}`}>
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className={link}>
                  {s.title.replace(/ \(.*\)$/, '')}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="t-label text-mist">Institute</p>
          <ul className={`mt-3 ${col}`}>
            {[
              ['Approach', '/approach'],
              ['People', '/people'],
              ['About', '/about'],
              ['Contact', '/contact'],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to!} className={link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="t-ui mt-4">
            <a href={`mailto:${contact.email}`} className="text-signal underline underline-offset-4">
              {contact.email}
            </a>
          </p>
          {contact.social.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-x-5">
              {contact.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} rel="noopener noreferrer" className="t-ui text-ivory underline underline-offset-4">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <div className="border-t border-midnight-rule">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-4">
          <p className="t-ui text-mist">
            © {year} {identity.name}
          </p>
          <Link to="/privacy" className="t-ui inline-flex min-h-11 items-center text-ivory no-underline hover:text-signal">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
