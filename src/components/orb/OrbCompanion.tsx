"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Sparkles, X, ChevronUp } from "lucide-react";

export type OrbState = "IDLE" | "THINKING";

interface OrbCompanionProps {
  onOpenChat: () => void;
  voiceActive?: boolean;
  onVoiceInput?: (text: string) => void;
}

export const OrbCompanion: React.FC<OrbCompanionProps> = ({
  onOpenChat,
}) => {
  const [orbState, setOrbState] = useState<OrbState>("IDLE");
  const [bubbleText, setBubbleText] = useState<string>(
    "Olá! Sou o Jeff, seu guia interativo pelo portfólio. Clique para tirar dúvidas e navegar pelos projetos!"
  );
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Fecha o balão após alguns segundos caso o usuário prefira foco
  useEffect(() => {
    const timer = setTimeout(() => {
      // Deixa o balão discreto após 12 segundos
      setIsBubbleVisible(false);
    }, 14000);
    return () => clearTimeout(timer);
  }, []);

  // Cores dinâmicas de acordo com o estado do ORB
  const getOrbColor = () => {
    switch (orbState) {
      case "THINKING":
        return "from-[#A855F7] via-[#C084FC] to-[#00F2FE]";
      default:
        return "from-[#00F2FE] via-[#38BDF8] to-[#A855F7]";
    }
  };

  return (
    <>
      {/* ============================================================== */}
      {/* DESKTOP VIEW: Flutuante e interativo no canto inferior direito */}
      {/* ============================================================== */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-3 select-none">
        {/* Balão de Fala do ORB */}
        {isBubbleVisible && (
          <div className="relative max-w-xs bg-[#0F172A]/95 backdrop-blur-md border border-[#00F2FE]/30 rounded-2xl p-3.5 shadow-2xl text-xs text-gray-200 animate-fade-in">
            <button
              onClick={() => setIsBubbleVisible(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              aria-label="Ocultar balão"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5 text-[#00F2FE] font-mono font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Jeff Copilot</span>
            </div>
            <p className="leading-relaxed pr-3">{bubbleText}</p>

            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-end">
              <button
                onClick={onOpenChat}
                className="text-[11px] text-[#00F2FE] hover:underline flex items-center gap-1 font-mono"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Abrir Chat</span>
              </button>
            </div>
          </div>
        )}

        {/* O ORB Esférico com Efeito de Pulso Ultraleve (Puro CSS e SVG) */}
        <div className="flex items-center gap-2">
          {/* O ORB propriamente dito */}
          <div
            onClick={onOpenChat}
            className="group relative cursor-pointer w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            title="Clique para conversar com o assistente do portfólio"
          >
            {/* Anel Externo de Energia */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${getOrbColor()} opacity-60 blur-md group-hover:opacity-100 transition-opacity animate-pulse`}
            />

            {/* Núcleo do ORB */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#080B11] via-[#0F172A] to-[#1E293B] border border-white/30 flex items-center justify-center overflow-hidden shadow-inner">
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-tr ${getOrbColor()} opacity-80 animate-ping`}
                style={{ animationDuration: "3s" }}
              />
              <Sparkles className="absolute w-5 h-5 text-white/90 drop-shadow" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE VIEW: Dock Inferior Ultra-Leve e Compacto (Sem cobrir texto) */}
      {/* ============================================================== */}
      <div className="fixed bottom-4 right-4 z-40 sm:hidden select-none">
        <div className="flex items-center gap-2 bg-[#0F172A]/90 backdrop-blur-md border border-[#00F2FE]/30 rounded-full px-3 py-2 shadow-xl">
          {/* Mini ORB que abre o Chat */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 pr-1"
            aria-label="Abrir conversa com IA"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#A855F7] flex items-center justify-center p-0.5 shadow">
              <div className="w-full h-full rounded-full bg-[#080B11] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#00F2FE]" />
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-gray-200">
              Jeff IA
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
