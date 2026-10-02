import { ArrowDown, ArrowUp, ChevronDown, ImageUp, Plus, Trash2 } from 'lucide-react';
import { useId, useRef, useState, type ReactNode } from 'react';
import type { SiteContent } from '../content/types';
import { uploadMedia } from '../lib/mediaUploader';
import { useAdminContent } from './AdminContent';

/**
 * A form editor generated from the shape of the content itself. Adding a field to the content
 * types and defaults makes it editable here with no further work.
 *
 * Rules the generator follows:
 *  - text longer than a line, or stored under a prose-like name, gets a text area;
 *  - lists of text and lists of records can be added to, removed from and reordered;
 *  - fields named portrait / image / video get an upload button (Cloudinary);
 *  - `status` is a choice between published / verify / placeholder.
 */

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const SECTIONS: { key: keyof SiteContent; label: string; hint: string }[] = [
  { key: 'home', label: 'Home page', hint: 'Headline, the six scenes of the story and the section headings.' },
  { key: 'identity', label: 'Organisation', hint: 'Name and the sentence shown in search results.' },
  { key: 'contact', label: 'Contact and booking', hint: 'Address, email, phone, hours and consultation slots.' },
  { key: 'domains', label: 'Focus areas', hint: 'The three domains. Slugs link to sectors and services.' },
  { key: 'sectors', label: 'Sectors', hint: 'The eight sectors and the lines between them.' },
  { key: 'capabilities', label: 'What clients hire us for', hint: 'The six capabilities shown on the home page.' },
  { key: 'services', label: 'Services', hint: 'The service pages.' },
  { key: 'portfolio', label: 'Selected work', hint: 'Only entries marked "published" appear on the site.' },
  { key: 'method', label: 'Approach', hint: 'The six movements and the principles.' },
  { key: 'people', label: 'People', hint: 'Names, roles and practice areas. Leave the portrait empty to show initials.' },
  { key: 'insights', label: 'Insights', hint: 'Reports, articles and commentary by the team. Only entries marked "published" appear.' },
  { key: 'pillars', label: 'Pillars', hint: 'What IP3 stands for.' },
  { key: 'about', label: 'About', hint: 'Who IP3 is, vision, mission, chairman and the institutions named.' },
  { key: 'legal', label: 'Privacy page', hint: 'Plain-language description of what the site collects.' },
];

const LONG_KEYS = new Set(['text', 'summary', 'sub', 'lead', 'quote', 'note', 'description', 'need', 'audience', 'support', 'intro', 'body', 'vision', 'mission', 'change', 'shown', 'bio', 'challenge', 'approach']);
const IMAGE_KEYS = /^(portrait|image|photo|video|poster)$/i;
const STATUS = ['published', 'verify', 'placeholder'];

const input =
  'w-full rounded-lg border border-slate-700 bg-[#050a12] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-[#e3a94b] focus:outline-none focus:ring-1 focus:ring-[#e3a94b]';
const btn =
  'inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#081220] px-2.5 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:border-slate-500 hover:text-white disabled:opacity-40';

const label = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

function itemTitle(v: Json, i: number): string {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    for (const k of ['title', 'name', 'label', 'rail', 'slug', 'id', 'heading']) {
      const x = v[k];
      if (typeof x === 'string' && x.trim()) return x;
    }
  }
  return typeof v === 'string' ? v.slice(0, 60) : `Item ${i + 1}`;
}

/** An empty record with the same keys as an example, so "Add" creates a complete entry. */
function blankLike(sample: Json): Json {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === 'object') {
    const out: { [k: string]: Json } = {};
    for (const [k, v] of Object.entries(sample)) out[k] = k === 'status' ? 'placeholder' : blankLike(v);
    return out;
  }
  if (typeof sample === 'number') return 0;
  if (typeof sample === 'boolean') return false;
  return '';
}

function Row({ title, children, htmlFor }: { title: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-slate-400">
        {title}
      </label>
      {children}
    </div>
  );
}

function Upload({ onDone }: { onDone: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*,video/*"
        className="sr-only"
        tabIndex={-1}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          setErr('');
          try {
            onDone((await uploadMedia(f)).url);
          } catch (x) {
            setErr(x instanceof Error ? x.message : 'Upload failed');
          } finally {
            setBusy(false);
            if (ref.current) ref.current.value = '';
          }
        }}
      />
      <button type="button" className={btn} disabled={busy} onClick={() => ref.current?.click()}>
        <ImageUp className="h-3.5 w-3.5" />
        {busy ? 'Uploading…' : 'Upload'}
      </button>
      {err ? <span className="text-xs text-red-300">{err}</span> : null}
    </>
  );
}

function Node({ name, value, onChange, depth }: { name: string; value: Json; onChange: (v: Json) => void; depth: number }) {
  const id = useId();

  if (typeof value === 'string') {
    if (name === 'status') {
      return (
        <Row title="Status" htmlFor={id}>
          <select id={id} className={input} value={value} onChange={(e) => onChange(e.target.value)}>
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {s === 'published' ? 'published (shown on the site)' : s === 'verify' ? 'verify (hidden until confirmed)' : 'placeholder (hidden)'}
              </option>
            ))}
          </select>
        </Row>
      );
    }
    if (IMAGE_KEYS.test(name)) {
      return (
        <Row title={label(name)} htmlFor={id}>
          <div className="flex flex-wrap items-center gap-2">
            <input id={id} className={`${input} min-w-0 flex-1`} value={value} placeholder="https://…" onChange={(e) => onChange(e.target.value)} />
            <Upload onDone={onChange} />
          </div>
          {value && /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(value) ? <img src={value} alt="" className="mt-1 h-20 w-20 rounded-lg object-cover" /> : null}
        </Row>
      );
    }
    const long = LONG_KEYS.has(name) || value.length > 90 || value.includes('\n');
    return (
      <Row title={label(name)} htmlFor={id}>
        {long ? (
          <textarea id={id} className={`${input} min-h-[5.5rem] resize-y leading-relaxed`} value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input id={id} className={input} value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </Row>
    );
  }

  if (typeof value === 'number') {
    return (
      <Row title={label(name)} htmlFor={id}>
        <input id={id} type="number" className={input} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      </Row>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2.5 text-sm text-slate-200">
        <input type="checkbox" className="h-4 w-4 accent-[#e3a94b]" checked={value} onChange={(e) => onChange(e.target.checked)} />
        {label(name)}
      </label>
    );
  }

  if (Array.isArray(value)) return <List name={name} value={value} onChange={onChange} depth={depth} />;

  if (value && typeof value === 'object') {
    return (
      <fieldset className={`grid gap-4 ${depth > 0 ? 'rounded-xl border border-slate-800 p-4' : ''}`}>
        {depth > 0 ? <legend className="px-1.5 text-xs font-bold text-[#e3a94b]">{label(name)}</legend> : null}
        {Object.entries(value).map(([k, v]) => (
          <Node key={k} name={k} value={v} depth={depth + 1} onChange={(nv) => onChange({ ...value, [k]: nv })} />
        ))}
      </fieldset>
    );
  }
  return null;
}

function List({ name, value, onChange, depth }: { name: string; value: Json[]; onChange: (v: Json) => void; depth: number }) {
  const records = value.length > 0 && typeof value[0] === 'object' && value[0] !== null;
  const textList = !records;
  const [open, setOpen] = useState<number | null>(value.length <= 1 ? 0 : null);

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
    if (open === i) setOpen(j);
  };
  const remove = (i: number) => {
    if (records && !window.confirm(`Remove "${itemTitle(value[i]!, i)}"?`)) return;
    onChange(value.filter((_, k) => k !== i));
    setOpen(null);
  };
  const add = () => {
    const sample = value[0];
    const fresh = sample === undefined ? '' : blankLike(sample);
    onChange([...value, fresh]);
    if (records) setOpen(value.length);
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#e3a94b]">
          {label(name)} <span className="font-normal text-slate-500">({value.length})</span>
        </span>
        <button type="button" className={btn} onClick={add}>
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      <ul className="grid gap-2">
        {value.map((item, i) => (
          <li key={i} className="rounded-xl border border-slate-800 bg-[#081220]/60">
            {textList ? (
              <div className="flex items-start gap-2 p-2">
                {typeof item === 'string' && (item.length > 90 || LONG_KEYS.has(name)) ? (
                  <textarea
                    aria-label={`${label(name)} ${i + 1}`}
                    className={`${input} min-h-[4.5rem] resize-y`}
                    value={item}
                    onChange={(e) => onChange(value.map((v, k) => (k === i ? e.target.value : v)))}
                  />
                ) : (
                  <input
                    aria-label={`${label(name)} ${i + 1}`}
                    className={input}
                    value={String(item ?? '')}
                    onChange={(e) => onChange(value.map((v, k) => (k === i ? e.target.value : v)))}
                  />
                )}
                <div className="flex shrink-0 gap-1">
                  <button type="button" className={btn} aria-label="Move up" onClick={() => move(i, -1)}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className={btn} aria-label="Move down" onClick={() => move(i, 1)}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className={btn} aria-label="Remove" onClick={() => remove(i)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 p-2">
                  <button
                    type="button"
                    aria-expanded={open === i}
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-semibold text-slate-100 hover:bg-slate-800/60"
                  >
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open === i ? '' : '-rotate-90'}`} />
                    <span className="truncate">{itemTitle(item, i)}</span>
                  </button>
                  <button type="button" className={btn} aria-label="Move up" onClick={() => move(i, -1)}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className={btn} aria-label="Move down" onClick={() => move(i, 1)}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" className={btn} aria-label="Remove" onClick={() => remove(i)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {open === i ? (
                  <div className="border-t border-slate-800 p-4">
                    <Node name={name} depth={depth + 1} value={item} onChange={(nv) => onChange(value.map((v, k) => (k === i ? nv : v)))} />
                  </div>
                ) : null}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContentEditor() {
  const { draft, setDraft } = useAdminContent();
  const [section, setSection] = useState<keyof SiteContent>('home');
  const meta = SECTIONS.find((s) => s.key === section)!;

  return (
    <div className="grid gap-6 lg:grid-cols-[14rem_1fr]">
      <nav aria-label="Content sections" className="lg:sticky lg:top-32 lg:self-start">
        <ul className="flex gap-1 overflow-x-auto lg:flex-col">
          {SECTIONS.map((s) => (
            <li key={s.key}>
              <button
                type="button"
                aria-current={section === s.key ? 'true' : undefined}
                onClick={() => setSection(s.key)}
                className={`w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                  section === s.key ? 'bg-[#e3a94b]/15 text-[#e3a94b]' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0">
        <h3 className="font-serif text-xl font-bold text-slate-100">{meta.label}</h3>
        <p className="mb-5 mt-1 text-xs text-slate-400">{meta.hint} Changes stay in this browser until you publish them on the Publish tab.</p>
        <Node
          key={section}
          name={String(section)}
          depth={0}
          value={draft[section] as unknown as Json}
          onChange={(v) => setDraft((prev) => ({ ...prev, [section]: v }) as unknown as SiteContent)}
        />
      </div>
    </div>
  );
}
