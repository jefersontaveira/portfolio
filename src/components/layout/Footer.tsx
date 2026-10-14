"use client";

import React from "react";
import { Terminal, Github, Linkedin, Mail, Heart } from "lucide-react";
import { DEVELOPER_PROFILE } from "@/lib/careerContext";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#080B11] py-12 text-xs font-mono text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#00F2FE]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white">{DEVELOPER_PROFILE.name}</span>
            <span className="mx-2 text-gray-600">•</span>
            <span>Portfólio de Alta Performance</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href={DEVELOPER_PROFILE.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#25D366] transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={DEVELOPER_PROFILE.contact.email ? `mailto:${DEVELOPER_PROFILE.contact.email}` : "#contato"}
            className="hover:text-[#00F2FE] transition-colors"
          >
            E-mail
          </a>
          <a
            href={DEVELOPER_PROFILE.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#38BDF8] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={DEVELOPER_PROFILE.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href={DEVELOPER_PROFILE.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E1306C] transition-colors"
          >
            Instagram
          </a>
        </div>


        <div className="text-gray-400 flex items-center gap-1">
          <span>Construído com Python, Next.js & IA</span>
          <span className="text-gray-400">|</span>
          <span className="text-[#10B981]">Custo Operacional Zero</span>
        </div>
      </div>
    </footer>
  );
};
