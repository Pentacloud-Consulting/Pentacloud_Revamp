import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Filter, ChevronDown } from 'lucide-react';

const CLAY_CARD = "bg-background rounded-[20px] sm:rounded-[28px] shadow-[8px_8px_16px_rgba(163,185,210,0.4),-8px_-8px_16px_rgba(255,255,255,0.9)]";
const CLAY_PILL = "rounded-full shadow-[2px_2px_6px_rgba(163,185,210,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)]";

export const CATEGORIES = [
  "All categories", 
  "Salesforce Consulting", 
  "Zoho Service", 
  "Cloud Solution", 
  "Web Development", 
  "App Development", 
  "Digital Marketing", 
  "Data Migration", 
  "Consulting And Training"
];

export function BlogPageTop({ searchQuery, setSearchQuery, activeCategory, setActiveCategory, setVisibleCount }: any) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      {/* ══ HERO HEADER ════════════════════════════════════════ */}
      <div className="text-center mb-8 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${CLAY_PILL} inline-flex items-center gap-1.5 bg-background text-[#1A7FD4] font-nunito font-bold text-[10px] sm:text-[11px] tracking-[3px] px-4 py-1.5 mb-4 sm:mb-6 shadow-[inset_3px_3px_8px_rgba(163,185,210,0.25),inset_-3px_-3px_8px_rgba(255,255,255,0.7)]`}
        >
          <BookOpen size={11} />
          INSIGHTS & UPDATES
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] as any }}
          className="font-nunito font-black text-2xl sm:text-4xl md:text-6xl text-[#0D1B2A] mb-3 sm:mb-5 leading-[1.2] md:leading-[1.1]"
        >
          Insights &{" "}
          <span className="text-[#1A7FD4] relative">
            Innovation
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
              className="absolute bottom-0 left-0 w-full h-0.75 bg-[#1A7FD4]/30 rounded-full origin-left block"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-inter text-[#4A6080] max-w-2xl mx-auto text-xs sm:text-base md:text-[17px] leading-relaxed mb-6 sm:mb-10 px-2"
        >
          Stay ahead with our latest thoughts on Salesforce excellence, Cloud strategy,
          Digital marketing, and the future of enterprise technology.
        </motion.p>

        {/* ── Search Bar ── */}
      </div>

      {/* ── Search & Filter Row ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 w-full mb-8 sm:mb-12"
      >
        {/* Search Bar (Left) */}
        <div className={`${CLAY_CARD} w-full sm:flex-1 flex items-center gap-3 px-5 py-3.5 sm:py-4 rounded-full transition-all duration-300 focus-within:shadow-[8px_8px_20px_rgba(26,127,212,0.15),-8px_-8px_20px_rgba(255,255,255,0.9)]`}>
          <Search size={20} className="text-[#8BA4BE] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(6); }}
            placeholder="Search articles, insights, or categories..."
            className="flex-1 font-inter text-sm sm:text-[15px] text-[#0D1B2A] bg-transparent outline-none placeholder:text-[#8BA4BE] min-w-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[#8BA4BE] hover:text-[#1A7FD4] text-sm font-bold transition-colors p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Dropdown (Right) */}
        <div className="relative w-full sm:w-auto shrink-0 z-50">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`${CLAY_CARD} flex items-center justify-between gap-3 px-5 py-3.5 sm:py-4 font-nunito font-bold text-sm sm:text-[15px] text-[#0D1B2A] rounded-full w-full sm:w-[240px] transition-all duration-300 hover:-translate-y-0.5`}
          >
            <Filter size={18} className="text-[#1A7FD4] shrink-0" />
            <span className="truncate flex-1 text-left">{activeCategory}</span>
            <ChevronDown size={18} className={`text-[#8BA4BE] shrink-0 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 sm:left-auto sm:right-0 mt-3 w-full sm:w-[260px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.15)] border border-white/20 overflow-hidden"
              >
                <div className="flex flex-col max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setVisibleCount(6);
                        setIsFilterOpen(false);
                      }}
                      className={`text-left px-4 py-3 rounded-xl font-nunito font-bold text-sm transition-all duration-200 ${
                        activeCategory === cat
                          ? "bg-[#1A7FD4] text-white shadow-md"
                          : "bg-transparent text-[#4A6080] hover:bg-[#F0F7FF] hover:text-[#1A7FD4]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
