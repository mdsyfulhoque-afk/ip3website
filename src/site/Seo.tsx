import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useContent } from '../content';
import { applyTags, headTags, type HeadData } from './seo';

/** On the server, pages report their head data here so the prerenderer can write it into the HTML. */
export interface HeadCollector {
  data: HeadData | null;
}
const CollectorContext = createContext<HeadCollector | null>(null);

export function HeadCollectorProvider({ collector, children }: { collector: HeadCollector; children: ReactNode }) {
  return <CollectorContext.Provider value={collector}>{children}</CollectorContext.Provider>;
}

/** Declares a page's title, description and canonical URL. Renders nothing. */
export function Seo(props: HeadData) {
  const content = useContent();
  const collector = useContext(CollectorContext);
  if (collector) collector.data = props;

  const { title, description, path, noindex, image } = props;
  const ld = props.jsonLd ? JSON.stringify(props.jsonLd) : '';
  useEffect(() => {
    applyTags(headTags(content, { title, description, path, noindex, image, jsonLd: ld ? JSON.parse(ld) : undefined }));
  }, [content, title, description, path, noindex, image, ld]);

  return null;
}
