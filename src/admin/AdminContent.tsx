import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_CONTENT, mergeContent } from '../content';
import type { SiteContent } from '../content/types';
import { loadContent, saveContent } from '../lib/contentStore';

export type SyncStatus = 'loading' | 'idle' | 'saving' | 'saved' | 'error' | 'offline';

interface AdminContentState {
  /** What the editor is changing. Nothing here is public until it is published. */
  draft: SiteContent;
  setDraft: (next: SiteContent | ((prev: SiteContent) => SiteContent)) => void;
  /** What visitors see right now. */
  published: SiteContent;
  dirty: boolean;
  contentVersion: number | null;
  lastSyncedAt: string | null;
  syncStatus: SyncStatus;
  syncError: string | null;
  saveToServer: (note?: string) => Promise<boolean>;
  reloadFromServer: () => Promise<void>;
  discardChanges: () => void;
  resetToBundled: () => void;
}

const Ctx = createContext<AdminContentState | null>(null);

export function AdminContentProvider({ children }: { children: ReactNode }) {
  const [published, setPublished] = useState<SiteContent>(DEFAULT_CONTENT);
  const [draft, setDraftState] = useState<SiteContent>(DEFAULT_CONTENT);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [contentVersion, setVersion] = useState<number | null>(null);
  const [lastSyncedAt, setLast] = useState<string | null>(null);
  const publishedRef = useRef(published);
  publishedRef.current = published;

  const reloadFromServer = useCallback(async () => {
    setSyncStatus('loading');
    const res = await loadContent();
    if (res.error) {
      setSyncStatus('offline');
      setSyncError(res.error);
      return;
    }
    const merged = mergeContent(res.data);
    setPublished(merged);
    setDraftState(merged);
    setVersion(res.version ?? 0);
    setLast(res.updatedAt ?? null);
    setSyncError(null);
    setSyncStatus('idle');
  }, []);

  useEffect(() => {
    void reloadFromServer();
  }, [reloadFromServer]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(published), [draft, published]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const saveToServer = useCallback(
    async (note = '') => {
      setSyncStatus('saving');
      setSyncError(null);
      // Only the new content tree is stored. Anything an older version of the site left in the
      // database (including the old farm template) is dropped on the first publish.
      const res = await saveContent({ content: draft }, note);
      if (!res.ok) {
        setSyncStatus('error');
        setSyncError(res.error ?? 'Could not save.');
        return false;
      }
      setPublished(draft);
      setVersion(res.version ?? null);
      setLast(res.updatedAt ?? new Date().toISOString());
      setSyncStatus('saved');
      return true;
    },
    [draft],
  );

  const value = useMemo<AdminContentState>(
    () => ({
      draft,
      setDraft: setDraftState,
      published,
      dirty,
      contentVersion,
      lastSyncedAt,
      syncStatus,
      syncError,
      saveToServer,
      reloadFromServer,
      discardChanges: () => setDraftState(publishedRef.current),
      resetToBundled: () => setDraftState(DEFAULT_CONTENT),
    }),
    [draft, published, dirty, contentVersion, lastSyncedAt, syncStatus, syncError, saveToServer, reloadFromServer],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminContent(): AdminContentState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAdminContent must be used inside AdminContentProvider');
  return v;
}
