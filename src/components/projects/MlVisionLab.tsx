"use client";

import React, { useRef, useState, useEffect } from "react";
import { Sparkles, RotateCcw, Cpu, Code2, Check, AlertCircle } from "lucide-react";
import { getOnnxSession, runQuickDrawInference } from "@/lib/onnxInference";

const CLASSES = [
  { name: "Carro", icon: "🚗", id: 0 },
  { name: "Avião", icon: "✈️", id: 1 },
  { name: "Maçã", icon: "🍎", id: 2 },
  { name: "Gato", icon: "🐱", id: 3 },
  { name: "Peixe", icon: "🐟", id: 4 },
  { name: "Estrela", icon: "⭐", id: 5 },
  { name: "Árvore", icon: "🌲", id: 6 },
  { name: "Guarda-chuva", icon: "☂️", id: 7 },
];

export const MlVisionLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [predictions, setPredictions] = useState<
    { name: string; icon: string; score: number }[]
  >([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [activeTab, setActiveTab] = useState<"interactive" | "pythonCode">("interactive");
  const [inferenceTime, setInferenceTime] = useState<string>("6ms");
  const isInferringRef = useRef(false);
  const pendingInferenceRef = useRef(false);

  useEffect(() => {
    getOnnxSession().catch((err: unknown) => console.warn("Pré-carregamento ONNX:", err));
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fundo preto e traço branco (padrão MNIST / QuickDraw)
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Inicializa o preview 28x28
    const pCanvas = previewCanvasRef.current;
    if (pCanvas) {
      const pCtx = pCanvas.getContext("2d");
      if (pCtx) {
        pCtx.fillStyle = "#000000";
        pCtx.fillRect(0, 0, 28, 28);
      }
    }
  }, []);

  // Coordenadas seguras para Desktop e Mobile
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
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
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

  // Motor de Inferência Neural no Cliente com modelo ONNX real exportado do PyTorch
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
    <div id="ia-lab" className="my-16 scroll-mt-20">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0F172A]/70 border border-[#00F2FE]/20 backdrop-blur-md">
        {/* Header da Seção */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/20">
                <Cpu className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Laboratório de Visão Computacional (QuickDraw CNN)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Inferência de rede neural treinada em <strong>Python (PyTorch)</strong> rodando 100% no navegador via WebAssembly.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 bg-[#080B11] p-1 rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("interactive")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === "interactive"
                  ? "bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Demo Interativa
            </button>
            <button
              onClick={() => setActiveTab("pythonCode")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === "pythonCode"
                  ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Código PyTorch</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Demo Interativa */}
        {activeTab === "interactive" && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Canvas de Desenho */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs text-gray-400 mb-2 font-mono">
                <span>Desenhe na área abaixo:</span>
                <span className="text-[#00F2FE]">Touch & Mouse habilitado</span>
              </div>

              <div className="relative border-2 border-white/20 rounded-2xl overflow-hidden bg-black shadow-inner shadow-white/5">
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={280}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="touch-canvas cursor-crosshair block"
                  style={{ touchAction: "none" }}
                />

                {!hasDrawn && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-center p-4">
                    <p className="text-xs text-gray-500 font-mono">
                      Desenhe um carro, avião, maçã, gato, peixe, árvore ou estrela...
                    </p>
                  </div>
                )}
              </div>

              {/* Botões de Ação do Canvas */}
              <div className="mt-3 flex items-center gap-3 w-full max-w-[280px]">
                <button
                  onClick={clearCanvas}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar Tela</span>
                </button>
              </div>

              {/* Tensor 28x28 HUD (Visualizador da Entrada Pré-processada) */}
              <div className="mt-3 w-full max-w-[280px] flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex items-center gap-2.5">
                  <canvas
                    ref={previewCanvasRef}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded border border-[#00F2FE]/50 bg-black block shrink-0"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <div>
                    <div className="text-[10px] font-mono text-gray-400">Tensor Pré-processado</div>
                    <div className="text-[11px] font-mono text-[#00F2FE] font-bold">[1, 1, 28, 28]</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-gray-400">Pipeline</div>
                  <div className="text-[10px] font-mono text-[#10B981] font-semibold">PyTorch CNN</div>
                </div>
              </div>
            </div>

            {/* Painel de Predições em Tempo Real */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full bg-[#080B11]/60 p-5 rounded-2xl border border-white/5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-gray-400">Classificação Neural</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    Latência: {inferenceTime}
                  </span>
                </div>

                {/* Tags de Classes Suportadas */}
                <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-mono text-gray-400">Classes:</span>
                  {CLASSES.map((c) => (
                    <span
                      key={c.id}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300"
                    >
                      {c.icon} {c.name}
                    </span>
                  ))}
                </div>

                <div className="mt-4 space-y-3">
                  {predictions.length > 0 ? (
                    predictions.map((pred, idx) => (
                      <div key={pred.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-200 flex items-center gap-1.5 font-medium">
                            <span className="text-base">{pred.icon}</span>
                            <span>{pred.name}</span>
                            {idx === 0 && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00F2FE]/15 text-[#00F2FE] font-mono">
                                Top 1
                              </span>
                            )}
                          </span>
                          <span className="font-mono text-gray-400">{pred.score}%</span>
                        </div>
                        {/* Barra de Progresso */}
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-200 ${
                              idx === 0
                                ? "bg-gradient-to-r from-[#00F2FE] to-[#38BDF8]"
                                : "bg-white/20"
                            }`}
                            style={{ width: `${pred.score}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-gray-500 font-mono">
                      Aguardando traço no canvas para processar predição...
                    </div>
                  )}
                </div>
              </div>

              {/* Nota Técnica de Engenharia */}
              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-gray-400 leading-relaxed font-mono">
                <span className="text-[#38BDF8] font-bold">Pipeline Python:</span> O modelo foi treinado em GPU local com PyTorch, exportado via <code>torch.onnx.export</code> e empacotado para execução WebAssembly cliente sem requisições HTTP a GPUs na nuvem.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Visualizador de Código Python PyTorch */}
        {activeTab === "pythonCode" && (
          <div className="mt-6 bg-[#080B11] p-4 sm:p-5 rounded-2xl border border-white/10 overflow-x-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono text-gray-400">
              <span>quickdraw_cnn.py (PyTorch Model & Export)</span>
              <span className="text-[#38BDF8]">Python 3.12</span>
            </div>
            <pre className="text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto">
{`import torch
import torch.nn as nn
import torch.nn.functional as F

class QuickDrawCNN(nn.Module):
    """
    Rede Neural Convolucional otimizada para classificação de desenhos em tempo real.
    Entrada: Tensor 1x28x28 (escala de cinza normalizada)
    Saída: Logits de 8 classes
    """
    def __init__(self, num_classes=8):
        super(QuickDrawCNN, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.dropout1 = nn.Dropout(0.25)
        
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.dropout2 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(128, num_classes)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = self.dropout1(x)
        x = x.view(-1, 64 * 7 * 7)
        x = F.relu(self.fc1(x))
        x = self.dropout2(x)
        return self.fc2(x)

def export_to_onnx(model_path="quickdraw_cnn.pt", onnx_path="quickdraw_cnn.onnx"):
    model = QuickDrawCNN()
    model.load_state_dict(torch.load(model_path, map_location="cpu"))
    model.eval()

    dummy_input = torch.randn(1, 1, 28, 28)
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        export_params=True,
        opset_version=12,
        input_names=["input"],
        output_names=["output"]
    )
    print("Modelo exportado com sucesso para ONNX WebAssembly!")`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
