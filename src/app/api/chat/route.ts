import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { processLocalQuery, buildGeminiPrompt, buildLlamaPrompt } from "@/lib/jeffEngine";
import { ChatAction } from "@/lib/jeffKnowledge";

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

    // Processa intenção padrão com o motor RAG local (usado como base de ações e fallback seguro)
    const localResult = processLocalQuery(message);

    const groqKey = process.env.GROQ_API_KEY;
    const ollamaUrl = process.env.OLLAMA_BASE_URL;
    const geminiKey = process.env.GEMINI_API_KEY;

    // =========================================================================
    // 1. MOTOR OPEN SOURCE VIA GROQ (GPT-OSS 120B / Qwen 27B / Llama)
    // Velocidade de inferência extrema (~800 tok/s), JSON estruturado e pensamento próprio
    // =========================================================================
    if (groqKey) {
      const preferredModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
      const candidateModels = [preferredModel, "qwen/qwen3.8-27b", "openai/gpt-oss-20b", "allam-2-7b"];

      for (const modelToTry of candidateModels) {
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model: modelToTry,
              messages: [
                {
                  role: "system",
                  content: buildLlamaPrompt(),
                },
                {
                  role: "user",
                  content: message,
                },
              ],
              response_format: { type: "json_object" },
              temperature: 0.65,
              max_tokens: 600,
            }),
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const contentStr = data.choices?.[0]?.message?.content || "";
            try {
              const parsed = JSON.parse(contentStr);
              const reply = parsed.reply || localResult.reply;
              const actions: ChatAction[] = Array.isArray(parsed.actions) && parsed.actions.length > 0
                ? parsed.actions
                : localResult.actions;
              const suggestions: string[] = Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
                ? parsed.suggestions
                : localResult.suggestions;

              return NextResponse.json({
                reply,
                actions,
                suggestions,
                provider: `groq-${modelToTry}`,
              });
            } catch {
              if (contentStr.trim()) {
                return NextResponse.json({
                  reply: contentStr,
                  actions: localResult.actions,
                  suggestions: localResult.suggestions,
                  provider: `groq-${modelToTry}`,
                });
              }
            }
          }
        } catch (err) {
          console.warn(`Aviso: Falha na tentativa com modelo ${modelToTry}:`, err);
        }
      }
    }

    // =========================================================================
    // 2. MOTOR LLAMA OPEN SOURCE LOCAL VIA OLLAMA (ex: http://localhost:11434)
    // =========================================================================
    if (ollamaUrl) {
      try {
        const endpoint = `${ollamaUrl.replace(/\/+$/, "")}/api/chat`;
        const ollamaRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama3.2",
            messages: [
              { role: "system", content: buildLlamaPrompt() },
              { role: "user", content: message },
            ],
            stream: false,
            format: "json",
            options: {
              temperature: 0.7,
              num_predict: 400,
            },
          }),
        });

        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          const contentStr = data.message?.content || "";
          try {
            const parsed = JSON.parse(contentStr);
            return NextResponse.json({
              reply: parsed.reply || localResult.reply,
              actions: Array.isArray(parsed.actions) && parsed.actions.length > 0 ? parsed.actions : localResult.actions,
              suggestions: Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0 ? parsed.suggestions : localResult.suggestions,
              provider: "llama-ollama-local",
            });
          } catch {
            if (contentStr) {
              return NextResponse.json({
                reply: contentStr,
                actions: localResult.actions,
                suggestions: localResult.suggestions,
                provider: "llama-ollama-local",
              });
            }
          }
        }
      } catch (err) {
        console.warn("Aviso: Falha na chamada do Ollama local:", err);
      }
    }

    // =========================================================================
    // 3. MOTOR GOOGLE GEMINI (Caso configurado como alternativa)
    // =========================================================================
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
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
          provider: "gemini",
        });
      } catch (geminiError) {
        console.warn("Aviso: Falha na chamada da API Gemini, usando motor RAG local:", geminiError);
      }
    }

    // =========================================================================
    // 4. MODO RAG LOCAL AUTÔNOMO (100% offline, zero latência e sem custos)
    // =========================================================================
    return NextResponse.json({
      reply: localResult.reply,
      actions: localResult.actions,
      suggestions: localResult.suggestions,
      provider: "rag-local-offline",
    });
  } catch (error: any) {
    console.error("Erro na rota /api/chat:", error);
    const fallback = processLocalQuery("contato");
    return NextResponse.json(
      {
        reply: fallback.reply,
        actions: fallback.actions,
        suggestions: fallback.suggestions,
        provider: "error-fallback",
      },
      { status: 200 }
    );
  }
}
