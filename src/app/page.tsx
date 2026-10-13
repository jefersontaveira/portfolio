"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { ProjectsRegistryGrid } from "@/components/projects/ProjectsRegistryGrid";
import { MlVisionLab } from "@/components/projects/MlVisionLab";
import { ArenaSaasSandbox } from "@/components/projects/ArenaSaasSandbox";
import { ContainerCluster } from "@/components/projects/ContainerCluster";
import { Footer } from "@/components/layout/Footer";
import { OrbChatModal } from "@/components/orb/OrbChatModal";
import { ExecutiveModal } from "@/components/hero/ExecutiveModal";

// Importação dinâmica com ssr: false para eliminar qualquer erro de hidratação (extensões, SVG, window)
const HologramIntro = dynamic(
  () => import("@/components/hologram/HologramIntro").then((mod) => mod.HologramIntro),
  { ssr: false }
);

export default function Home() {
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [isJeffVisible, setIsJeffVisible] = useState(true);
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [initialChatQuery, setInitialChatQuery] = useState("");

  return (
    <div
      suppressHydrationWarning
      className={`relative bg-[#080B11] text-[#F8FAFC] overflow-x-hidden ${
        portfolioOpen ? "min-h-screen" : "h-screen max-h-screen overflow-hidden"
      }`}
    >
      {/* 
        Todo o conteúdo do portfólio (Menu, Seções e Rodapé) só é renderizado
        quando o usuário inicia o sistema. Isso garante zero erro de hidratação
        causado por extensões do navegador (como Dark Reader) e carrega a tela
        holográfica de forma instantânea e limpa.
      */}
      {portfolioOpen && (
        <div
          className="relative min-h-screen flex flex-col animate-fade-in"
        >
          {/* Camada Atmosférica de Manchas e Degradês de Fundo (Profundidade Visual de Alto Nível) */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            {/* Mancha 1: Ciano Quântico no Topo Esquerdo */}
            <div className="absolute -top-40 -left-40 w-[700px] h-[600px] bg-gradient-to-br from-[#00F2FE]/15 via-[#38BDF8]/08 to-transparent blur-[140px] rounded-full" />

            {/* Mancha 2: Violeta / Roxo Neon Superior Direito (Atrás da Hero & Foto) */}
            <div className="absolute top-10 -right-40 w-[750px] h-[700px] bg-gradient-to-bl from-[#A855F7]/15 via-[#6366F1]/08 to-transparent blur-[160px] rounded-full" />

            {/* Mancha 3: Azul Safira Central (Atrás da Vitrine de Projetos) */}
            <div className="absolute top-[48%] -left-32 w-[650px] h-[600px] bg-gradient-to-tr from-[#38BDF8]/10 via-[#00F2FE]/05 to-transparent blur-[150px] rounded-full" />

            {/* Mancha 4: Esmeralda / Teal Inferior Direito (Próximo ao Rodapé) */}
            <div className="absolute -bottom-32 right-[5%] w-[700px] h-[550px] bg-gradient-to-tl from-[#10B981]/12 via-[#00F2FE]/06 to-transparent blur-[160px] rounded-full" />
          </div>

          {/* Barra de Navegação */}
          <Navbar
            onOpenExecutiveModal={() => setIsExecutiveModalOpen(true)}
            voiceActive={voiceActive}
            onToggleVoice={() => setVoiceActive(!voiceActive)}
            isJeffVisible={isJeffVisible}
            onToggleJeff={() => setIsJeffVisible(!isJeffVisible)}
          />

          {/* Conteúdo Principal do Portfólio */}
          <main className="flex-1">
            {/* Seção Hero */}
            <HeroSection
              onOpenExecutiveModal={() => setIsExecutiveModalOpen(true)}
              onOpenChat={() => setIsChatModalOpen(true)}
            />

            {/* Vitrine Modular de Projetos */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ProjectsRegistryGrid />
            </div>
          </main>

          {/* Rodapé */}
          <Footer />
        </div>
      )}

      {/* Holograma Interativo Permanente (Intro no Centro -> Transição Suave para Canto Inferior Direito) */}
      <HologramIntro
        isDocked={portfolioOpen}
        isJeffVisible={isJeffVisible}
        isChatOpen={isChatModalOpen}
        onEnterPortfolio={() => setPortfolioOpen(true)}
        onOpenChat={() => setIsChatModalOpen(true)}
      />

      {/* Modal de Conversa com a IA do Jeff */}
      <OrbChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        initialQuery={initialChatQuery}
      />

      {/* Modal do Modo Executivo (Fast-Track de 1 minuto) */}
      <ExecutiveModal
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
        voiceActive={voiceActive}
      />
    </div>
  );
}
