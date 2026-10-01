import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { ImageStreamHero, StreamImage } from './ui/image-stream-hero';
import { useCMS, defaultCorridorHero } from '../context/CMSContext';

const STREAM_HERO_IMAGES: StreamImage[] = [
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    alt: "Institutional Systems & Modern Architecture",
  },
  {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
    alt: "Climate Action & Ecological Transition",
  },
  {
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    alt: "Digital Public Infrastructure & Data Networks",
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
    alt: "Collaborative Policy Co-Design & Strategic Advisory",
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
    alt: "Education & Human Capacity Development",
  },
  {
    src: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=900&q=80",
    alt: "Clean Energy & Resilient Urban Infrastructure",
  },
  {
    src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80",
    alt: "Governance, Regulation & Public Sector Delivery",
  },
  {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    alt: "Systems Engineering & Grounded Implementation",
  },
];

export interface AboutPageProps {
  darkMode?: boolean;
  setDarkMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
  initialSection?: string;
  onOpenTalk?: () => void;
  onOpenCollaborate?: (area?: string) => void;
  onNavigateHome?: () => void;
  onNavigateContact?: () => void;
  onNavigateApproach?: () => void;
  onNavigateFocus?: (sectionId?: string) => void;
  onNavigatePeople?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenTalk,
  onNavigateHome,
  onNavigateContact,
  onNavigateApproach,
  onNavigateFocus,
  onNavigatePeople,
}) => {
  const { data } = useCMS();
  const corridorConfig = data.corridorHero ?? defaultCorridorHero;

  const containerRef = useRef<HTMLDivElement>(null);
  const fieldCanvasRef = useRef<HTMLCanvasElement>(null);
  const storyCanvasRef = useRef<HTMLCanvasElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const litPathRef = useRef<SVGPathElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Reveal animations on mount
    const reveals = container.querySelectorAll<HTMLElement>('.reveal');
    const flows = container.querySelectorAll<HTMLElement>('.flow');

    if ('IntersectionObserver' in window) {
      const ro = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-in');
              ro.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px' }
      );
      reveals.forEach((el) => ro.observe(el));

      const fo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-in');
              fo.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -15% 0px' }
      );
      flows.forEach((el) => fo.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('is-in'));
      flows.forEach((el) => el.classList.add('is-in'));
    }

    // Scroll progress
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = clamp(h > 0 ? st / h : 0, 0, 1);
        if (progressBarRef.current) {
          progressBarRef.current.style.width = (p * 100).toFixed(2) + '%';
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    // Section active detection & dynamic hue
    const secIds = ['who', 'dna', 'purpose', 'story', 'deliver', 'leadership'];
    const secElements = secIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const HUE_MAP: Record<string, number> = {
      who: 18,
      dna: 42,
      purpose: 110,
      story: 150,
      deliver: 180,
      leadership: 196,
    };

    let so: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window && secElements.length) {
      so = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              if (HUE_MAP[e.target.id] != null && containerRef.current) {
                containerRef.current.style.setProperty('--hue', String(HUE_MAP[e.target.id]));
              }
            }
          });
        },
        { rootMargin: '-45% 0px -45% 0px' }
      );
      secElements.forEach((s) => so?.observe(s));
    }

    // Hero pulse animation along path
    let pulseRaf = 0;
    if (pulseRef.current && litPathRef.current && !RM) {
      const pulse = pulseRef.current;
      const lit = litPathRef.current;
      const len = lit.getTotalLength ? lit.getTotalLength() : 0;
      if (len > 2) {
        let start: number | null = null;
        const dur = 4200;
        const wait = 1400;
        const t0 = -wait;
        const framePulse = (ts: number) => {
          if (start === null) start = ts;
          const e = ts - start + t0;
          const cyc = dur + wait;
          const m = ((e % cyc) + cyc) % cyc;
          if (m < dur) {
            const pt = lit.getPointAtLength((m / dur) * len);
            pulse.setAttribute('cx', String(pt.x));
            pulse.setAttribute('cy', String(pt.y));
            pulse.setAttribute('opacity', Math.sin((m / dur) * Math.PI).toFixed(3));
          } else {
            pulse.setAttribute('opacity', '0');
          }
          pulseRaf = requestAnimationFrame(framePulse);
        };
        pulseRaf = requestAnimationFrame(framePulse);
      }
    }

    // DNA Principle radial sync
    const dnaSteps = container.querySelectorAll<HTMLElement>('.dna-step');
    const dnaNodes = container.querySelectorAll<SVGGElement>('.dna-node');
    const dnaEdges = container.querySelectorAll<SVGPathElement>('#dnaEdges .dna-edge');

    const setActiveDna = (n: string | null) => {
      if (!n) return;
      dnaNodes.forEach((g) => {
        g.classList.toggle('active', g.getAttribute('data-n') === n);
      });
      dnaEdges.forEach((ed) => {
        ed.classList.toggle('lit', ed.getAttribute('data-n') === n);
      });
    };

    dnaNodes.forEach((g) => {
      g.style.cursor = 'pointer';
      g.addEventListener('mouseenter', () => setActiveDna(g.getAttribute('data-n')));
    });

    let dnaIo: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window && dnaSteps.length) {
      dnaIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setActiveDna(e.target.getAttribute('data-n'));
            }
          });
        },
        { rootMargin: '-42% 0px -42% 0px' }
      );
      dnaSteps.forEach((s) => dnaIo?.observe(s));
    }
    setActiveDna('0');

    // How We Deliver: assembling track
    const deliverSteps = container.querySelectorAll<HTMLElement>('#deliverSteps .deliver__step');
    const trackMods = container.querySelectorAll<HTMLElement>('#track .track__mod');
    const buildDeliverTrack = (upto: number) => {
      trackMods.forEach((m) => {
        const mi = +(m.getAttribute('data-m') || 0);
        const on = mi <= upto ? 1 : 0;
        m.style.setProperty('--on', String(on));
        m.classList.toggle('on', mi === upto);
      });
    };

    let deliverIo: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window && deliverSteps.length) {
      deliverIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const mi = +(e.target.getAttribute('data-m') || 0);
              buildDeliverTrack(mi);
            }
          });
        },
        { rootMargin: '-45% 0px -45% 0px' }
      );
      deliverSteps.forEach((s) => deliverIo?.observe(s));
    }
    buildDeliverTrack(0);

    // Canvas 1: Ambient background field
    let fieldRaf = 0;
    const fieldCv = fieldCanvasRef.current;
    if (fieldCv && !RM) {
      const ctx = fieldCv.getContext('2d');
      if (ctx) {
        const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
        let W = 0;
        let H = 0;
        interface FieldNode {
          hx: number;
          hy: number;
          sx: number;
          sy: number;
          ph: number;
          x: number;
          y: number;
        }
        let nodes: FieldNode[] = [];

        const sizeField = () => {
          W = window.innerWidth;
          H = window.innerHeight;
          fieldCv.width = W * DPR;
          fieldCv.height = H * DPR;
          ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
          buildFieldNodes();
        };

        const buildFieldNodes = () => {
          nodes = [];
          const gap = W < 640 ? 108 : 156;
          const cols = Math.ceil(W / gap) + 1;
          const rows = Math.ceil(H / gap) + 1;
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
              const hx = (x / (cols - 1)) * W;
              const hy = (y / (rows - 1)) * H;
              nodes.push({
                hx,
                hy,
                sx: hx + (Math.random() - 0.5) * 160,
                sy: hy + (Math.random() - 0.5) * 160,
                ph: Math.random() * 6.28,
                x: hx,
                y: hy,
              });
            }
          }
        };

        sizeField();
        window.addEventListener('resize', sizeField, { passive: true });

        let t = 0;
        const frameField = () => {
          t += 0.005;
          const p = clamp(
            (window.pageYOffset || 0) /
              (document.documentElement.scrollHeight - window.innerHeight || 1),
            0,
            1
          );
          ctx.clearRect(0, 0, W, H);
          const hue = lerp(18, 192, p);
          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            const chaos = 1 - p;
            const tx = lerp(n.sx, n.hx, p) + Math.sin(t + n.ph) * 18 * chaos;
            const ty = lerp(n.sy, n.hy, p) + Math.cos(t * 0.8 + n.ph) * 18 * chaos;
            n.x += (tx - n.x) * 0.04;
            n.y += (ty - n.y) * 0.04;
          }

          const maxd = lerp(70, 132, p);
          ctx.lineWidth = 1;
          for (let a = 0; a < nodes.length; a++) {
            for (let b = a + 1; b < nodes.length; b++) {
              const dx = nodes[a].x - nodes[b].x;
              const dy = nodes[a].y - nodes[b].y;
              const d = Math.sqrt(dx * dx + dy * dy);
              if (d < maxd) {
                const al = (1 - d / maxd) * lerp(0.08, 0.22, p);
                ctx.strokeStyle = `rgba(213, 200, 188, ${al.toFixed(3)})`;
                ctx.beginPath();
                ctx.moveTo(nodes[a].x, nodes[a].y);
                ctx.lineTo(nodes[b].x, nodes[b].y);
                ctx.stroke();
              }
            }
          }

          for (let c = 0; c < nodes.length; c++) {
            ctx.beginPath();
            ctx.arc(nodes[c].x, nodes[c].y, 1.4, 0, 6.2832);
            ctx.fillStyle = `rgba(139, 58, 42, ${lerp(0.2, 0.45, p).toFixed(3)})`;
            ctx.fill();
          }
          fieldRaf = requestAnimationFrame(frameField);
        };
        fieldRaf = requestAnimationFrame(frameField);
      }
    }

    // Canvas 2: Our Story Network Morph
    let storyRaf = 0;
    const storyCv = storyCanvasRef.current;
    const storyCap = container.querySelector<HTMLElement>('#storyCap');
    if (storyCv) {
      const ctx = storyCv.getContext('2d');
      if (ctx) {
        const MOBILE = window.matchMedia('(max-width: 900px)').matches;
        const DPR = Math.min(window.devicePixelRatio || 1, 1.6);
        let W = 0;
        let H = 0;
        const N = 15;
        const labels = [
          'Economics',
          'Policy',
          'Climate',
          'Data',
          'Education',
          'Governance',
          'Markets',
          'Tech',
          'Communities',
          'Implementation',
          'Research',
          'Finance',
          'Health',
          'Regulation',
          'Delivery',
        ];
        const seedScatter: [number, number][] = [];
        const seedNet: [number, number][] = [];
        const pts: { x: number; y: number; dx: number; dy: number }[] = [];

        let s = 20260831;
        const rnd = () => {
          s = (s * 1664525 + 1013904223) % 4294967296;
          return s / 4294967296;
        };

        for (let i = 0; i < N; i++) {
          seedScatter.push([0.08 + rnd() * 0.84, 0.08 + rnd() * 0.84]);
        }

        for (let j = 0; j < N; j++) {
          if (j < 10) {
            const a = (j / 10) * Math.PI * 2 - Math.PI / 2;
            seedNet.push([0.5 + Math.cos(a) * 0.38, 0.5 + Math.sin(a) * 0.38]);
          } else {
            const b = ((j - 10) / 5) * Math.PI * 2;
            seedNet.push([0.5 + Math.cos(b) * 0.16, 0.5 + Math.sin(b) * 0.16]);
          }
        }

        for (let k = 0; k < N; k++) {
          pts.push({ x: 0, y: 0, dx: rnd() * 6.28, dy: rnd() * 6.28 });
        }

        const edges: [number, number][] = [];
        for (let e1 = 0; e1 < 10; e1++) {
          edges.push([e1, (e1 + 1) % 10]);
        }
        for (let e2 = 10; e2 < 15; e2++) {
          for (let e3 = 0; e3 < 10; e3 += 2) {
            edges.push([e2, e3]);
          }
          edges.push([e2, e2 + 1 > 14 ? 10 : e2 + 1]);
        }

        const sizeStory = () => {
          const r = storyCv.getBoundingClientRect();
          W = r.width;
          H = r.height;
          storyCv.width = W * DPR;
          storyCv.height = H * DPR;
          ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        };
        sizeStory();
        window.addEventListener('resize', sizeStory, { passive: true });

        let prog = 0;
        let target = 0;
        let running = false;
        let tphase = 0;

        const drawStory = () => {
          prog += (target - prog) * 0.06;
          tphase += 0.012;
          ctx.clearRect(0, 0, W, H);
          const col1 = [139, 58, 42];
          const col2 = [213, 200, 188];
          const mix = (t: number) =>
            `rgba(${Math.round(lerp(col1[0], col2[0], t))},${Math.round(
              lerp(col1[1], col2[1], t)
            )},${Math.round(lerp(col1[2], col2[2], t))},`;

          for (let i = 0; i < N; i++) {
            const sc = seedScatter[i];
            const nt = seedNet[i];
            const drift = RM ? 0 : (1 - clamp(prog, 0, 1)) * 0.02;
            const sx = sc[0] + Math.sin(tphase + pts[i].dx) * drift;
            const sy = sc[1] + Math.cos(tphase * 0.9 + pts[i].dy) * drift;
            pts[i].x = lerp(sx, nt[0], clamp(prog, 0, 1)) * W;
            pts[i].y = lerp(sy, nt[1], clamp(prog, 0, 1)) * H;
          }

          const ea = clamp((prog - 0.15) / 0.7, 0, 1);
          if (ea > 0) {
            ctx.lineWidth = 1;
            for (let g = 0; g < edges.length; g++) {
              const p1 = pts[edges[g][0]];
              const p2 = pts[edges[g][1]];
              ctx.strokeStyle = mix(prog) + (0.28 * ea) + ')';
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          const sa = clamp(1 - prog / 0.5, 0, 1) * 0.5;
          if (sa > 0.02) {
            ctx.strokeStyle = 'rgba(213,200,188,' + (0.35 * sa) + ')';
            ctx.lineWidth = 1;
            for (let q = 0; q < N; q++) {
              const nb = (q * 7 + 3) % N;
              ctx.beginPath();
              ctx.moveTo(pts[q].x, pts[q].y);
              ctx.lineTo(pts[nb].x, pts[nb].y);
              ctx.stroke();
            }
          }

          for (let n = 0; n < N; n++) {
            const lit = clamp(prog, 0, 1);
            ctx.beginPath();
            ctx.arc(pts[n].x, pts[n].y, lerp(2.4, 4.2, lit), 0, 6.2832);
            ctx.fillStyle = mix(prog) + (0.45 + 0.55 * lit) + ')';
            ctx.fill();
            if (prog > 0.55) {
              ctx.font = "9px 'IBM Plex Mono', monospace";
              ctx.fillStyle = 'rgba(28,25,23,' + (((prog - 0.55) / 0.45) * 0.95).toFixed(2) + ')';
              ctx.textAlign = 'center';
              ctx.fillText(labels[n], pts[n].x, pts[n].y - 8);
            }
          }

          if (prog > 0.7) {
            ctx.strokeStyle = 'rgba(139,58,42,' + (((prog - 0.7) / 0.3) * 0.6).toFixed(2) + ')';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.arc(W / 2, H / 2, Math.min(W, H) * 0.46, 0, 6.2832);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          if (running || Math.abs(target - prog) > 0.001) {
            storyRaf = requestAnimationFrame(drawStory);
          } else {
            storyRaf = 0;
          }
        };

        const kickStory = () => {
          if (!storyRaf) storyRaf = requestAnimationFrame(drawStory);
        };

        const caps = [
          'Siloed disciplines — working the same problems separately',
          'Connections begin to form across the divide',
          'The Dynamic Network Model — one connected system',
        ];

        const stepsEl = container.querySelectorAll<HTMLElement>('#storySteps .story__step');
        if (MOBILE || !('IntersectionObserver' in window)) {
          target = 1;
          prog = 1;
          if (storyCap) storyCap.textContent = caps[2];
          drawStory();
        } else {
          const storyIo = new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => {
                if (e.isIntersecting) {
                  const sIdx = +(e.target.getAttribute('data-s') || 0);
                  target = sIdx === 0 ? 0.0 : sIdx === 1 ? 0.5 : 1.0;
                  if (RM) prog = target;
                  if (storyCap) storyCap.textContent = caps[sIdx];
                  kickStory();
                }
              });
            },
            { rootMargin: '-45% 0px -45% 0px' }
          );
          stepsEl.forEach((s) => storyIo.observe(s));

          const storySec = document.getElementById('story');
          if (storySec) {
            const visIo = new IntersectionObserver(
              (entries) => {
                entries.forEach((e) => {
                  running = e.isIntersecting && !RM;
                  if (e.isIntersecting) kickStory();
                });
              },
              { rootMargin: '10% 0px 10% 0px' }
            );
            visIo.observe(storySec);
          }
        }
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (pulseRaf) cancelAnimationFrame(pulseRaf);
      if (fieldRaf) cancelAnimationFrame(fieldRaf);
      if (storyRaf) cancelAnimationFrame(storyRaf);
    };
  }, []);

  return (
    <div ref={containerRef} className="about-deck js selection:bg-[#8B3A2A]/20 selection:text-[#8B3A2A]">
      {/* Accessibility Skip Link */}
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-[#8B3A2A] focus:text-white focus:px-4 focus:py-2 focus:font-mono focus:text-xs"
        href="#who"
      >
        Skip to content
      </a>

      {/* Ambient Canvas and Vignette Layer */}
      <div className="ambient" aria-hidden="true">
        <canvas ref={fieldCanvasRef} id="field" />
        <div className="ambient__glow" />
        <div className="ambient__grid" />
      </div>
      <div className="grain" aria-hidden="true" />

      {/* Top Scroll Progress Bar */}
      <div className="progress" aria-hidden="true">
        <div ref={progressBarRef} className="progress__bar" id="progressBar" />
      </div>

      {/* 1. Page Header & Institutional Breadcrumb with Sub-Page Switcher */}
      <div className="border-b border-[#D5C8BC] bg-[#FFFFFF]/95 backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#7A6B63]">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#1C1917] transition-colors cursor-pointer font-medium"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 text-[#D5C8BC]" />
            <span className="text-[#8B3A2A] font-bold">
              About Us
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-[#7A6B63] uppercase tracking-wider hidden sm:inline text-[10px] font-medium">About Sections:</span>
            <a
              href="#who"
              className="px-2.5 py-1 rounded-md text-[#1C1917] hover:text-[#8B3A2A] hover:bg-[#F0EBE4] transition-colors font-medium"
            >
              Overview
            </a>
            <button
              onClick={onNavigatePeople}
              className="px-2.5 py-1 rounded-md text-[#8B3A2A] bg-[#8B3A2A]/10 hover:bg-[#8B3A2A]/20 border border-[#8B3A2A]/30 transition-all flex items-center gap-1.5 cursor-pointer font-bold"
              title="Navigate to Dedicated IP3 People Page"
            >
              <span>IP3 People</span>
              <span className="text-[9px] uppercase tracking-wider bg-[#8B3A2A] text-white px-1 py-0.2 rounded font-extrabold">Page</span>
            </button>
            <button
              onClick={onNavigateApproach}
              className="px-2.5 py-1 rounded-md text-[#1C1917] hover:text-[#8B3A2A] hover:bg-[#F0EBE4] transition-colors cursor-pointer font-medium"
              title="Navigate to Our Approach Page"
            >
              <span>Our Approach</span>
            </button>
          </div>
        </div>
      </div>

      <main className="w-full">
        {/* ===================== IMAGE STREAM CORRIDOR (CMS CONTROLLED) ===================== */}
        {corridorConfig.enabled !== false && (
          <section
            className="w-full relative overflow-hidden bg-neutral-950 h-[70vh] min-h-[520px] max-h-[780px] mb-8 border-b border-neutral-800 select-none shadow-2xl"
            aria-label="Visual corridor journey"
          >
            <ImageStreamHero
              images={corridorConfig.images && corridorConfig.images.length > 0 ? corridorConfig.images : STREAM_HERO_IMAGES}
              cards={corridorConfig.cards || corridorConfig.images?.length || 8}
              speed={corridorConfig.speed || 20}
              axis={corridorConfig.axis || 55}
              className="h-full w-full bg-neutral-950"
            >
              {corridorConfig.title && (
                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase bg-black/65 backdrop-blur-md text-white/90 border border-white/20 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A]" />
                    {corridorConfig.title}
                  </span>
                </div>
              )}
            </ImageStreamHero>
          </section>
        )}

        {/* ===================== HERO ===================== */}
        <section
          className="hero wrap"
          style={{ backgroundColor: 'inherit' }}
          aria-labelledby="pagetitle"
        >
          <div className="hero__inner">
            <p className="eyebrow reveal">About IP3 Consulting</p>
            <h1 id="pagetitle" className="reveal" data-d="1">
              About IP3 Consulting: <em>Translational</em> Policy &amp; Systems Advisory
            </h1>
            <p className="hero__sub reveal" data-d="2">
              We understand interconnected complexity, translate intelligence into actionable architecture, and work alongside institutions to carry solutions from policy vision through <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>, learning and scale.
            </p>
          </div>
        </section>

        {/* Thesis Pathway */}
        <div className="thesis wrap">
          <figure className="pathway reveal">
            <p className="eyebrow" style={{ marginBottom: '1.6rem' }}>The IP3 through-line</p>
            <svg viewBox="0 0 920 150" role="img" aria-label="IP3 operating thesis as a left-to-right pathway: Complexity leads to Intelligence, Intelligence to Architecture, Architecture to Implementation, and Implementation to Impact.">
              <path className="pw-line" d="M60,60 Q160,40 260,60 Q360,80 460,60 Q560,40 660,60 Q760,80 860,60" />
              <path ref={litPathRef} className="pw-line-lit" d="M60,60 Q160,40 260,60 Q360,80 460,60 Q560,40 660,60 Q760,80 860,60" />
              <g className="pw-nodes">
                <circle className="pw-node" cx="60" cy="60" r="6" />
                <circle className="pw-node" cx="260" cy="60" r="6" />
                <circle className="pw-node" cx="460" cy="60" r="6" />
                <circle className="pw-node" cx="660" cy="60" r="6" />
                <circle className="pw-node pw-node-on" cx="860" cy="60" r="7" />
              </g>
              <circle ref={pulseRef} className="pw-pulse" id="pwPulse" cx="60" cy="60" r="4" />
              <g className="pw-label" textAnchor="middle">
                <text x="60" y="98">Complexity</text>
                <text x="260" y="98">Intelligence</text>
                <text x="460" y="98">Architecture</text>
                <text x="660" y="98" fill="#8B3A2A" fontWeight="bold">Implementation</text>
                <text x="860" y="98">Impact</text>
              </g>
              <g className="pw-desc" textAnchor="middle">
                <text x="60" y="118">interconnected systems</text>
                <text x="260" y="118">research &amp; policy insight</text>
                <text x="460" y="118">systems &amp; digital design</text>
                <text x="660" y="118">delivery with institutions</text>
                <text x="860" y="118">lasting capability</text>
              </g>
            </svg>
            <ol className="pw-mobile" aria-hidden="true">
              <li><b>Complexity</b><span>interconnected systems</span></li>
              <li><b>Intelligence</b><span>research &amp; policy insight</span></li>
              <li><b>Architecture</b><span>systems &amp; digital design</span></li>
              <li className="on"><b className="text-[#8B3A2A]">Implementation</b><span>delivery with institutions</span></li>
              <li className="on"><b>Impact</b><span>lasting capability</span></li>
            </ol>
            <figcaption>Every section below is a stage on this path — complexity to intelligence, intelligence to architecture, architecture to <span className="text-[#8B3A2A] font-semibold">implementation</span> and impact.</figcaption>
          </figure>
        </div>

        {/* ===================== WHO WE ARE ===================== */}
        <section className="section section--alt" id="who" aria-labelledby="who-h">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">01 // Who We Are</p>
              <h2 id="who-h">Translating policy intelligence into systems that work</h2>
              <p className="kicker">
                IP3 Consulting — the Institute for Public Policy and Practice — is a <span className="term">translational policy studio</span> and <span className="term">systems integrator</span> helping governments, development partners, businesses and institutions turn complex policy ambitions into <span className="accent-word text-[#8B3A2A] font-semibold">implementable</span>, scalable solutions.
              </p>
            </div>

            <div className="who-grid">
              <div className="prose reveal">
                <p>We work where policy, economics, climate, institutions, data, technology, education and <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> intersect. By combining rigorous research and policy intelligence with systems thinking, digital architecture, locally grounded expertise and hands-on implementation support, we help clients move from understanding a problem to designing, testing, delivering and improving the solution.</p>
                <p>What distinguishes IP3 is the distance we are prepared to travel with a problem. We do not stop at diagnosis, recommendations or the delivery of a report. We work across the policy and management advisory value chain — from market and institutional diagnostics, empirical research and <span className="term">policy co-design</span> through experimentation, <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> support, monitoring, learning, adaptation and scale.</p>
                <p className="pull">We translate intelligence into architecture — and architecture into impact.</p>
              </div>

              <div className="reveal" data-d="1">
                <p className="eyebrow eyebrow--cool" style={{ marginBottom: '1.2rem' }}>Three connected transformation domains</p>
                <div className="domains">
                  <div className="domain">
                    <b>Climate Action, ESG &amp; Circular Economy</b>
                    <span>Green transition, ESG strategy and circular-economy policy and practice.</span>
                  </div>
                  <div className="domain">
                    <b>Education &amp; Human Capacity Development</b>
                    <span>Learning systems, human capability and future-ready skills.</span>
                  </div>
                  <div className="domain">
                    <b>Institutional Effectiveness, Data &amp; Digital Governance</b>
                    <span>Institutions, regulation, data ecosystems and digital public infrastructure.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-14 border-t border-[#D5C8BC]/80" />

            <div className="who-grid">
              <div className="reveal">
                <h3 style={{ marginBottom: '1.1rem' }}>A strategic policy &amp; management solutions firm built for the complexity of now</h3>
                <div className="prose">
                  <p>Today's institutional challenges rarely arrive independently. Climate exposure interacts with financing constraints. Digital transformation reshapes service delivery. Education outcomes depend on institutional capability. Regulation intersects with markets, technology, behaviour and political economy.</p>
                  <p><strong>IP3 is built for these intersections.</strong> We combine global expertise with <span className="term">Global South</span> intelligence — economists, policy specialists, systems thinkers, sector experts, data professionals, digital strategists and practitioners — to create solutions that are globally informed, locally workable and designed for <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>.</p>
                </div>
                <div className="cta-row">
                  <button
                    onClick={onNavigateApproach}
                    className="btn btn--primary"
                  >
                    Explore what we do
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="reveal who-aside" data-d="1" aria-hidden="true">
                <figure className="pathway bg-white p-5 rounded-xl border border-[#D5C8BC] shadow-sm" style={{ margin: 0 }}>
                  <svg className="who-aside-svg" viewBox="0 0 320 220" role="img" aria-label="Diagram: three overlapping domain nodes feeding a single implementation core.">
                    <defs>
                      <radialGradient id="dg" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#8B3A2A" stopOpacity=".18" />
                        <stop offset="100%" stopColor="#8B3A2A" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle cx="160" cy="120" r="92" fill="url(#dg)" />
                    <line x1="95" y1="70" x2="160" y2="150" stroke="#D5C8BC" strokeWidth="1.5" />
                    <line x1="225" y1="70" x2="160" y2="150" stroke="#D5C8BC" strokeWidth="1.5" />
                    <line x1="160" y1="60" x2="160" y2="150" stroke="#D5C8BC" strokeWidth="1.5" />
                    <circle cx="95" cy="70" r="9" fill="#F0EBE4" stroke="#D5C8BC" strokeWidth="1.5" />
                    <circle cx="225" cy="70" r="9" fill="#F0EBE4" stroke="#D5C8BC" strokeWidth="1.5" />
                    <circle cx="160" cy="58" r="9" fill="#F0EBE4" stroke="#D5C8BC" strokeWidth="1.5" />
                    <circle cx="160" cy="150" r="13" fill="#8B3A2A" stroke="#8B3A2A" />
                    <text x="160" y="185" textAnchor="middle" className="pw-label" fill="#8B3A2A" fontWeight="bold">Implementation core</text>
                    <text x="95" y="46" textAnchor="middle" className="pw-desc" fill="#7A6B63">Climate</text>
                    <text x="225" y="46" textAnchor="middle" className="pw-desc" fill="#7A6B63">Institutions</text>
                    <text x="160" y="34" textAnchor="middle" className="pw-desc" fill="#7A6B63">Education</text>
                  </svg>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== ORGANIZATIONAL DNA ===================== */}
        <section className="section section--alt" id="dna" aria-labelledby="dna-h">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">02 // Our Organizational DNA</p>
              <h2 id="dna-h">Built differently for complex change</h2>
              <p className="kicker">
                A simple proposition: complex systems cannot be transformed through isolated answers. IP3 brings research, policy, technology, institutions, markets, people and <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> into the same problem-solving architecture. Five principles — one system.
              </p>
            </div>

            <div className="dna-grid">
              <figure className="dna-figure">
                <svg className="dna-svg" viewBox="0 0 340 340" role="img" aria-label="Radial diagram: a central hub labelled Organizational DNA linked to five principle nodes — Poly-Solutions, Translation, Thinking that Ships, End-to-End Expertise and Convenor — which are also linked to one another in a ring.">
                  <g id="dnaEdges" aria-hidden="true">
                    <path className="dna-edge" data-n="0" d="M170,170 L170,54" />
                    <path className="dna-edge" data-n="1" d="M170,170 L280,110" />
                    <path className="dna-edge" data-n="2" d="M170,170 L238,286" />
                    <path className="dna-edge" data-n="3" d="M170,170 L102,286" />
                    <path className="dna-edge" data-n="4" d="M170,170 L60,110" />
                    <path className="dna-edge dna-ring" d="M170,54 L280,110 L238,286 L102,286 L60,110 Z" />
                  </g>
                  <circle className="dna-hub" cx="170" cy="170" r="36" />
                  <text className="dna-hub-label" x="170" y="166">ORGANIZATIONAL</text>
                  <text className="dna-hub-label" x="170" y="180">DNA</text>
                  <g className="dna-node" data-n="0">
                    <circle cx="170" cy="54" r="7" />
                    <text x="170" y="33">01 · Poly-Solutions</text>
                  </g>
                  <g className="dna-node" data-n="1">
                    <circle cx="280" cy="110" r="7" />
                    <text x="258" y="96">02 · Translation</text>
                  </g>
                  <g className="dna-node" data-n="2">
                    <circle cx="238" cy="286" r="7" />
                    <text x="238" y="309">03 · Ships</text>
                  </g>
                  <g className="dna-node" data-n="3">
                    <circle cx="102" cy="286" r="7" />
                    <text x="102" y="309">04 · End-to-End</text>
                  </g>
                  <g className="dna-node" data-n="4">
                    <circle cx="60" cy="110" r="7" />
                    <text x="82" y="96">05 · Convenor</text>
                  </g>
                </svg>
                <figcaption>Hover a principle to trace its links · scroll to move through the system</figcaption>
              </figure>

              <div className="dna-steps">
                <article className="dna-step reveal" data-n="0">
                  <p className="dna-step__n">Principle 01</p>
                  <h3>From Poly-Crisis to Poly-Solutions</h3>
                  <p className="sub">Connected problems require connected solutions.</p>
                  <p>Policy pressure, climate exposure, financing gaps, digital disruption, service-delivery constraints and institutional uncertainty increasingly overlap and compound one another. IP3 works at those intersections — mapping the relationships between systems before deciding where intervention creates the greatest leverage.</p>
                  <p>Our response is not a collection of isolated sector solutions. It is <span className="term">poly-solution architecture</span>: integrated, evidence-led and co-created interventions designed around how the problem actually behaves.</p>
                </article>

                <article className="dna-step reveal" data-n="1">
                  <p className="dna-step__n">Principle 02</p>
                  <h3>Translation, Not Theory</h3>
                  <p className="sub">Evidence matters when it changes what institutions can do.</p>
                  <p>IP3 treats research as the beginning of the engagement, not its final product. Evidence becomes policy intelligence; policy intelligence becomes systems and delivery architecture; architecture becomes <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>; and <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> experience feeds back into learning and adaptation.</p>
                  <ul className="flow" aria-label="Translational pathway">
                    <li>Research</li>
                    <li>Policy Intelligence</li>
                    <li>Systems Design</li>
                    <li>Digital Architecture</li>
                    <li><span className="accent-word text-[#8B3A2A] font-semibold">Implementation</span></li>
                    <li>Learning &amp; Scale</li>
                  </ul>
                </article>

                <article className="dna-step reveal" data-n="2">
                  <p className="dna-step__n">Principle 03</p>
                  <h3>Thinking That Ships</h3>
                  <p className="sub">We develop thinking designed to leave the page.</p>
                  <p>Policy architectures, institutional theses, data stories, research reports, case studies, implementation frameworks, diagnostics and digital solutions are built to help decision-makers act, not simply understand.</p>
                  <p>Insight should produce a decision, a design, a tested intervention, an institutional capability or a clearer pathway to <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>.</p>
                </article>

                <article className="dna-step reveal" data-n="3">
                  <p className="dna-step__n">Principle 04</p>
                  <h3>End-to-End Expertise</h3>
                  <p className="sub">Full-stack advisory across the entire value chain.</p>
                  <p>Complex transformations become vulnerable when strategy, research, <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>, data and evaluation are separated across disconnected advisory teams. IP3 integrates those capabilities.</p>
                  <p>Depending on the assignment, we work across diagnostics, market and institutional assessment, policy research, data modelling, stakeholder engagement, programme and policy co-design, pilot development, <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> support, digital systems, MERLA, capability building, learning and scale.</p>
                </article>

                <article className="dna-step reveal" data-n="4">
                  <p className="dna-step__n">Principle 05</p>
                  <h3>A Convenor Between Worlds</h3>
                  <p className="sub">Global knowledge. Global South intelligence.</p>
                  <p>IP3 operates between communities that too often work separately: policy and practice; government and markets; research and <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>; technology and institutions; international standards and local realities; experts and communities.</p>
                  <p>Through IP3's <span className="term">Dynamic Network Model</span>, complementary expertise is assembled across geographies and disciplines while retaining the local knowledge required to understand how institutions, incentives, markets, communities and delivery systems actually operate. Global South focus does not mean importing a global framework and localising the language — it means starting with context, and connecting context intelligently to global knowledge.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== VISION & MISSION ===================== */}
        <section className="section" id="purpose" aria-label="Our Vision and Our Mission">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">03 // Our Purpose</p>
              <p className="kicker">Vision names the future IP3 wants to help create. Mission is what IP3 does to move institutions toward it — two complementary halves of one statement.</p>
            </div>

            <div className="vm reveal">
              <div className="vm__half vm__v">
                <div className="vm__horizon" aria-hidden="true" />
                <p className="eyebrow">Our Vision</p>
                <h2 id="vision-h">Policy innovation for transformative, sustainable growth</h2>
                <p className="sub">The future we work toward.</p>
                <p>We envision a future in which governments, institutions, businesses and communities possess the policies, capabilities, data, partnerships and institutional resilience needed to navigate complexity and create sustainable, equitable prosperity.</p>
                <p>Our vision is for public policy to become more adaptive, more connected to <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>, and more capable of translating economic opportunity, technological change, social inclusion and environmental responsibility into durable improvements in institutions and people's lives.</p>
              </div>
              <div className="vm__half vm__m">
                <p className="eyebrow eyebrow--cool">Our Mission</p>
                <h2 id="mission-h">Turning evidence, innovation and <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> into lasting impact</h2>
                <p className="sub">What we do to get there.</p>
                <p>Our mission is to help governments, development partners, businesses, institutions and communities solve complex policy and management challenges by connecting rigorous evidence with practical <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>.</p>
                <p>We develop solutions that are contextually grounded and capable of enduring beyond the life of an assignment, combining:</p>
                <div className="mech">
                  <span>Policy intelligence</span>
                  <span>Action research</span>
                  <span>Systems thinking</span>
                  <span>Strategic advisory</span>
                  <span>Data &amp; digital innovation</span>
                  <span>Institutional design</span>
                  <span>Collaborative problem-solving</span>
                  <span>Adaptive learning</span>
                </div>
              </div>
              <p className="vm__bridge">
                Across climate action and ESG, education and human capacity development, and institutional effectiveness and digital governance, our purpose is consistent: <strong>to strengthen the systems through which better policy becomes better outcomes.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* ===================== OUR STORY ===================== */}
        <section className="section section--alt" id="story" aria-labelledby="story-h">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">04 // Our Story</p>
              <h2 id="story-h">Why IP3 exists</h2>
              <p className="kicker">IP3 emerged from a recurring problem in development and policy practice: good analysis does not automatically produce good <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>.</p>
            </div>

            <div className="story__inner">
              <div className="story__sticky">
                <figure className="story__figure">
                  <canvas ref={storyCanvasRef} id="storyCanvas" aria-hidden="true" />
                  <figcaption id="storyCap">Siloed disciplines — working the same problems separately</figcaption>
                </figure>
              </div>

              <div className="story__steps" id="storySteps">
                <article className="story__step" data-s="0">
                  <p className="story__badge">The gap</p>
                  <h3>Analysis on one side, <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> on the other</h3>
                  <p>Institutions are increasingly asked to respond to challenges that cross conventional policy boundaries. Climate, finance, technology, education, governance, inequality, service delivery, markets and institutional capacity interact in ways that traditional siloed advisory models struggle to address.</p>
                </article>

                <article className="story__step" data-s="1">
                  <p className="story__badge">We are different</p>
                  <h3>The advisory relationship should go further</h3>
                  <p>We built IP3 around the belief that advice should not stop at explaining what should happen. It should help determine what can work, how it can work, who must be involved, what institutional architecture is required, how it can be tested, and how learning strengthens it over time.</p>
                  <p>That is why IP3 combines the rigour of a policy research institution, the agility of an <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> partner and the integrative capability of a systems studio — bringing <span className="term">rigor and imagination</span> together: analytical depth without losing creativity; global knowledge without losing context; technology without losing people.</p>
                </article>

                <article className="story__step" data-s="2">
                  <p className="story__badge">A hub for ideas, expertise &amp; exchange</p>
                  <h3>The Dynamic Network Model</h3>
                  <p>IP3 is more than a conventional consulting organisation. It is a networking, knowledge-exchange and resource-sharing platform that brings complementary expertise across disciplines and geographies around complex public and institutional problems.</p>
                  <p>Our Dynamic Network Model connects in-house capability with economists, academics, policy specialists, development practitioners, industry expertise, data and technology professionals and entrepreneurial thinkers.</p>
                  <p className="story__close">Different disciplines. Shared problems. One purpose: solutions that can move.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== HOW WE DELIVER ===================== */}
        <section className="section" id="deliver" aria-labelledby="deliver-h">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">05 // How We Deliver Lasting Impact</p>
              <h2 id="deliver-h">From complexity to actionable architecture</h2>
              <p className="deliver__quote">“Do not <b>simplify</b> the problem until you <b>understand</b> the system.”</p>
              <p className="kicker" style={{ marginTop: '1.6rem' }}>
                One coherent delivery architecture. IP3 does not stop at strategy or policy recommendations — each stage builds on the last, from sensing the system to institutionalising what works.
              </p>
            </div>

            <div className="deliver__inner">
              <div className="deliver__sticky" aria-hidden="true">
                <div className="track" id="track">
                  <div className="track__mod" data-m="0"><span className="k">01</span><span className="nm">Sense</span><span className="arrow">→</span></div>
                  <div className="track__mod" data-m="1"><span className="k">02</span><span className="nm">Design</span><span className="arrow">→</span></div>
                  <div className="track__mod" data-m="2"><span className="k">03</span><span className="nm">Test</span><span className="arrow">→</span></div>
                  <div className="track__mod" data-m="3"><span className="k">04</span><span className="nm font-semibold text-[#8B3A2A]">Implement</span><span className="arrow">→</span></div>
                  <div className="track__mod" data-m="4"><span className="k">05</span><span className="nm">Learn &amp; Scale</span><span className="arrow">●</span></div>
                </div>
                <p className="track__logic">
                  The IP3 impact logic — <b>Sense → Design → Test → <span className="text-[#8B3A2A]">Implement</span> → Learn &amp; Scale</b>
                </p>
              </div>

              <div className="deliver__steps" id="deliverSteps">
                <article className="deliver__step" data-m="0">
                  <p className="n">01 — Sense the System</p>
                  <h3>Holistic diagnostics &amp; systems mapping</h3>
                  <p className="role">Understand the system rather than treat its symptoms.</p>
                  <p>We map institutions, incentives, stakeholders, markets, policies, behaviours, data, risks, capabilities and <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> constraints — to find the real problem, the relationships sustaining it, and the points where intervention can create meaningful change.</p>
                  <div className="caps">
                    <span>Holistic diagnostics</span>
                    <span>Systems mapping</span>
                    <span>Stakeholder intelligence</span>
                    <span>Institutional analysis</span>
                    <span>Market &amp; policy assessment</span>
                  </div>
                </article>

                <article className="deliver__step" data-m="1">
                  <p className="n">02 — Design for Reality</p>
                  <h3>Action research, policy co-design &amp; systems architecture</h3>
                  <p className="role">Solutions designed for the environment in which they must operate.</p>
                  <p>Evidence is combined with stakeholder intelligence, behavioural insight, local knowledge and interdisciplinary expertise to co-create policies, programmes, institutional models, regulatory frameworks, digital systems and delivery strategies.</p>
                  <div className="caps">
                    <span>Action research</span>
                    <span>Policy co-design</span>
                    <span>Systems architecture</span>
                    <span>Programme design</span>
                    <span>Regulatory &amp; digital solutions</span>
                  </div>
                </article>

                <article className="deliver__step" data-m="2">
                  <p className="n">03 — Test Before Scale</p>
                  <h3>Policy experimentation, prototyping &amp; pilot execution</h3>
                  <p className="role">Learn before committing institutions to scale.</p>
                  <p>Where appropriate, assumptions are tested through pilots, policy experimentation, operational prototyping, sandbox approaches or staged <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>.</p>
                  <div className="caps">
                    <span>Pilots</span>
                    <span>Experimentation</span>
                    <span>Prototypes</span>
                    <span>Sandboxes</span>
                    <span>Adaptive testing</span>
                  </div>
                </article>

                <article className="deliver__step" data-m="3">
                  <p className="n">04 — <span className="text-[#8B3A2A]">Implement</span> with Institutions</p>
                  <h3>Delivery architecture &amp; <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> support</h3>
                  <p className="role"><span className="accent-word text-[#8B3A2A] font-semibold">Implementation</span> is part of the advisory architecture — not what happens after consulting.</p>
                  <p>IP3 works alongside clients and stakeholders to translate design into operating reality — connecting people, processes, data, governance arrangements, technology, financing and institutional capability.</p>
                  <div className="caps">
                    <span>Delivery architecture</span>
                    <span><span className="accent-word text-[#8B3A2A] font-semibold">Implementation</span> support</span>
                    <span>Digital systems</span>
                    <span>Institutional capability</span>
                    <span>Stakeholder coordination</span>
                  </div>
                </article>

                <article className="deliver__step" data-m="4">
                  <p className="n">05 — Learn, Adapt &amp; Scale</p>
                  <h3>MERLA, capability development &amp; continuous learning</h3>
                  <p className="role">Not simply to leave behind a solution — to strengthen the capacity to sustain, adapt and scale it.</p>
                  <p>Transformation rarely follows a perfectly linear plan. We integrate monitoring, evaluation, research, learning and adaptation into <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> so evidence can inform decisions while change is occurring — through to scaling and institutionalisation.</p>
                  <div className="caps">
                    <span>Monitoring &amp; evaluation</span>
                    <span>Research</span>
                    <span>Learning &amp; adaptation</span>
                    <span>Capability development</span>
                    <span>Scaling &amp; institutionalisation</span>
                  </div>
                  <div className="cta-row">
                    <button
                      onClick={onNavigateApproach}
                      className="btn btn--primary"
                    >
                      Explore our approach
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== LEADERSHIP (Bottom section start) ===================== */}
        <section className="section section--alt" id="leadership" aria-labelledby="leadership-h">
          <div className="wrap">
            <div className="section__head reveal">
              <p className="eyebrow">06 // IP3 Leadership</p>
              <h2 id="leadership-h">Leadership for the space between ideas and execution</h2>
              <p className="kicker">IP3's leadership model reflects the firm itself: interdisciplinary, <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>-oriented, globally connected and grounded in the realities of policy and institutional transformation.</p>
            </div>

            {/* Executive Chairman */}
            <div className="chair reveal">
              <div className="portrait" aria-hidden="true"><span>MSH</span></div>
              <div className="chair__body">
                <p className="role">Executive Chairman</p>
                <h3>Mohammad Syful Hoque</h3>
                <p className="org">Institute for Public Policy and Practice — IP3 Consulting</p>
                <p className="desc">Driving transformative impact beyond policy.</p>
                <p>IP3's leadership philosophy is built around moving beyond policy recommendation toward policy capability — bringing analytical rigour, systems thinking, technology, institutional intelligence, <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span> discipline and cross-sector collaboration into a single transformation agenda.</p>
                <p>Under this model, IP3 functions as a convergence point between thinkers and practitioners, connecting strategic policy insight with the people, institutions, technologies and operating systems required to convert ideas into viable change. The ambition is not simply to advise institutions on the future — it is to help them build the capacity to deliver it.</p>
              </div>
            </div>

            <h3 className="reveal" style={{ marginTop: '3.4rem', fontSize: '1.2rem', letterSpacing: '.02em' }}>
              Advisory &amp; Practice Leadership
            </h3>
            <p className="eyebrow eyebrow--cool reveal" style={{ marginTop: '.9rem' }}>
              Economics · Education · Public health · Regulation · Institutional development · Industry strategy
            </p>

            <div className="leaders reveal" data-d="1">
              <div className="leader">
                <div className="leader__mono" aria-hidden="true">MM</div>
                <b>Prof. Dr. M A Mannan</b>
                <span className="t">Senior Consulting Advisor</span>
                <span className="dom">Education · Health · Demography · Social Protection</span>
                <span className="strat">Where demographic and human-development evidence meets social-protection systems.</span>
              </div>
              <div className="leader">
                <div className="leader__mono" aria-hidden="true">NA</div>
                <b>Prof. Dr. Niaz Asadullah</b>
                <span className="t">Chief Economic Advisor</span>
                <span className="dom">Education · Institutions · Poverty · Labour · Gender</span>
                <span className="strat">Economic analysis of institutions, opportunity and equity.</span>
              </div>
              <div className="leader">
                <div className="leader__mono" aria-hidden="true">ZR</div>
                <b>Barr. Zareen Rahman</b>
                <span className="t">Founding Director</span>
                <span className="dom">Regulation · PPP Formation · Legal Compliance</span>
                <span className="strat">Turning regulatory and contractual structure into workable delivery.</span>
              </div>
              <div className="leader">
                <div className="leader__mono" aria-hidden="true">SS</div>
                <b>Prof. Dr. Shafiun Shimul</b>
                <span className="t">Policy Advisor / Lead Economist</span>
                <span className="dom">Public Health Policy &amp; Practice</span>
                <span className="strat">Health economics translated into policy and practice.</span>
              </div>
              <div className="leader">
                <div className="leader__mono" aria-hidden="true">HR</div>
                <b>Adj. Prof. Harun Rashid</b>
                <span className="t">Founding Director</span>
                <span className="dom">Comparative Politics · Public Policy · Conflict Management</span>
                <span className="strat">Political economy and the governance of contested change.</span>
              </div>
              <div className="leader">
                <div className="leader__mono" aria-hidden="true">AS</div>
                <b>Dr. Md. Abu Zafor Sadek</b>
                <span className="t">Deputy Director / Practice Area Lead</span>
                <span className="dom">Pharmaceutical Industry Dynamics · Strategic Market, Product &amp; Biosimilars Development</span>
                <span className="strat">Industry strategy across markets, products and biosimilars.</span>
              </div>
            </div>
            <p className="leaders__note">Names and roles synchronised with the official IP3 People database · portraits added at CMS publication.</p>

            <div className="cta-row reveal">
              <button
                onClick={onNavigatePeople}
                className="btn btn--primary"
              >
                Meet IP3 People (Dedicated Page)
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ===================== CLOSE (Bottom section continued) ===================== */}
        <section className="close wrap" aria-label="In summary">
          <div className="close__pt reveal" aria-hidden="true" />
          <p className="close__line reveal" data-d="1">
            IP3 understands interconnected complexity, translates intelligence into <b>actionable architecture</b>, and works alongside institutions to carry solutions from policy vision through <span className="accent-word text-[#8B3A2A] font-semibold">implementation</span>, learning and <b>scale</b>.
          </p>
          <div className="cta-row reveal" data-d="2">
            <button
              onClick={onNavigateApproach}
              className="btn btn--primary"
            >
              Explore what we do
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <button
              onClick={onOpenTalk || onNavigateContact}
              className="btn btn--ghost"
            >
              Start a conversation
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot">
            <div className="foot__brand">
              <b>IP3 CONSULTING</b>
              <p>
                Institute for Public Policy and Practice — a translational policy studio and systems integrator working across climate and ESG, education and human capacity development, and institutional effectiveness, data and digital governance.
              </p>
            </div>
            <nav className="foot__nav" aria-label="Footer">
              <button onClick={onNavigateApproach}>What We Do</button>
              <button onClick={onNavigateApproach}>Our Approach</button>
              <button onClick={() => onNavigateFocus?.('insights')}>Insights</button>
              <button onClick={onNavigatePeople}>IP3 People</button>
              <button onClick={onOpenTalk || onNavigateContact}>Contact</button>
            </nav>
          </div>
          <p className="foot__legal">
            &copy; {new Date().getFullYear()} IP3 Consulting · Institute for Public Policy and Practice · Global South oriented, globally connected.
          </p>
        </div>
      </footer>
    </div>
  );
};
