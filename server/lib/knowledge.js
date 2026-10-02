import siteContent from '../generated/site-content.json' with { type: 'json' };

/**
 * The Ask IP3 assistant's knowledge: the site's own content turned into plain text with page addresses.
 * Nothing else is given to the model, so it can only answer from what the site publishes.
 */

const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Same rule as src/content/merge.ts: objects merge key by key, arrays and strings replace whole. */
function overlay(base, over) {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) return Array.isArray(over) ? over : base;
  if (isObject(base)) {
    if (!isObject(over)) return base;
    const out = { ...base };
    for (const key of Object.keys(over)) out[key] = key in out ? overlay(out[key], over[key]) : over[key];
    return out;
  }
  return typeof over === typeof base ? over : base;
}

/** Bundled content with the published copy from the database (`{ content: … }`) laid over it. */
export function siteContentFrom(published) {
  return isObject(published) && isObject(published.content) ? overlay(siteContent, published.content) : siteContent;
}

const tbc = (v) => !v || /to be confirmed|^tbc$|^n\/a$/i.test(String(v).trim());
const line = (label, v) => (tbc(v) ? '' : `${label}: ${v}\n`);
const list = (items) => items.filter(Boolean).map((i) => `- ${i}`).join('\n');

/** The knowledge text. Stable for a given content version, so the prompt cache keeps hitting. */
export function buildKnowledge(c) {
  const out = [];
  const published = (xs) => (xs || []).filter((x) => !x.status || x.status === 'published');

  out.push(`# ${c.identity.name} (${c.identity.descriptor})\n${c.identity.description}\nHome page: /`);
  out.push(`## About (/about)\n${c.about.lead}\n${(c.about.body || []).join('\n')}\nVision: ${c.about.vision}\nMission: ${c.about.mission}`);
  if (c.about.worksWith?.names?.length) out.push(`Institutions IP3 may name as clients: ${c.about.worksWith.names.join(', ')}.`);

  out.push(
    `## Focus areas (/focus)\n${c.domains
      .map((d) => `### ${d.title} (/focus/${d.slug})\n${d.short}\n${(d.intro || []).join(' ')}\nAreas: ${(d.areas || []).map((a) => a.title).join('; ')}`)
      .join('\n')}`,
  );
  out.push(`## Sectors (/sectors)\n${c.sectors.map((s) => `- ${s.name} (/sectors/${s.slug}): ${s.summary}`).join('\n')}`);
  out.push(
    `## Services (/services)\n${c.services
      .map((s) => `### ${s.title} (/services/${s.slug})\n${s.short}\nOffers: ${(s.offers || []).map((o) => o.title).join('; ')}\nDeliverables: ${(s.deliverables || []).join('; ')}`)
      .join('\n')}`,
  );
  out.push(`## Approach (/approach)\n${(c.method.movements || []).map((m) => `- ${m.title}: ${m.text}`).join('\n')}`);

  const work = published(c.portfolio).filter((e) => !tbc(e.title));
  out.push(
    `## Portfolio: ${work.length} assignments (/work; each has a case story page)\n${work
      .map(
        (e) =>
          `### ${e.title} (/work/${e.id})\n${line('Client', e.client)}${line('Role', e.role)}${line('Period', e.period)}${line('Place', e.place)}${e.summary}\n${
            e.challenge ? `Challenge: ${e.challenge}\n` : ''
          }${e.approach?.length ? `What IP3 did:\n${list(e.approach)}\n` : ''}`,
      )
      .join('\n')}`,
  );

  const people = published(c.people);
  out.push(
    `## People (/people)\n${people
      .map((p) => `- ${p.name}, ${p.role} (/people/${p.slug}). ${p.summary} ${p.affiliation ? `Affiliation: ${p.affiliation}.` : ''} Practice: ${(p.practice || []).join(', ')}.`)
      .join('\n')}`,
  );

  const insights = published(c.insights);
  if (insights.length) {
    out.push(`## Insights: publications (/insights)\n${insights.map((i) => `- ${i.title} (${i.kind}, ${i.publisher}, ${i.year}). ${i.summary}${i.href ? ` Link: ${i.href}` : ''}`).join('\n')}`);
  }

  const ct = c.contact;
  out.push(
    `## Contact (/contact)\nEmail: ${ct.email}\n${line('Phone', ct.phone)}Address: ${ct.address.join(', ')}\nHours: ${ct.hours}\nThe contact page has an enquiry form and lets visitors book a ${
      ct.consultation.durationMinutes
    }-minute consultation (Dhaka time); the team confirms each booking by email with a link to join.\nBangla summary page: /bn`,
  );
  return out.join('\n\n');
}
