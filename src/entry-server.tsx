import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { DEFAULT_CONTENT } from './content';
import { HeadCollectorProvider, type HeadCollector } from './site/Seo';
import { headTags, origin, serializeTags } from './site/seo';
import { prerenderPaths } from './site/routes';

export const paths = prerenderPaths(DEFAULT_CONTENT);
export const siteOrigin = origin(DEFAULT_CONTENT);

/** Renders one URL to markup plus its <head> tags. Called by scripts/prerender.mjs. */
export function render(url: string): { html: string; head: string; status: number } {
  const collector: HeadCollector = { data: null };
  const html = renderToString(
    <HeadCollectorProvider collector={collector}>
      <StaticRouter location={url}>
        <App content={DEFAULT_CONTENT} />
      </StaticRouter>
    </HeadCollectorProvider>,
  );
  const data = collector.data;
  const head = data ? serializeTags(headTags(DEFAULT_CONTENT, data)) : '';
  return { html, head, status: url === '/404' ? 404 : 200 };
}
