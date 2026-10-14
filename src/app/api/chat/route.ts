import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { processLocalQuery, buildGeminiPrompt } from "@/lib/jeffEngine";

export async function POST(req: NextRequest) {
  try {
    let message = "";
    try {
      const body = await req.json();
      message = typeof body?.message === "string" ? body.message : "";
    } catch {
      // Body não era JSON válido
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Mensagem vazia ou inválida" },
        { status: 400 }
      );
    }

    // Processa a intenção localmente para extrair botões de ação e sugestões contextuais
    const localResult = processLocalQuery(message);

    const apiKey = process.env.GEMINI_API_KEY;

    // Se houver chave do Gemini configurada, executa chamada à IA gerativa
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
          config: {
            systemInstruction: buildGeminiPrompt(),
            temperature: 0.6,
            maxOutputTokens: 400,
          },
        });

        const reply = response.text || localResult.reply;
        return NextResponse.json({
          reply,
          actions: localResult.actions,
          suggestions: localResult.suggestions,
        });
      } catch (geminiError) {
        console.warn("Aviso: Falha na chamada da API Gemini, usando motor RAG local:", geminiError);
        // Fallback imediato para o motor local RAG
        return NextResponse.json({
          reply: localResult.reply,
          actions: localResult.actions,
          suggestions: localResult.suggestions,
        });
      }
    }

    // Modo RAG Local Autônomo (100% funcional offline e sem custos de API)
    return NextResponse.json({
      reply: localResult.reply,
      actions: localResult.actions,
      suggestions: localResult.suggestions,
    });
  } catch (error: any) {
    console.error("Erro na rota /api/chat:", error);
    const fallback = processLocalQuery("contato");
    return NextResponse.json(
      {
        reply: fallback.reply,
        actions: fallback.actions,
        suggestions: fallback.suggestions,
      },
      { status: 200 }
    );
  }
}
