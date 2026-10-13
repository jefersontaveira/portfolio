"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { SpeechManager } from "@/lib/speechHelper";

interface HologramIntroProps {
  isDocked?: boolean;
  onEnterPortfolio: () => void;
  onOpenChat?: () => void;
}

export const HologramIntro: React.FC<HologramIntroProps> = ({
  isDocked: propIsDocked,
  onEnterPortfolio,
  onOpenChat,
}) => {
  const [internalDocked, setInternalDocked] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  // Controle de transição e visibilidade inicial
  const [greetingVisible, setGreetingVisible] = useState(false);
  const [hologramVisible, setHologramVisible] = useState(false);
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const dockProgressRef = useRef<number>(0);

  const isDocked = propIsDocked !== undefined ? propIsDocked : internalDocked;

  const welcomeVoiceText = "Sistemas online. Seja bem-vindo ao portfólio de Jeferson Taveira.";

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions, { passive: true });

    // Se já estiver acoplado no canto, ativa direto
    if (isDocked) {
      setHologramVisible(true);
      dockProgressRef.current = 1;
      return () => window.removeEventListener("resize", updateDimensions);
    }

    // 1. Início: Saudação surge rapidamente (60ms)
    const t1 = setTimeout(() => {
      setGreetingVisible(true);
    }, 60);

    // 2. O texto fica na tela por 1s e esmaece
    const t2 = setTimeout(() => {
      setGreetingVisible(false);
    }, 1000);

    // 3. O holograma surge na tela em 1.4s com o botão Iniciar Sistema
    const t3 = setTimeout(() => {
      setHologramVisible(true);
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [isDocked]);

  // Efeito sonoro futurista de ativação
  const playSciFiSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch (e) {
      // Ignora caso bloqueado pelo navegador
    }
  };

  // Clique no botão "Iniciar Sistema"
  const handleStartSystem = () => {
    setIsSystemActive(true);
    playSciFiSound();

    let typingFinished = false;
    let voiceFinished = false;

    const transitionToPortfolio = () => {
      setTimeout(() => {
        setInternalDocked(true);
        onEnterPortfolio();
      }, 500);
    };

    setTimeout(() => {
      SpeechManager.speak(
        welcomeVoiceText,
        () => {},
        () => {
          voiceFinished = true;
          if (typingFinished) {
            transitionToPortfolio();
          }
        }
      );

      let i = 0;
      const interval = setInterval(() => {
        if (i <= welcomeVoiceText.length) {
          setTypedMessage(welcomeVoiceText.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
          typingFinished = true;
          setTimeout(() => {
            transitionToPortfolio();
          }, 600);
        }
      }, 36);
    }, 250);
  };

  // Renderização contínua do Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    const particles: {
      x: number;
      y: number;
      speed: number;
      size: number;
      alpha: number;
      angle: number;
      radius: number;
    }[] = [];

    // Partículas flutuantes de energia
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 200,
        y: Math.random() * 300,
        speed: 0.6 + Math.random() * 1.4,
        size: 1 + Math.random() * 2,
        alpha: Math.random() * 0.7,
        angle: Math.random() * Math.PI * 2,
        radius: 35 + Math.random() * 55,
      });
    }

    const render = () => {
      time += 0.025;
      const width = canvas.width;
      const height = canvas.height;

      // Interpolação suave e sincronizada para o modo docked
      const targetDock = isDocked ? 1 : 0;
      dockProgressRef.current += (targetDock - dockProgressRef.current) * 0.08;
      const dp = dockProgressRef.current;

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      const scale = width / 400;
      ctx.scale(scale, scale);

      const baseWidth = 400;
      const baseHeight = 400;
      const centerX = baseWidth / 2;
      const centerY = baseHeight / 2;

      // 1. FEIXE DE LUZ CÔNICO SUBINDO DO CHÃO (Desaparece gradualmente no modo docked)
      if (dp < 0.99) {
        const beamAlpha = (1 - dp) * 0.22;
        const groundY = centerY + 155;
        const beamGrad = ctx.createLinearGradient(centerX, groundY, centerX, centerY - 95);
        beamGrad.addColorStop(0, `rgba(0, 242, 254, ${beamAlpha})`);
        beamGrad.addColorStop(0.6, `rgba(0, 242, 254, ${beamAlpha * 0.3})`);
        beamGrad.addColorStop(1, "rgba(0, 242, 254, 0.0)");

        ctx.beginPath();
        ctx.moveTo(centerX - 120, groundY);
        ctx.lineTo(centerX + 120, groundY);
        ctx.lineTo(centerX + 50, centerY - 100);
        ctx.lineTo(centerX - 50, centerY - 100);
        ctx.closePath();
        ctx.fillStyle = beamGrad;
        ctx.fill();

        // 2. DISCO DE PROJEÇÃO NO CHÃO (Desaparece suavemente no modo docked)
        const discAlpha = (1 - dp) * 0.4;
        ctx.beginPath();
        ctx.ellipse(centerX, groundY, 120, 24, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 242, 254, ${discAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(centerX, groundY, 70, 14, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 242, 254, ${discAlpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. PARTÍCULAS DE ENERGIA AO REDOR DO CÍRCULO (Transição contínua)
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < centerY - 95) {
          p.y = centerY + 155;
          p.x = (Math.random() - 0.5) * 150;
        }
        const beamX = centerX + p.x;
        const beamY = p.y;

        p.angle += 0.016 * p.speed;
        const orbitX = centerX + Math.cos(p.angle) * p.radius;
        const orbitY = centerY + Math.sin(p.angle) * p.radius;

        const finalX = beamX * (1 - dp) + orbitX * dp;
        const finalY = beamY * (1 - dp) + orbitY * dp;

        ctx.beginPath();
        ctx.arc(finalX, finalY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${p.alpha * 0.75})`;
        ctx.fill();
      });

      // 4. ANÉIS ORBITAIS HOLOGRÁFICOS
      const speedMultiplier = isSystemActive || isDocked ? 1.4 : 0.8;

      // Anel 1: Externo, rotação horária
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.6 * speedMultiplier);
      ctx.beginPath();
      ctx.ellipse(0, 0, 105, 44, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 242, 254, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 8, 4, 8]);
      ctx.stroke();
      ctx.restore();

      // Anel 2: Intermediário inclinado, rotação anti-horária com nó de dado
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-time * speedMultiplier);
      ctx.beginPath();
      ctx.ellipse(0, 0, 80, 34, -Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.45)";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([18, 10]);
      ctx.stroke();

      const nodeX = Math.cos(time * 1.8) * 80;
      const nodeY = Math.sin(time * 1.8) * 34;
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#00F2FE";
      ctx.shadowColor = "#00F2FE";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();

      // Anel 3: Interno vertical
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 1.4 * speedMultiplier);
      ctx.beginPath();
      ctx.ellipse(0, 0, 52, 52, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.restore();

      // 5. NÚCLEO ESFÉRICO CENTRAL DE ENERGIA (O Círculo)
      const pulse = Math.sin(time * 3) * (isSystemActive || isDocked ? 6 : 4);
      const coreRadius = (isSystemActive || isDocked ? 24 : 18) + pulse;

      const coreGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        2,
        centerX,
        centerY,
        coreRadius + 22
      );
      coreGlow.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      coreGlow.addColorStop(0.3, "rgba(0, 242, 254, 0.85)");
      coreGlow.addColorStop(0.7, "rgba(168, 85, 247, 0.3)");
      coreGlow.addColorStop(1, "rgba(0, 242, 254, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius + 22, 0, Math.PI * 2);
      ctx.fillStyle = coreGlow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 242, 254, 0.75)";
      ctx.fill();

      // 6. SCANLINES HOLOGRÁFICAS HORIZONTAIS
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
      ctx.clip();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.28)";
      ctx.lineWidth = 1.5;
      for (let y = centerY - 120; y < centerY + 120; y += 4) {
        ctx.beginPath();
        ctx.moveTo(centerX - 120, y);
        ctx.lineTo(centerX + 120, y);
        ctx.stroke();
      }
      ctx.restore();

      ctx.restore();

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isSystemActive, isDocked]);

  // Breakpoints dinâmicos com suporte a telas grandes de PC e celulares
  const isMobile = dimensions.width < 640;
  const isTablet = dimensions.width >= 640 && dimensions.width < 1024;

  // Tamanho do holograma no centro (Intro):
  // No PC: amplo e imponente (até 660px); no mobile: cabe perfeitamente na largura (320px-340px)
  const centralSize = isMobile
    ? Math.min(dimensions.width - 32, 340)
    : isTablet
    ? Math.min(Math.round(dimensions.width * 0.7), Math.round(dimensions.height * 0.6), 500)
    : Math.min(Math.round(dimensions.width * 0.55), Math.round(dimensions.height * 0.72), 660);

  // Tamanho no canto inferior direito (Docked):
  const dockedSize = isMobile
    ? (dimensions.width < 380 ? 84 : 96)
    : isTablet
    ? 124
    : 160;

  // Margem simétrica diagonal
  const dockedMargin = isMobile
    ? (dimensions.width < 380 ? "12px" : "16px")
    : "24px";

  const containerSize = isDocked ? dockedSize : centralSize;

  return (
    <>
      {/* ============================================================== */}
      {/* TELA DE FUNDO ESCURA (Fade out suave ao abrir o portfólio) */}
      {/* ============================================================== */}
      <div
        suppressHydrationWarning
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-1000 ${
          isDocked ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        }`}
      >
        {/* Saudação Inicial: Bem-vindo */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-400 pointer-events-none px-4 text-center ${
            greetingVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] sm:tracking-[0.3em] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
            Bem-vindo
          </h1>
          <div className="w-14 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-[#00F2FE] to-transparent mt-4 sm:mt-5 opacity-70 animate-pulse" />
        </div>
      </div>

      {/* ============================================================== */}
      {/* HOLOGRAMA PERMANENTE: AMPLIADO NO PC, RESPONSIVO NO CELULAR */}
      {/* ============================================================== */}
      <div
        suppressHydrationWarning
        style={{
          position: "fixed",
          zIndex: 50,
          right: isDocked ? dockedMargin : "50%",
          bottom: isDocked ? dockedMargin : "50%",
          transform: isDocked ? "translate(0, 0)" : "translate(50%, 50%)",
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          aspectRatio: "1 / 1",
          transition: "all 1s cubic-bezier(0.25, 1, 0.5, 1)",
          pointerEvents: isDocked ? "auto" : (hologramVisible ? "auto" : "none"),
        }}
        onClick={() => {
          if (isDocked && onOpenChat) {
            onOpenChat();
          }
        }}
        className={`flex items-center justify-center select-none shrink-0 ${
          isDocked ? "cursor-pointer" : ""
        } ${!hologramVisible && !isDocked ? "opacity-0" : "opacity-100"} transition-opacity duration-1000`}
      >
        <canvas
          ref={canvasRef}
          width={660}
          height={660}
          className="w-full h-full aspect-square block shrink-0 drop-shadow-[0_0_35px_rgba(0,242,254,0.4)] pointer-events-none"
        />
      </div>

      {/* ============================================================== */}
      {/* BOTÃO ÚNICO INICIAR SISTEMA (100% Centralizado no Mobile e PC) */}
      {/* ============================================================== */}
      {!isSystemActive && !isDocked && hologramVisible && (
        <div
          suppressHydrationWarning
          className="fixed inset-x-0 bottom-8 sm:bottom-12 md:bottom-14 z-50 flex justify-center items-center px-4 pointer-events-auto"
        >
          <button
            onClick={handleStartSystem}
            suppressHydrationWarning
            className="group relative px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#A855F7] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(0,242,254,0.4)] hover:shadow-[0_0_45px_rgba(0,242,254,0.7)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer max-w-xs w-auto touch-manipulation"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black text-black group-hover:scale-110 transition-transform" />
            <span>Iniciar Sistema</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* LEGENDA FALADA (100% Centralizada no Mobile e PC) */}
      {/* ============================================================== */}
      {isSystemActive && !isDocked && (
        <div
          suppressHydrationWarning
          className="fixed inset-x-0 bottom-8 sm:bottom-12 md:bottom-14 z-50 flex justify-center items-center px-4 pointer-events-none transition-opacity duration-500"
        >
          <div className="bg-[#080B11]/90 backdrop-blur-md border border-[#00F2FE]/40 rounded-2xl px-5 sm:px-6 py-3 sm:py-3.5 shadow-2xl max-w-sm sm:max-w-md w-full text-center">
            <p className="text-xs sm:text-sm font-mono text-[#00F2FE] leading-relaxed min-h-[36px] flex items-center justify-center">
              {typedMessage}
              <span className="inline-block w-2 h-3.5 bg-[#00F2FE] ml-1 animate-pulse" />
            </p>
          </div>
        </div>
      )}
    </>
  );
};
