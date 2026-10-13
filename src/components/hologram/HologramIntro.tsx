"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Volume2, ArrowRight, X, Play, RefreshCw, Radio } from "lucide-react";
import { SpeechManager } from "@/lib/speechHelper";

interface HologramIntroProps {
  onEnterPortfolio: () => void;
}

// Caminho configurável caso o Jeferson queira colocar o áudio gravado no futuro
const CUSTOM_AUDIO_PATH = "/audio/welcome.mp3"; 

export const HologramIntro: React.FC<HologramIntroProps> = ({ onEnterPortfolio }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [typedText, setTypedText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const fullText = "Sistemas online. Seja bem-vindo ao portfólio de Jeferson Taveira.";

  // Efeito sonoro de ativação sci-fi gerado via Web Audio API pura (Zero dependências, zero delay)
  const playSciFiPowerUpSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Oscilador 1: Varredura de frequência ascendente (boot de energia)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);

      // Oscilador 2: Pulso harmônico de ressonância
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(520, ctx.currentTime);
        osc2.frequency.linearRampToValueAtTime(1040, ctx.currentTime + 0.4);

        gain2.gain.setValueAtTime(0.15, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.5);
      }, 250);
    } catch (e) {
      // Ignora silenciosamente se o navegador bloquear o contexto de áudio
    }
  };

  // Dispara a voz holográfica nativa
  const speakHologramVoice = () => {
    setIsSpeaking(true);
    SpeechManager.speak(
      fullText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Ao clicar no botão de inicialização
  const handleStartSequence = () => {
    setHasStarted(true);
    playSciFiPowerUpSound();

    // Inicia fala e digitação de telemetria após breve pausa dramática (400ms)
    setTimeout(() => {
      speakHologramVoice();

      // Efeito de digitação da mensagem no ar
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (currentIdx <= fullText.length) {
          setTypedText(fullText.slice(0, currentIdx));
          currentIdx++;
        } else {
          clearInterval(interval);
        }
      }, 45);
    }, 400);
  };

  // Animação do Núcleo Tecnológico Holográfico no Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    const particles: { x: number; y: number; speed: number; size: number; alpha: number }[] = [];

    // Cria partículas de energia flutuando no feixe
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 220,
        y: Math.random() * 320,
        speed: 0.8 + Math.random() * 1.5,
        size: 1 + Math.random() * 2,
        alpha: Math.random() * 0.8,
      });
    }

    const render = () => {
      time += 0.025;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2 - 20;

      ctx.clearRect(0, 0, width, height);

      // 1. FEIXE DE LUZ CÔNICO DO CHÃO (Projeção Holográfica)
      const beamHeight = 340;
      const groundY = centerY + 180;
      const beamGradient = ctx.createLinearGradient(centerX, groundY, centerX, centerY - 100);
      beamGradient.addColorStop(0, "rgba(0, 242, 254, 0.25)");
      beamGradient.addColorStop(0.5, "rgba(0, 242, 254, 0.08)");
      beamGradient.addColorStop(1, "rgba(0, 242, 254, 0.0)");

      ctx.beginPath();
      ctx.moveTo(centerX - 130, groundY);
      ctx.lineTo(centerX + 130, groundY);
      ctx.lineTo(centerX + 60, centerY - 110);
      ctx.lineTo(centerX - 60, centerY - 110);
      ctx.closePath();
      ctx.fillStyle = beamGradient;
      ctx.fill();

      // 2. DISCO DE PROJEÇÃO NO CHÃO (Elipse em perspectiva)
      ctx.beginPath();
      ctx.ellipse(centerX, groundY, 130, 28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 242, 254, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Anel interno no chão
      ctx.beginPath();
      ctx.ellipse(centerX, groundY, 80, 16, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 242, 254, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. PARTÍCULAS SUBINDO PELO FEIXE
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < centerY - 100) {
          p.y = groundY;
          p.x = (Math.random() - 0.5) * 160;
        }

        ctx.beginPath();
        ctx.arc(centerX + p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${p.alpha * (hasStarted ? 0.9 : 0.4)})`;
        ctx.fill();
      });

      // 4. ANÉIS ORBITAIS DO NÚCLEO (Estilo Jarvis / Holograma Quântico)
      const coreIntensity = hasStarted ? 1 : 0.6;

      // Anel 1: Grande externo, rotação horária
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.7);
      ctx.beginPath();
      ctx.ellipse(0, 0, 110, 48, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 242, 254, ${0.45 * coreIntensity})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 8, 4, 8]);
      ctx.stroke();
      ctx.restore();

      // Anel 2: Intermediário inclinado, rotação anti-horária
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-time * 1.1);
      ctx.beginPath();
      ctx.ellipse(0, 0, 85, 38, -Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.5 * coreIntensity})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 10]);
      ctx.stroke();

      // Nós de dados no Anel 2
      const nodeX = Math.cos(time * 2) * 85;
      const nodeY = Math.sin(time * 2) * 38;
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#00F2FE";
      ctx.shadowColor = "#00F2FE";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();

      // Anel 3: Interno vertical rápido
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 1.6);
      ctx.beginPath();
      ctx.ellipse(0, 0, 58, 58, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.6 * coreIntensity})`;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.restore();

      // 5. NÚCLEO CENTRAL ESFÉRICO PULSANTE
      const pulse = Math.sin(time * 3) * 6;
      const coreRadius = (hasStarted ? 26 : 20) + pulse;

      // Brilho exterior (Glow)
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        2,
        centerX,
        centerY,
        coreRadius + 24
      );
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      coreGrad.addColorStop(0.3, "rgba(0, 242, 254, 0.85)");
      coreGrad.addColorStop(0.7, "rgba(168, 85, 247, 0.35)");
      coreGrad.addColorStop(1, "rgba(0, 242, 254, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius + 24, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Núcleo sólido com linhas de scanline
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 242, 254, 0.8)";
      ctx.fill();

      // 6. LINHAS DE ESCANEAMENTO HORIZONTAIS (Scanlines holográficas)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 130, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
      ctx.lineWidth = 1.5;
      for (let y = centerY - 130; y < centerY + 130; y += 4) {
        ctx.beginPath();
        ctx.moveTo(centerX - 130, y);
        ctx.lineTo(centerX + 130, y);
        ctx.stroke();
      }
      ctx.restore();

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [hasStarted]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#040608] text-white select-none overflow-hidden p-6">
      {/* Top Bar: Telemetria & Pular */}
      <div className="w-full max-w-5xl flex items-center justify-between text-xs font-mono text-gray-400 z-20">
        <div className="flex items-center gap-2">
          <Radio className={`w-3.5 h-3.5 ${hasStarted ? "text-[#00F2FE] animate-pulse" : "text-gray-500"}`} />
          <span>PROJEÇÃO HOLOGRÁFICA // V2.4</span>
        </div>

        <button
          onClick={onEnterPortfolio}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-all text-xs"
        >
          <span>Pular para o site</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Centro: O Canvas Holográfico */}
      <div className="relative flex flex-col items-center justify-center flex-1 w-full max-w-lg z-10">
        <canvas
          ref={canvasRef}
          width={420}
          height={420}
          className="max-w-full h-auto drop-shadow-[0_0_35px_rgba(0,242,254,0.35)]"
        />

        {/* Estado 1: Botão de Inicialização antes de tocar */}
        {!hasStarted ? (
          <div className="mt-4 flex flex-col items-center gap-3 animate-fade-in">
            <button
              onClick={handleStartSequence}
              className="group relative px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#A855F7] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-3 shadow-[0_0_30px_rgba(0,242,254,0.4)] hover:shadow-[0_0_45px_rgba(0,242,254,0.7)] transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-black text-black group-hover:animate-pulse" />
              <span>Inicializar Holograma</span>
            </button>
            <span className="text-[11px] font-mono text-gray-500">
              Clique para ativar a transmissão com áudio
            </span>
          </div>
        ) : (
          /* Estado 2: Holograma Ativo com Digitação e Controles */
          <div className="mt-4 flex flex-col items-center text-center max-w-md space-y-4 animate-fade-in">
            {/* Texto da Mensagem Holográfica */}
            <div className="bg-[#080B11]/80 backdrop-blur-md border border-[#00F2FE]/40 rounded-2xl px-5 py-3.5 shadow-2xl">
              <p className="text-sm sm:text-base font-mono text-[#00F2FE] leading-relaxed tracking-wide min-h-[48px] flex items-center justify-center">
                {typedText}
                <span className="inline-block w-2 h-4 bg-[#00F2FE] ml-1 animate-pulse" />
              </p>
            </div>

            {/* Ações após inicializar */}
            <div className="flex items-center gap-3">
              <button
                onClick={speakHologramVoice}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Ouvir novamente a mensagem holográfica"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "text-[#10B981] animate-pulse" : ""}`} />
                <span>Ouvir de novo</span>
              </button>

              <button
                onClick={onEnterPortfolio}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] text-black font-bold text-xs font-mono flex items-center gap-2 hover:opacity-95 shadow-lg shadow-[#00F2FE]/25 transition-all transform hover:scale-105 active:scale-95"
              >
                <span>Acessar Portfólio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé da Intro */}
      <div className="w-full max-w-5xl flex items-center justify-between text-[11px] font-mono text-gray-500 z-20">
        <span>ENGENHARIA DE SOFTWARE & IA</span>
        <span>JEFERSON TAVEIRA // 2026</span>
      </div>
    </div>
  );
};
