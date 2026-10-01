import React from 'react';
import {
  Layers,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  Sliders,
  Gauge,
  Compass,
} from 'lucide-react';
import { useCMS, defaultCorridorHero } from '../context/CMSContext';
import { CorridorHeroConfig, CorridorImage } from '../types';
import { ImageField } from './ImageField';

interface CorridorManagerProps {
  onShowToast?: (msg: string) => void;
}

export const CorridorManager: React.FC<CorridorManagerProps> = ({ onShowToast }) => {
  const { data, updateCorridorHero } = useCMS();
  const config: CorridorHeroConfig = data.corridorHero ?? defaultCorridorHero;

  const handleUpdate = (updated: Partial<CorridorHeroConfig>) => {
    updateCorridorHero({
      ...config,
      ...updated,
    });
  };

  const handleImageChange = (index: number, key: keyof CorridorImage, val: string) => {
    const updatedImages = [...config.images];
    updatedImages[index] = {
      ...updatedImages[index],
      [key]: val,
    };
    handleUpdate({ images: updatedImages });
  };

  const handleAddCard = () => {
    const newCard: CorridorImage = {
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
      alt: `System Node 0${config.images.length + 1}`,
      badge: 'Systems',
      tagline: 'Translational Impact',
    };
    const newImages = [...config.images, newCard];
    handleUpdate({
      images: newImages,
      cards: newImages.length,
    });
    onShowToast?.('New card added to corridor.');
  };

  const handleDeleteCard = (index: number) => {
    if (config.images.length <= 2) {
      alert('The corridor requires at least 2 cards to maintain continuous projection.');
      return;
    }
    const newImages = config.images.filter((_, i) => i !== index);
    handleUpdate({
      images: newImages,
      cards: Math.min(config.cards, newImages.length),
    });
    onShowToast?.('Card removed from corridor.');
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.images.length) return;
    const newImages = [...config.images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIdx];
    newImages[targetIdx] = temp;
    handleUpdate({ images: newImages });
  };

  const handleReset = () => {
    if (window.confirm('Reset the Visual Corridor stream to default 8-system configuration?')) {
      updateCorridorHero(defaultCorridorHero);
      onShowToast?.('Corridor reset to default 8 systems.');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner & Global Controls */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                3D Visual Corridor // Perspective Stream
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
                  CMS Controlled
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Live dual-rail 3D corridor rendered before Section 01 // Who We Are
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => handleUpdate({ enabled: e.target.checked })}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 bg-slate-800 border-slate-700"
              />
              <span className="text-xs font-bold text-slate-200">
                {config.enabled ? 'Corridor Active' : 'Corridor Disabled'}
              </span>
            </label>
          </div>
        </div>

        {/* Section Title & Eyebrow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Corridor Overlay Title / Caption
            </label>
            <input
              type="text"
              value={config.title ?? ''}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              placeholder="Corridor of Practice // 8 Key Intersections"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Badge Label
            </label>
            <input
              type="text"
              value={config.badge ?? ''}
              onChange={(e) => handleUpdate({ badge: e.target.value })}
              placeholder="Visual Corridor"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Physics & Geometry Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-orange-400" />
                Loop Cycle Speed
              </span>
              <span className="font-mono text-orange-400 font-bold">{config.speed}s</span>
            </div>
            <input
              type="range"
              min={10}
              max={40}
              step={1}
              value={config.speed}
              onChange={(e) => handleUpdate({ speed: Number(e.target.value) })}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Lower is faster rush; higher is slower flow</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Cards on Rail
              </span>
              <span className="font-mono text-amber-400 font-bold">{config.cards} cards</span>
            </div>
            <input
              type="range"
              min={4}
              max={16}
              step={1}
              value={config.cards}
              onChange={(e) => handleUpdate({ cards: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Denser rails with more cards</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                Vanishing Horizon Axis
              </span>
              <span className="font-mono text-sky-400 font-bold">{config.axis}%</span>
            </div>
            <input
              type="range"
              min={35}
              max={70}
              step={1}
              value={config.axis}
              onChange={(e) => handleUpdate({ axis: Number(e.target.value) })}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Vertical horizon percentage (default 55%)</p>
          </div>
        </div>
      </div>

      {/* Cards List Manager */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Corridor Card Deck
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-mono text-slate-300">
                {config.images.length} cards active
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Each card streams continuously through both left and right corridor rails.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddCard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Corridor Card
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.images.map((img, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3.5 hover:border-slate-700 transition-colors relative"
            >
              {/* Card Header & Controls */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-[180px]">
                    {img.alt || `Card 0${idx + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveCard(idx, 'up')}
                    className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move earlier in corridor"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === config.images.length - 1}
                    onClick={() => handleMoveCard(idx, 'down')}
                    className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move later in corridor"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCard(idx)}
                    className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 ml-1 cursor-pointer"
                    title="Delete card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Image Uploader & Preview */}
              <div className="space-y-1">
                <ImageField
                  label={`Card 0${idx + 1} Image`}
                  value={img.src}
                  onChange={(val) => handleImageChange(idx, 'src', val)}
                  folder="corridor-stream"
                  placeholder="https://images.unsplash.com/... or upload CDN asset"
                />
              </div>

              {/* Title / Description */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Title / Subject Description
                </label>
                <input
                  type="text"
                  value={img.alt ?? ''}
                  onChange={(e) => handleImageChange(idx, 'alt', e.target.value)}
                  placeholder="e.g. Institutional Systems & Modern Architecture"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* System Badge & Tagline */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase">
                    Domain Tag
                  </label>
                  <input
                    type="text"
                    value={img.badge ?? ''}
                    onChange={(e) => handleImageChange(idx, 'badge', e.target.value)}
                    placeholder="e.g. Climate, Architecture"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase">
                    Sub-Tagline
                  </label>
                  <input
                    type="text"
                    value={img.tagline ?? ''}
                    onChange={(e) => handleImageChange(idx, 'tagline', e.target.value)}
                    placeholder="e.g. Translational Impact"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CorridorManager;
