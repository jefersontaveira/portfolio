export interface PredictionResult {
  name: string;
  icon: string;
  id: string;
  score: number;
}

export const QUICKDRAW_CLASSES: { id: string; name: string; icon: string }[] = [
  { id: "airplane", name: "Avião", icon: "✈️" },
  { id: "apple", name: "Maçã", icon: "🍎" },
  { id: "car", name: "Carro", icon: "🚗" },
  { id: "cat", name: "Gato", icon: "🐱" },
  { id: "fish", name: "Peixe", icon: "🐟" },
  { id: "star", name: "Estrela", icon: "⭐" },
  { id: "tree", name: "Árvore", icon: "🌲" },
  { id: "umbrella", name: "Guarda-chuva", icon: "☂️" },
];

/**
 * Pré-carrega e aquece o modelo neural para resposta instantânea ao primeiro toque.
 */
export async function getOnnxSession(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/predict-drawing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pixels: new Array(784).fill(0) }),
    });
  } catch {
    // warmup silencioso
  }
}

/**
 * Executa a inferência direta utilizando os pesos reais da CNN PyTorch exportada.
 * Utiliza a API dedicada /api/predict-drawing com execução no servidor para máxima
 * confiabilidade, baixa latência e compatibilidade total com qualquer navegador.
 */
export async function runQuickDrawInference(
  normalized28x28: Float32Array
): Promise<{ predictions: PredictionResult[]; inferenceTimeMs: number }> {
  const start = performance.now();
  const pixelArray = Array.from(normalized28x28);

  const executeRequest = async () => {
    const res = await fetch("/api/predict-drawing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pixels: pixelArray }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API de inferência respondeu com status ${res.status}: ${errText}`);
    }

    const data = await res.json();
    if (!data.predictions || !Array.isArray(data.predictions)) {
      throw new Error("Formato de resposta inesperado da API.");
    }

    const totalTime = Math.max(2, Math.round(performance.now() - start));
    return {
      predictions: data.predictions as PredictionResult[],
      inferenceTimeMs: totalTime,
    };
  };

  try {
    return await executeRequest();
  } catch (firstErr) {
    console.warn("Tentativa inicial de inferência falhou, tentando novamente:", firstErr);
    // Pequena espera antes da segunda tentativa para caso o servidor estivesse inicializando a rota
    await new Promise((r) => setTimeout(r, 60));
    return await executeRequest();
  }
}

