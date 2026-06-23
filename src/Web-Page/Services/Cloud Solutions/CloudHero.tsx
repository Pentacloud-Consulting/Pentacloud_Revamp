"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Cloud, Shield, Server, Activity, ArrowRight, CheckCircle2, Zap, Laptop, Smartphone
} from "lucide-react";

const CloudHero = () => {
  const [nodesOnline, setNodesOnline] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setNodesOnline((prev) => (prev < 247 ? prev + 1 : 247));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[70vh] lg:min-h-[85vh] overflow-hidden bg-[#F0F6FF] flex items-center pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12">
      {/* Background Blobs */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C8E2FA] rounded-full blur-[130px] opacity-55 pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 0], 
          y: [0, -50, 0],
          scale: [1, 1.05, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-[#D4EEFF] rounded-full blur-[100px] opacity-40 pointer-events-none" 
      />
      <motion.div 
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[#E0F7FF] rounded-full blur-[80px] opacity-30 pointer-events-none" 
      />

      {/* Cloud Particles */}
      {isMounted && [...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
          animate={{ 
            y: "-10vh",
            opacity: [0, 0.12, 0.12, 0]
          }}
          transition={{ 
            duration: 20 + Math.random() * 20, 
            repeat: Infinity, 
            delay: Math.random() * 20,
            ease: "linear"
          }}
          className="absolute text-[#1A7FD4] pointer-events-none z-0"
        >
          <Cloud size={16 + Math.random() * 24} />
        </motion.div>
      ))}

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center relative z-10">
        {/* Left Column — pinned to left edge */}
        <div className="flex flex-col items-start text-left gap-3 sm:gap-5 w-full pl-6 md:pl-12 lg:pl-16 xl:pl-24 pr-4">
          {/* Badge Row */}
          <div className="flex flex-wrap gap-2 justify-start">
            {[
              { text: "Cloud Solutions", bg: "bg-[#EEF3FF]", border: "border-[#1A7FD4]/30", color: "text-[#1A7FD4]", icon: Cloud },
              { text: "Enterprise Grade", bg: "bg-[#E8FFE8]", border: "border-[#34C98A]/30", color: "text-[#34C98A]", icon: Shield },
              { text: "99.9% Uptime", bg: "bg-[#FFF8E0]", border: "border-[#F59E0B]/30", color: "text-[#F59E0B]", icon: CheckCircle2 }
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 12, delay: i * 0.05 }}
                className={`px-2.5 py-1 sm:py-1.5 rounded-full border ${badge.bg} ${badge.border} ${badge.color} text-[8px] sm:text-[10px] font-bold tracking-wide uppercase shadow-sm flex items-center gap-1`}
              >
                <badge.icon className="w-3 h-3" />
                <span>{badge.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Headline */}
          <div className="flex flex-col items-start">
            <motion.h1 
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="font-nunito font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[60px] text-[#0D1B2A] leading-[1.2] md:leading-[1.1] tracking-tight"
            >
              Enterprise Cloud <br className="hidden sm:block" />
              Infrastructure That <br />
              <span className="bg-gradient-to-r from-[#1A7FD4] via-[#29C6E0] to-[#2563EB] bg-[length:300%_auto] bg-clip-text text-transparent animate-gradient-sweep">
                Never Sleeps.
              </span>
            </motion.h1>
          </div>

          {/* Subtext */}
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-inter text-xs sm:text-sm md:text-[15px] text-[#4A6080] leading-relaxed max-w-[500px] pr-2"
          >
            Pentacloud designs, deploys, and manages enterprise-grade cloud infrastructure, from architecture blueprints to 24/7 managed operations. Scalable, secure, and optimised for performance from day one.
          </motion.p>



          {/* Trust Line */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-[#8BA4BE] text-[9px] sm:text-[12px] font-inter flex flex-wrap items-center gap-x-2.5 gap-y-1.5"
          >
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#34C98A]" /> HIPAA + GDPR Compliant</span>
            <span className="opacity-30 hidden sm:block">·</span>
            <span className="flex items-center gap-1.5"><Cloud className="w-3.5 h-3.5 text-[#1A7FD4]" /> AWS + GCP Certified</span>
            <span className="opacity-30 hidden sm:block">·</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[#F59E0B]" fill="#F59E0B" /> 99.9% Uptime SLA</span>
          </motion.div>

          {/* Floating Cards */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mt-3 sm:mt-5 w-full relative z-20">
            {[
              { icon: Activity, title: "Uptime: 99.97%", sub: "Health", delay: 0 },
              { icon: Server, title: `${nodesOnline} Nodes`, sub: "Active Servers", delay: 1 },
              { icon: Shield, title: "All Secure", sub: "Security", delay: 2 }
            ].map((card, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: card.delay }}
                className="bg-[#E8F0F8] rounded-[10px] sm:rounded-[14px] p-1.5 sm:p-2.5 shadow-[4px_4px_10px_rgba(163,185,210,0.5),-4px_-4px_10px_rgba(255,255,255,0.9)] flex items-center gap-1.5 min-w-0 border border-white/40"
              >
                <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-white flex items-center justify-center text-[#1A7FD4] shadow-inner shrink-0">
                  <card.icon className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${i === 0 || i === 2 ? "text-green-500" : ""}`} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[6px] sm:text-[7.5px] text-[#8BA4BE] font-bold uppercase leading-none mb-0.5 truncate">{card.sub}</span>
                  <span className="text-[7.5px] sm:text-[10px] font-bold text-[#0D1B2A] whitespace-nowrap leading-none truncate">{card.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column — pinned to right edge */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", delay: 0.4 }}
          className="relative w-full max-w-full pr-6 md:pr-12 lg:pr-16 xl:pr-24 mt-6 lg:-mt-16 overflow-hidden sm:overflow-visible flex items-center justify-end"
        >
          <div className="bg-gradient-to-br from-[#EEF3FF] to-[#E0EEFF] rounded-2xl sm:rounded-[28px] p-3 sm:p-8 min-h-[260px] sm:min-h-[460px] max-w-[380px] lg:max-w-none w-full border-2 border-dashed border-[#1A7FD4]/15 shadow-[12px_12px_32px_rgba(26,127,212,0.15),-6px_-6px_16px_rgba(255,255,255,0.95)] relative flex flex-col items-center justify-center">
            
            {/* Diagram */}
            <div className="w-full flex flex-col items-center gap-6 sm:gap-10 relative -translate-y-4">
              {/* Cloud Icon */}
              <motion.div 
                animate={{ boxShadow: ["0 0 0px rgba(26,127,212,0)", "0 0 20px rgba(26,127,212,0.4)", "0 0 0px rgba(26,127,212,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center text-[#1A7FD4] shadow-lg relative z-10"
              >
                <Cloud className="w-6 h-6 sm:w-8 sm:h-8" />
              </motion.div>

              {/* Connection Lines (Top) */}
              <svg className="absolute top-10 sm:top-[60px] w-full h-[50px] sm:h-[70px] -z-0" viewBox="0 0 200 60" preserveAspectRatio="none">
                <motion.path 
                  d="M 100 0 L 30 60" 
                  stroke="#1A7FD4" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3"
                />
                <motion.path 
                  d="M 100 0 L 100 60" 
                  stroke="#1A7FD4" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3"
                />
                <motion.path 
                  d="M 100 0 L 170 60" 
                  stroke="#1A7FD4" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3"
                />
                {/* Data Dots */}
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={`top-${i}`}
                    r="2"
                    fill="#1A7FD4"
                    animate={{ 
                      offsetDistance: ["0%", "100%"],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                    style={{ offsetPath: `path('${i === 0 ? "M 100 0 L 30 60" : i === 1 ? "M 100 0 L 100 60" : "M 100 0 L 170 60"}')` }}
                  />
                ))}
              </svg>

              {/* Server Blocks */}
              <div className="flex gap-3 sm:gap-5 w-full justify-center relative z-10">
                {["Web", "API", "DB"].map((label, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-[#E8F0F8] rounded-lg p-2 sm:p-3 shadow-[4px_4px_8px_rgba(163,185,210,0.6),-4px_-4px_8px_rgba(255,255,255,0.9)] flex flex-col items-center gap-1 sm:gap-1.5 min-w-[56px] sm:min-w-[70px]"
                  >
                    <Server className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1A7FD4]" />
                    <span className="text-[8px] sm:text-[9px] font-bold text-[#0D1B2A]">{label}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  </motion.div>
                ))}
              </div>

              {/* Connection Lines (Bottom) */}
              <svg className="absolute top-[135px] sm:top-[185px] w-full h-[45px] sm:h-[60px] -z-0" viewBox="0 0 200 60" preserveAspectRatio="none">
                <motion.path 
                  d="M 30 0 L 70 60" 
                  stroke="#34C98A" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3"
                />
                <motion.path 
                  d="M 100 0 L 130 60" 
                  stroke="#34C98A" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3"
                />
                <motion.path 
                  d="M 170 0 L 130 60" 
                  stroke="#34C98A" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3"
                />
                {/* Data Dots up */}
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={`bot-${i}`}
                    r="2"
                    fill="#34C98A"
                    animate={{ 
                      offsetDistance: ["100%", "0%"],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5, ease: "linear" }}
                    style={{ offsetPath: `path('${i === 0 ? "M 30 0 L 70 60" : i === 1 ? "M 100 0 L 130 60" : "M 170 0 L 130 60"}')` }}
                  />
                ))}
              </svg>

              {/* End User Devices */}
              <div className="flex gap-3 sm:gap-5 w-full justify-center pt-2 relative z-10">
                 <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-lg p-2.5 shadow-sm border border-slate-100 flex items-center justify-center text-[#4A6080]">
                   <Laptop className="w-4 h-4 sm:w-5 sm:h-5" />
                 </motion.div>
                 <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-lg p-2.5 shadow-sm border border-slate-100 flex items-center justify-center text-[#4A6080]">
                   <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                 </motion.div>
              </div>
            </div>

            <div className="absolute bottom-3 sm:bottom-6 text-[9px] sm:text-[11px] text-[#1A7FD4]/40 font-inter">
              Cloud Architecture Blueprint
            </div>

            <div className="absolute top-[-10px] sm:top-[-12px] right-2 sm:right-4 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[#1A7FD4] text-white rounded-full font-bold text-[8px] sm:text-[10px] shadow-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> <span>End-to-End Cloud</span>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes sweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-sweep {
          animation: sweep 4s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CloudHero;
