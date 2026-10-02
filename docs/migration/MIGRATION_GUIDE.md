# Migration Guide: Porting to AdnanInTheSky/ip3adnanv17 Base

## Status

The core work from this redesign has been adapted for integration into the AdnanInTheSky/ip3adnanv17 base repository, which uses a different architecture:

- **Source (current)**: mdsyfulhoque-afk/ip3website - Full page-based app with GSAP animations
- **Target (base)**: AdnanInTheSky/ip3adnanv17 - Single-page app with Motion library
- **Branch**: Both have been prepared on `redesign` branches

## What Was Ported

### 1. Video Assets (All Formats)
- **IP3 Brand Reel**: `public/videos/ip3-reel.mp4`, `.webm`, `-poster.webp`
- **Garment Loop**: `public/videos/garment-loop.mp4`, `.webm`, `-poster.webp`
- **Climate Data**: `public/videos/climate-data.mp4`, `.webm`, `-poster.webp`

### 2. Terminal Section Images
All 4 terminal beats with responsive formats (800w and 1600w, AVIF and WebP):
- `public/media/terminal-lenses-*`
- `public/media/terminal-studio-*`
- `public/media/terminal-modules-*`
- `public/media/terminal-briefs-*`

### 3. Components (Simplified for Base Architecture)
- **BrandFilmSection.tsx**: Video player with play/pause, no scroll animations
- **PolicyIntelligenceTerminal.tsx**: Tab-based beat navigation, no GSAP timelines

## Key Architectural Differences

| Aspect | mdsyfulhoque-afk | AdnanInTheSky |
|--------|------------------|---------------|
| **Routing** | React Router (full pages) | Modal-based navigation (single page) |
| **Animation** | GSAP + ScrollTrigger | Motion library / CSS |
| **Layout** | Scroll-driven sections | Stacked full-width sections |
| **State** | Content context + router | CMS context (MongoDB) |

## Integration Steps

### Step 1: Create Redesign Branch on AdnanInTheSky Repo
```bash
cd /path/to/adnaninthesky/ip3adnanv17
git checkout -b redesign origin/main
```

### Step 2: Copy Video Assets
Copy from mdsyfulhoque-afk/ip3website:
```bash
cp -r /path/to/ip3website/public/video/* ./public/videos/
cp /path/to/ip3website/public/media/terminal-* ./public/media/
```

### Step 3: Add Components
Copy from `docs/migration/components/`:
- `BrandFilmSection.tsx` → `src/components/`
- `PolicyIntelligenceTerminal.tsx` → `src/components/`

### Step 4: Update App.tsx
Import the new components:
```typescript
import { BrandFilmSection } from './components/BrandFilmSection';
import { PolicyIntelligenceTerminal } from './components/PolicyIntelligenceTerminal';
```

Add to home page (after PresentationSlider):
```typescript
<BrandFilmSection
  videoSrc="/videos/ip3-reel.mp4"
  posterSrc="/videos/ip3-reel-poster.webp"
/>
<PolicyIntelligenceTerminal
  onContact={() => setIsTalkModalOpen(true)}
/>
```

### Step 5: Verify Styling
Both components use Tailwind classes compatible with the base theme:
- Colors: `#ff7e67` (primary), `#050a12` (bg), `#f8fafc` (text)
- Spacing: `clamp()` for responsive padding
- Dark mode: Already applied via base CSS variables

## Content Integration

The components accept props for:
- `kicker`, `heading`, `lead` - Text content
- `beats` - Terminal section beats with title, text, points, photoKey
- `pipeline` - Terminal pipeline steps
- `videoSrc`, `posterSrc` - Media paths

These can be:
1. Hardcoded in App.tsx (current simple approach)
2. Moved to MongoDB via CMS (more scalable)
3. Imported from a content JSON file

## Testing Checklist

- [ ] Video playback works (MP4 and WebM formats)
- [ ] Terminal beat navigation works smoothly
- [ ] Images load from correct paths
- [ ] Responsive design at mobile/tablet/desktop
- [ ] Dark mode colors display correctly
- [ ] No console errors in development
- [ ] Production build completes successfully

## Deployment

Once integrated and tested:
```bash
npm run build
npm run preview
# Then deploy to Vercel as usual
```

## Fallback Plan

If push access to AdnanInTheSky/ip3adnanv17 is not available:
1. The components and assets are staged in this repo under `docs/migration/`
2. Manual copy-paste of files is possible
3. All changes are minimal and don't touch the base's existing code

## Files in This Migration

- `MIGRATION_GUIDE.md` - This file
- `components/BrandFilmSection.tsx` - Video section component
- `components/PolicyIntelligenceTerminal.tsx` - Terminal section component
- `assets-checklist.md` - Detailed asset inventory

See `AdnanInTheSky/ip3adnanv17` redesign branch for the full integration.
