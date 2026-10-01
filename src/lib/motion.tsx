import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

type ViewPref = 'auto' | '3d' | 'simple';

interface MotionState {
  /** True once the client has measured its own capabilities. Before that the simple view renders, matching the server. */
  hydrated: boolean;
  reducedMotion: boolean;
  webgl: boolean;
  lowPower: boolean;
  mobile: boolean;
  /** The 3D scene is running. */
  use3D: boolean;
  toggle3D: () => void;
  /** Called by the canvas if the GPU context is lost or the scene fails; drops to the simple view. */
  fail3D: () => void;
}

const MotionContext = createContext<MotionState>({
  hydrated: false,
  reducedMotion: false,
  webgl: false,
  lowPower: false,
  mobile: false,
  use3D: false,
  toggle3D: () => {},
  fail3D: () => {},
});

const STORAGE_KEY = 'ip3-view';

function mediaStore(query: string) {
  return {
    subscribe(cb: () => void) {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    get: () => window.matchMedia(query).matches,
  };
}

const reducedStore = typeof window !== 'undefined' ? mediaStore('(prefers-reduced-motion: reduce)') : null;
const mobileStore = typeof window !== 'undefined' ? mediaStore('(max-width: 767px)') : null;

function useMedia(store: ReturnType<typeof mediaStore> | null): boolean {
  return useSyncExternalStore(
    store ? store.subscribe : () => () => {},
    store ? store.get : () => false,
    () => false,
  );
}

function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function detectLowPower(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType && /(^|-)(2g|3g)$/.test(nav.connection.effectiveType)) return true;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) return true;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2) return true;
  return false;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useMedia(reducedStore);
  const mobile = useMedia(mobileStore);
  const [hydrated, setHydrated] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [pref, setPref] = useState<ViewPref>('auto');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setWebgl(detectWebGL());
    setLowPower(detectLowPower());
    let stored: ViewPref = 'auto';
    try {
      const q = new URLSearchParams(window.location.search).get('view');
      const s = q ?? window.localStorage.getItem(STORAGE_KEY);
      if (s === '3d' || s === 'simple') stored = s;
    } catch {
      /* storage can be blocked; fall back to auto */
    }
    setPref(stored);
    setHydrated(true);
  }, []);

  const use3D = hydrated && webgl && !failed && (pref === '3d' || (pref === 'auto' && !reducedMotion && !lowPower));

  useEffect(() => {
    if (hydrated) document.documentElement.dataset.view = use3D ? '3d' : 'simple';
  }, [hydrated, use3D]);

  const toggle3D = useCallback(() => {
    setFailed(false);
    setPref((p) => {
      const next: ViewPref = use3D ? 'simple' : '3d';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return p === next ? p : next;
    });
  }, [use3D]);

  const fail3D = useCallback(() => setFailed(true), []);

  const value = useMemo(
    () => ({ hydrated, reducedMotion, webgl, lowPower, mobile, use3D, toggle3D, fail3D }),
    [hydrated, reducedMotion, webgl, lowPower, mobile, use3D, toggle3D, fail3D],
  );
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export const useMotion = () => useContext(MotionContext);
