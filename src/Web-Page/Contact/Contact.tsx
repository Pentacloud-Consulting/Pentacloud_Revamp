"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import ContactInfoForm from "./ContactInfoForm";
import ContactResumeForm from "./Contact Resume Form";
import ContactQuickOptions from "./ContactQuickOptions";
import ContactFAQ from "./ContactFAQ";

const Contact = () => {
  const [activeTab, setActiveTab] = useState<"message" | "resume">("message");

  return (
    <main className="bg-background min-h-screen relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[150px] -z-10" />
      <div className="absolute top-[20%] -left-40 w-[600px] h-[600px] bg-indigo-100/20 rounded-full blur-[120px] -z-10" />

      {activeTab === "message" ? (
        <ContactInfoForm activeTab={activeTab} onTabChange={setActiveTab} />
      ) : (
        <ContactResumeForm activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      


      <ContactQuickOptions />
      <ContactFAQ />


    </main>
  );
};

export default Contact;
