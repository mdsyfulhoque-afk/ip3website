import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadContent } from '../lib/contentStore';
import { DEFAULT_CONTENT } from './defaults';
import { mergeContent } from './merge';
import type { SiteContent } from './types';

export type ContentStatus = 'default' | 'loading' | 'live' | 'offline';

interface ContentState {
  content: SiteContent;
  /** `loading` while the first request is in flight. Pages use it to avoid flashing "not found". */
  status: ContentStatus;
}

const ContentContext = createContext<ContentState>({ content: DEFAULT_CONTENT, status: 'default' });

/**
 * Renders the bundled content immediately and swaps in the published copy when the API answers.
 * Nothing waits on the network, and a failed request leaves the bundled content in place.
 */
export function ContentProvider({ children, initial = DEFAULT_CONTENT }: { children: ReactNode; initial?: SiteContent }) {
  const [state, setState] = useState<ContentState>({ content: initial, status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    loadContent().then((res) => {
      if (cancelled) return;
      if (res.error) setState((s) => ({ content: s.content, status: 'offline' }));
      else setState({ content: mergeContent(res.data, initial), status: 'live' });
    });
    return () => {
      cancelled = true;
    };
  }, [initial]);

  const value = useMemo(() => state, [state]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export const useContent = (): SiteContent => useContext(ContentContext).content;
export const useContentStatus = (): ContentStatus => useContext(ContentContext).status;
