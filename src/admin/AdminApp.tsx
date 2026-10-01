import React, { useState } from 'react';
import {
  CalendarCheck,
  Check,
  Cloud,
  CloudOff,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Rocket,
  ShieldCheck,
  SquarePen,
} from 'lucide-react';
import { AdminContentProvider, useAdminContent } from './AdminContent';
import { ContentEditor } from './ContentEditor';
import { LoginScreen } from './LoginScreen';
import { BookingsPanel } from './panels/BookingsPanel';
import { LeadsPanel } from './panels/LeadsPanel';
import { OverviewPanel } from './panels/OverviewPanel';
import { PublishPanel } from './panels/PublishPanel';
import { useAdminAuth } from './useAdminAuth';

type TabId = 'overview' | 'leads' | 'bookings' | 'content' | 'publish';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: 'leads', label: 'Enquiries', icon: <Inbox className="h-4 w-4" /> },
  { id: 'bookings', label: 'Consultations', icon: <CalendarCheck className="h-4 w-4" /> },
  { id: 'content', label: 'Edit content', icon: <SquarePen className="h-4 w-4" /> },
  { id: 'publish', label: 'Publish', icon: <Rocket className="h-4 w-4" /> },
];

/** Where the draft stands relative to the live site. */
const StateBadge: React.FC = () => {
  const { syncStatus, dirty } = useAdminContent();

  const view =
    syncStatus === 'loading' || syncStatus === 'saving'
      ? { icon: <Loader2 className="h-3 w-3 animate-spin" />, text: syncStatus === 'saving' ? 'Publishing' : 'Loading', tone: 'text-slate-400' }
      : syncStatus === 'error' || syncStatus === 'offline'
        ? { icon: <CloudOff className="h-3 w-3" />, text: syncStatus === 'error' ? 'Publish failed' : 'Offline', tone: 'text-[#e3a94b]' }
        : dirty
          ? { icon: <Cloud className="h-3 w-3" />, text: 'Unpublished changes', tone: 'text-[#e3a94b]' }
          : { icon: <Check className="h-3 w-3" />, text: 'Matches the live site', tone: 'text-slate-400' };

  return (
    <span
      role="status"
      className={`hidden items-center gap-1.5 rounded-full border border-slate-800 bg-[#050a12] px-2.5 py-1 text-xs font-semibold sm:flex ${view.tone}`}
    >
      {view.icon}
      {view.text}
    </span>
  );
};

const AdminShell: React.FC<{ onSignOut: () => void }> = ({ onSignOut }) => {
  const [tab, setTab] = useState<TabId>('overview');
  const { dirty } = useAdminContent();

  return (
    <div className="min-h-screen bg-[#050a12] font-sans text-slate-100 antialiased selection:bg-[#e3a94b] selection:text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#050a12]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center gap-4">
            <div className="flex shrink-0 items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#e3a94b]/30 bg-[#e3a94b]/10">
                <ShieldCheck className="h-4 w-4 text-[#e3a94b]" aria-hidden />
              </div>
              <div className="leading-tight">
                <p className="font-serif text-sm font-bold tracking-tight">IP3 admin</p>
                <p className="text-xs text-slate-500">Content and submissions</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2.5">
              <StateBadge />
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                title="Open the public website"
                className="hidden items-center gap-1.5 rounded-full border border-slate-800 bg-[#081220] px-3 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 sm:flex"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden lg:inline">View site</span>
              </a>
              <button
                type="button"
                onClick={onSignOut}
                className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-[#081220] px-3 py-1.5 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-800 hover:text-[#e3a94b]"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>

          <nav aria-label="Admin sections" className="-mb-px flex items-center gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-current={tab === t.id ? 'page' : undefined}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-3 text-xs font-bold transition-colors ${
                  tab === t.id ? 'border-[#e3a94b] text-[#e3a94b]' : 'border-transparent text-slate-400 hover:text-slate-100'
                }`}
              >
                {t.icon}
                {t.label}
                {t.id === 'publish' && dirty ? <span className="h-1.5 w-1.5 rounded-full bg-[#e3a94b]" aria-label="unpublished changes" /> : null}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
        {tab === 'overview' && <OverviewPanel onNavigate={(id) => setTab(id as TabId)} />}
        {tab === 'leads' && <LeadsPanel />}
        {tab === 'bookings' && <BookingsPanel />}
        {tab === 'publish' && <PublishPanel />}
        {tab === 'content' && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-100">Edit content</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-400">
                Everything on the public site is edited here. Changes stay in this browser as a draft. Visitors see them only after you publish on the Publish tab.
              </p>
            </div>
            <ContentEditor />
          </div>
        )}
      </main>
    </div>
  );
};

export default function AdminApp() {
  const { state, error, submitting, signIn, signOut, setError } = useAdminAuth();

  if (state === 'checking') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#050a12] text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin text-[#e3a94b]" aria-hidden />
        <span className="font-sans text-sm">Checking your session</span>
      </div>
    );
  }

  if (state === 'unauthenticated') {
    return <LoginScreen onSubmit={signIn} error={error} submitting={submitting} clearError={setError} />;
  }

  // The writable provider is only mounted for a signed-in administrator.
  return (
    <AdminContentProvider>
      <AdminShell onSignOut={signOut} />
    </AdminContentProvider>
  );
}
