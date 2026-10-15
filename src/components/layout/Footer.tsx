"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { DEVELOPER_PROFILE } from "@/lib/careerContext";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#080B11] pt-10 sm:pt-12 pb-32 sm:pb-12 text-xs font-mono text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4 lg:pr-24 xl:pr-0">
        {/* Identificação / Marca */}
        <div className="flex items-center gap-3 shrink-0 text-center sm:text-left">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#00F2FE] shrink-0 shadow-[0_0_15px_rgba(0,242,254,0.1)]">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-1 sm:gap-2">
            <span className="font-bold text-white text-xs sm:text-sm tracking-tight whitespace-nowrap">
              {DEVELOPER_PROFILE.name}
            </span>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <span className="text-gray-400 text-[11px] sm:text-xs whitespace-nowrap">
              Portfólio de Alta Performance
            </span>
          </div>
        </div>

        {/* Links Sociais com área de toque tátil (Linha horizontal contínua) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href={DEVELOPER_PROFILE.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-[#25D366]/10 border border-white/5 hover:border-[#25D366]/30 text-gray-300 hover:text-[#25D366] transition-all text-[11px] sm:text-xs font-medium whitespace-nowrap cursor-pointer"
          >
            WhatsApp
          </a>
          <a
            href={DEVELOPER_PROFILE.contact.email ? `mailto:${DEVELOPER_PROFILE.contact.email}` : "#contato"}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-[#00F2FE]/10 border border-white/5 hover:border-[#00F2FE]/30 text-gray-300 hover:text-[#00F2FE] transition-all text-[11px] sm:text-xs font-medium whitespace-nowrap cursor-pointer"
          >
            E-mail
          </a>
          <a
            href={DEVELOPER_PROFILE.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-[#38BDF8]/10 border border-white/5 hover:border-[#38BDF8]/30 text-gray-300 hover:text-[#38BDF8] transition-all text-[11px] sm:text-xs font-medium whitespace-nowrap cursor-pointer"
          >
            LinkedIn
          </a>
          <a
            href={DEVELOPER_PROFILE.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-white/30 text-gray-300 hover:text-white transition-all text-[11px] sm:text-xs font-medium whitespace-nowrap cursor-pointer"
          >
            GitHub
          </a>
          <a
            href={DEVELOPER_PROFILE.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-[#E1306C]/10 border border-white/5 hover:border-[#E1306C]/30 text-gray-300 hover:text-[#E1306C] transition-all text-[11px] sm:text-xs font-medium whitespace-nowrap cursor-pointer"
          >
            Instagram
          </a>
        </div>

        {/* Arquitetura & Custo */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-1 sm:gap-2 text-[11px] sm:text-xs text-gray-400 shrink-0 text-center sm:whitespace-nowrap">
          <span className="text-gray-400">Construído com Python, Next.js & IA</span>
          <span className="hidden sm:inline text-gray-600">•</span>
          <span className="inline-flex items-center gap-1.5 text-[#10B981] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
            Custo Operacional Zero
          </span>
        </div>
      </div>
    </footer>
  );
};
