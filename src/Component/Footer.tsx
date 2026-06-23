"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Cloud,
  Settings,
  Database,
  Code,
  Smartphone,
  Globe,
  RefreshCw,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CTA from "@/Web-Page/Landing/CTA";

const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/pentacloudconsulting/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/pentacloudconsulting/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    )
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61573242994665&mibextid=wwXIfr&rdid=a9vdt4aEsAkRZwBi&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CP9RauVy6%2F%3Fmibextid%3DwwXIfr#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    )
  },
  {
    name: "Twitter",
    url: "https://x.com/pentacloudind?s=21",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M20 4L4 20" />
      </svg>
    )
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Footer = () => {
  return (
    <div className="relative">
      {/* CTA Section - Light Theme Area */}
      <section className="bg-background pt-4 sm:pt-6 pb-1 relative z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
          <CTA />
        </div>
      </section>

      {/* Dark Footer Section */}
      <footer className="relative bg-[#020617] pt-8 pb-4 overflow-hidden">
        {/* Animated Background Grid & Orbs */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none" 
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          
          {/* Animated Links Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-0 mb-8 sm:mb-10 w-full"
          >
            {/* Brand Info */}
            <motion.div variants={itemVariants} className="flex flex-col items-start gap-4 sm:gap-6 w-full lg:w-[35%] lg:pr-8">
              <Image 
                src="/Logo/Pentacloud logo.png" 
                alt="Pentacloud Logo" 
                width={150} 
                height={38} 
                className="h-8 sm:h-10 w-auto object-contain brightness-0 invert"
              />
              <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-[280px] lg:max-w-[320px]">
                Architecting the future of business with cutting-edge cloud infrastructure, automation, and enterprise integrations.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>

              {/* Big Background Text - Desktop */}
              <div className="hidden lg:block w-[1200px] lg:w-[1400px] pointer-events-none select-none z-0 mt-2 sm:mt-6 -ml-1">
                <span className="text-[16vw] sm:text-[140px] lg:text-[9vw] leading-[0.75] font-black text-white/5 tracking-tight text-left block">
                  PENTACLOUD
                </span>
              </div>
            </motion.div>

            {/* Explore Links */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:gap-4 w-full lg:w-[12%]">
              <h4 className="text-white font-bold text-base sm:text-lg lg:text-xl tracking-wide mb-1 sm:mb-2">Explore</h4>
              <ul className="flex flex-col gap-2.5">
                {[
                  { name: 'About', href: '/about' },
                  { name: 'Blogs', href: '/blogs' },
                  { name: 'Contact', href: '/contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition-all duration-300 inline-flex items-center group">
                      <ArrowRight className="w-3.5 h-3.5 mr-0 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:mr-2 group-hover:translate-x-0 transition-all duration-300 text-blue-400" />
                      <span className="text-xs sm:text-sm group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services Links */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:gap-4 w-full lg:w-[28%]">
              <h4 className="text-white font-bold text-base sm:text-lg lg:text-xl tracking-wide mb-1 sm:mb-2">Services</h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {[
                  { name: 'Salesforce Consulting', href: '/services/salesforce' },
                  { name: 'Zoho Service', href: '/services/zoho' },
                  { name: 'Cloud Solution', href: '/services/cloud' },
                  { name: 'Web Development', href: '/services/web' },
                  { name: 'App Development', href: '/services/app' },
                  { name: 'Digital Marketing', href: '/services/digital-marketing' },
                  { name: 'Data Migration', href: '/services/data-migration' },
                  { name: 'Consulting And Training', href: '/services/consulting' }
                ].map((service) => (
                  <li key={service.name}>
                    <Link href={service.href} className="text-slate-400 hover:text-indigo-400 transition-all duration-300 inline-flex items-center group">
                      <ArrowRight className="w-3.5 h-3.5 mr-0 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:mr-2 group-hover:translate-x-0 transition-all duration-300 text-indigo-400" />
                      <span className="text-xs sm:text-sm group-hover:translate-x-1 transition-transform duration-300">{service.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:gap-4 w-full lg:w-[25%]">
              <h4 className="text-white font-bold text-base sm:text-lg lg:text-xl tracking-wide mb-1 sm:mb-2">Contact</h4>
              <ul className="flex flex-col gap-4">
                <li className="flex flex-col gap-2 group cursor-pointer w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all duration-300 shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <span className="text-slate-400 text-xs sm:text-sm font-semibold group-hover:text-white transition-colors">Locations</span>
                  </div>
                  <div className="flex flex-col gap-3 pl-[44px] sm:pl-[56px] text-slate-400 text-xs sm:text-sm mt-1">
                    <div className="flex items-center gap-3 hover:text-white transition-colors group/loc">
                      <img src="https://flagcdn.com/w20/in.png" alt="India Flag" className="w-4 h-auto rounded-[2px] opacity-70 group-hover/loc:opacity-100 transition-opacity" />
                      <span>Bangalore, India</span>
                    </div>
                    <div className="flex items-center gap-3 hover:text-white transition-colors group/loc">
                      <img src="https://flagcdn.com/w20/ae.png" alt="Dubai Flag" className="w-4 h-auto rounded-[2px] opacity-70 group-hover/loc:opacity-100 transition-opacity" />
                      <span>Dubai, UAE</span>
                    </div>
                    <div className="flex items-center gap-3 hover:text-white transition-colors group/loc">
                      <img src="https://flagcdn.com/w20/qa.png" alt="Qatar Flag" className="w-4 h-auto rounded-[2px] opacity-70 group-hover/loc:opacity-100 transition-opacity" />
                      <span>Doha, Qatar</span>
                    </div>
                  </div>
                </li>
                <li className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 transition-all duration-300 shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <span className="text-slate-400 text-xs sm:text-sm group-hover:text-white transition-colors">
                    +971 545 132 807
                  </span>
                </li>
                <li className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-300 shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <span className="text-slate-400 text-xs sm:text-sm group-hover:text-white transition-colors">
                    contactus@pentacloudconsulting.com
                  </span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Big Background Text - Mobile */}
          <div className="block lg:hidden w-full pointer-events-none select-none z-0 overflow-hidden mb-6 mt-4">
            <span className="text-[10.5vw] sm:text-[9vw] leading-[0.75] font-black text-white/5 tracking-tight text-center block w-full">
              PENTACLOUD
            </span>
          </div>

          {/* Bottom Bar */}
          <div className="relative border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Pentacloud Consulting. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500">
              <Link href="/terms" className="hover:text-blue-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <span className="text-slate-700">|</span>
              <Link href="/privacy" className="hover:text-blue-400 transition-colors duration-300">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
