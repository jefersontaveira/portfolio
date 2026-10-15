"use client";

import React, { useState } from "react";
import { Terminal, Volume2, VolumeX, Sparkles, FileText, Menu, X, Code2, Radio } from "lucide-react";
import { SpeechManager } from "@/lib/speechHelper";

interface NavbarProps {
  onOpenExecutiveModal: () => void;
  voiceActive: boolean;
  onToggleVoice: () => void;
  isJeffVisible?: boolean;
  onToggleJeff?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenExecutiveModal,
  voiceActive,
  onToggleVoice,
  isJeffVisible = true,
  onToggleJeff,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleVoiceToggle = () => {
    onToggleVoice();
    if (!voiceActive) {
      SpeechManager.speak("Sistema de voz ativado. Como posso ajudar na sua visita?");
    } else {
      SpeechManager.stopSpeaking();
    }
  };

  // Trava a rolagem da página de fundo quando o menu mobile estiver aberto
  const [isHeaderElevated, setIsHeaderElevated] = useState(false);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      setIsHeaderElevated(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const timer = setTimeout(() => {
        setIsHeaderElevated(false);
      }, 350);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header suppressHydrationWarning className={`sticky top-0 ${isHeaderElevated ? 'z-[100]' : 'z-30'} w-full backdrop-blur-xl bg-[#080B11]/75 border-b border-white/[0.08] transition-all`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-[84px] flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div suppressHydrationWarning className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00F2FE]/20 to-[#A855F7]/20 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE] group-hover:border-[#00F2FE] transition-colors">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-[#00F2FE] transition-colors">
              <span>Jeferson Taveira</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 font-mono">
                Python & IA
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono">Engenharia de Software</p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <a href="#projetos" className="hover:text-[#00F2FE] transition-colors">
            Projetos
          </a>
          <a href="#sobre" className="hover:text-[#00F2FE] transition-colors">
            Sobre
          </a>
          <a href="#contato" className="hover:text-[#00F2FE] transition-colors font-medium">
            Contato
          </a>
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Jeff Presence Toggle (Ocultar / Exibir o Jeff) */}
          {onToggleJeff && (
            <button
              onClick={onToggleJeff}
              title={isJeffVisible ? "Ocultar assistente holográfico Jeff" : "Exibir assistente holográfico Jeff"}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
                isJeffVisible
                  ? "bg-[#00F2FE]/15 border-[#00F2FE]/50 text-[#00F2FE] hover:bg-[#00F2FE]/25"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isJeffVisible ? "animate-pulse text-[#00F2FE]" : "text-gray-400"}`} />
              <span>{isJeffVisible ? "Jeff ON" : "Jeff OFF"}</span>
            </button>
          )}

          {/* Voice Toggle Button */}
          <button
            onClick={handleVoiceToggle}
            title={voiceActive ? "Silenciar narração de Jeff" : "Ativar narração por voz de Jeff"}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
              voiceActive
                ? "bg-[#10B981]/15 border-[#10B981]/50 text-[#10B981]"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
            }`}
          >
            {voiceActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="font-mono text-[11px] hidden lg:inline">
              {voiceActive ? "Voz ON" : "Voz OFF"}
            </span>
          </button>

          {/* Executive Summary Button (Fast Track para recrutadores) */}
          <button
            onClick={onOpenExecutiveModal}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00F2FE]/10 to-[#A855F7]/10 border border-[#00F2FE]/30 hover:border-[#00F2FE] text-white text-xs font-medium flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00F2FE]" />
            <span>Modo Executivo</span>
            <span className="text-[10px] text-gray-400 font-mono bg-white/5 px-1 rounded">1 min</span>
          </button>

          {/* Currículo Button */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/25 text-gray-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <span>Currículo</span>
          </a>
        </div>

        {/* Mobile menu trigger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
          aria-label="Menu principal"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Mobile Lateral (Desliza da lateral ao abrir e retorna à lateral ao fechar) */}
      <div
        style={{ backgroundColor: "#080B11" }}
        className={`md:hidden fixed inset-0 z-[100] bg-[#080B11] flex flex-col justify-between p-6 h-screen w-screen overflow-y-auto transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
          {/* Top Bar do Modal Mobile */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00F2FE]/20 to-[#A855F7]/20 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-base text-white">
                  <span>Jeferson Taveira</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 font-mono">
                    Python & IA
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-mono">Engenharia de Software</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links Principais (um abaixo do outro com tipografia ampla e toque fácil) */}
          <div className="flex flex-col py-6 space-y-3 shrink-0">
            <a
              href="#projetos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3.5 px-4 rounded-xl text-lg font-semibold text-gray-100 hover:text-[#00F2FE] hover:bg-white/5 border border-white/5 hover:border-[#00F2FE]/30 transition-all flex items-center justify-between"
            >
              <span>Projetos</span>
              <span className="text-xs text-gray-500 font-mono">01</span>
            </a>
            <a
              href="#sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3.5 px-4 rounded-xl text-lg font-semibold text-gray-100 hover:text-[#00F2FE] hover:bg-white/5 border border-white/5 hover:border-[#00F2FE]/30 transition-all flex items-center justify-between"
            >
              <span>Sobre Mim</span>
              <span className="text-xs text-gray-500 font-mono">02</span>
            </a>
            <a
              href="#contato"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3.5 px-4 rounded-xl text-lg font-semibold text-gray-100 hover:text-[#00F2FE] hover:bg-white/5 border border-white/5 hover:border-[#00F2FE]/30 transition-all flex items-center justify-between"
            >
              <span>Contato Direto</span>
              <span className="text-xs text-gray-500 font-mono">03</span>
            </a>
          </div>

          {/* Ações e Controles no Rodapé do Menu (um abaixo do outro em largura total) */}
          <div className="pt-5 border-t border-white/10 flex flex-col gap-2.5 shrink-0">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenExecutiveModal();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00F2FE]/20 to-[#A855F7]/20 border border-[#00F2FE]/40 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#00F2FE]/30 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-[#00F2FE]" />
              <span>Modo Executivo Rápido (1 Minuto)</span>
            </button>

            {onToggleJeff && (
              <button
                onClick={() => onToggleJeff()}
                className={`w-full py-3.5 px-4 rounded-xl border text-sm font-mono flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  isJeffVisible
                    ? "bg-[#00F2FE]/15 border-[#00F2FE]/50 text-[#00F2FE]"
                    : "bg-white/5 border-white/10 text-gray-400"
                }`}
              >
                <Radio className={`w-4 h-4 ${isJeffVisible ? "animate-pulse text-[#00F2FE]" : "text-gray-400"}`} />
                <span>{isJeffVisible ? "Assistente Jeff: Ativo (Toque para Ocultar)" : "Assistente Jeff: Oculto (Toque para Exibir)"}</span>
              </button>
            )}

            <button
              onClick={handleVoiceToggle}
              className={`w-full py-3.5 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                voiceActive
                  ? "bg-[#10B981]/15 border-[#10B981]/50 text-[#10B981]"
                  : "bg-white/5 border-white/10 text-gray-400"
              }`}
            >
              {voiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{voiceActive ? "Voz Jeff Ativada (ON)" : "Voz Jeff Desativada (OFF)"}</span>
            </button>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <FileText className="w-4 h-4 text-gray-400" />
              <span>Baixar Currículo (PDF)</span>
            </a>
          </div>
        </div>
    </header>
  );
};
