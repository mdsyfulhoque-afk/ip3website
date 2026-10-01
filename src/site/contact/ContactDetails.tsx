import { isTbc, useContent } from '../../content';
import { DetailRow as Row } from './shared';

const linkClass = 'text-teal-deep underline underline-offset-4';

/** How else to reach the studio. Every row is dropped when its content is empty or still "to be confirmed". */
export function ContactDetails() {
  const { contact } = useContent();
  const has = (v: string | undefined) => Boolean(v && v.trim() && !isTbc(v));

  const address = contact.address.filter((l) => has(l));
  const social = contact.social.filter((s) => has(s.label) && has(s.href));
  const mapHref = has(contact.mapQuery)
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.mapQuery)}`
    : null;
  const tel = has(contact.phone) ? contact.phone.replace(/[^\d+]/g, '') : '';

  return (
    <aside aria-labelledby="contact-details-title" className="lg:sticky lg:top-28">
      <h2 id="contact-details-title" className="t-h3">
        Contact details
      </h2>
      <dl className="mt-5 border-b border-midnight/20">
        {has(contact.email) ? (
          <Row label="Email">
            <a href={`mailto:${contact.email}`} className={`${linkClass} inline-flex min-h-11 items-center break-all`}>
              {contact.email}
            </a>
          </Row>
        ) : null}
        {tel ? (
          <Row label="Phone">
            <a href={`tel:${tel}`} className={`${linkClass} inline-flex min-h-11 items-center`}>
              {contact.phone}
            </a>
          </Row>
        ) : null}
        {address.length > 0 ? (
          <Row label="Address">
            <address className="not-italic">
              {address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            {mapHref ? (
              <a href={mapHref} target="_blank" rel="noopener noreferrer" className={`${linkClass} t-ui mt-3 inline-flex min-h-11 items-center font-sans font-semibold`}>
                Open in maps<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}
          </Row>
        ) : null}
        {has(contact.hours) ? <Row label="Hours">{contact.hours}</Row> : null}
        {social.length > 0 ? (
          <Row label="Elsewhere">
            <ul className="grid gap-1">
              {social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex min-h-11 items-center`}>
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Row>
        ) : null}
      </dl>
    </aside>
  );
}
