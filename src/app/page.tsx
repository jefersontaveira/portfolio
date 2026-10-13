"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { ProjectsRegistryGrid } from "@/components/projects/ProjectsRegistryGrid";
import { MlVisionLab } from "@/components/projects/MlVisionLab";
import { ArenaSaasSandbox } from "@/components/projects/ArenaSaasSandbox";
import { ContainerCluster } from "@/components/projects/ContainerCluster";
import { Footer } from "@/components/layout/Footer";
import { OrbCompanion } from "@/components/orb/OrbCompanion";
import { OrbChatModal } from "@/components/orb/OrbChatModal";
import { ExecutiveModal } from "@/components/hero/ExecutiveModal";
import { HologramIntro } from "@/components/hologram/HologramIntro";

export default function Home() {
  const [showHologram, setShowHologram] = useState(true);
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [initialChatQuery, setInitialChatQuery] = useState("");

  const handleVoiceInputFromOrb = (transcript: string) => {
    setInitialChatQuery(transcript);
    setIsChatModalOpen(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#080B11] text-[#F8FAFC]">
      {/* 🛸 EXPERIÊNCIA DO HOLOGRAMA INICIAL (Dark Void & Transmissão Holográfica) */}
      {showHologram && (
        <HologramIntro onEnterPortfolio={() => setShowHologram(false)} />
      )}

      {/* Barra de Navegação */}
      <Navbar
        onOpenExecutiveModal={() => setIsExecutiveModalOpen(true)}
        voiceActive={voiceActive}
        onToggleVoice={() => setVoiceActive(!voiceActive)}
        onReplayHologram={() => setShowHologram(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1">
        {/* Seção Hero */}
        <HeroSection
          onOpenExecutiveModal={() => setIsExecutiveModalOpen(true)}
          onOpenChat={() => setIsChatModalOpen(true)}
        />

        {/* Vitrine Modular de Projetos (Extensível para projetos existentes) */}
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

      {/* Copiloto ORB (Desktop flutuante + Mobile dock ultra-leve) */}
      <OrbCompanion
        onOpenChat={() => setIsChatModalOpen(true)}
        voiceActive={voiceActive}
        onVoiceInput={handleVoiceInputFromOrb}
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
