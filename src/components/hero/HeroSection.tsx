"use client";

import React from "react";
import { Terminal, Sparkles, ArrowRight, Code2, Cpu, Database, Server, Mic } from "lucide-react";
import { DEVELOPER_PROFILE } from "@/lib/careerContext";

interface HeroSectionProps {
  onOpenExecutiveModal: () => void;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenExecutiveModal,
  onOpenChat,
}) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* Luz ambiente sutil de fundo (puro CSS, sem impacto de performance) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-[#00F2FE]/10 via-[#A855F7]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-[#10B981] font-semibold">Online</span>
            <span className="text-gray-500">|</span>
            <span>Jeferson Taveira • Full Stack & IA</span>
          </div>

          {/* Headline Principal */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Engenharia de Software com{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#00F2FE] to-[#A855F7]">
              Python & IA Real
            </span>
            , do Modelo à Produção.
          </h1>

          {/* Subtitle / Proposta de Valor */}
          <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
            Projetos construídos na filosofia <strong className="text-white">"Show, Don't Tell"</strong>.
            Interaja com modelos de Machine Learning rodando no seu navegador, teste regras de concorrência em SaaS Django e simule falhas em containers de infraestrutura.
          </p>

          {/* Stacks Badges em Destaque */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Python 3.12 (FastAPI & Django)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/20 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> PyTorch & ONNX Web
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> PostgreSQL & Redis
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> Docker & DevOps
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href="#projetos"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] text-black font-semibold text-xs sm:text-sm flex items-center gap-2 hover:opacity-95 shadow-lg shadow-[#00F2FE]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explorar Demos Interativas</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenExecutiveModal}
              className="px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#00F2FE]" />
              <span>Modo Executivo (1 min)</span>
            </button>

            <button
              onClick={onOpenChat}
              className="px-4 py-3 rounded-xl bg-[#A855F7]/10 hover:bg-[#A855F7]/20 border border-[#A855F7]/30 text-[#A855F7] font-medium text-xs sm:text-sm flex items-center gap-2 transition-all font-mono"
            >
              <Mic className="w-4 h-4" />
              <span>Falar com o ORB</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
