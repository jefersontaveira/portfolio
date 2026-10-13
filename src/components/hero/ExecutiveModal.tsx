"use client";

import React, { useEffect } from "react";
import { X, Sparkles, Download, Github, Linkedin, Mail, ExternalLink, CheckCircle2, Volume2 } from "lucide-react";
import { DEVELOPER_PROFILE } from "@/lib/careerContext";
import { SpeechManager } from "@/lib/speechHelper";

interface ExecutiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceActive: boolean;
}

export const ExecutiveModal: React.FC<ExecutiveModalProps> = ({
  isOpen,
  onClose,
  voiceActive,
}) => {
  // Bloqueia a rolagem da página de fundo enquanto o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement | null;
        const isInsideModalScroll = target?.closest(".overflow-y-auto");
        if (!isInsideModalScroll) {
          e.preventDefault();
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        const isInsideModalScroll = target?.closest(".overflow-y-auto");
        if (!isInsideModalScroll) {
          e.preventDefault();
        }
      };

      // Fechar modal ao pressionar tecla ESC ou evitar rolagem da página por teclas
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
          return;
        }
        if (["Space", "PageUp", "PageDown"].includes(e.code)) {
          const target = e.target as HTMLElement | null;
          const isInsideModalScroll = target?.closest(".overflow-y-auto");
          if (!isInsideModalScroll) {
            e.preventDefault();
          }
        }
      };

      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleReadSummary = () => {
    SpeechManager.speak(
      `Resumo Executivo de ${DEVELOPER_PROFILE.name}. ${DEVELOPER_PROFILE.role}. ${DEVELOPER_PROFILE.bio}. Principais tecnologias incluem Python, Django, FastAPI, PyTorch e ecossistemas web modernos com React e Docker.`
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overscroll-contain"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto overscroll-contain max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00F2FE]/20 to-[#A855F7]/20 border border-[#00F2FE]/40 text-[#00F2FE]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {DEVELOPER_PROFILE.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                  Disponível para Oportunidades
                </span>
              </div>
              <p className="text-sm text-gray-400 font-mono">{DEVELOPER_PROFILE.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bio & Pitch */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-mono tracking-wider text-gray-400">
              Síntese Profissional (TL;DR)
            </h3>
            <button
              onClick={handleReadSummary}
              className="text-xs flex items-center gap-1 text-[#00F2FE] hover:underline font-mono"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Ouvir Resumo</span>
            </button>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
            {DEVELOPER_PROFILE.bio}
          </p>
        </div>

        {/* Metric Highlights */}
        <div className="mt-6">
          <h3 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-3">
            Métricas de Engenharia
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DEVELOPER_PROFILE.highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center flex flex-col justify-center"
              >
                <span className="text-base sm:text-lg font-bold text-[#00F2FE] font-mono">
                  {item.metric}
                </span>
                <span className="text-[11px] text-gray-400 leading-tight mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Stack */}
        <div className="mt-6">
          <h3 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-2.5">
            Especialidades Principais
          </h3>
          <div className="flex flex-wrap gap-2">
            {DEVELOPER_PROFILE.specialties.map((spec, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 text-gray-200 border border-white/10 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Pilares Arquiteturais & Filosofia de Engenharia */}
        <div className="mt-6">
          <h3 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-2.5">
            Pilares de Arquitetura & Engenharia
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] mt-1.5 shrink-0" />
              <div>
                <strong className="text-white block font-medium">Clean Architecture & SOLID</strong>
                <p className="text-gray-400 text-[11px] mt-0.5 leading-snug">
                  Código desacoplado, testabilidade e manutenibilidade contínua.
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] mt-1.5 shrink-0" />
              <div>
                <strong className="text-white block font-medium">Concorrência & ACID</strong>
                <p className="text-gray-400 text-[11px] mt-0.5 leading-snug">
                  Transações atômicas, locks pessimistas e prevenção de race conditions.
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 shrink-0" />
              <div>
                <strong className="text-white block font-medium">Otimização de Modelos IA</strong>
                <p className="text-gray-400 text-[11px] mt-0.5 leading-snug">
                  Conversão PyTorch para ONNX, quantização e inferência de ultra baixa latência.
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
              <div>
                <strong className="text-white block font-medium">Resiliência & CI/CD</strong>
                <p className="text-gray-400 text-[11px] mt-0.5 leading-snug">
                  Containers Docker padronizados e pipelines de deploy com zero downtime.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact & Links */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={DEVELOPER_PROFILE.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#00F2FE]/50 text-gray-300 hover:text-white transition-colors"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={DEVELOPER_PROFILE.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#38BDF8]/50 text-gray-300 hover:text-white transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${DEVELOPER_PROFILE.contact.email}`}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#A855F7]/50 text-gray-300 hover:text-white transition-colors"
              title="Email direto"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/resume.pdf"
              download
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] text-black font-semibold text-xs flex items-center gap-1.5 hover:opacity-95 shadow-lg shadow-[#00F2FE]/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Currículo PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
