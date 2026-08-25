"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Calendar, User, ArrowRight,
  Search, Clock, Tag, ChevronRight, Mail,
  TrendingUp, BookOpen, Loader2
} from "lucide-react";
import Link from 'next/link';
import { CATEGORIES, BlogPageTop } from './Blog page Top';
import { fetchPublishedBlogs, PublicBlog } from './Blog Saveed';

// ─── Design Tokens ───────────────────────────────────────────────
const CLAY_CARD =
  "bg-background rounded-[20px] sm:rounded-[28px] shadow-[8px_8px_16px_rgba(163,185,210,0.4),-8px_-8px_16px_rgba(255,255,255,0.9)]";

const CLAY_PILL =
  "rounded-full shadow-[2px_2px_6px_rgba(163,185,210,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)]";

// ─── Framer variants ──────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.05, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// ─── Featured Card ────────────────────────────────────────────────
const FeaturedCard = ({ blog }: { blog: PublicBlog }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className={`${CLAY_CARD} overflow-hidden group cursor-pointer col-span-full lg:col-span-2`}
  >
    <div className="flex flex-col lg:flex-row h-full">
      {/* Image */}
      <Link
        href={`/blogs/${blog.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative lg:w-1/2 h-44 sm:h-64 lg:h-auto overflow-hidden shrink-0 block"
      >
        <img
          src={blog.image}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-linear-to-br ${blog.gradient} opacity-20`} />
        <div
          className="absolute bottom-4 left-4 rounded-full px-3 py-1 text-[9px] sm:text-[11px] font-bold tracking-wider bg-background"
          style={{ color: blog.tagColor }}
        >
          {blog.tag}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 sm:p-10 flex flex-col justify-between lg:w-1/2">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-[12px] text-[#8BA4BE] mb-3 sm:mb-5 font-inter">
            <span className="flex items-center gap-1"><Calendar size={12} />{blog.date}</span>
            <span className="flex items-center gap-1"><User size={12} />{blog.author}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{blog.readTime}</span>
          </div>
          <h2 className="font-nunito font-black text-lg sm:text-2xl lg:text-3xl text-[#0D1B2A] mb-3 sm:mb-5 group-hover:text-[#1A7FD4] transition-colors duration-300 leading-tight">
            {blog.title}
          </h2>
          <p className="font-inter text-xs sm:text-sm md:text-[15px] text-[#4A6080] leading-relaxed sm:leading-[1.75]">
            {blog.excerpt}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100">
          <Link
            href={`/blogs/${blog.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-nunito font-bold text-xs sm:text-[14px] text-[#1A7FD4] group/btn"
            style={{ color: blog.accent }}
          >
            Read Full Article
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Regular Blog Card ────────────────────────────────────────────
const BlogCard = ({ blog, index }: { blog: PublicBlog; index: number }) => (
  <motion.div
    variants={fadeUp}
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
    className={`${CLAY_CARD} overflow-hidden group cursor-pointer flex flex-col`}
  >
    {/* Image */}
    <Link
      href={`/blogs/${blog.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="relative h-40 sm:h-52 overflow-hidden shrink-0 block"
    >
      <img
        src={blog.image}
        alt={blog.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className={`absolute inset-0 bg-linear-to-br ${blog.gradient} opacity-20`} />
      <div
        className="absolute top-3 left-3 rounded-full px-3 py-1 text-[9px] sm:text-[11px] font-nunito font-bold tracking-wider bg-background"
        style={{ color: blog.tagColor }}
      >
        {blog.tag}
      </div>
    </Link>

    {/* Content */}
    <div className="p-4 sm:p-7 flex flex-col flex-1">
      <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-[#8BA4BE] mb-2 sm:mb-4 font-inter">
        <span className="flex items-center gap-1"><Calendar size={11} />{blog.date}</span>
        <span className="flex items-center gap-1"><Clock size={11} />{blog.readTime}</span>
      </div>

      <h3 className="font-nunito font-extrabold text-sm sm:text-[18px] text-[#0D1B2A] mb-2 sm:mb-3 group-hover:text-[#1A7FD4] transition-colors duration-300 leading-snug flex-1">
        {blog.title}
      </h3>

      <p className="font-inter text-xs sm:text-[13px] text-[#4A6080] leading-relaxed sm:leading-[1.7] mb-3 sm:mb-5 line-clamp-3">
        {blog.excerpt}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        <Link
          href={`/blogs/${blog.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-nunito font-bold text-xs sm:text-[13px] group/btn"
          style={{ color: blog.accent }}
        >
          Read More
          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  </motion.div>
);

// ─── Skeleton Loader ─────────────────────────────────────────────
const SkeletonCard = () => (
  <div className={`${CLAY_CARD} overflow-hidden flex flex-col animate-pulse`}>
    <div className="h-40 sm:h-52 bg-gray-200 shrink-0" />
    <div className="p-4 sm:p-7 flex flex-col gap-3">
      <div className="h-3 w-24 bg-gray-200 rounded-full" />
      <div className="h-5 w-full bg-gray-200 rounded-full" />
      <div className="h-5 w-3/4 bg-gray-200 rounded-full" />
      <div className="h-3 w-full bg-gray-100 rounded-full mt-2" />
      <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────
export default function Blogs() {
  const [blogs, setBlogs] = useState<PublicBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  // ── Fetch live blogs from Supabase on mount ──
  useEffect(() => {
    setIsLoading(true);
    fetchPublishedBlogs()
      .then(data => setBlogs(data))
      .catch(err => console.error('Blog fetch error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const featured = blogs.find(b => b.featured);

  const isDefaultView = activeCategory === "All categories" && !searchQuery;
  const gridBlogs = isDefaultView ? blogs.filter(b => !b.featured) : blogs;

  const filtered = gridBlogs.filter(b => {
    const matchCat = activeCategory === "All categories" || b.category === activeCategory;
    const matchSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <main className="relative w-full min-h-screen bg-background pt-20 sm:pt-28 pb-6 sm:pb-12 overflow-x-hidden">

      {/* ── Background blobs ── */}
      <div className="fixed top-0 right-0 w-175 h-175 bg-[#C8E2FA] rounded-full mix-blend-multiply filter blur-[140px] opacity-25 pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-125 h-125 bg-[#D4EEFF] rounded-full mix-blend-multiply filter blur-[120px] opacity-25 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        <BlogPageTop
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          setVisibleCount={setVisibleCount}
        />

        {/* ══ LOADING SKELETONS ═══════════════════════════════════ */}
        {isLoading && (
          <div className="space-y-8">
            {/* Featured skeleton */}
            <div className={`${CLAY_CARD} overflow-hidden animate-pulse flex flex-col lg:flex-row h-72`}>
              <div className="lg:w-1/2 bg-gray-200 shrink-0" />
              <div className="flex-1 p-10 flex flex-col gap-4">
                <div className="h-3 w-32 bg-gray-200 rounded-full" />
                <div className="h-8 w-3/4 bg-gray-200 rounded-xl" />
                <div className="h-4 w-full bg-gray-100 rounded-full" />
                <div className="h-4 w-5/6 bg-gray-100 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* ══ FEATURED CARD ══════════════════════════════════════ */}
            <AnimatePresence>
              {activeCategory === "All categories" && !searchQuery && featured && (
                <motion.div
                  key="featured"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-8 sm:mb-10"
                >
                  <FeaturedCard blog={featured} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ══ BLOG GRID ══════════════════════════════════════════ */}
            <AnimatePresence mode="wait">
              {visible.length > 0 ? (
                <motion.div
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8"
                >
                  {visible.map((blog, i) => (
                    <BlogCard key={blog.id} blog={blog} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 sm:py-24"
                >
                  <div className={`${CLAY_CARD} inline-block px-8 py-8 sm:px-12 sm:py-10`}>
                    <Search size={32} className="text-[#8BA4BE] mx-auto mb-3" />
                    <p className="font-nunito font-bold text-base sm:text-[18px] text-[#0D1B2A] mb-1 sm:mb-2">
                      No articles found
                    </p>
                    <p className="font-inter text-xs sm:text-[14px] text-[#8BA4BE]">
                      Try a different search term or category
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ══ LOAD MORE ══════════════════════════════════════════ */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex justify-center mt-8 sm:mt-12"
              >
                <button
                  onClick={() => setVisibleCount(v => v + 3)}
                  className={`${CLAY_PILL} cursor-pointer flex items-center gap-1.5 bg-background text-[#1A7FD4] font-nunito font-bold text-xs sm:text-[14px] px-6 py-3.5 sm:px-8 sm:py-4 hover:-translate-y-0.5 transition-all duration-300`}
                >
                  Load More Articles
                  <ChevronRight size={14} />
                </button>
              </motion.div>
            )}

            {/* ══ STATS STRIP ════════════════════════════════════════ */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 mb-0"
            >
              {[
                { num: `${blogs.length}`, label: "Articles Published", icon: BookOpen },
                { num: (() => { const r = blogs.length * 350; return r >= 1000 ? `${(r / 1000).toFixed(1)}K+` : `${r}+`; })(), label: "Monthly Readers", icon: User },
                { num: `${new Set(blogs.map(b => b.category).filter(Boolean)).size}`, label: "Topic Categories", icon: Tag },
                { num: "500+", label: "Newsletter Subscribers", icon: Mail },
              ].map(({ num, label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`${CLAY_CARD} p-4 sm:p-6 text-center`}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-background shadow-[inset_1.5px_1.5px_3px_rgba(163,185,210,0.25),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.7)] flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Icon size={15} className="text-[#1A7FD4]" />
                  </div>
                  <div className="font-nunito font-black text-lg sm:text-2xl text-[#1A7FD4] mb-0.5 sm:mb-1">{num}</div>
                  <div className="font-inter text-[10px] sm:text-[12px] text-[#8BA4BE]">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

      </div>
    </main>
  );
}