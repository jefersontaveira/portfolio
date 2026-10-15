"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Github, 
  Cpu, 
  Code2, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Terminal,
  BookOpen,
  Zap,
  ExternalLink
} from "lucide-react";
import { getOnnxSession, runQuickDrawInference } from "@/lib/onnxInference";

const CLASSES = [
  { name: "Carro", icon: "🚗", id: 0, desc: "Veículo automotor com rodas e chassi horizontal" },
  { name: "Avião", icon: "✈️", id: 1, desc: "Aeronave com asas perpendiculares à fuselagem" },
  { name: "Maçã", icon: "🍎", id: 2, desc: "Forma circular arredondada com caule superior" },
  { name: "Gato", icon: "🐱", id: 3, desc: "Cabeça felina com duas orelhas triangulares no topo" },
  { name: "Peixe", icon: "🐟", id: 4, desc: "Corpo hidrodinâmico horizontal com cauda assimétrica" },
  { name: "Estrela", icon: "⭐", id: 5, desc: "Forma geométrica com pontas irradiando do centro" },
  { name: "Árvore", icon: "🌲", id: 6, desc: "Copa superior densa sobre um tronco vertical estreito" },
  { name: "Guarda-chuva", icon: "☂️", id: 7, desc: "Cúpula superior curva conectada a haste vertical" },
];

export default function ClassificadorDesenhosPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [predictions, setPredictions] = useState<
    { name: string; icon: string; score: number }[]
  >([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [inferenceTime, setInferenceTime] = useState<string>("5ms");
  const [activeCodeTab, setActiveCodeTab] = useState<"model" | "train" | "dataset">("model");
  const [brushSize, setBrushSize] = useState<number>(7);
  const isInferringRef = useRef(false);
  const pendingInferenceRef = useRef(false);

  // Pré-carrega o modelo ONNX e inicializa o canvas
  useEffect(() => {
    getOnnxSession().catch((err: unknown) => {
      console.warn("Pré-carregamento do modelo ONNX:", err);
    });
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const pCanvas = previewCanvasRef.current;
    if (pCanvas) {
      const pCtx = pCanvas.getContext("2d");
      if (pCtx) {
        pCtx.fillStyle = "#000000";
        pCtx.fillRect(0, 0, 28, 28);
      }
    }
  }, [brushSize]);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const triggerInference = () => {
    if (isInferringRef.current) {
      pendingInferenceRef.current = true;
      return;
    }
    isInferringRef.current = true;
    runInference().finally(() => {
      isInferringRef.current = false;
      if (pendingInferenceRef.current) {
        pendingInferenceRef.current = false;
        triggerInference();
      }
    });
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = "#FFFFFF";
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    triggerInference();
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineTo(x, y);
    ctx.stroke();
    triggerInference();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    triggerInference();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = "#FFFFFF";
    setHasDrawn(false);
    setPredictions([]);

    const pCanvas = previewCanvasRef.current;
    if (pCanvas) {
      const pCtx = pCanvas.getContext("2d");
      if (pCtx) {
        pCtx.fillStyle = "#000000";
        pCtx.fillRect(0, 0, 28, 28);
      }
    }
  };

  const runInference = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let minX = canvas.width;
    let maxX = 0;
    let minY = canvas.height;
    let maxY = 0;
    let whitePixels = 0;

    for (let y = 0; y < canvas.height; y += 2) {
      for (let x = 0; x < canvas.width; x += 2) {
        const idx = (y * canvas.width + x) * 4;
        if (data[idx] > 40) {
          whitePixels++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (whitePixels < 12 || maxX <= minX || maxY <= minY) {
      setPredictions([]);
      return;
    }

    const boxW = Math.max(1, maxX - minX + 1);
    const boxH = Math.max(1, maxY - minY + 1);
    const maxDim = Math.max(boxW, boxH);

    // Margem de 2px para centralizar dentro da matriz 28x28 com proporções idênticas ao dataset
    const availableSize = 24;
    const scale = availableSize / Math.max(maxDim, 1);
    const targetW = Math.max(1, Math.round(boxW * scale));
    const targetH = Math.max(1, Math.round(boxH * scale));
    const startX = Math.round((28 - targetW) / 2);
    const startY = Math.round((28 - targetH) / 2);

    const pCanvas = previewCanvasRef.current;
    if (!pCanvas) return;
    const pCtx = pCanvas.getContext("2d");
    if (!pCtx) return;

    pCtx.imageSmoothingEnabled = true;
    pCtx.imageSmoothingQuality = "high";
    pCtx.fillStyle = "#000000";
    pCtx.fillRect(0, 0, 28, 28);
    pCtx.drawImage(canvas, minX, minY, boxW, boxH, startX, startY, targetW, targetH);


    const pImgData = pCtx.getImageData(0, 0, 28, 28);
    const rawData = new Float32Array(28 * 28);

    // Encontra valor máximo para normalização de contraste
    let maxVal = 0;
    for (let i = 0; i < 28 * 28; i++) {
      const v = pImgData.data[i * 4];
      if (v > maxVal) maxVal = v;
      rawData[i] = v;
    }

    const normFactor = maxVal > 0 ? 1.0 / maxVal : 1.0;
    for (let i = 0; i < 28 * 28; i++) {
      rawData[i] *= normFactor;
    }

    // Dilatação morfológica 3x3 suave (reproduz ImageFilter.MaxFilter(5) do app.py original)
    // Garante que o traço encolhido preencha 2 a 3 pixels de largura na resolução do QuickDraw
    const floatData = new Float32Array(28 * 28);
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        let maxNeighborhood = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < 28 && nx >= 0 && nx < 28) {
              const val = rawData[ny * 28 + nx];
              if (val > maxNeighborhood) maxNeighborhood = val;
            }
          }
        }
        floatData[y * 28 + x] = maxNeighborhood;
      }
    }

    // Atualiza a visualização do tensor 28x28 para exibir exatamente o que a CNN processa
    for (let i = 0; i < 28 * 28; i++) {
      const pxVal = Math.round(floatData[i] * 255);
      pImgData.data[i * 4] = pxVal;
      pImgData.data[i * 4 + 1] = pxVal;
      pImgData.data[i * 4 + 2] = pxVal;
      pImgData.data[i * 4 + 3] = 255;
    }
    pCtx.putImageData(pImgData, 0, 0);

    try {
      const { predictions: ranked, inferenceTimeMs } = await runQuickDrawInference(floatData);
      setInferenceTime(`${inferenceTimeMs}ms`);
      setPredictions(ranked.slice(0, 4));
    } catch (err) {
      console.error("Erro na inferência neural:", err);
    }
  };



  return (
    <div className="min-h-screen bg-[#080B11] text-[#F8FAFC] selection:bg-[#00F2FE]/20 selection:text-[#00F2FE] relative overflow-x-hidden">
      {/* Luzes e Efeitos Atmosféricos de Fundo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-gradient-to-br from-[#00F2FE]/15 via-[#38BDF8]/08 to-transparent blur-[150px] rounded-full" />
        <div className="absolute top-40 -right-32 w-[700px] h-[700px] bg-gradient-to-bl from-[#A855F7]/15 via-[#6366F1]/08 to-transparent blur-[160px] rounded-full" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-[#10B981]/10 via-[#00F2FE]/05 to-transparent blur-[160px] rounded-full" />
      </div>

      {/* Top Header / Barra de Retorno */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#080B11]/80 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-mono text-gray-400 hover:text-[#00F2FE] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Portfólio</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Modelo Operacional
            </span>
            <a
              href="https://github.com/jefersontaveira/classificador_de_desenhos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00F2FE]/40 text-xs font-mono text-white transition-all shadow-sm"
            >
              <Github className="w-4 h-4 text-[#00F2FE]" />
              <span>Ver no GitHub</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        {/* Banner do Projeto */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F2FE]/10 border border-[#00F2FE]/25 text-[#00F2FE] text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>MACHINE LEARNING & VISÃO COMPUTACIONAL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Classificador de Desenhos em Tempo Real{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#A855F7]">
              (QuickDraw CNN)
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-3xl leading-relaxed">
            Rede Neural Convolucional completa desenvolvida em <strong>Python com PyTorch</strong>, treinada sobre o dataset oficial <em>Google Quick, Draw!</em> e executada diretamente no navegador com inferência instantânea (&lt; 6ms).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {[
              { label: "PyTorch 2.0+", icon: "🔥" },
              { label: "Python 3.12", icon: "🐍" },
              { label: "CNN Deep Learning", icon: "🧠" },
              { label: "ONNX Runtime Web", icon: "⚡" },
              { label: "WebAssembly (WASM)", icon: "⚙️" },
              { label: "Google QuickDraw", icon: "🎨" },
              { label: "TypeScript", icon: "🔷" },
              { label: "HTML5 Canvas API", icon: "🖌️" },
            ].map((tech) => (
              <div
                key={tech.label}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-gray-300 text-xs font-mono transition-colors"
              >
                <span className="text-sm shrink-0">{tech.icon}</span>
                <span className="truncate">{tech.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SEÇÃO INTERATIVA: O LABORATÓRIO DE INFERÊNCIA AO VIVO */}
        {/* ============================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#0F172A]/70 border border-[#00F2FE]/30 backdrop-blur-xl shadow-[0_0_60px_rgba(0,242,254,0.12)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/30">
                  <Zap className="w-4 h-4" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Demonstração Interativa ao Vivo
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Desenhe livremente no canvas preto. A rede processa os traços e ranqueia as probabilidades instantaneamente.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Latência: {inferenceTime}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Coluna do Canvas Expandido */}
            <div className="md:col-span-1 lg:col-span-6 flex flex-col items-center w-full">
              <div className="w-full max-w-[420px] flex items-center justify-between text-xs text-gray-400 mb-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse" />
                  <span>Quadro de Desenho</span>
                </span>
                <span className="text-[#00F2FE] text-[11px]">Mouse & Touch Ativos</span>
              </div>

              {/* Seletor de Espessura do Traço */}
              <div className="w-full max-w-[420px] mb-2.5 flex items-center justify-between p-1 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-[11px] font-mono text-gray-400 pl-2.5 shrink-0">Traço:</span>
                <div className="flex items-center gap-1">
                  {[
                    { label: "Fino", size: 4, width: "w-2.5", height: "h-0.5" },
                    { label: "Médio", size: 7, width: "w-3", height: "h-1" },
                    { label: "Grosso", size: 11, width: "w-3.5", height: "h-1.5" },
                  ].map((opt) => (
                    <button
                      key={opt.size}
                      type="button"
                      onClick={() => setBrushSize(opt.size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                        brushSize === opt.size
                          ? "bg-[#00F2FE] text-black font-bold shadow-[0_0_12px_rgba(0,242,254,0.4)]"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`${opt.width} ${opt.height} rounded-full bg-current block shrink-0`}
                      />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] aspect-square border-2 border-[#00F2FE]/40 rounded-2xl overflow-hidden bg-black shadow-[0_0_35px_rgba(0,242,254,0.18)]">
                <canvas
                  ref={canvasRef}
                  width={420}
                  height={420}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="touch-canvas cursor-crosshair block w-full h-full"
                  style={{ touchAction: "none" }}
                />

                {!hasDrawn && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center p-6">
                    <p className="text-sm font-medium text-gray-300 font-mono leading-relaxed">
                      Área de desenho interativa
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-2 max-w-[260px]">
                      Desenhe livremente: carro, avião, maçã, gato, peixe, estrela, árvore ou guarda-chuva...
                    </p>
                  </div>
                )}
              </div>

              {/* Card de Predição Imediata em Tempo Real (Visível sem rolar a página) */}
              <div className="w-full max-w-[420px] mt-3 p-3 rounded-xl bg-gradient-to-r from-[#00F2FE]/15 via-[#38BDF8]/10 to-[#A855F7]/15 border border-[#00F2FE]/40 shadow-[0_0_20px_rgba(0,242,254,0.12)] flex items-center justify-between transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00F2FE]/20 border border-[#00F2FE]/40 flex items-center justify-center text-2xl shrink-0 shadow-[0_0_12px_rgba(0,242,254,0.3)]">
                    {predictions.length > 0 ? predictions[0].icon : "✏️"}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${predictions.length > 0 ? "bg-[#10B981] animate-pulse" : "bg-gray-500"}`} />
                      <span>{predictions.length > 0 ? "IA Detectou:" : "Aguardando traço..."}</span>
                    </div>
                    <div className="text-sm sm:text-base font-bold font-mono text-white flex items-center gap-2">
                      <span>{predictions.length > 0 ? predictions[0].name : "Desenhe no quadro"}</span>
                      {predictions.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/30">
                          {predictions[0].score}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {predictions.length > 1 && (
                  <div className="text-right pl-3 border-l border-white/10 hidden min-[380px]:block">
                    <div className="text-[10px] font-mono text-gray-400">2ª opção:</div>
                    <div className="text-xs font-mono text-gray-300 font-medium">
                      {predictions[1].icon} {predictions[1].name} <span className="text-gray-400">({predictions[1].score}%)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Botões do Canvas & Tensor Compacto Integrado */}
              <div className="mt-3 flex items-center gap-2 w-full max-w-[420px]">
                <button
                  onClick={clearCanvas}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-200 hover:text-white text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar Tela</span>
                </button>

                {/* Tensor Preview Compacto integrado */}
                <div
                  className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-xl bg-[#080B11] border border-[#00F2FE]/30 shrink-0"
                  title="Tensor 28x28 processado pela rede neural"
                >
                  <canvas
                    ref={previewCanvasRef}
                    width={28}
                    height={28}
                    className="w-6 h-6 rounded border border-[#00F2FE]/50 bg-black block"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <span className="text-[10px] font-mono text-[#00F2FE] font-bold hidden min-[360px]:inline">
                    28x28
                  </span>
                </div>
              </div>
            </div>

            {/* Coluna das Predições Completas */}
            <div className="md:col-span-1 lg:col-span-6 flex flex-col justify-between h-full bg-[#080B11]/70 p-6 sm:p-7 rounded-2xl border border-white/10 w-full">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Distribuição Softmax de Probabilidades</span>
                  <span className="text-xs font-mono text-[#00F2FE]">8 Classes</span>
                </div>

                {/* Chips de Classes Disponíveis */}
                <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-mono text-gray-400">Classes treinadas:</span>
                  {CLASSES.map((c) => (
                    <span
                      key={c.id}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300"
                    >
                      {c.icon} {c.name}
                    </span>
                  ))}
                </div>

                {/* Lista de Predições */}
                <div className="mt-6 space-y-4">
                  {predictions.length > 0 ? (
                    predictions.map((pred, idx) => (
                      <div key={pred.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-200 flex items-center gap-2 font-medium">
                            <span className="text-lg">{pred.icon}</span>
                            <span>{pred.name}</span>
                            {idx === 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] font-mono font-bold border border-[#00F2FE]/30">
                                Top 1 Predição
                              </span>
                            )}
                          </span>
                          <span className="font-mono text-base font-bold text-white">{pred.score}%</span>
                        </div>
                        {/* Barra */}
                        <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-200 ${
                              idx === 0
                                ? "bg-gradient-to-r from-[#00F2FE] via-[#38BDF8] to-[#A855F7]"
                                : "bg-white/20"
                            }`}
                            style={{ width: `${pred.score}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-xs font-mono text-gray-500">
                      Faça um traço no canvas ao lado para que a inteligência artificial analise a imagem...
                    </div>
                  )}
                </div>
              </div>

              {/* Dica de Engenharia */}
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-400 font-mono leading-relaxed">
                <span className="text-[#38BDF8] font-bold">Invariância Espacial:</span> O pipeline centraliza automaticamente a bounding box do desenho e normaliza o contraste para a escala [0, 1], garantindo que desenhos desenhados em qualquer canto do canvas sejam lidos com precisão.
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SEÇÃO TÉCNICA: COMO O PROJETO FOI CRIADO */}
        {/* ============================================================== */}
        <section className="space-y-10">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#00F2FE]" />
              <span>Como o Projeto Foi Criado (Engenharia de Ponta a Ponta)</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Do download dos datasets vetoriais até o treinamento e a compilação do modelo.
            </p>
          </div>

          {/* Cards de Etapas do Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0F172A]/50 border border-white/10 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#00F2FE]/10 text-[#00F2FE] flex items-center justify-center font-mono font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-white">1. Dataset Quick, Draw!</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Utilização do dataset oficial do Google Cloud Storage com arquivos <code>.npy</code> contendo milhares de amostras por categoria. Implementação de PyTorch <code>Dataset</code> e <code>DataLoader</code> customizados com divisão de 80% treino e 20% validação.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A]/50 border border-white/10 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#A855F7]/10 text-[#A855F7] flex items-center justify-center font-mono font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-white">2. Arquitetura CNN (QuickDrawCNN)</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Rede neural convolucional profunda com 3 blocos de convolução (32, 64 e 128 filtros 3x3), <code>BatchNorm2d</code> para acelerar convergência, <code>MaxPool2d</code> para redução espacial e <code>Dropout(0.3)</code> para mitigar overfitting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A]/50 border border-white/10 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-mono font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-white">3. Treino & Validação em GPU</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Otimização com algoritmo <code>Adam(lr=0.001)</code> e função de perda <code>CrossEntropyLoss</code>. O modelo atinge mais de <strong>94% de acurácia</strong> em apenas 5 épocas com salvamento automático do melhor checkpoint <code>.pt</code>.
              </p>
            </div>
          </div>

          {/* Diagrama da Arquitetura Neural */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0F172A]/60 border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#38BDF8]" />
              <span>Fluxo Dimensional dos Tensores na CNN</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#080B11] border border-white/10">
                <span className="text-gray-400 block text-[10px]">Entrada</span>
                <span className="text-[#00F2FE] font-bold block mt-1">[B, 1, 28, 28]</span>
                <span className="text-[10px] text-gray-500">Traço Monocromático</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080B11] border border-white/10">
                <span className="text-gray-400 block text-[10px]">Bloco Conv 1</span>
                <span className="text-[#38BDF8] font-bold block mt-1">[B, 32, 14, 14]</span>
                <span className="text-[10px] text-gray-500">Bordas e Cantos</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080B11] border border-white/10">
                <span className="text-gray-400 block text-[10px]">Bloco Conv 2</span>
                <span className="text-[#A855F7] font-bold block mt-1">[B, 64, 7, 7]</span>
                <span className="text-[10px] text-gray-500">Curvas e Formas</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080B11] border border-white/10">
                <span className="text-gray-400 block text-[10px]">Bloco Conv 3</span>
                <span className="text-[#EC4899] font-bold block mt-1">[B, 128, 3, 3]</span>
                <span className="text-[10px] text-gray-500">Padrões Compostos</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080B11] border border-white/10">
                <span className="text-gray-400 block text-[10px]">Camada Linear FC</span>
                <span className="text-[#F59E0B] font-bold block mt-1">[B, 128]</span>
                <span className="text-[10px] text-gray-500">Dropout (0.3)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080B11] border border-white/10">
                <span className="text-gray-400 block text-[10px]">Saída Final</span>
                <span className="text-[#10B981] font-bold block mt-1">[B, 8]</span>
                <span className="text-[10px] text-gray-500">Softmax Logits</span>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* VISUALIZADOR DE CÓDIGO PYTHON REAL DO REPOSITÓRIO */}
          {/* ============================================================== */}
          <div className="p-4 sm:p-8 rounded-2xl bg-[#0F172A]/60 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] flex items-center justify-center shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                    Código Fonte do Repositório
                  </h3>
                  <p className="text-xs font-mono text-[#00F2FE]">PyTorch nn.Module & Pipeline</p>
                </div>
              </div>

              {/* Tabs de Código (Responsivo no mobile com grid 3 colunas e 100% preservado no PC) */}
              <div className="w-full sm:w-auto grid grid-cols-3 sm:flex sm:items-center sm:justify-start gap-1 sm:gap-1.5 bg-[#080B11] p-1 sm:p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveCodeTab("model")}
                  className={`w-full sm:w-auto flex items-center justify-center px-1 min-[380px]:px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] min-[380px]:text-[11px] sm:text-xs font-mono transition-all text-center whitespace-nowrap cursor-pointer ${
                    activeCodeTab === "model"
                      ? "bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/30 font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="hidden min-[360px]:inline">src/</span>model.py
                </button>
                <button
                  onClick={() => setActiveCodeTab("train")}
                  className={`w-full sm:w-auto flex items-center justify-center px-1 min-[380px]:px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] min-[380px]:text-[11px] sm:text-xs font-mono transition-all text-center whitespace-nowrap cursor-pointer ${
                    activeCodeTab === "train"
                      ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="hidden min-[360px]:inline">src/</span>train.py
                </button>
                <button
                  onClick={() => setActiveCodeTab("dataset")}
                  className={`w-full sm:w-auto flex items-center justify-center px-1 min-[380px]:px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] min-[380px]:text-[11px] sm:text-xs font-mono transition-all text-center whitespace-nowrap cursor-pointer ${
                    activeCodeTab === "dataset"
                      ? "bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/30 font-semibold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="hidden min-[360px]:inline">src/</span>dataset.py
                </button>
              </div>
            </div>

            {/* Código Tab 1: model.py */}
            {activeCodeTab === "model" && (
              <div className="bg-[#080B11] p-4 sm:p-5 rounded-xl border border-white/10 overflow-x-auto">
                <div className="text-[11px] font-mono text-gray-400 pb-2 mb-2 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>src/model.py — QuickDrawCNN Architecture</span>
                  <span className="text-[#00F2FE]">PyTorch nn.Module</span>
                </div>
                <pre className="text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto">
{`import torch
import torch.nn as nn
import torch.nn.functional as F

class QuickDrawCNN(nn.Module):
    """
    Arquitetura Convolucional para Reconhecimento de Traços.
    Entrada: Imagem monocromática (1 canal, 28x28 pixels)
    """
    def __init__(self, num_classes: int = 8):
        super(QuickDrawCNN, self).__init__()
        
        # Bloco 1: [B, 1, 28, 28] -> [B, 32, 28, 28] -> Pool [B, 32, 14, 14]
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        
        # Bloco 2: [B, 32, 14, 14] -> [B, 64, 14, 14] -> Pool [B, 64, 7, 7]
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        
        # Bloco 3: [B, 64, 7, 7] -> [B, 128, 7, 7] -> Pool [B, 128, 3, 3]
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        
        # Camadas Densas com Dropout de 30%
        self.fc1 = nn.Linear(128 * 3 * 3, 128)
        self.dropout = nn.Dropout(p=0.3)
        self.fc2 = nn.Linear(128, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.pool(F.relu(self.bn1(self.conv1(x))))
        x = self.pool(F.relu(self.bn2(self.conv2(x))))
        x = self.pool(F.relu(self.bn3(self.conv3(x))))
        
        x = x.view(x.size(0), -1)  # Achatamento (Flatten)
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        return self.fc2(x)`}
                </pre>
              </div>
            )}

            {/* Código Tab 2: train.py */}
            {activeCodeTab === "train" && (
              <div className="bg-[#080B11] p-4 sm:p-5 rounded-xl border border-white/10 overflow-x-auto">
                <div className="text-[11px] font-mono text-gray-400 pb-2 mb-2 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>src/train.py — Training & Backpropagation Loop</span>
                  <span className="text-[#38BDF8]">Adam Optimizer + CrossEntropyLoss</span>
                </div>
                <pre className="text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto">
{`def train_one_epoch(model, dataloader, criterion, optimizer, device):
    model.train()
    running_loss, correct, total = 0.0, 0, 0
    
    for images, labels in dataloader:
        images, labels = images.to(device), labels.to(device)
        
        # 1. Zera os gradientes acumulados
        optimizer.zero_grad()
        
        # 2. Forward pass: calcula os logits
        outputs = model(images)
        
        # 3. Calcula o erro (Loss)
        loss = criterion(outputs, labels)
        
        # 4. Backward pass: calcula gradientes com regra da cadeia
        loss.backward()
        
        # 5. Otimizador atualiza os pesos
        optimizer.step()
        
        running_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()
        
    return running_loss / total, 100.0 * correct / total`}
                </pre>
              </div>
            )}

            {/* Código Tab 3: dataset.py */}
            {activeCodeTab === "dataset" && (
              <div className="bg-[#080B11] p-4 sm:p-5 rounded-xl border border-white/10 overflow-x-auto">
                <div className="text-[11px] font-mono text-gray-400 pb-2 mb-2 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>src/dataset.py — QuickDraw Dataset Loader</span>
                  <span className="text-[#A855F7]">PyTorch Dataset</span>
                </div>
                <pre className="text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto">
{`CLASSES = [
    "airplane", "apple", "car", "cat",
    "fish", "star", "tree", "umbrella"
]

class QuickDrawDataset(Dataset):
    def __init__(self, data_dir="data/quickdraw", classes=CLASSES, max_samples=10000):
        self.data, self.labels = [], []
        
        for idx, category in enumerate(classes):
            raw = np.load(f"{data_dir}/{category}.npy")[:max_samples]
            # Normalização para intervalo [0.0, 1.0]
            normalized = raw.astype(np.float32) / 255.0
            reshaped = normalized.reshape(-1, 1, 28, 28)
            
            self.data.append(reshaped)
            self.labels.append(np.full(len(reshaped), idx, dtype=np.int64))
            
        self.data = np.concatenate(self.data, axis=0)
        self.labels = np.concatenate(self.labels, axis=0)

    def __getitem__(self, idx):
        return torch.from_numpy(self.data[idx]), torch.tensor(self.labels[idx])`}
                </pre>
              </div>
            )}
          </div>
        </section>

        {/* Rodapé da Página Dedicada */}
        <footer className="pt-8 pb-20 sm:pb-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400 text-center sm:text-left">
          <div>
            Projeto de <strong className="text-white font-semibold">Jeferson Taveira</strong>
            <span className="hidden sm:inline"> • </span>
            <span className="block sm:inline text-gray-400 mt-1 sm:mt-0">Engenharia de Software, IA & Python</span>
          </div>
          <div className="flex items-center justify-center gap-6">
            <Link href="/" className="hover:text-[#00F2FE] text-gray-300 transition-colors py-1">
              Página Principal
            </Link>
            <span className="text-white/20">•</span>
            <a
              href="https://github.com/jefersontaveira/classificador_de_desenhos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00F2FE] text-gray-300 transition-colors py-1 flex items-center gap-1.5"
            >
              <span>Repositório no GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
