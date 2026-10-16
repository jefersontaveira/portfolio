import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, senderContact, message } = body;

    if (!senderContact || !senderContact.trim()) {
      return NextResponse.json(
        { error: "Por favor, informe seu e-mail ou WhatsApp para que possamos te responder." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY não configurada no ambiente (.env.local).");
      return NextResponse.json(
        {
          error: "A chave da API de e-mail (RESEND_API_KEY) ainda não foi configurada. Por favor, adicione-a ao .env.local ou entre em contato pelo WhatsApp!",
          code: "MISSING_API_KEY",
        },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const destinationEmail = process.env.CONTACT_DESTINATION_EMAIL || "jefersontave@gmail.com";
    const selectedTopic = topic || "Oportunidade / Projeto";
    const userMessage =
      message && message.trim().length > 0
        ? message.trim()
        : "Olá Jeferson! Gostaria de falar com você sobre novas oportunidades e projetos.";

    // Checar se parece um e-mail válido para preencher o replyTo
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderContact.trim());

    const { data, error } = await resend.emails.send({
      from: "Portfólio Jeferson Taveira <onboarding@resend.dev>",
      to: [destinationEmail],
      replyTo: isEmail ? senderContact.trim() : undefined,
      subject: `[Portfólio] Nova Mensagem: ${selectedTopic}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080B11; color: #e2e8f0; margin: 0; padding: 24px; }
            .container { max-width: 580px; margin: 0 auto; background: #0F172A; border-radius: 16px; border: 1px solid rgba(0, 242, 254, 0.2); padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .header { border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 18px; margin-bottom: 22px; }
            .badge { display: inline-block; padding: 5px 12px; background: rgba(0, 242, 254, 0.12); border: 1px solid rgba(0, 242, 254, 0.4); color: #00f2fe; border-radius: 20px; font-size: 11px; font-weight: bold; font-family: monospace; }
            .title { font-size: 20px; font-weight: bold; color: #ffffff; margin-top: 12px; margin-bottom: 4px; }
            .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 6px; font-family: monospace; }
            .field-value { font-size: 15px; color: #f8fafc; background: #080B11; padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 20px; }
            .message-box { font-size: 14px; color: #cbd5e1; line-height: 1.6; white-space: pre-wrap; background: #080B11; padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.08); }
            .footer { margin-top: 26px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px; color: #64748b; text-align: center; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="badge">🚀 DISPARO RÁPIDO DO PORTFÓLIO</span>
              <div class="title">${selectedTopic}</div>
            </div>

            <div class="field-label">Contato do Remetente</div>
            <div class="field-value">
              <strong style="color: #00F2FE;">${senderContact}</strong> ${
        isEmail ? "(E-mail para resposta direta)" : "(WhatsApp / Contato)"
      }
            </div>

            <div class="field-label">Mensagem</div>
            <div class="message-box">${userMessage}</div>

            <div class="footer">
              Enviado através do formulário de contato do seu Portfólio.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Erro retornado pelo Resend:", error);
      return NextResponse.json(
        { error: error.message || "Erro ao processar envio do e-mail" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error("Erro interno em /api/contact:", err);
    return NextResponse.json(
      { error: err.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
