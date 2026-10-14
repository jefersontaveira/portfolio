import { NextResponse } from "next/server";
import path from "path";
import * as ort from "onnxruntime-node";

let sessionPromise: Promise<ort.InferenceSession> | null = null;

const CLASSES = [
  { id: "airplane", name: "Avião", icon: "✈️" },
  { id: "apple", name: "Maçã", icon: "🍎" },
  { id: "car", name: "Carro", icon: "🚗" },
  { id: "cat", name: "Gato", icon: "🐱" },
  { id: "fish", name: "Peixe", icon: "🐟" },
  { id: "star", name: "Estrela", icon: "⭐" },
  { id: "tree", name: "Árvore", icon: "🌲" },
  { id: "umbrella", name: "Guarda-chuva", icon: "☂️" },
];

async function getSession(): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    const modelPath = path.join(process.cwd(), "public", "models", "quickdraw_cnn.onnx");
    sessionPromise = ort.InferenceSession.create(modelPath);
  }
  return sessionPromise;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pixels = body.pixels;

    if (!pixels || !Array.isArray(pixels) || pixels.length !== 28 * 28) {
      return NextResponse.json(
        { error: "Formato de pixels inválido. Esperado vetor de 784 números." },
        { status: 400 }
      );
    }

    const sess = await getSession();
    const floatData = new Float32Array(pixels);
    const tensor = new ort.Tensor("float32", floatData, [1, 1, 28, 28]);

    const start = performance.now();
    const results = await sess.run({ input: tensor });
    const latency = Math.max(1, Math.round(performance.now() - start));

    const outputData = results.output.data as Float32Array;

    const predictions = CLASSES.map((cls, idx) => ({
      id: cls.id,
      name: cls.name,
      icon: cls.icon,
      score: Math.min(100, Math.max(0, Math.round((outputData[idx] ?? 0) * 100))),
    })).sort((a, b) => b.score - a.score);

    return NextResponse.json({
      predictions,
      inferenceTimeMs: latency,
    });
  } catch (error: unknown) {
    console.error("Erro na rota /api/predict-drawing:", error);
    const message = error instanceof Error ? error.message : "Falha na execução do modelo neural.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

