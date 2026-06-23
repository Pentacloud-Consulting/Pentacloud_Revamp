"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const ZohoCTA = () => {
  return (
    <section className="py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Bg visual elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="bg-[#1A7FD4] rounded-[24px] sm:rounded-[48px] p-6 sm:p-12 md:p-20 text-center relative overflow-hidden shadow-[0_32px_64px_rgba(26,127,212,0.20)]"
        >
           {/* Inset shadow effect */}
           <div className="absolute inset-0 shadow-[inset_0_4px_12px_rgba(255,255,255,0.2),inset_0_-4px_12px_rgba(0,0,0,0.1)] pointer-events-none" />
           
           <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-nunito font-black text-white mb-4 sm:mb-8 leading-tight">
                Ready to Get More <br/> <span className="text-blue-200">From Your Zoho Investment?</span>
              </h2>
              
              <p className="text-blue-50/80 font-inter text-xs sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-12 leading-relaxed">
                Get a free Zoho consultation from our certified team. Whether you're new to Zoho, already using it but not getting full value, or planning a full Zoho One deployment, we'll give you honest advice and a clear plan.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6 sm:mb-12 w-full sm:w-auto">
                 <Link href="/contact" className="bg-white text-[#1A7FD4] px-5 py-3 rounded-xl sm:px-10 sm:py-5 sm:rounded-2xl font-nunito font-black text-xs sm:text-xl shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-1.5 group w-full sm:w-auto cursor-pointer">
                    <span>Book Free Zoho Consultation</span>
                    <ArrowRight className="w-4 h-4 sm:w-5.5 sm:h-5.5 group-hover:translate-x-1 transition-transform shrink-0" />
                 </Link>
                 <a href="tel:+971545132807" className="bg-blue-600/40 backdrop-blur-md text-white border border-white/20 px-5 py-3 rounded-xl sm:px-10 sm:py-5 sm:rounded-2xl font-nunito font-bold text-xs sm:text-lg flex items-center justify-center gap-1.5 hover:bg-blue-600/60 transition-all w-full sm:w-auto">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>Call +971 545 132 807</span>
                 </a>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-8 text-[9px] sm:text-[11px] font-black text-blue-100 uppercase tracking-[2px]">
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200 shrink-0" />
                    <span>Certified Zoho Partner</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200 shrink-0" />
                    <span>Free Consultation</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200 shrink-0" />
                    <span>No Obligation</span>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ZohoCTA;
