# Asset Migration Checklist

## Video Files (9 files)

### IP3 Reel (Brand Film)
- [x] `ip3-reel.mp4` - H.264 video (primary format)
- [x] `ip3-reel.webm` - VP9 video (fallback format)
- [x] `ip3-reel-poster.webp` - Poster frame for video player

**Destination**: `public/videos/`

### Garment Loop
- [x] `garment-loop.mp4` - H.264 video
- [x] `garment-loop.webm` - VP9 video
- [x] `garment-loop-poster.webp` - Poster frame

**Used in**: Portfolio page (currently optional, can be used in future)
**Destination**: `public/videos/`

### Climate Data
- [x] `climate-data.mp4` - H.264 video
- [x] `climate-data.webm` - VP9 video
- [x] `climate-data-poster.webp` - Poster frame

**Used in**: Focus/Domains pages (currently optional, can be used in future)
**Destination**: `public/videos/`

## Terminal Section Images (16 files)

All images have responsive variants (800px and 1600px widths) in two formats (WebP and AVIF).

### Terminal Lenses Section (4 files)
- [x] `terminal-lenses-800.webp`
- [x] `terminal-lenses-1600.webp`
- [x] `terminal-lenses-800.avif`
- [x] `terminal-lenses-1600.avif`

### Terminal Studio Section (4 files)
- [x] `terminal-studio-800.webp`
- [x] `terminal-studio-1600.webp`
- [x] `terminal-studio-800.avif`
- [x] `terminal-studio-1600.avif`

### Terminal Modules Section (4 files)
- [x] `terminal-modules-800.webp`
- [x] `terminal-modules-1600.webp`
- [x] `terminal-modules-800.avif`
- [x] `terminal-modules-1600.avif`

### Terminal Briefs Section (4 files)
- [x] `terminal-briefs-800.webp`
- [x] `terminal-briefs-1600.webp`
- [x] `terminal-briefs-800.avif`
- [x] `terminal-briefs-1600.avif`

**Destination**: `public/media/`
**Format Strategy**: 
- WebP for modern browsers (smaller, good quality)
- AVIF for newest browsers (smaller still)
- Two widths (800px for mobile, 1600px for desktop)

## Component Code Files (2 files)

### BrandFilmSection.tsx
**Location**: `src/components/BrandFilmSection.tsx`
**Size**: ~2.2 KB (TypeScript/React)
**Dependencies**: React, Tailwind CSS
**Features**:
- Video player with play/pause button
- Responsive aspect ratio (16:9)
- WebM/MP4 format selection
- Poster frame display
- Touch-friendly controls

### PolicyIntelligenceTerminal.tsx
**Location**: `src/components/PolicyIntelligenceTerminal.tsx`
**Size**: ~4.8 KB (TypeScript/React)
**Dependencies**: React, Tailwind CSS
**Features**:
- 4-beat tab navigation
- Responsive image display (srcSet)
- Pipeline progress visualization
- CTA button integration
- Smooth beat transitions with CSS animations

## Verification Steps

### Video Files
```bash
# Check file sizes
ls -lh public/videos/

# Test playback in browser
# Verify both mp4 and webm load correctly
```

### Images
```bash
# Verify all terminal images exist
ls -l public/media/terminal-*

# Test image loading with srcSet
# Verify 800px and 1600px variants load appropriately
```

### Components
```bash
# Type check
npm run lint

# Build
npm run build

# Visual inspection in dev
npm run dev
# Navigate to and view both sections
```

## Size Summary

| Category | Count | Total Size | Notes |
|----------|-------|-----------|-------|
| Videos | 9 | ~180 MB | Largest asset category |
| Images | 16 | ~2.5 MB | Optimized formats |
| Components | 2 | ~7 KB | Minimal code footprint |

## Deployment Considerations

1. **Video Streaming**: MP4/WebM are served directly; consider CDN for large deployments
2. **Image Optimization**: AVIF/WebP with fallbacks ensure broad browser support
3. **Build Size**: Videos should be in `public/` (not bundled); add to `.gitignore` if needed
4. **Caching**: Static assets can be cached aggressively
5. **Loading**: Use `loading="lazy"` and `decoding="async"` for images

## Browser Support

- **Video Formats**: MP4 (H.264) supported in all browsers; WebM fallback for Firefox
- **Image Formats**: WebP widely supported; AVIF for newest browsers
- **Components**: ES2020+ JavaScript; works in all modern browsers
- **Tailwind CSS**: v4.x required (already in base repo)

## Post-Migration Checklist

- [ ] All 9 video files copied to `public/videos/`
- [ ] All 16 terminal images copied to `public/media/`
- [ ] Both component files added to `src/components/`
- [ ] App.tsx imports and uses new components
- [ ] No console errors in dev build
- [ ] Responsive design works at all breakpoints
- [ ] Video playback tested in at least 2 browsers
- [ ] Production build succeeds
- [ ] Deployed to staging environment
- [ ] QA testing completed
