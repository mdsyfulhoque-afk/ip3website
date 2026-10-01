import { useContent } from '../../content';
import { Seo } from '../Seo';
import { Band, PageHero } from '../components/ui';

export function Privacy() {
  const { legal, contact } = useContent();
  const p = legal.privacy;
  return (
    <>
      <Seo title="Privacy" description="What this website collects when you send an enquiry or book a conversation, and what we do with it." path="/privacy" />
      <PageHero
        title="Privacy"
        lead="What this website collects when you contact us, and what we do with it."
        trail={[{ label: 'Home', to: '/' }, { label: 'Privacy' }]}
        anchor="right bottom"
      />
      <Band tone="paper" labelledBy="page-title">
        <div className="max-w-[44rem]">
          <p className="t-ui text-ink-soft">Last updated {p.updated}</p>
          {p.sections.map((s) => (
            <section key={s.title} className="mt-10">
              <h2 className="t-h3">{s.title}</h2>
              {s.text.map((t) => (
                <p key={t} className="t-body mt-3">
                  {t}
                </p>
              ))}
            </section>
          ))}
          <p className="t-body mt-12">
            Questions about this page: <a href={`mailto:${contact.email}`} className="text-teal-deep underline underline-offset-4">{contact.email}</a>.
          </p>
        </div>
      </Band>
    </>
  );
}
