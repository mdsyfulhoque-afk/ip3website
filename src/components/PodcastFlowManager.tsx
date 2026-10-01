import React from 'react';
import {
  Radio,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Play,
  Gauge,
  HelpCircle,
  Film,
  CheckCircle2,
} from 'lucide-react';
import { useCMS, defaultPodcastCarousel } from '../context/CMSContext';
import { PodcastCarouselConfig, PodcastCardItem } from '../types';
import { ImageField } from './ImageField';

interface PodcastFlowManagerProps {
  onShowToast?: (msg: string) => void;
}

export const PodcastFlowManager: React.FC<PodcastFlowManagerProps> = ({ onShowToast }) => {
  const { data, updatePodcastCarousel } = useCMS();
  const config: PodcastCarouselConfig = data.podcastCarousel ?? defaultPodcastCarousel;

  const handleUpdate = (updated: Partial<PodcastCarouselConfig>) => {
    updatePodcastCarousel({
      ...config,
      ...updated,
    });
  };

  const handleItemChange = (index: number, key: keyof PodcastCardItem, val: any) => {
    const updatedItems = [...config.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [key]: val,
    };
    handleUpdate({ items: updatedItems });
  };

  const handleAddItem = () => {
    const newItem: PodcastCardItem = {
      id: `ep-${Date.now()}`,
      title: `New Podcast Episode ${config.items.length + 1}`,
      imageSrc: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
      youtubeUrl: 'https://www.youtube.com/watch?v=gT_uK0Y7oFw',
      badgeText: 'IP³ PODCAST',
      headlinePrimary: 'Policy & Innovation',
      headlineSecondary: 'In Practice',
      questionMark: false,
    };
    const newItems = [...config.items, newItem];
    handleUpdate({ items: newItems });
    onShowToast?.('New podcast card added to carousel.');
  };

  const handleDeleteItem = (index: number) => {
    if (config.items.length <= 2) {
      alert('The carousel requires at least 2 cards to maintain smooth continuous flow.');
      return;
    }
    const newItems = config.items.filter((_, i) => i !== index);
    handleUpdate({ items: newItems });
    onShowToast?.('Podcast card removed.');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= config.items.length) return;
    const newItems = [...config.items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    handleUpdate({ items: newItems });
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset the podcast flow carousel back to default settings & episodes?')) {
      updatePodcastCarousel(defaultPodcastCarousel);
      onShowToast?.('Reset podcast carousel to default content.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Global Controls */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Podcast Flow Carousel</h3>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    config.enabled
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {config.enabled ? 'Active on Approach Page' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Infinite flowing video cards positioned before the "Current to Desired State" section.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleAddItem}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Episode</span>
            </button>
          </div>
        </div>

        {/* Global Configuration Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
          {/* Section Visibility Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Display Section</p>
              <p className="text-[11px] text-slate-400">Show or hide the carousel on the Approach page</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => handleUpdate({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* Flow Speed Adjustment */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Gauge className="w-3.5 h-3.5 text-rose-400" />
                <span>Flow Speed:</span>
                <span className="text-rose-400 font-mono">{config.speed ?? 40} px/s</span>
              </div>
              <div className="flex items-center gap-1">
                {[
                  { label: 'Slow', val: 26 },
                  { label: 'Normal', val: 40 },
                  { label: 'Fast', val: 65 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleUpdate({ speed: preset.val })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight cursor-pointer ${
                      config.speed === preset.val
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min="15"
              max="100"
              step="1"
              value={config.speed ?? 40}
              onChange={(e) => handleUpdate({ speed: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Episode Cards Grid / List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Film className="w-3.5 h-3.5 text-slate-400" />
            <span>Podcast Episode Cards ({config.items.length})</span>
          </h4>
          <span className="text-[11px] text-slate-500">Drag or use arrow buttons to reorder</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {config.items.map((item, index) => (
            <div
              key={item.id || `card-${index}`}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center justify-center font-mono">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[200px] sm:max-w-md">
                    {item.title || `Episode ${index + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Move earlier"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === config.items.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Move later"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer ml-1"
                    title="Delete episode"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body: Thumbnail & Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left: Thumbnail Preview & Image Field */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-inner">
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white text-[#1d4ed8] flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-[#1d4ed8] ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <ImageField
                    label="Thumbnail Image"
                    value={item.imageSrc}
                    onChange={(url) => handleItemChange(index, 'imageSrc', url)}
                    helpText="Recommended: 16:9 aspect ratio image"
                  />
                </div>

                {/* Right: Text Graphics & Badges */}
                <div className="lg:col-span-8 space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Episode / Video Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                      placeholder="e.g. Problem Solving কি বাস্তব জীবনে প্রভাব ফেলে?"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-red-400 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                        <span>YouTube Video URL or Video ID</span>
                      </span>
                      {item.youtubeUrl && (
                        <a
                          href={item.youtubeUrl.startsWith('http') ? item.youtubeUrl : `https://www.youtube.com/watch?v=${item.youtubeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-red-400 hover:text-red-300 normal-case underline"
                        >
                          Test Link
                        </a>
                      )}
                    </label>
                    <input
                      type="text"
                      value={item.youtubeUrl || ''}
                      onChange={(e) => handleItemChange(index, 'youtubeUrl', e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or 11-char ID"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono text-xs"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Visitors who click this card in the carousel will watch this YouTube video in the popup player.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Red Badge Tag
                      </label>
                      <input
                        type="text"
                        value={item.badgeText || ''}
                        onChange={(e) => handleItemChange(index, 'badgeText', e.target.value)}
                        placeholder="e.g. Problem Solving কি"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Primary Headline (Yellow)
                      </label>
                      <input
                        type="text"
                        value={item.headlinePrimary || ''}
                        onChange={(e) => handleItemChange(index, 'headlinePrimary', e.target.value)}
                        placeholder="e.g. বাস্তব জীবনে"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-amber-300 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Secondary Headline (White)
                      </label>
                      <input
                        type="text"
                        value={item.headlineSecondary || ''}
                        onChange={(e) => handleItemChange(index, 'headlineSecondary', e.target.value)}
                        placeholder="e.g. প্রভাব ফেলে?"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* Question Mark Icon Toggle */}
                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(item.questionMark)}
                        onChange={(e) => handleItemChange(index, 'questionMark', e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                        Show Cyan Question Mark Icon on Headline
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
