"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { ProjectsRegistryGrid } from "@/components/projects/ProjectsRegistryGrid";
import { AboutSection } from "@/components/about/AboutSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/layout/Footer";
import { OrbChatModal } from "@/components/orb/OrbChatModal";
import { ExecutiveModal } from "@/components/hero/ExecutiveModal";
import { isPortfolioInitialized, setPortfolioInitialized } from "@/lib/portfolioSession";

// Importação dinâmica com fallback seguro de SSR para o Bem-vindo aparecer imediatamente
const HologramIntro = dynamic(
  () => import("@/components/hologram/HologramIntro").then((mod) => mod.HologramIntro),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center pointer-events-auto">
        <div className="flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] sm:tracking-[0.3em] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            Bem-vindo
          </h1>
          <div className="w-14 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-[#00F2FE] to-transparent mt-4 sm:mt-5 opacity-70 animate-pulse" />
        </div>
      </div>
    ),
  }
);

export default function Home() {
  // Inicialização segura com false para paridade exata SSR/Cliente e zero hydration mismatch
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [isJeffVisible, setIsJeffVisible] = useState(true);
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  // Coordenação: o holograma viaja primeiro (850ms) e o modal só surge suavemente após ele pousar
  const [isHologramAtChat, setIsHologramAtChat] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [initialChatQuery, setInitialChatQuery] = useState("");
  const chatFlightTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sincroniza persistência de sessão logo após a montagem no cliente
  useEffect(() => {
    if (isPortfolioInitialized()) {
      setPortfolioOpen(true);
    }
    return () => {
      if (chatFlightTimerRef.current) clearTimeout(chatFlightTimerRef.current);
    };
  }, []);


  const handleOpenChat = (query?: string) => {
    if (query) setInitialChatQuery(query);
    setIsJeffVisible(true);

    // 1. O holograma parte imediatamente em direção ao topo da posição do popup
    setIsHologramAtChat(true);

    if (chatFlightTimerRef.current) clearTimeout(chatFlightTimerRef.current);

    // 2. O pop up só aparece suavemente quando o holograma atinge a posição exata
    chatFlightTimerRef.current = setTimeout(() => {
      setIsChatModalOpen(true);
    }, 850);
  };

  const handleCloseChat = () => {
    if (chatFlightTimerRef.current) clearTimeout(chatFlightTimerRef.current);
    // 1. O pop-up fecha suavemente retraindo de volta para o holograma
    setIsChatModalOpen(false);
    // 2. Quando o pop-up terminar de fechar (300ms), o holograma retorna suavemente para o canto
    chatFlightTimerRef.current = setTimeout(() => {
      setIsHologramAtChat(false);
    }, 300);
  };

  return (
    <div
      suppressHydrationWarning
      className="relative bg-[#080B11] text-[#F8FAFC] min-h-screen flex flex-col overflow-x-hidden"
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

      {/* Conteúdo Principal do Portfólio (Revelado suavemente somente após iniciar o sistema ou em sessões já ativas) */}
      <div
        className={`flex-1 flex flex-col transition-opacity duration-1000 ${
          portfolioOpen ? "opacity-100" : "opacity-0 pointer-events-none select-none"
        }`}
      >
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
            onOpenChat={() => handleOpenChat()}
          />

          {/* Vitrine Modular de Projetos */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProjectsRegistryGrid />
          </div>

          {/* Seção Sobre Mim (Trajetória, Foto & Pilares de Engenharia) */}
          <AboutSection />

          {/* Seção de Contato e Conexões Diretas (Última Seção) */}
          <ContactSection />
        </main>

        {/* Rodapé */}
        <Footer />
      </div>

      {/* Holograma Interativo Permanente (Intro no Centro -> Transição Suave para Canto Inferior Direito) */}
      <HologramIntro
        isDocked={portfolioOpen}
        isJeffVisible={isJeffVisible}
        isChatOpen={isHologramAtChat}
        onEnterPortfolio={() => {
          setPortfolioInitialized(true);
          setPortfolioOpen(true);
        }}
        onOpenChat={() => handleOpenChat()}
        onCloseChat={handleCloseChat}
      />

      {/* Modal de Conversa com a IA do Jeff */}
      <OrbChatModal
        isOpen={isChatModalOpen}
        onClose={handleCloseChat}
        initialQuery={initialChatQuery}
        onOpenExecutiveModal={() => setIsExecutiveModalOpen(true)}
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
