"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import { CLAY_CARD } from "./Constants";

const packages = [
  {
    name: "Zoho Starter",
    bestFor: "Small businesses implementing 1–2 Zoho apps",
    price: "₹35,000",
    timeline: "2–3 Weeks",
    included: [
      "1 Zoho app implementation (CRM or Books)",
      "Basic configuration",
      "Data migration (up to 10,000 records)",
      "1 integration setup",
      "Half-day user training",
      "14-day post-go-live support",
      "Email support"
    ],
    featured: false
  },
  {
    name: "Zoho Growth",
    bestFor: "Growing SMBs implementing 3–5 Zoho apps",
    price: "₹95,000",
    timeline: "4–6 Weeks",
    included: [
      "Up to 5 Zoho app implementations",
      "Full configuration & customisation",
      "Custom modules & workflows",
      "Data migration (up to 100,000 records)",
      "Up to 3 integrations",
      "Full-day user training per app",
      "Custom reports & dashboards",
      "30-day post-go-live support",
      "Dedicated account manager",
      "Phone & email support"
    ],
    featured: true
  },
  {
    name: "Zoho Enterprise",
    bestFor: "Organisations deploying full Zoho One suite",
    price: "Custom",
    timeline: "8–16 Weeks",
    included: [
      "Full Zoho One deployment",
      "All apps configured for your business",
      "Custom Deluge scripting",
      "Unlimited data migration",
      "All integrations required",
      "Department-specific training",
      "Admin training programme",
      "SSO & user management setup",
      "90-day post-go-live support",
      "Monthly support retainer option",
      "Quarterly optimisation reviews"
    ],
    featured: false
  }
];

const retainers = [
  { name: "Basic", price: "₹8,000/month", hours: "4hrs support" },
  { name: "Standard", price: "₹15,000/month", hours: "8hrs support" },
  { name: "Premium", price: "₹28,000/month", hours: "16hrs support" }
];

const ZohoPackages = () => {
  return (
    <section className="py-10 px-4 sm:px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 bg-blue-50 text-[#1A7FD4] rounded-full text-[8.5px] sm:text-[10px] font-black uppercase tracking-[3px] mb-4 sm:mb-6"
          >
            ENGAGEMENT OPTIONS
          </motion.div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-nunito font-black text-[#0D1B2A] mb-4 sm:mb-6 leading-tight">
            Zoho Packages That <br/> <span className="text-[#1A7FD4]">Fit Your Business</span>
          </h2>
          <p className="text-[#4A6080] font-inter text-xs sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From a single Zoho app implementation to a full Zoho One deployment, we have a package that fits your needs and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-24">
          {packages.map((pkg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative ${CLAY_CARD} p-5 sm:p-10 flex flex-col ${pkg.featured ? "border-[#1A7FD4]/30 shadow-[16px_16px_40px_rgba(26,127,212,0.15)] ring-2 ring-[#1A7FD4]/20" : ""} rounded-[20px] sm:rounded-[32px]`}
            >
               {pkg.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A7FD4] text-white px-4 py-1 rounded-full text-[8.5px] sm:text-[10px] font-black tracking-widest uppercase shadow-lg leading-none">
                    MOST POPULAR
                  </div>
               )}
               
               <div className="mb-4 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-nunito font-black text-[#0D1B2A] mb-1 sm:mb-2">{pkg.name}</h3>
                  <p className="text-[11px] sm:text-xs font-bold text-[#4A6080] mb-4 sm:mb-6">{pkg.bestFor}</p>
                  <div className="flex items-baseline gap-1">
                     <span className="text-2xl sm:text-4xl font-nunito font-black text-[#1A7FD4] leading-none">{pkg.price}</span>
                     {pkg.price !== "Custom" && <span className="text-xs sm:text-sm font-bold text-[#4A6080]">onwards</span>}
                  </div>
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider">
                     <span>Timeline: {pkg.timeline}</span>
                  </div>
               </div>

               <div className="space-y-3 mb-6 sm:space-y-4 sm:mb-10 flex-grow">
                  {pkg.included.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 min-w-0">
                       <div className="w-3.5 h-3.5 rounded-full bg-blue-50 flex items-center justify-center text-[#1A7FD4] shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} />
                       </div>
                       <span className="text-[11px] sm:text-xs font-bold text-[#4A6080] leading-tight truncate">{item}</span>
                    </div>
                  ))}
               </div>

               <button className={`w-full py-3 rounded-xl sm:py-4 sm:rounded-2xl font-nunito font-black text-xs sm:text-lg transition-all cursor-pointer ${pkg.featured ? "bg-[#1A7FD4] text-white shadow-lg hover:-translate-y-1" : "bg-slate-100 text-[#0D1B2A] hover:bg-slate-200"}`}>
                  Choose {pkg.name.split(' ')[1]}
               </button>
            </motion.div>
          ))}
        </div>

        {/* Support Retainers */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           className={`${CLAY_CARD} p-5 sm:p-10 bg-white/40 border-white/60 rounded-[20px] sm:rounded-[32px]`}
        >
           <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="max-w-md w-full">
                 <div className="inline-block px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-3 sm:mb-4 leading-none">
                    MONTHLY SUPPORT PLANS
                 </div>
                 <h3 className="text-xl sm:text-2xl font-nunito font-black text-[#0D1B2A] mb-2 sm:mb-4">Dedicated Zoho Support</h3>
                 <p className="text-xs sm:text-sm text-[#4A6080] font-inter mb-4 sm:mb-0 leading-relaxed">
                    Ensure your Zoho ecosystem stays healthy, updated, and optimized with our monthly managed support plans.
                 </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full md:w-auto">
                 {retainers.map((r, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-xl sm:p-6 sm:rounded-3xl border border-slate-100 shadow-sm text-center group hover:border-[#1A7FD4]/30 transition-all min-w-0">
                       <p className="text-[8.5px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">{r.name}</p>
                       <p className="text-base sm:text-lg font-nunito font-black text-[#0D1B2A] mb-0.5 sm:mb-1">{r.price}</p>
                       <p className="text-[10px] sm:text-xs font-bold text-[#1A7FD4]">{r.hours}</p>
                    </div>
                  ))}
              </div>
           </div>
           
           <div className="mt-6 pt-5 border-t border-slate-200/50 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 justify-center text-[8.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                 <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1A7FD4] shrink-0" />
                 <span>48hr response SLA</span>
              </div>
              <div className="flex items-center gap-2">
                 <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1A7FD4] shrink-0" />
                 <span>monthly review call</span>
              </div>
              <div className="flex items-center gap-2">
                 <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1A7FD4] shrink-0" />
                 <span>zoho update management</span>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ZohoPackages;
