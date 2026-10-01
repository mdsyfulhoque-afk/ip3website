import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Sliders,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  Edit2,
  X,
  Palette,
  Eye,
} from 'lucide-react';
import { useCMS, defaultEightSystemsConfig, defaultWhyIp3 } from '../context/CMSContext';
import { defaultSystemsHero } from '../data/defaultContent';
import { SystemItem, SystemMetric, SystemOverlap } from '../types';
import { ImageField } from './ImageField';

export const SystemsManager: React.FC = () => {
  const { data, updateEightSystems, updateSystemsHero, updateWhyIp3 } = useCMS();
  const config = data.eightSystems || defaultEightSystemsConfig;
  const hero = data.systemsHero || defaultSystemsHero;
  const whyIp3 = data.whyIp3 || defaultWhyIp3;
  const systems = config.systems && config.systems.length > 0 ? config.systems : defaultEightSystemsConfig.systems;

  const [expandedSystemId, setExpandedSystemId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'visuals' | 'metrics' | 'overlaps'>('content');
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleUpdateHero = <K extends keyof typeof hero>(key: K, value: typeof hero[K]) => {
    updateSystemsHero({
      ...hero,
      [key]: value,
    });
  };

  const handleUpdateHeader = <K extends keyof typeof config>(key: K, value: typeof config[K]) => {
    updateEightSystems({
      ...config,
      [key]: value,
    });
  };

  const handleUpdateSystem = (systemId: string, updater: (sys: SystemItem) => SystemItem) => {
    const nextSystems = systems.map((sys) => (sys.id === systemId ? updater(sys) : sys));
    updateEightSystems({
      ...config,
      systems: nextSystems,
    });
  };

  const handleAddSystem = () => {
    const id = `system-${Date.now()}`;
    const newSystem: SystemItem = {
      id,
      name: 'New Horizon System',
      shortName: 'New System',
      row: Math.ceil((systems.length + 1) / 4),
      color: '#38BDF8',
      glowColor: 'rgba(56, 189, 248, 0.7)',
      category: 'Governance & Institutional Architecture',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      summary: 'Brief operational overview for this strategic system domain.',
      coreMandate: 'Core systemic mission and institutional transition framework.',
      keyDrivers: ['Interconnected driver 01', 'Interconnected driver 02'],
      systemicRisks: ['Structural cascade risk 01'],
      interventions: ['Cross-jurisdictional intervention 01'],
      metrics: [
        { label: 'Domain Readiness Index', value: '78%', trend: 'up' },
        { label: 'Capital Deployed', value: '$450M', trend: 'stable' },
      ],
      overlaps: [],
    };

    updateEightSystems({
      ...config,
      systems: [...systems, newSystem],
    });
    setExpandedSystemId(id);
    showNotice('New system created!');
  };

  const handleDeleteSystem = (systemId: string) => {
    if (systems.length <= 1) {
      showNotice('At least one system must remain in the horizon.');
      return;
    }
    const nextSystems = systems.filter((s) => s.id !== systemId);
    updateEightSystems({
      ...config,
      systems: nextSystems,
    });
    if (expandedSystemId === systemId) {
      setExpandedSystemId(null);
    }
    showNotice('System removed.');
  };

  const handleMoveSystem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= systems.length) return;

    const next = [...systems];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);

    updateEightSystems({
      ...config,
      systems: next,
    });
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset the Eight Systems section back to original factory defaults?')) {
      updateEightSystems(defaultEightSystemsConfig);
      setExpandedSystemId(null);
      showNotice('Eight Systems reset to factory defaults.');
    }
  };

  const activeEditingSystem = systems.find((s) => s.id === expandedSystemId);

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Layers className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">Eight Systems & Overlapping Horizons CMS</h3>
          </div>
          <p className="text-xs text-slate-400">
            Control the 8 whole-systems domains, visual badges, interactive cards, metrics, and cross-domain overlap matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to shipped defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleAddSystem}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add System ({systems.length})</span>
          </button>
        </div>
      </div>

      {/* Systems Architecture Hero Controls (#systems-hero) */}
      <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#38d9c0] uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Systems Architecture Hero Controls</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-400">Section: #systems-hero</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Hero Badge (Monospace)</label>
            <input
              type="text"
              value={hero.badge}
              onChange={(e) => handleUpdateHero('badge', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-[#38d9c0] outline-none"
              placeholder="BUILT FOR COMPLEX MANDATES"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Headline Prefix</label>
            <input
              type="text"
              value={hero.titlePrefix}
              onChange={(e) => handleUpdateHero('titlePrefix', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-[#38d9c0] outline-none"
              placeholder="Turning complex policy challenges into"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Headline Highlight (Coral)</label>
            <input
              type="text"
              value={hero.titleHighlight}
              onChange={(e) => handleUpdateHero('titleHighlight', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-[#38d9c0] outline-none"
              placeholder="implementable, investable solutions."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Hero Narrative Description</label>
          <textarea
            rows={2}
            value={hero.description}
            onChange={(e) => handleUpdateHero('description', e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-[#38d9c0] outline-none resize-none"
            placeholder="IP3 Consulting Limited is a policy and development advisory firm..."
          />
        </div>

        {/* Hero Feature Imagery (CMS Controlled) */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <ImageField
            label="Hero Boardroom Feature Imagery (Right Side Visual)"
            value={hero.imageUrl || '/images/boardroom_meeting.jpg'}
            onChange={(url) => handleUpdateHero('imageUrl', url)}
            folder="hero"
            placeholder="/images/boardroom_meeting.jpg or https://..."
          />
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Image Alt Text (Accessibility & SEO)</label>
            <input
              type="text"
              value={hero.imageAlt || ''}
              onChange={(e) => handleUpdateHero('imageAlt', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-[#38d9c0] outline-none"
              placeholder="IP3 High-Level Advisory & Boardroom Deliberation Session"
            />
          </div>
        </div>
      </div>

      {/* Why IP³ / Four Reasons Clients Choose Us Feature Image & Content (CMS Controlled) */}
      <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
              <span>Why IP³ • Four Reasons Clients Choose Us Section</span>
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
            #orbital-system-clone-section
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Control the featured portrait photograph, alt text, and headline messaging for the Why IP³ split section.
        </p>

        <div className="pt-2 border-t border-slate-800/80 space-y-4">
          <ImageField
            label="Why IP³ Collaboration Feature Image (Left Portrait Visual)"
            value={whyIp3.imageUrl || '/images/why_ip3_collaboration.jpg'}
            onChange={(url) => {
              updateWhyIp3({
                ...whyIp3,
                imageUrl: url,
              });
              showNotice('Why IP³ feature image updated successfully');
            }}
            folder="why-ip3"
            placeholder="/images/why_ip3_collaboration.jpg or https://..."
          />

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Image Alt Text (Accessibility & SEO)</label>
            <input
              type="text"
              value={whyIp3.imageAlt || ''}
              onChange={(e) =>
                updateWhyIp3({
                  ...whyIp3,
                  imageAlt: e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-orange-400 outline-none"
              placeholder="Two women collaborating over digital policy insights and tablet interface"
            />
          </div>

          {/* Quick preset selector */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">Presets:</span>
            <button
              type="button"
              onClick={() => {
                updateWhyIp3({
                  ...whyIp3,
                  imageUrl: '/images/why_ip3_collaboration.jpg',
                });
                showNotice('Reset to Default Collaboration Image');
              }}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              Default Collaboration
            </button>
            <button
              type="button"
              onClick={() => {
                updateWhyIp3({
                  ...whyIp3,
                  imageUrl: '/images/boardroom_meeting.jpg',
                });
                showNotice('Set to Boardroom Meeting');
              }}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              Boardroom Meeting
            </button>
            <button
              type="button"
              onClick={() => {
                updateWhyIp3({
                  ...whyIp3,
                  imageUrl: '/images/boardroom_delegation.jpg',
                });
                showNotice('Set to High-Level Delegation');
              }}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              Delegation Session
            </button>
          </div>
        </div>
      </div>

      {/* Section Typography & Header Configuration */}
      <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Section Header & Typography Controls</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-400">PolySolutions • Horizon 01</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Section Subtitle / Badge</label>
            <input
              type="text"
              value={config.badge}
              onChange={(e) => handleUpdateHeader('badge', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
              placeholder="Operationalized Across 8 Interconnected Realities"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Headline Part 1 (Main Title)</label>
            <input
              type="text"
              value={config.titleMain}
              onChange={(e) => handleUpdateHeader('titleMain', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
              placeholder="Eight sectors. One "
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Headline Part 2 (Highlight)</label>
            <input
              type="text"
              value={config.titleHighlight}
              onChange={(e) => handleUpdateHeader('titleHighlight', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none"
              placeholder="integrated delivery model."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Heading Serif Typeface</label>
            <select
              value={config.fontFamily || 'newsreader'}
              onChange={(e) => handleUpdateHeader('fontFamily', e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 outline-none cursor-pointer"
            >
              <option value="newsreader">Newsreader Serif (Refined Editorial)</option>
              <option value="playfair">Playfair Display (High Contrast Classical)</option>
              <option value="cormorant">Cormorant Garamond (Graceful Archival)</option>
              <option value="instrument">Instrument Serif (Modern Precision)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-slate-300">Ambient Glow Intensity</label>
              <span className="text-[11px] font-mono text-amber-400">
                {Math.round((config.glowIntensity ?? 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.glowIntensity ?? 1}
              onChange={(e) => handleUpdateHeader('glowIntensity', parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Systems Grid List Manager */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Configured Systems ({systems.length})</span>
          </h4>
          <span className="text-[11px] text-slate-500">Click any card to edit its content & overlaps</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {systems.map((system, idx) => {
            const isExpanded = expandedSystemId === system.id;
            return (
              <div
                key={system.id}
                className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900 border-amber-500/50 shadow-lg ring-1 ring-amber-500/30'
                    : 'bg-slate-950/80 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* System Row Header */}
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    onClick={() => setExpandedSystemId(isExpanded ? null : system.id)}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: system.color, boxShadow: `0 0 8px ${system.color}` }}
                    />

                    {system.imageUrl && (
                      <img
                        src={system.imageUrl}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{system.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {system.shortName || system.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {system.summary || system.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveSystem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSystem(idx, 'down')}
                      disabled={idx === systems.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedSystemId(isExpanded ? null : system.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isExpanded
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{isExpanded ? 'Close' : 'Edit'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSystem(system.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer transition-colors"
                      title="Delete System"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Editor Accordion */}
                {isExpanded && activeEditingSystem && activeEditingSystem.id === system.id && (
                  <div className="border-t border-slate-800 p-4 bg-slate-950 space-y-5">
                    {/* Sub tabs inside the system editor */}
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('content')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          activeTab === 'content'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Core Information & Narrative
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('visuals')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          activeTab === 'visuals'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Colors & Imagery
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('metrics')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          activeTab === 'metrics'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Metrics ({system.metrics?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('overlaps')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          activeTab === 'overlaps'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Cross-Domain Overlaps ({system.overlaps?.length || 0})
                      </button>
                    </div>

                    {/* Tab 1: Core Information & Narrative */}
                    {activeTab === 'content' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">System Full Name</label>
                            <input
                              type="text"
                              value={system.name}
                              onChange={(e) =>
                                handleUpdateSystem(system.id, (s) => ({ ...s, name: e.target.value }))
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Short Name / Badge</label>
                            <input
                              type="text"
                              value={system.shortName}
                              onChange={(e) =>
                                handleUpdateSystem(system.id, (s) => ({ ...s, shortName: e.target.value }))
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Category / Domain</label>
                            <input
                              type="text"
                              value={system.category}
                              onChange={(e) =>
                                handleUpdateSystem(system.id, (s) => ({ ...s, category: e.target.value }))
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">Summary Description</label>
                          <textarea
                            rows={2}
                            value={system.summary}
                            onChange={(e) =>
                              handleUpdateSystem(system.id, (s) => ({ ...s, summary: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                            placeholder="Brief summary appearing on the front card"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">Core Mandate</label>
                          <textarea
                            rows={2}
                            value={system.coreMandate}
                            onChange={(e) =>
                              handleUpdateSystem(system.id, (s) => ({ ...s, coreMandate: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                            placeholder="Strategic mandate detailed in modal"
                          />
                        </div>

                        {/* Lists: Key Drivers, Systemic Risks, Interventions */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-medium text-emerald-400 mb-1">
                              Key Strategic Drivers (one per line)
                            </label>
                            <textarea
                              rows={4}
                              value={(system.keyDrivers || []).join('\n')}
                              onChange={(e) =>
                                handleUpdateSystem(system.id, (s) => ({
                                  ...s,
                                  keyDrivers: e.target.value.split('\n').filter((l) => l.trim() !== ''),
                                }))
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-rose-400 mb-1">
                              Systemic Risks (one per line)
                            </label>
                            <textarea
                              rows={4}
                              value={(system.systemicRisks || []).join('\n')}
                              onChange={(e) =>
                                handleUpdateSystem(system.id, (s) => ({
                                  ...s,
                                  systemicRisks: e.target.value.split('\n').filter((l) => l.trim() !== ''),
                                }))
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-sky-400 mb-1">
                              Interventions (one per line)
                            </label>
                            <textarea
                              rows={4}
                              value={(system.interventions || []).join('\n')}
                              onChange={(e) =>
                                handleUpdateSystem(system.id, (s) => ({
                                  ...s,
                                  interventions: e.target.value.split('\n').filter((l) => l.trim() !== ''),
                                }))
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Colors & Imagery */}
                    {activeTab === 'visuals' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Accent Brand Color (HEX)</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={system.color.startsWith('#') ? system.color : '#10B981'}
                                onChange={(e) => {
                                  const hex = e.target.value;
                                  handleUpdateSystem(system.id, (s) => ({
                                    ...s,
                                    color: hex,
                                  }));
                                }}
                                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                              />
                              <input
                                type="text"
                                value={system.color}
                                onChange={(e) =>
                                  handleUpdateSystem(system.id, (s) => ({ ...s, color: e.target.value }))
                                }
                                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Glow Atmosphere Color (RGBA)</label>
                            <input
                              type="text"
                              value={system.glowColor}
                              onChange={(e) =>
                                handleUpdateSystem(system.id, (s) => ({ ...s, glowColor: e.target.value }))
                              }
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                              placeholder="rgba(16, 185, 129, 0.7)"
                            />
                          </div>
                        </div>

                        {/* Image Upload/URL Field */}
                        <div className="pt-2">
                          <ImageField
                            label="Cover Imagery (Card and Deep Dive Modal Header)"
                            value={system.imageUrl || ''}
                            onChange={(url) =>
                              handleUpdateSystem(system.id, (s) => ({ ...s, imageUrl: url }))
                            }
                            folder="systems"
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Metrics */}
                    {activeTab === 'metrics' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-400">Indicators displayed on the system detail panel</p>
                          <button
                            type="button"
                            onClick={() => {
                              const newMetric: SystemMetric = {
                                label: 'New Indicator',
                                value: '100%',
                                trend: 'up',
                              };
                              handleUpdateSystem(system.id, (s) => ({
                                ...s,
                                metrics: [...(s.metrics || []), newMetric],
                              }));
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Metric</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(system.metrics || []).map((metric, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3"
                            >
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  value={metric.label}
                                  onChange={(e) => {
                                    const next = [...system.metrics];
                                    next[mIdx] = { ...next[mIdx], label: e.target.value };
                                    handleUpdateSystem(system.id, (s) => ({ ...s, metrics: next }));
                                  }}
                                  placeholder="Indicator Label"
                                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-xs text-white rounded-lg"
                                />
                                <input
                                  type="text"
                                  value={metric.value}
                                  onChange={(e) => {
                                    const next = [...system.metrics];
                                    next[mIdx] = { ...next[mIdx], value: e.target.value };
                                    handleUpdateSystem(system.id, (s) => ({ ...s, metrics: next }));
                                  }}
                                  placeholder="Value (e.g. 87% or $1.8T)"
                                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-xs text-white rounded-lg font-mono"
                                />
                                <select
                                  value={metric.trend || 'stable'}
                                  onChange={(e) => {
                                    const next = [...system.metrics];
                                    next[mIdx] = { ...next[mIdx], trend: e.target.value as any };
                                    handleUpdateSystem(system.id, (s) => ({ ...s, metrics: next }));
                                  }}
                                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-xs text-white rounded-lg cursor-pointer"
                                >
                                  <option value="up">Trend: Up (Accelerating)</option>
                                  <option value="down">Trend: Down (Declining)</option>
                                  <option value="stable">Trend: Stable</option>
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const next = system.metrics.filter((_, idx) => idx !== mIdx);
                                  handleUpdateSystem(system.id, (s) => ({ ...s, metrics: next }));
                                }}
                                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 4: Overlaps */}
                    {activeTab === 'overlaps' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-400">
                            Pairwise linkages with other systems in the whole-systems matrix
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              const other = systems.find((s) => s.id !== system.id) || systems[0];
                              const newOverlap: SystemOverlap = {
                                targetSystemId: other.id,
                                targetSystemName: other.name,
                                overlapTitle: `Nexus with ${other.shortName || other.name}`,
                                synergyDescription: 'Coordinated policy synergy across domain boundaries.',
                                compoundRisk: 'Compound cascading vulnerability when left unaddressed.',
                                jointIntervention: 'Synergistic cross-portfolio governance intervention.',
                                sharedMetrics: ['Shared domain throughput indicator'],
                              };
                              handleUpdateSystem(system.id, (s) => ({
                                ...s,
                                overlaps: [...(s.overlaps || []), newOverlap],
                              }));
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Overlap</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(system.overlaps || []).map((overlap, oIdx) => (
                            <div
                              key={oIdx}
                              className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                      Target Intersecting System
                                    </label>
                                    <select
                                      value={overlap.targetSystemId}
                                      onChange={(e) => {
                                        const targetId = e.target.value;
                                        const targetObj = systems.find((s) => s.id === targetId);
                                        const next = [...system.overlaps];
                                        next[oIdx] = {
                                          ...next[oIdx],
                                          targetSystemId: targetId,
                                          targetSystemName: targetObj?.name || targetId,
                                        };
                                        handleUpdateSystem(system.id, (s) => ({ ...s, overlaps: next }));
                                      }}
                                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-xs text-white rounded-lg cursor-pointer"
                                    >
                                      {systems
                                        .filter((s) => s.id !== system.id)
                                        .map((s) => (
                                          <option key={s.id} value={s.id}>
                                            {s.name} ({s.shortName})
                                          </option>
                                        ))}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                      Overlap Link Title
                                    </label>
                                    <input
                                      type="text"
                                      value={overlap.overlapTitle}
                                      onChange={(e) => {
                                        const next = [...system.overlaps];
                                        next[oIdx] = { ...next[oIdx], overlapTitle: e.target.value };
                                        handleUpdateSystem(system.id, (s) => ({ ...s, overlaps: next }));
                                      }}
                                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-xs text-white rounded-lg"
                                      placeholder="e.g. Green Industrial Strategy & Stranded Assets"
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = system.overlaps.filter((_, idx) => idx !== oIdx);
                                    handleUpdateSystem(system.id, (s) => ({ ...s, overlaps: next }));
                                  }}
                                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg cursor-pointer mt-4"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                    Synergy Description
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={overlap.synergyDescription}
                                    onChange={(e) => {
                                      const next = [...system.overlaps];
                                      next[oIdx] = { ...next[oIdx], synergyDescription: e.target.value };
                                      handleUpdateSystem(system.id, (s) => ({ ...s, overlaps: next }));
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-xs text-white rounded-lg"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                    Joint Policy Intervention
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={overlap.jointIntervention}
                                    onChange={(e) => {
                                      const next = [...system.overlaps];
                                      next[oIdx] = { ...next[oIdx], jointIntervention: e.target.value };
                                      handleUpdateSystem(system.id, (s) => ({ ...s, overlaps: next }));
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-xs text-white rounded-lg"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SystemsManager;
