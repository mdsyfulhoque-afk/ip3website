import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, CloudUpload, Download, History, Inbox, Loader2, RefreshCw, RotateCcw, Undo2, Upload } from 'lucide-react';
import { mergeContent } from '../../content';
import { validateContent } from '../../content/validate';
import { downloadContentJson, exportSubmissions, listRevisions, restoreRevision, type ContentRevision } from '../../lib/contentStore';
import { useAdminContent } from '../AdminContent';

const formatWhen = (iso?: string | null) => (iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'not yet');

const card = 'rounded-2xl border border-slate-800 bg-[#081220] p-5';
const ghost =
  'flex items-center gap-2 rounded-xl border border-slate-700 bg-[#050a12] px-4 py-2.5 text-xs font-bold text-slate-300 transition-colors hover:border-slate-500 hover:text-white disabled:opacity-50';

/**
 * Editing and publishing are separate steps. The editor changes a draft that only this browser
 * holds. Publishing checks the draft, writes it to the database and makes it the live site.
 */
export const PublishPanel: React.FC = () => {
  const { draft, setDraft, dirty, syncStatus, syncError, lastSyncedAt, contentVersion, saveToServer, reloadFromServer, discardChanges, resetToBundled } =
    useAdminContent();

  const [revisions, setRevisions] = useState<ContentRevision[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'bad'; text: string } | null>(null);
  const [note, setNote] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const problems = useMemo(() => validateContent(draft), [draft]);

  const loadRevisions = useCallback(async () => {
    setLoadingRevisions(true);
    try {
      setRevisions(await listRevisions());
    } catch {
      setRevisions([]);
    } finally {
      setLoadingRevisions(false);
    }
  }, []);

  useEffect(() => {
    void loadRevisions();
  }, [loadRevisions]);

  const handlePublish = async () => {
    setBusy('publish');
    setNotice(null);
    const ok = await saveToServer(note.trim());
    if (ok) {
      setNote('');
      setNotice({ tone: 'ok', text: 'Published. Visitors see this version now.' });
      await loadRevisions();
    }
    setBusy(null);
  };

  const handleDiscard = () => {
    if (!window.confirm('Discard every unpublished change and go back to the live version?')) return;
    discardChanges();
    setNotice({ tone: 'ok', text: 'Draft reset to the live version.' });
  };

  const handleDefaults = () => {
    if (!window.confirm('Replace the draft with the content that ships with the site? Nothing goes live until you publish.')) return;
    resetToBundled();
    setNotice({ tone: 'ok', text: 'Draft replaced with the bundled content. Review it, then publish.' });
  };

  const handleBackup = () => {
    downloadContentJson(draft, `ip3-content-${new Date().toISOString().slice(0, 10)}.json`);
    setNotice({ tone: 'ok', text: 'Backup of the current draft downloaded.' });
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text()) as Record<string, unknown>;
      const next = mergeContent(raw && typeof raw === 'object' && 'content' in raw ? raw : { content: raw });
      setDraft(next);
      setNotice({ tone: 'ok', text: 'Backup loaded into the draft. Review it, then publish.' });
    } catch {
      setNotice({ tone: 'bad', text: 'That file is not valid JSON, so nothing was changed.' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleExportSubmissions = async () => {
    setBusy('submissions');
    try {
      const payload = await exportSubmissions();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ip3-submissions.json';
      a.click();
      URL.revokeObjectURL(url);
      setNotice({ tone: 'ok', text: 'Enquiries and bookings exported.' });
    } catch {
      setNotice({ tone: 'bad', text: 'Could not export submissions.' });
    } finally {
      setBusy(null);
    }
  };

  const handleRestore = async (revision: ContentRevision) => {
    if (!window.confirm(`Roll the live site back to version ${revision.version}? The current version is kept as a new revision.`)) return;
    setBusy(revision._id);
    try {
      await restoreRevision(revision._id);
      await reloadFromServer();
      await loadRevisions();
      setNotice({ tone: 'ok', text: `Restored version ${revision.version}.` });
    } catch (err) {
      setNotice({ tone: 'bad', text: err instanceof Error ? err.message : 'Restore failed.' });
    } finally {
      setBusy(null);
    }
  };

  const publishing = syncStatus === 'saving' || busy === 'publish';
  const failed = syncStatus === 'error' || syncStatus === 'offline';
  const blocked = problems.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-slate-100">Publish</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Check the draft, publish it, or roll the live site back. Enquiries and bookings are stored separately and are never affected by publishing.
        </p>
      </div>

      <div className={`flex gap-3 rounded-2xl border p-4 ${failed ? 'border-[#e3a94b]/40 bg-[#e3a94b]/10' : 'border-slate-800 bg-[#081220]'}`} role="status">
        {failed ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#e3a94b]" aria-hidden /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />}
        <p className="text-sm leading-relaxed text-slate-300">
          {failed ? (
            <>
              <strong className="font-semibold text-slate-100">Not published.</strong> {syncError || 'The database could not be reached.'}
            </>
          ) : (
            <>
              <strong className="font-semibold text-slate-100">
                {contentVersion ? `Live version ${contentVersion}.` : 'The site is showing the content that ships with it.'}
              </strong>{' '}
              Last published {formatWhen(lastSyncedAt)}. {dirty ? 'The draft has changes that are not live yet.' : 'The draft matches the live site.'}
            </>
          )}
        </p>
      </div>

      {blocked ? (
        <div className="rounded-2xl border border-[#e3a94b]/40 bg-[#e3a94b]/10 p-5" role="alert">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <AlertTriangle className="h-4 w-4 text-[#e3a94b]" aria-hidden />
            Fix {problems.length === 1 ? 'this' : `these ${problems.length}`} before publishing
          </h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-300">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={card}>
        <h3 className="mb-1 text-sm font-bold text-slate-100">Publish the draft</h3>
        <p className="mb-4 text-xs text-slate-400">A short note helps when you need to find this version in the history below.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="grid flex-1 gap-1.5">
            <span className="text-xs font-semibold text-slate-400">Note about this version (optional)</span>
            <input
              value={note}
              maxLength={120}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Confirmed office hours"
              className="w-full rounded-lg border border-slate-700 bg-[#050a12] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-[#e3a94b] focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing || blocked || !dirty}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#e3a94b] px-5 py-2.5 text-xs font-bold text-slate-900 transition-colors hover:bg-[#c98a1e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {publishing ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <CloudUpload className="h-4 w-4" aria-hidden />}
            {publishing ? 'Publishing' : 'Publish'}
          </button>
        </div>
        {!dirty && !blocked ? <p className="mt-3 text-xs text-slate-500">Nothing to publish. The draft matches the live site.</p> : null}
        {notice ? (
          <p role="status" className={`mt-3.5 flex items-center gap-1.5 text-xs ${notice.tone === 'ok' ? 'text-[#e3a94b]' : 'text-red-300'}`}>
            {notice.tone === 'ok' ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : <AlertTriangle className="h-3.5 w-3.5" aria-hidden />}
            {notice.text}
          </p>
        ) : null}
      </div>

      <div className={card}>
        <h3 className="mb-1 text-sm font-bold text-slate-100">Draft tools</h3>
        <p className="mb-4 text-xs text-slate-400">These change the draft only. Nothing is live until you publish.</p>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" className={ghost} onClick={handleDiscard} disabled={!dirty}>
            <Undo2 className="h-4 w-4" aria-hidden />
            Discard changes
          </button>
          <button type="button" className={ghost} onClick={handleDefaults}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            Restore bundled content
          </button>
          <button type="button" className={ghost} onClick={handleBackup}>
            <Download className="h-4 w-4" aria-hidden />
            Download backup
          </button>
          <button type="button" className={ghost} onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" aria-hidden />
            Load a backup
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-label="Backup file" onChange={(e) => void handleImport(e.target.files?.[0])} />
          <button type="button" className={ghost} onClick={() => void reloadFromServer()}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            Reload live version
          </button>
        </div>
      </div>

      <div className={card}>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-100">
          <History className="h-4 w-4 text-[#e3a94b]" aria-hidden />
          Version history
        </h3>
        <p className="mb-4 text-xs leading-relaxed text-slate-400">
          The most recent published versions. Restoring one makes it the live site and keeps the version it replaced, so nothing is lost.
        </p>

        {loadingRevisions ? (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            Loading versions
          </div>
        ) : revisions.length === 0 ? (
          <p className="text-xs text-slate-500">No earlier versions yet. They appear after the first publish.</p>
        ) : (
          <ul className="divide-y divide-slate-800/70">
            {revisions.map((rev) => (
              <li key={rev._id} className="flex items-center gap-3 py-2.5">
                <span className="w-14 shrink-0 font-mono text-xs text-slate-100">v{rev.version}</span>
                <span className="flex-1 truncate text-xs text-slate-400">
                  {formatWhen(rev.createdAt)}
                  {rev.note ? `, ${rev.note}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => void handleRestore(rev)}
                  disabled={busy === rev._id}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#050a12] px-3 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-800 hover:text-[#e3a94b] disabled:opacity-50"
                >
                  {busy === rev._id ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden /> : <RotateCcw className="h-3 w-3" aria-hidden />}
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={card}>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-100">
          <Inbox className="h-4 w-4 text-[#e3a94b]" aria-hidden />
          Enquiries and bookings
        </h3>
        <p className="mb-4 text-xs leading-relaxed text-slate-400">
          Each enquiry and consultation booking is stored as it arrives and can be read in the Enquiries and Consultations tabs. Export a copy for your records.
        </p>
        <button type="button" onClick={() => void handleExportSubmissions()} disabled={busy === 'submissions'} className={ghost}>
          {busy === 'submissions' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
          Export submissions
        </button>
      </div>
    </div>
  );
};

export default PublishPanel;
