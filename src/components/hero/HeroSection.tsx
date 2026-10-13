"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, Code2, Cpu, Database, Server, Mic, Briefcase, CheckCircle2 } from "lucide-react";
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
    <section id="hero" className="relative pt-10 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
      {/* Luz ambiente sutil de fundo (puro CSS, sem impacto de performance) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00F2FE]/10 via-[#A855F7]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Coluna da Esquerda: Textos & CTAs */}
          <div className="lg:col-span-7">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="text-[#10B981] font-semibold">Online</span>
              <span className="text-gray-500">|</span>
              <span>Jeferson Taveira • Engenharia de Software & IA</span>
            </div>

            {/* Headline Principal (Corrigido para 100% de visibilidade sem corte de gradiente) */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Engenharia de Software com{" "}
              <span className="text-[#00F2FE] drop-shadow-[0_0_25px_rgba(0,242,254,0.4)]">
                Python & IA Real
              </span>
              , do Modelo à Produção.
            </h1>

            {/* Subtitle / Proposta de Valor Equilibrada (Recrutadores & Clientes) */}
            <p className="mt-5 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
              Desenvolvo arquiteturas escaláveis, microsserviços de alta confiabilidade e soluções práticas com Inteligência Artificial. Preparado para somar em times de alta performance como <strong className="text-white">Engenheiro de Software</strong> ou construir plataformas seguras e sob medida para <strong className="text-[#00F2FE]">clientes e empresas</strong>.
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
                <span>Explorar Projetos</span>
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
                <span>Falar com Jeff (IA)</span>
              </button>
            </div>
          </div>

          {/* Coluna da Direita: Imagem Recortada Preenchendo o Background */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[540px]">
              {/* Glow atmosférico concentrado atrás da silhueta */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[440px] bg-gradient-to-tr from-[#00F2FE]/25 via-[#A855F7]/25 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

              {/* Imagem Recortada sem Fundo / Moldura, Integrada Diretamente ao Tema Escuro */}
              <div className="relative aspect-[3/4] w-full overflow-hidden select-none">
                <Image
                  src="/images/profile.jpg"
                  alt="Jeferson Taveira - Engenheiro de Software Full Stack & IA"
                  width={560}
                  height={740}
                  priority
                  className="w-full h-full object-cover object-top scale-105 hover:scale-108 transition-transform duration-700"
                />

                {/* Gradiente de Fusão na Base (Transição Suave para o Preto da Página) */}
                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#080B11] via-[#080B11]/80 to-transparent pointer-events-none" />

                {/* Gradiente de Fusão na Esquerda (Fusão Suave com o Conteúdo de Texto) */}
                <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#080B11] via-[#080B11]/50 to-transparent pointer-events-none hidden lg:block" />

                {/* Gradiente de Fusão no Topo */}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#080B11] to-transparent pointer-events-none" />
              </div>

              {/* Badge Flutuante de Status Integrado */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-20 flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#080B11]/90 backdrop-blur-md border border-[#10B981]/30 shadow-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[11px] font-mono text-white font-medium">Disponível para Projetos & Vagas</span>
                </div>
                <span className="text-[10px] font-mono text-[#00F2FE] bg-[#00F2FE]/10 px-2 py-0.5 rounded border border-[#00F2FE]/20">
                  Full Stack
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
