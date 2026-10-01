import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Mail,
  X,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowLeft,
  Users,
  RotateCw,
  RotateCcw,
} from 'lucide-react';
import { FACULTY_MEMBERS, FacultyMember } from '../data/peopleData';
import { useCMS } from '../context/CMSContext';

export interface PeoplePageProps {
  darkMode?: boolean;
  onOpenTalk?: () => void;
  onOpenCollaborate?: (area?: string) => void;
  onNavigateHome?: () => void;
  onNavigateAbout?: () => void;
  onNavigateApproach?: () => void;
  onNavigateFocus?: (sectionId?: string) => void;
  onNavigateServices?: () => void;
}

interface FacultyFlipCardProps {
  member: FacultyMember;
  index: number;
  onOpenModal: (member: FacultyMember) => void;
  onInquire: (member: FacultyMember) => void;
}

const FacultyFlipCard: React.FC<FacultyFlipCardProps> = ({
  member,
  index,
  onOpenModal,
  onInquire,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => setIsFlipped((prev) => !prev)}
      className="w-full h-full min-h-[500px] cursor-pointer select-none"
      style={{ perspective: '1200px' }}
    >
      <div
        className="relative w-full h-full rounded-2xl [transform-style:preserve-3d]"
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)',
        }}
      >
        {/* FRONT FACE */}
        <div
          className="w-full h-full bg-[#12202B] border border-[#3C3F45] hover:border-[#EF715A]/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl flex flex-col justify-between group transition-colors"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div>
            {/* Photo & Header Badge */}
            <div className="relative h-64 overflow-hidden bg-[#152735]">
              <img
                src={member.imageUrl || (member as any).image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('photo-1534528741775')) {
                    target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12202B] via-[#12202B]/20 to-transparent opacity-95" />

              {/* Member Name on Photo bottom */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-cardo font-bold text-[#F3F0E8] leading-tight">
                  {member.name}
                </h3>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-4">
              <p className="text-xs font-semibold text-[#EF715A] tracking-wide">
                {member.role}
              </p>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Domain of Practice:
                </span>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {member.domain}
                </p>
              </div>

              <p className="text-xs text-[#AEB0AE] line-clamp-3 leading-relaxed font-light">
                {member.bio}
              </p>

              {/* Expertise Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {member.expertise.slice(0, 3).map((exp) => (
                  <span
                    key={exp}
                    className="text-[10px] bg-[#152735] text-[#AEB0AE] border border-[#3C3F45] px-2 py-0.5 rounded font-mono"
                  >
                    {exp}
                  </span>
                ))}
                {member.expertise.length > 3 && (
                  <span className="text-[10px] text-slate-400 self-center font-mono">
                    +{member.expertise.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#101D28] via-[#0E1A22] to-[#0A131A] border-2 border-[#EF715A]/70 rounded-2xl p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="space-y-4">
            {/* Header on Back Side */}
            <div className="flex items-start justify-between border-b border-[#3C3F45] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EF715A]/15 border border-[#EF715A]/40 flex items-center justify-center font-mono text-sm font-bold text-[#EF715A] shadow-inner">
                  {member.initials}
                </div>
                <div>
                  <h4 className="text-base font-cardo font-bold text-[#F3F0E8] leading-tight">
                    {member.name}
                  </h4>
                  <span className="text-[10px] font-mono text-[#EF715A] uppercase tracking-wider block">
                    {member.categoryLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Role */}
            <div>
              <p className="text-xs font-semibold text-[#EF715A]">
                {member.role}
              </p>
            </div>

            {/* Academic Credentials */}
            {member.education && member.education.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#EF715A] font-bold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Academic Credentials</span>
                </div>
                <div className="space-y-1 pl-1">
                  {member.education.map((edu) => (
                    <div key={edu} className="text-xs text-[#F3F0E8] flex items-start gap-1.5">
                      <span className="text-[#EF715A] font-bold leading-tight">•</span>
                      <span className="leading-snug">{edu}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extended Insight / Focus */}
            <div className="space-y-1 bg-[#12202B]/90 p-3 rounded-xl border border-[#3C3F45]/70">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                Translational Contribution:
              </span>
              <p className="text-xs text-[#AEB0AE] leading-relaxed line-clamp-3">
                {member.extendedBio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const PeoplePage: React.FC<PeoplePageProps> = ({
  darkMode = true,
  onOpenTalk,
  onOpenCollaborate,
  onNavigateHome,
  onNavigateAbout,
  onNavigateApproach,
  onNavigateFocus,
  onNavigateServices,
}) => {
  const { data } = useCMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<FacultyMember | null>(null);

  // Source list of faculty members dynamically from database/CMS with bundled fallback
  const allMembers = useMemo(() => {
    return (data.facultyMembers && data.facultyMembers.length > 0)
      ? data.facultyMembers
      : FACULTY_MEMBERS;
  }, [data.facultyMembers]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const categories = [
    { id: 'all', label: 'All Faculty & Fellows' },
    { id: 'leadership', label: 'Executive Leadership' },
    { id: 'economics', label: 'Economics & Public Finance' },
    { id: 'climate', label: 'Climate & Environment' },
    { id: 'data', label: 'Data, AI & Digital' },
    { id: 'education', label: 'Education & Human Capital' },
    { id: 'law', label: 'Law & Governance' },
  ];

  const filteredMembers = useMemo(() => {
    return allMembers.filter((member) => {
      const matchesCategory =
        selectedCategory === 'all' || member.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const nameMatch = member.name.toLowerCase().includes(q);
      const roleMatch = member.role.toLowerCase().includes(q);
      const domainMatch = member.domain.toLowerCase().includes(q);
      const bioMatch = member.bio.toLowerCase().includes(q);
      const expertiseMatch = member.expertise.some((e) =>
        e.toLowerCase().includes(q)
      );

      return nameMatch || roleMatch || domainMatch || bioMatch || expertiseMatch;
    });
  }, [allMembers, selectedCategory, searchQuery]);

  const handleInquireWithMember = (member: FacultyMember) => {
    setSelectedMember(null);
    if (onOpenCollaborate) {
      onOpenCollaborate(`${member.name} (${member.role})`);
    } else if (onOpenTalk) {
      onOpenTalk();
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1A22] text-[#F3F0E8] font-sans selection:bg-[#EF715A] selection:text-white">
      {/* Top Breadcrumb & Quick Subnav */}
      <div className="border-b border-[#3C3F45]/60 bg-[#12202B]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#AEB0AE]">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#EF715A] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-[#3C3F45]" />
            <button
              onClick={onNavigateAbout}
              className="hover:text-[#EF715A] transition-colors cursor-pointer"
            >
              About Us
            </button>
            <ChevronRight className="w-3 h-3 text-[#3C3F45]" />
            <span className="text-[#EF715A] font-semibold">IP3 People</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateAbout}
              className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1 rounded bg-[#152735] border border-[#3C3F45] hover:border-[#EF715A]/50 transition-colors cursor-pointer"
            >
              About Overview
            </button>
            <button
              onClick={onNavigateApproach}
              className="text-xs font-mono text-slate-300 hover:text-white px-3 py-1 rounded bg-[#152735] border border-[#3C3F45] hover:border-[#EF715A]/50 transition-colors cursor-pointer"
            >
              Our Approach
            </button>
            <button
              onClick={onOpenTalk}
              className="text-xs font-semibold px-3 py-1 rounded bg-[#EF715A] text-white hover:bg-[#E05E47] transition-colors shadow-sm cursor-pointer"
            >
              Inquire / Collaborate
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-[#3C3F45]/60 bg-gradient-to-b from-[#0E1A22] via-[#12202B] to-[#0E1A22]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#EF715A]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#152735] border border-[#EF715A]/40 text-[#EF715A] text-xs font-mono uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" />
              <span>IP3 People · Global Faculty</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cardo tracking-tight text-[#F3F0E8] uppercase leading-[1.1]">
              The People Behind <br />
              <span className="text-[#EF715A] italic normal-case">Actionable</span> Systemic Change
            </h1>

            <p className="text-base sm:text-lg text-[#AEB0AE] font-light leading-relaxed">
              IP3 combines the analytical rigour of premier economists and researchers with the operational experience of practitioners, legal architects, and institutional engineers. Together, we translate complex insights into durable capability across emerging economies.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#3C3F45]/80">
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-cardo font-bold text-[#F3F0E8]">30+</span>
                <p className="text-xs font-mono text-[#AEB0AE] uppercase tracking-wider">Faculty &amp; Fellows</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-cardo font-bold text-[#EF715A]">4</span>
                <p className="text-xs font-mono text-[#AEB0AE] uppercase tracking-wider">Core Practice Domains</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-cardo font-bold text-[#F3F0E8]">15+</span>
                <p className="text-xs font-mono text-[#AEB0AE] uppercase tracking-wider">Sovereign Engagements</p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl sm:text-3xl font-cardo font-bold text-[#EF715A]">1</span>
                <p className="text-xs font-mono text-[#AEB0AE] uppercase tracking-wider">Translational Studio</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Roster Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Search & Category Filter Controls */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#AEB0AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, expertise, or domain (e.g. Economics, Climate, Law)..."
                className="w-full bg-[#12202B] border border-[#3C3F45] focus:border-[#EF715A] text-sm text-[#F3F0E8] placeholder:text-[#AEB0AE]/60 pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <span className="text-xs font-mono text-[#AEB0AE] self-center md:self-auto">
              Showing <span className="text-[#EF715A] font-bold">{filteredMembers.length}</span> of {allMembers.length} leaders &amp; specialists
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#EF715A] text-white font-bold shadow-md shadow-[#EF715A]/20'
                      : 'bg-[#12202B] text-[#AEB0AE] hover:text-white border border-[#3C3F45] hover:border-[#EF715A]/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Member Cards Grid */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#3C3F45] rounded-2xl bg-[#12202B]/40 space-y-4">
            <Search className="w-8 h-8 text-[#AEB0AE] mx-auto opacity-50" />
            <h3 className="text-xl font-cardo text-[#F3F0E8]">No faculty members matched your criteria</h3>
            <p className="text-sm text-[#AEB0AE] max-w-md mx-auto">
              Try resetting your search query or selecting a different practice domain above.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-semibold px-4 py-2 rounded bg-[#152735] border border-[#3C3F45] text-[#EF715A] hover:bg-[#EF715A] hover:text-white transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <FacultyFlipCard
                key={member.id}
                member={member}
                index={index}
                onOpenModal={(m) => setSelectedMember(m)}
                onInquire={(m) => handleInquireWithMember(m)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl bg-[#12202B] border border-[#3C3F45] rounded-3xl overflow-hidden shadow-2xl z-10 my-8 max-h-[90vh] flex flex-col"
            >
              {/* Header with image & basic details */}
              <div className="relative bg-[#152735] p-6 sm:p-8 border-b border-[#3C3F45]">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#0E1A22]/80 border border-[#3C3F45] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#EF715A]/60 shadow-xl shrink-0">
                    <img
                      src={selectedMember.imageUrl}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#EF715A] block">
                      {selectedMember.categoryLabel} · {selectedMember.affiliation}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-cardo font-bold text-[#F3F0E8]">
                      {selectedMember.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      {selectedMember.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scrollable details */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#EF715A]">
                    Domain &amp; Specialization
                  </h4>
                  <p className="text-sm text-[#F3F0E8] font-medium">
                    {selectedMember.domain}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#EF715A]">
                    Executive Biography
                  </h4>
                  <p className="text-sm text-[#AEB0AE] leading-relaxed font-light">
                    {selectedMember.extendedBio}
                  </p>
                </div>

                {/* Strategic Quote Callout */}
                <div className="p-4 rounded-2xl bg-[#152735] border-l-4 border-l-[#EF715A] border border-[#3C3F45]/70 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#EF715A] block">
                    Strategic Philosophy &amp; Impact
                  </span>
                  <p className="text-sm text-slate-200 italic font-light">
                    "{selectedMember.strategicContribution}"
                  </p>
                </div>

                {/* Key Expertise */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#EF715A]">
                    Areas of Advisory &amp; Technical Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="text-xs bg-[#152735] text-slate-200 border border-[#3C3F45] px-3 py-1 rounded-lg font-mono"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Academic Background if present */}
                {selectedMember.education && selectedMember.education.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#EF715A] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#EF715A]" />
                      <span>Education &amp; Credentials</span>
                    </h4>
                    <ul className="space-y-1">
                      {selectedMember.education.map((edu, i) => (
                        <li key={i} className="text-xs text-[#AEB0AE] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF715A]" />
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Selected Themes */}
                {selectedMember.selectedThemes && selectedMember.selectedThemes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#EF715A] flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#EF715A]" />
                      <span>Key Research &amp; Advisory Themes</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.selectedThemes.map((theme, i) => (
                        <span
                          key={i}
                          className="text-xs bg-[#0E1A22] text-[#AEB0AE] border border-[#3C3F45] px-3 py-1 rounded-md"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Action Footer */}
              <div className="p-6 bg-[#0E1A22] border-t border-[#3C3F45] flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2.5 rounded-lg border border-[#3C3F45] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => handleInquireWithMember(selectedMember)}
                  className="px-6 py-2.5 rounded-lg bg-[#EF715A] hover:bg-[#E05E47] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Mail className="w-4 h-4" />
                  <span>Inquire / Collaborate with {selectedMember.name.split(' ')[0]}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
