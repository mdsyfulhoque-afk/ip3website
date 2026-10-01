import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useContent } from '../../content';
import { useMotion } from '../../lib/motion';
import { CTA, NAV } from '../nav';
import { LogoMark } from './LogoMark';

export function Header() {
  const { identity } = useContent();
  const { use3D, toggle3D, hydrated, webgl } = useMotion();
  const { pathname } = useLocation();
  const home = pathname === '/';
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  // The 3D switch only means something on the home page and only where WebGL exists.
  const showToggle = home && hydrated && webgl;
  const toggle = showToggle ? (
    <button
      type="button"
      onClick={() => {
        toggle3D();
        close();
      }}
      aria-pressed={use3D}
      className="t-label inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/35 px-4 text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
    >
      <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 rounded-full ${use3D ? 'bg-signal' : 'border border-mist'}`} />
      3D scene {use3D ? 'on' : 'off'}
    </button>
  ) : null;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `t-label inline-flex min-h-11 items-center px-2.5 no-underline transition-colors hover:text-signal xl:px-3 ${
      isActive ? 'text-signal' : 'text-ivory/90'
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid || open || !home ? 'border-b border-midnight-rule bg-midnight/95' : 'border-b border-transparent bg-transparent'
      }`}
      style={{ height: 'var(--header-h)' }}
    >
      <div className="wrap flex h-full items-center justify-between gap-4">
        <Link to="/" className="flex min-h-11 items-center gap-3 no-underline" aria-label={`${identity.name}, home`}>
          <LogoMark className="h-8 w-8 shrink-0" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.375rem] font-semibold tracking-tight text-ivory">{identity.shortName}</span>
            <span className="t-label mt-1 hidden text-[0.75rem] font-medium text-mist xl:block">{identity.descriptor}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">{toggle}</div>
          <Link
            to={CTA.to}
            className="t-label hidden min-h-11 items-center rounded-full bg-ivory px-5 text-midnight no-underline transition-colors hover:bg-white lg:inline-flex"
          >
            {CTA.label}
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="t-label inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/35 px-4 text-ivory lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            Menu
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M3 3 L13 13 M13 3 L3 13" /> : <path d="M2 5 H14 M2 11 H14" />}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100svh-var(--header-h))] overflow-y-auto border-b border-midnight-rule bg-midnight px-[var(--gutter)] pb-6 pt-2 lg:hidden"
      >
        <nav aria-label="Primary mobile">
          <ul>
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={close}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center border-b border-midnight-rule font-serif text-xl no-underline ${isActive ? 'text-signal' : 'text-ivory'}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Link to={CTA.to} onClick={close} className="btn btn-solid mt-5 w-full">
          {CTA.label}
        </Link>
        {toggle ? <div className="mt-4">{toggle}</div> : null}
      </div>
    </header>
  );
}
