import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X, ArrowUpRight, Sparkles } from 'lucide-react';

interface CorridorItem {
  id: string;
  title: string;
  subtitle: string;
  domain: string;
  category: 'climate' | 'governance' | 'education' | 'systems';
  image: string;
  description: string;
  partner: string;
  metrics: string;
  location: string;
}

const CORRIDOR_ITEMS: CorridorItem[] = [
  {
    id: 'c1',
    title: 'Circular Economy Matrix',
    subtitle: 'Industrial Decarbonisation & Resource Loops',
    domain: 'Climate Action, ESG & Circular Economy',
    category: 'climate',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    description: 'Transitioning industrial clusters toward circular input loops through empirical material flow audits and adaptive policy instruments.',
    partner: 'Ministry of Environment & Regional Industrial Alliance',
    metrics: '34% Carbon Intensity Reduction',
    location: 'Southeast Asia Regional Hub'
  },
  {
    id: 'c2',
    title: 'Aperture of Opportunity',
    subtitle: 'Empirical Diagnostics & Field Inquiry',
    domain: 'Translational Policy & Research',
    category: 'systems',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1000&auto=format&fit=crop',
    description: 'Grounded ethnographic and statistical field investigation mapping real household and municipal service delivery frictions.',
    partner: 'Urban Resilience Council',
    metrics: '120+ Field Diagnostics Completed',
    location: 'Global South Urban Labs'
  },
  {
    id: 'c3',
    title: 'Solar & Clean Energy Grid',
    subtitle: 'Public Utility Transition & Financing',
    domain: 'Climate Action, ESG & Circular Economy',
    category: 'climate',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1000&auto=format&fit=crop',
    description: 'Architecting concessional finance mechanisms and regulatory frameworks to accelerate distributed solar grid adoption.',
    partner: 'National Energy Commission & Multilateral Partners',
    metrics: '1.2 GW Planned Renewable Integration',
    location: 'South Asian Energy Corridor'
  },
  {
    id: 'c4',
    title: 'Future Learning Commons',
    subtitle: 'Adaptive Pedagogy & Human Potential',
    domain: 'Education & Human Capacity Development',
    category: 'education',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1000&auto=format&fit=crop',
    description: 'Designing modular curriculum architectures and public teacher capability pipelines aligned to the requirements of the green and digital economies.',
    partner: 'Ministry of Primary & Higher Education',
    metrics: '450,000+ Students Impacted',
    location: 'National School Systems'
  },
  {
    id: 'c5',
    title: 'Digital Public Infrastructure',
    subtitle: 'Open Data Systems & Civil Registry Rail',
    domain: 'Institutional Effectiveness & Digital Governance',
    category: 'governance',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    description: 'Standardised interoperable digital rails connecting identification, social protection disbursement, and municipal registries.',
    partner: 'Digital Public Infrastructure Taskforce',
    metrics: '99.98% Verification Reliability',
    location: 'Metropolitan Governance Directorate'
  },
  {
    id: 'c6',
    title: 'Human Capability & Skills Hub',
    subtitle: 'Technical Resilience & Workforce Readiness',
    domain: 'Education & Human Capacity Development',
    category: 'education',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    description: 'Bridging institutional vocational systems with modern tech and sustainable manufacturing standards for youth employment.',
    partner: 'National Skills Development Authority',
    metrics: '82% Sustained Placement Rate',
    location: 'Vocational Centres Network'
  },
  {
    id: 'c7',
    title: 'Neural Systems Architecture',
    subtitle: 'Real-Time Policy Analytics & Data Studio',
    domain: 'Institutional Effectiveness & Digital Governance',
    category: 'governance',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1000&auto=format&fit=crop',
    description: 'Dynamic data telemetry infrastructure allowing policymakers to monitor public program outcomes and adapt resource allocation in real-time.',
    partner: 'Cabinet Delivery Unit',
    metrics: 'Sub-second Decision Telemetry',
    location: 'Central Policy War Room'
  },
  {
    id: 'c8',
    title: 'Institutional Synthesis Core',
    subtitle: 'Systems Integration & Convergence',
    domain: 'Translational Policy & Research',
    category: 'systems',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    description: 'The convergent point where institutional intelligence, economic modelling, technology systems, and delivery capability coalesce.',
    partner: 'IP3 Centre for Public Innovation',
    metrics: 'Cross-Disciplinary Integration',
    location: 'Global Headquarters'
  },
  {
    id: 'c9',
    title: 'Algorithmic Rights & Data Trust',
    subtitle: 'Ethical Governance in Automated Services',
    domain: 'Institutional Effectiveness & Digital Governance',
    category: 'governance',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    description: 'Independent auditing frameworks ensuring algorithmic fairness, transparency, and data sovereignty across state services.',
    partner: 'Data Protection Directorate',
    metrics: '14 Core Ethical Benchmarks Enforced',
    location: 'Digital Governance Commission'
  },
  {
    id: 'c10',
    title: 'Biodiversity & Water Stewardship',
    subtitle: 'Basin-Level Ecological Policy Integration',
    domain: 'Climate Action, ESG & Circular Economy',
    category: 'climate',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop',
    description: 'Cross-boundary watershed protection systems integrating municipal utilities, agricultural cooperatives, and climate resilience.',
    partner: 'River Basin Authority',
    metrics: '2.4M Hectares Preserved',
    location: 'Delta Basin Ecosystems'
  },
  {
    id: 'c11',
    title: 'Public Health Telemetry',
    subtitle: 'Decentralised Clinical Response Delivery',
    domain: 'Education & Human Capacity Development',
    category: 'education',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1000&auto=format&fit=crop',
    description: 'Strengthening peripheral clinic diagnostics and digital supply chain visibility to eliminate drug stockouts in rural wards.',
    partner: 'Directorate General of Health Services',
    metrics: '94% On-Time Medicine Fulfillment',
    location: 'Rural Primary Care Network'
  },
  {
    id: 'c12',
    title: 'Deliberative Governance Sandbox',
    subtitle: 'Co-Design & Participatory Implementation',
    domain: 'Translational Policy & Research',
    category: 'systems',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    description: 'Living policy laboratories bringing community leaders, civil servants, and economists into structured policy simulation.',
    partner: 'Participatory Policy Network',
    metrics: '40+ Deliberative Citizen Panels',
    location: 'Regional Civic Centres'
  }
];

export const PerspectiveCorridor: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CorridorItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'climate' | 'governance' | 'education' | 'systems'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const filteredItems = activeFilter === 'all'
    ? CORRIDOR_ITEMS
    : CORRIDOR_ITEMS.filter((item) => item.category === activeFilter);

  const total = filteredItems.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay
  useEffect(() => {
    if (!isPlaying || isDragging) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 3800);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isDragging, nextSlide]);

  // Mouse Parallax Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseParallax({ x: x * 15, y: y * 10 });
  };

  const handleMouseLeave = () => {
    setMouseParallax({ x: 0, y: 0 });
  };

  // Drag / Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 50) {
      prevSlide();
    } else if (dragOffset < -50) {
      nextSlide();
    }
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseDrag = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 60) {
      prevSlide();
    } else if (dragOffset < -60) {
      nextSlide();
    }
    setDragOffset(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'Escape') setSelectedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  /**
   * Calculate 3D perspective slots relative to center.
   * We display up to 13 cards symmetrically:
   * 6 on the left (receding from edge to center), 1 at the center horizon, 6 on the right (expanding from center to edge).
   */
  const slots = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];

  return (
    <section
      id="corridor"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#050505] text-white py-16 lg:py-24 overflow-hidden select-none border-y border-[#1F1D1A] scroll-mt-16"
      aria-label="IP3 Visual Corridor & Architectural Perspectives"
    >
      {/* Ambient Atmospheric Horizon Glow matching IP3 ember palette */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mouseParallax.x * -0.6}px, ${mouseParallax.y * -0.6}px)`
        }}
      >
        {/* Central Vanishing Glow Arc */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[340px] rounded-full blur-[110px] opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, #8B3A2A 0%, rgba(219, 120, 80, 0.45) 35%, rgba(213, 200, 188, 0.1) 60%, transparent 75%)'
          }}
        />
        {/* Horizon Laser Arc */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[980px] h-[2px] opacity-25"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #8B3A2A 30%, #E89E78 50%, #8B3A2A 70%, transparent 100%)'
          }}
        />
        {/* Top/bottom vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(5,5,5,0.92)_100%)] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-widest text-[#E89E78]">
              <Sparkles className="w-3.5 h-3.5 text-[#8B3A2A]" />
              <span>Perspective Corridor // 00 Visual Archive</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#F0EBE4] tracking-tight">
              Systems in Motion: Architectural Perspectives
            </h2>
            <p className="text-sm text-[#A89F91] max-w-2xl mt-1.5 leading-relaxed font-sans">
              Navigate across IP3&apos;s active transformation domains — from empirical field diagnostics and circular transitions to digital public rails and continuous adaptive delivery.
            </p>
          </div>

          {/* Interactive Navigation & Control Bar */}
          <div className="flex items-center gap-3">
            {/* Filter Tabs */}
            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-lg p-1 text-xs font-mono">
              {(
                [
                  { key: 'all', label: 'All Archive' },
                  { key: 'climate', label: 'Climate & ESG' },
                  { key: 'governance', label: 'Digital Rails' },
                  { key: 'education', label: 'Human Capacity' },
                  { key: 'systems', label: 'Systems Delivery' }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveFilter(tab.key);
                    setCurrentIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    activeFilter === tab.key
                      ? 'bg-[#8B3A2A] text-white shadow-sm font-semibold'
                      : 'text-[#A89F91] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
              title={isPlaying ? 'Pause Auto-Rotation' : 'Play Auto-Rotation'}
              aria-label={isPlaying ? 'Pause corridor movement' : 'Start corridor movement'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-[#8B3A2A] hover:border-[#8B3A2A] text-white/80 hover:text-white transition-all cursor-pointer"
                title="Previous Perspective"
                aria-label="Previous Perspective"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-[#8B3A2A] hover:border-[#8B3A2A] text-white/80 hover:text-white transition-all cursor-pointer"
                title="Next Perspective"
                aria-label="Next Perspective"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D PERSPECTIVE CORRIDOR STAGE */}
        <div
          className="relative w-full h-[380px] sm:h-[460px] md:h-[540px] lg:h-[620px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseDrag}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Central Vanishing Anchor (Horizon Center) */}
          <div className="absolute w-2 h-2 rounded-full bg-[#E89E78] shadow-[0_0_15px_#E89E78] opacity-80 pointer-events-none z-0" />

          {/* Cards along the 3D Corridor */}
          {slots.map((slot) => {
            const itemIndex = (currentIndex + slot + total * 100) % total;
            const item = filteredItems[itemIndex];
            if (!item) return null;

            // Geometry calculations for exact perspective tunnel matching the uploaded image:
            const isCenter = slot === 0;
            const isLeft = slot < 0;
            const absSlot = Math.abs(slot);

            // Distance progression from center (0 = distant vanishing point, 6 = camera foreground)
            // Left cards face inwards (positive rotateY), right cards face inwards (negative rotateY)
            const rotationY = isLeft ? 38 - absSlot * 1.5 : -(38 - absSlot * 1.5);
            
            // Non-linear horizontal spread so distant cards crowd toward 50%, outer cards hug the sides
            // xPercent from center (50%)
            const spreadFactor = Math.pow(absSlot / 6, 1.25);
            const xOffset = isCenter ? 0 : isLeft ? -spreadFactor * 48 : spreadFactor * 48;
            
            // Scale increases as cards move away from center vanishing point towards camera
            const scale = isCenter ? 0.32 : 0.34 + Math.pow(absSlot / 6, 1.3) * 0.88; // 0.32 in center up to 1.22 on edges

            // Z-index: outer cards must sit IN FRONT of inner cards to create the receding corridor effect
            const zIndex = absSlot * 10 + 10;

            // Slight opacity falloff towards deep distance
            const opacity = isCenter ? 0.75 : Math.max(0.65, 0.45 + (absSlot / 6) * 0.55);

            // Subtle vertical offset for slight curve
            const yOffset = -Math.pow(absSlot / 6, 2) * 8 + (mouseParallax.y * (7 - absSlot) * 0.15);

            return (
              <div
                key={`${slot}-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out group"
                style={{
                  transform: `translate3d(calc(-50% + ${xOffset}vw + ${mouseParallax.x * (slot * 0.2)}px), calc(-50% + ${yOffset}px), 0px) rotateY(${rotationY}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  transformOrigin: isLeft ? 'right center' : isCenter ? 'center center' : 'left center'
                }}
              >
                {/* 3D Card Body */}
                <div
                  className={`relative w-[180px] sm:w-[220px] md:w-[250px] lg:w-[280px] aspect-[9/14] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-2xl ${
                    absSlot >= 5 ? 'ring-1 ring-white/20' : 'ring-1 ring-white/10'
                  } group-hover:ring-2 group-hover:ring-[#8B3A2A] group-hover:shadow-[0_0_35px_rgba(139,58,42,0.45)]`}
                  style={{
                    backgroundColor: '#100D0B'
                  }}
                >
                  {/* Card Artwork Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlays for Cinematic Editorial Look */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
                  
                  {/* Outer edge highlight simulating lighting inside corridor */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: isLeft
                        ? 'inset -2px 0 12px rgba(255,255,255,0.15), inset 2px 0 16px rgba(0,0,0,0.8)'
                        : 'inset 2px 0 12px rgba(255,255,255,0.15), inset -2px 0 16px rgba(0,0,0,0.8)'
                    }}
                  />

                  {/* Card Content (Visible on outer cards or on hover) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end text-left pointer-events-none">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#E89E78] font-bold line-clamp-1 mb-1">
                      {item.domain}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base md:text-lg font-semibold text-white leading-tight line-clamp-2 drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#D5C8BC] line-clamp-1 mt-1 font-sans hidden sm:block opacity-90">
                      {item.subtitle}
                    </p>

                    {/* Quick Metric Pill */}
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#D5C8BC]">
                      <span className="truncate">{item.partner}</span>
                      <ArrowUpRight className="w-3 h-3 text-[#E89E78] shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>

                  {/* Top Domain Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/15 text-[9px] font-mono text-white/90">
                    0{(itemIndex % 12) + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corridor Status & Scrubber Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A89F91] border-t border-white/10 pt-4">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#8B3A2A] animate-pulse" />
            <span>
              Perspective <strong className="text-white font-bold">{currentIndex + 1}</strong> of{' '}
              <strong className="text-white font-bold">{total}</strong>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-white/70">
              Drag or use arrows to traverse 3D corridor
            </span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
            {filteredItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 h-1.5 bg-[#8B3A2A]'
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'
                }`}
                aria-label={`Jump to item ${idx + 1}: ${item.title}`}
                title={item.title}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL / LIGHTBOX VIEW */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#14110E] border border-[#302A24] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white/80 hover:text-white transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Image Column */}
            <div className="md:w-1/2 h-64 md:h-auto relative bg-black">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14110E] via-transparent to-transparent md:hidden" />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-xs font-mono text-[#E89E78] border border-white/10">
                {selectedItem.location}
              </div>
            </div>

            {/* Right Information Column */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-[#8B3A2A] font-bold">
                  {selectedItem.domain}
                </p>
                <h3 className="font-serif text-2xl font-bold text-[#F0EBE4] mt-1.5">
                  {selectedItem.title}
                </h3>
                <p className="text-sm font-sans text-[#D5C8BC] mt-1">
                  {selectedItem.subtitle}
                </p>

                <p className="text-sm text-[#A89F91] mt-4 leading-relaxed font-sans">
                  {selectedItem.description}
                </p>

                <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Institutional Partner</span>
                    <span className="text-white font-medium mt-0.5 block">{selectedItem.partner}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Outcome Metric</span>
                    <span className="text-[#E89E78] font-bold mt-0.5 block">{selectedItem.metrics}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[11px] font-mono text-[#7A6B63]">
                  IP3 Practice Architectural Archive
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-lg bg-[#8B3A2A] hover:bg-[#722F22] text-white text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  Close Archive View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
