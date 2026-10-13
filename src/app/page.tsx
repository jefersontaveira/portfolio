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
          {/* Barra de Navegação */}
          <Navbar
            onOpenExecutiveModal={() => setIsExecutiveModalOpen(true)}
            voiceActive={voiceActive}
            onToggleVoice={() => setVoiceActive(!voiceActive)}
            onReplayHologram={() => setPortfolioOpen(false)}
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

              {/* Demos Interativas Flagship */}
              <MlVisionLab />
              <ArenaSaasSandbox />
              <ContainerCluster />
            </div>
          </main>

          {/* Rodapé */}
          <Footer />
        </div>
      )}

      {/* Holograma Interativo Permanente (Intro no Centro -> Transição Suave para Canto Inferior Direito) */}
      <HologramIntro
        isDocked={portfolioOpen}
        onEnterPortfolio={() => setPortfolioOpen(true)}
        onOpenChat={() => setIsChatModalOpen(true)}
      />

      {/* Modal de Conversa com a IA do ORB */}
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
