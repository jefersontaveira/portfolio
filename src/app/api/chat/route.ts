import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { CAREER_SYSTEM_PROMPT, DEVELOPER_PROFILE } from "@/lib/careerContext";

export async function POST(req: NextRequest) {
  try {
    let message = "";
    try {
      const body = await req.json();
      message = typeof body?.message === "string" ? body.message : "";
    } catch {
      // Body não era JSON válido
    }

    if (!message) {
      return NextResponse.json(
        { error: "Mensagem vazia ou inválida" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Se houver chave do Gemini configurada, executa chamada à IA
    if (apiKey) {
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
          systemInstruction: CAREER_SYSTEM_PROMPT,
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      });

      const reply = response.text || "Desculpe, não consegui formular uma resposta no momento.";
      return NextResponse.json({ reply });
    }

    // Fallback inteligente caso a chave do Gemini ainda não tenha sido adicionada ao .env
    const lower = message.toLowerCase();
    let reply = `O ${DEVELOPER_PROFILE.name} é Engenheiro de Software Full Stack & IA, focado em soluções robustas com Python (Django, FastAPI, PyTorch) e ecossistemas web com React/Next.js e Docker.`;

    if (lower.includes("python") || lower.includes("ia") || lower.includes("pytorch")) {
      reply = `Na área de Python e IA, o Jeferson desenvolveu o classificador neural QuickDraw CNN (treinado com PyTorch e exportado para ONNX no browser), além de microsserviços em FastAPI e Django REST.`;
    } else if (lower.includes("arena") || lower.includes("saas") || lower.includes("django")) {
      reply = `O SaaS de Arenas foi desenvolvido com Django REST Framework e PostgreSQL, contando com locks pessimistas (select_for_update) para impedir overbooking em reservas de quadras.`;
    } else if (lower.includes("devops") || lower.includes("docker") || lower.includes("cluster")) {
      reply = `Em DevOps, o Jeferson constrói ambientes resilientes com Docker Compose, Nginx, Redis, PostgreSQL e políticas de health-check para auto-recuperação de containers.`;
    } else if (lower.includes("contato") || lower.includes("contratar") || lower.includes("email") || lower.includes("linkedin")) {
      reply = `Você pode falar com o Jeferson pelo LinkedIn (${DEVELOPER_PROFILE.contact.linkedin}), pelo GitHub (${DEVELOPER_PROFILE.contact.github}) ou através do botão 'Modo Executivo' no cabeçalho.`;
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Erro na rota /api/chat:", error);
    return NextResponse.json(
      {
        reply: `Ocorreu uma instabilidade momentânea na conexão, mas você pode conferir todos os projetos de ${DEVELOPER_PROFILE.name} diretamente na vitrine ou pelo LinkedIn: ${DEVELOPER_PROFILE.contact.linkedin}.`,
      },
      { status: 200 }
    );
  }
}
