"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Calendar, User, ArrowRight, MessageSquare,
  Search, Clock, Tag, ChevronRight, Mail,
  TrendingUp, BookOpen
} from "lucide-react";

// ─── Design Tokens ───────────────────────────────────────────────
const CLAY_CARD =
  "bg-background rounded-[20px] sm:rounded-[28px] shadow-[8px_8px_16px_rgba(163,185,210,0.4),-8px_-8px_16px_rgba(255,255,255,0.9)]";

const CLAY_PILL =
  "rounded-full shadow-[2px_2px_6px_rgba(163,185,210,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)]";

// ─── Blog Data ────────────────────────────────────────────────────
const CATEGORIES = ["All", "Salesforce", "Cloud", "Digital Marketing", "App Dev", "Web Dev", "Data Migration"];

const BLOGS = [
  {
    id: 1,
    category: "Salesforce",
    tag: "SALESFORCE",
    tagColor: "#1A7FD4",
    tagBg: "#EEF3FF",
    date: "April 28, 2025",
    author: "Pentacloud Team",
    readTime: "6 min read",
    comments: 14,
    title: "How AI is Revolutionising Salesforce Consulting in 2025",
    excerpt:
      "Einstein AI, predictive lead scoring, and automated workflows are reshaping how businesses use Salesforce. Here's what your CRM strategy needs to look like this year.",
    gradient: "from-[#EEF3FF] to-[#D4EEFF]",
    accent: "#1A7FD4",
    featured: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    category: "Cloud",
    tag: "CLOUD",
    tagColor: "#29C6E0",
    tagBg: "#E0F7FF",
    date: "April 18, 2025",
    author: "Cloud Team",
    readTime: "8 min read",
    comments: 9,
    title: "AWS vs Azure vs GCP: Which Cloud Is Right for Your Business in 2025?",
    excerpt:
      "A practical breakdown of the three major cloud platforms, comparing cost, compliance, performance, and which industries benefit most from each.",
    gradient: "from-[#E0F7FF] to-[#C8F0F8]",
    accent: "#29C6E0",
    featured: false,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    category: "Digital Marketing",
    tag: "MARKETING",
    tagColor: "#EC4899",
    tagBg: "#FFE8F0",
    date: "April 10, 2025",
    author: "Marketing Team",
    readTime: "5 min read",
    comments: 21,
    title: "Why Your Google Ads Are Wasting Budget (And How to Fix It)",
    excerpt:
      "Most PPC campaigns waste 40–60% of their budget on the wrong keywords, audiences, and match types. Here's our step-by-step optimisation framework.",
    gradient: "from-[#FFE8F0] to-[#FFD4E8]",
    accent: "#EC4899",
    featured: false,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    category: "Salesforce",
    tag: "SALESFORCE",
    tagColor: "#1A7FD4",
    tagBg: "#EEF3FF",
    date: "March 30, 2025",
    author: "Salesforce Team",
    readTime: "7 min read",
    comments: 11,
    title: "Salesforce Health Check: 10 Signs Your Org Needs Attention",
    excerpt:
      "From duplicate records and broken automation to security vulnerabilities, here are the 10 most common Salesforce org issues we find in every audit.",
    gradient: "from-[#EEF3FF] to-[#D4EEFF]",
    accent: "#1A7FD4",
    featured: false,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 5,
    category: "App Dev",
    tag: "APP DEV",
    tagColor: "#8B5CF6",
    tagBg: "#F3E8FF",
    date: "March 22, 2025",
    author: "Dev Team",
    readTime: "6 min read",
    comments: 8,
    title: "React Native vs Flutter in 2025: Which Should You Choose?",
    excerpt:
      "After building 30+ cross-platform apps, here's our honest comparison of React Native and Flutter, performance, ecosystem, hiring, and total cost.",
    gradient: "from-[#F3E8FF] to-[#E9D8FD]",
    accent: "#8B5CF6",
    featured: false,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 6,
    category: "Cloud",
    tag: "CLOUD",
    tagColor: "#29C6E0",
    tagBg: "#E0F7FF",
    date: "March 14, 2025",
    author: "Cloud Team",
    readTime: "9 min read",
    comments: 16,
    title: "How We Cut a Client's Cloud Bill by 47% in 90 Days",
    excerpt:
      "A real case study from one of our cloud cost optimisation engagements, the exact strategies we used to find and eliminate wasted cloud spend.",
    gradient: "from-[#E0F7FF] to-[#C8F0F8]",
    accent: "#29C6E0",
    featured: false,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 7,
    category: "Data Migration",
    tag: "DATA",
    tagColor: "#F59E0B",
    tagBg: "#FFF8E0",
    date: "March 5, 2025",
    author: "Data Team",
    readTime: "7 min read",
    comments: 6,
    title: "Zero Data Loss: Our Complete CRM Migration Checklist",
    excerpt:
      "Migrating CRM data is one of the riskiest IT projects a business can undertake. Here's the exact 27-point checklist we use on every migration.",
    gradient: "from-[#FFF8E0] to-[#FDECC8]",
    accent: "#F59E0B",
    featured: false,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 8,
    category: "Web Dev",
    tag: "WEB DEV",
    tagColor: "#34C98A",
    tagBg: "#E8FFE8",
    date: "February 24, 2025",
    author: "Web Team",
    readTime: "5 min read",
    comments: 19,
    title: "Core Web Vitals in 2025: What's Changed and Why It Matters",
    excerpt:
      "Google's page experience signals have evolved. Here's what LCP, CLS, and INP mean for your website's rankings and what you need to fix today.",
    gradient: "from-[#E8FFE8] to-[#C8F5E0]",
    accent: "#34C98A",
    featured: false,
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 9,
    category: "Digital Marketing",
    tag: "MARKETING",
    tagColor: "#EC4899",
    tagBg: "#FFE8F0",
    date: "February 15, 2025",
    author: "Marketing Team",
    readTime: "6 min read",
    comments: 24,
    title: "LinkedIn Ads for B2B: The Strategy That Generated 120 Leads in 90 Days",
    excerpt:
      "A behind-the-scenes breakdown of the exact LinkedIn campaign strategy we ran for a B2B client, targeting, creative, budget, and results.",
    gradient: "from-[#FFE8F0] to-[#FFD4E8]",
    accent: "#EC4899",
    featured: false,
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&q=80&w=600"
  },
];

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
const FeaturedCard = ({ blog }: { blog: typeof BLOGS[0] }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className={`${CLAY_CARD} overflow-hidden group cursor-pointer col-span-full lg:col-span-2`}
  >
    <div className="flex flex-col lg:flex-row h-full">
      {/* Image */}
      <div
        className="relative lg:w-1/2 h-44 sm:h-64 lg:h-auto overflow-hidden shrink-0"
      >
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-linear-to-br ${blog.gradient} opacity-20`} />
        
        {/* Featured badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#1A7FD4] text-white rounded-full px-3 py-1 text-[9px] sm:text-[11px] font-bold tracking-wider shadow-lg">
          <TrendingUp size={11} />
          FEATURED
        </div>
        {/* Category */}
        <div
          className="absolute bottom-4 left-4 rounded-full px-3 py-1 text-[9px] sm:text-[11px] font-bold tracking-wider bg-background shadow-[2px_2px_5px_rgba(163,185,210,0.3),-2px_-2px_5px_rgba(255,255,255,0.8)]"
          style={{ color: blog.tagColor }}
        >
          {blog.tag}
        </div>
      </div>

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
          <button
            className="flex items-center gap-1.5 font-nunito font-bold text-xs sm:text-[14px] text-[#1A7FD4] group/btn"
            style={{ color: blog.accent }}
          >
            Read Full Article
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-1.5 text-[#8BA4BE]">
            <MessageSquare size={13} />
            <span className="text-[10px] sm:text-[12px] font-inter">{blog.comments}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Regular Blog Card ────────────────────────────────────────────
const BlogCard = ({ blog, index }: { blog: typeof BLOGS[0]; index: number }) => (
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
    <div className="relative h-40 sm:h-52 overflow-hidden shrink-0">
      <img 
        src={blog.image} 
        alt={blog.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className={`absolute inset-0 bg-linear-to-br ${blog.gradient} opacity-20`} />
      
      <div
        className={`${CLAY_PILL} absolute top-3 left-3 px-3 py-1 text-[9px] sm:text-[11px] font-nunito font-bold tracking-wider bg-background`}
        style={{ color: blog.tagColor }}
      >
        {blog.tag}
      </div>
    </div>

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
        <button
          className="flex items-center gap-1.5 font-nunito font-bold text-xs sm:text-[13px] group/btn"
          style={{ color: blog.accent }}
        >
          Read More
          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
        <div className="flex items-center gap-1 text-[#8BA4BE]">
          <MessageSquare size={13} />
          <span className="text-[10px] sm:text-[11px] font-inter">{blog.comments}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Main Page ────────────────────────────────────────────────────
export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const featured = BLOGS.find((b) => b.featured)!;
  const rest = BLOGS.filter((b) => !b.featured);

  const filtered = rest.filter((b) => {
    const matchCat = activeCategory === "All" || b.category === activeCategory;
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
            transition={{ duration: 0.7, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${CLAY_CARD} flex items-center gap-2.5 max-w-md mx-auto px-4 py-2.5 rounded-full`}
          >
            <Search size={16} className="text-[#8BA4BE] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(6); }}
              placeholder="Search articles..."
              className="flex-1 font-inter text-xs sm:text-[14px] text-[#0D1B2A] bg-transparent outline-none placeholder:text-[#8BA4BE]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#8BA4BE] hover:text-[#1A7FD4] text-[10px] sm:text-xs font-bold"
              >
                ✕
              </button>
            )}
          </motion.div>
        </div>

        {/* ══ CATEGORY FILTERS ═══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-14"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
              className={`${CLAY_PILL} cursor-pointer px-3.5 py-1.5 sm:px-5 sm:py-2.5 font-nunito font-bold text-xs sm:text-[13px] transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[#1A7FD4] text-white scale-105 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)]"
                  : "bg-background text-[#4A6080] hover:-translate-y-0.5"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* ══ FEATURED CARD (only when All & no search) ══════════ */}
        <AnimatePresence>
          {activeCategory === "All" && !searchQuery && (
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8"
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
              onClick={() => setVisibleCount((v) => v + 3)}
              className={`${CLAY_PILL} cursor-pointer flex items-center gap-1.5 bg-background text-[#1A7FD4] font-nunito font-bold text-xs sm:text-[14px] px-6 py-3.5 sm:px-8 sm:py-4 hover:-translate-y-0.5 transition-all duration-300`}
            >
              Load More Articles
              <ChevronRight size={14} />
            </button>
          </motion.div>
        )}

        {/* ══ BLOG STATS ROW ═════════════════════════════════════ */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 mb-0"
        >
          {[
            { num: "50+", label: "Articles Published", icon: BookOpen },
            { num: "5K+", label: "Monthly Readers", icon: User },
            { num: "7", label: "Topic Categories", icon: Tag },
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

      </div>
    </main>
  );
}