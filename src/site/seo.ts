import { phoneNumbers } from '../content/merge';
import type { SiteContent } from '../content/types';

export interface HeadData {
  title: string;
  description: string;
  /** Path starting with "/", used for the canonical URL. */
  path: string;
  noindex?: boolean;
  image?: string;
  jsonLd?: Record<string, unknown>[];
}

export type HeadTag =
  | { tag: 'title'; text: string }
  | { tag: 'meta'; attrs: Record<string, string> }
  | { tag: 'link'; attrs: Record<string, string> }
  | { tag: 'script'; attrs: Record<string, string>; text: string };

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '');

export function origin(content: SiteContent): string {
  return SITE_URL || content.identity.url.replace(/\/+$/, '');
}

export function pageTitle(content: SiteContent, title: string): string {
  const name = content.identity.name;
  return !title || title === name ? `${name}: ${content.identity.descriptor}` : `${title} | ${name}`;
}

/** Search results show about 155 characters, so a longer description is cut at a word boundary. */
export function clipDescription(text: string, max = 158): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : cut.length).replace(/[,;:.\s]+$/, '')}…`;
}

/** Everything that belongs in <head> for a page. One definition, used by the prerenderer and by the browser. */
export function headTags(content: SiteContent, data: HeadData): HeadTag[] {
  const base = origin(content);
  const url = `${base}${data.path === '/' ? '/' : data.path.replace(/\/+$/, '')}`;
  const title = pageTitle(content, data.title);
  const description = clipDescription(data.description);
  const image = `${base}${data.image || '/og-image.png'}`;
  const tags: HeadTag[] = [
    { tag: 'title', text: title },
    { tag: 'meta', attrs: { name: 'description', content: description } },
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: content.identity.name } },
    { tag: 'meta', attrs: { property: 'og:title', content: title } },
    { tag: 'meta', attrs: { property: 'og:description', content: description } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
  ];
  if (data.noindex) tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex, follow' } });
  for (const ld of data.jsonLd ?? []) {
    tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, text: JSON.stringify(ld) });
  }
  return tags;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function serializeTags(tags: HeadTag[]): string {
  return tags
    .map((t) => {
      if (t.tag === 'title') return `<title data-seo>${esc(t.text)}</title>`;
      const attrs = Object.entries(t.attrs)
        .map(([k, v]) => `${k}="${esc(v)}"`)
        .join(' ');
      if (t.tag === 'script') return `<script data-seo ${attrs}>${t.text.replace(/</g, '\\u003c')}</script>`;
      return `<${t.tag} data-seo ${attrs}>`;
    })
    .join('\n    ');
}

/** Browser side: replace the managed tags. Tags the prerenderer wrote carry data-seo too, so nothing is duplicated. */
export function applyTags(tags: HeadTag[]) {
  document.head.querySelectorAll('[data-seo]').forEach((n) => n.remove());
  for (const t of tags) {
    const el = document.createElement(t.tag);
    el.setAttribute('data-seo', '');
    if (t.tag === 'title') el.textContent = t.text;
    else {
      for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
      if (t.tag === 'script') el.textContent = t.text;
    }
    document.head.appendChild(el);
  }
}

export function organizationLd(content: SiteContent): Record<string, unknown> {
  const { identity, contact } = content;
  const phones = phoneNumbers(contact.phone);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: identity.name,
    alternateName: identity.descriptor,
    url: origin(content),
    logo: `${origin(content)}/brand/ip3-logo.png`,
    description: identity.description,
    email: contact.email,
    ...(phones.length ? { telephone: phones[0]!.tel } : {}),
    ...(contact.social.length ? { sameAs: contact.social.map((s) => s.href) } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address[0],
      addressLocality: 'Dhaka',
      postalCode: '1212',
      addressCountry: 'BD',
    },
  };
}

export function breadcrumbLd(content: SiteContent, trail: { name: string; path: string }[]): Record<string, unknown> {
  const base = origin(content);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${base}${t.path}`,
    })),
  };
}
