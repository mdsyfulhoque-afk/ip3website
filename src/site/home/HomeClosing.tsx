import { Link } from 'react-router-dom';
import { useContent } from '../../content';

export function HomeClosing() {
  const { home, contact } = useContent();
  const c = home.closing;
  return (
    <section id="start" aria-labelledby="closing-title" className="on-stone band">
      <div className="wrap grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 id="closing-title" className="t-h2 max-w-[22ch]">
            {c.heading}
          </h2>
          <p className="t-lead mt-6 max-w-[36rem] text-ink-soft">{c.sub}</p>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end">
          <Link to={c.cta.href} className="btn btn-ink">
            {c.cta.label}
          </Link>
          <p className="t-ui mt-4 text-ink-soft">
            Or write to{' '}
            <a href={`mailto:${contact.email}`} className="text-teal-deep underline underline-offset-4">
              {contact.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
