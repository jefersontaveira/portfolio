"use client";

import React, { useState } from "react";
import { 
  Instagram, 
  Github, 
  Linkedin, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  ArrowUpRight,
  ShieldCheck,
  Clock,
  MessageSquare,
  Volume2
} from "lucide-react";
import { DEVELOPER_PROFILE } from "@/lib/careerContext";
import { SpeechManager } from "@/lib/speechHelper";

// Ícone oficial SVG nítido do WhatsApp
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface ContactChannel {
  id: string;
  name: string;
  handle: string;
  url: string;
  badge: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
  hoverGlow: string;
  buttonLabel: string;
}

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [quickMessage, setQuickMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Oportunidade / Projeto");

  const emailAddress = "jefersontave@gmail.com";
  const rawWhatsApp = "85981311975";
  const whatsappDisplay = "(85) 98131-1975";
  const whatsappUrl = `https://wa.me/55${rawWhatsApp}`;
  const instagramUrl = "https://www.instagram.com/jeferson_taveria/";
  const linkedinUrl = "https://www.linkedin.com/in/jefersontaveira";
  const githubUrl = "https://github.com/jefersontaveira";

  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleCopyWhatsApp = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText(rawWhatsApp);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2200);
  };

  const handleCopyAll = () => {
    const textSummary = `Contato Jeferson Taveira:\nWhatsApp: ${whatsappDisplay} (${whatsappUrl})\nE-mail: ${emailAddress}\nLinkedIn: ${linkedinUrl}\nGitHub: ${githubUrl}\nInstagram: ${instagramUrl}`;
    navigator.clipboard.writeText(textSummary);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2200);
  };

  const handleVoiceIntroduction = () => {
    SpeechManager.speak(
      "Central de contatos de Jeferson Taveira. Você pode me chamar diretamente no WhatsApp, enviar um e-mail ou conectar pelo LinkedIn, GitHub e Instagram."
    );
  };

  const buildWhatsAppMessageUrl = () => {
    const baseText = `Olá Jeferson! Vi seu portfólio. Assunto: [${selectedTopic}]. ${quickMessage ? `Mensagem: ${quickMessage}` : "Gostaria de agendar uma conversa."}`;
    return `${whatsappUrl}?text=${encodeURIComponent(baseText)}`;
  };

  const buildEmailMessageUrl = () => {
    const subject = `[Portfólio] Contato: ${selectedTopic}`;
    const body = `Olá Jeferson,\n\n${quickMessage ? quickMessage : "Gostaria de falar com você sobre novas oportunidades e projetos de engenharia de software."}\n\nAtenciosamente,`;
    return `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const channels: ContactChannel[] = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      handle: whatsappDisplay,
      url: buildWhatsAppMessageUrl(),
      badge: "Online",
      icon: <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />,
      accentColor: "from-[#25D366]/20 via-[#10B981]/15 to-transparent",
      borderColor: "border-[#25D366]/30 hover:border-[#25D366]/60",
      hoverGlow: "group-hover:shadow-[0_0_35px_rgba(37,211,102,0.25)]",
      buttonLabel: "Conversar no WhatsApp",
    },
    {
      id: "email",
      name: "E-mail",
      handle: emailAddress,
      url: `mailto:${emailAddress}`,
      badge: "Direto",
      icon: <Mail className="w-5 h-5 text-[#00F2FE]" />,
      accentColor: "from-[#00F2FE]/20 via-[#38BDF8]/15 to-transparent",
      borderColor: "border-[#00F2FE]/30 hover:border-[#00F2FE]/60",
      hoverGlow: "group-hover:shadow-[0_0_35px_rgba(0,242,254,0.25)]",
      buttonLabel: "Enviar E-mail",
    },
    {
      id: "instagram",
      name: "Instagram",
      handle: "@jeferson_taveria",
      url: instagramUrl,
      badge: "Social",
      icon: <Instagram className="w-5 h-5 text-[#E1306C]" />,
      accentColor: "from-[#F58529]/15 via-[#DD2A7B]/15 to-[#8134AF]/15",
      borderColor: "border-[#DD2A7B]/30 hover:border-[#DD2A7B]/60",
      hoverGlow: "group-hover:shadow-[0_0_35px_rgba(221,42,123,0.22)]",
      buttonLabel: "Ver Perfil",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      handle: "in/jefersontaveira",
      url: linkedinUrl,
      badge: "Profissional",
      icon: <Linkedin className="w-5 h-5 text-[#0A66C2]" />,
      accentColor: "from-[#0A66C2]/20 via-[#00F2FE]/10 to-transparent",
      borderColor: "border-[#0A66C2]/30 hover:border-[#0A66C2]/60",
      hoverGlow: "group-hover:shadow-[0_0_35px_rgba(10,102,194,0.25)]",
      buttonLabel: "Conectar na Rede",
    },
    {
      id: "github",
      name: "GitHub",
      handle: "github.com/jefersontaveira",
      url: githubUrl,
      badge: "Open Source",
      icon: <Github className="w-5 h-5 text-white" />,
      accentColor: "from-white/10 via-[#38BDF8]/10 to-transparent",
      borderColor: "border-white/20 hover:border-white/50",
      hoverGlow: "group-hover:shadow-[0_0_35px_rgba(255,255,255,0.18)]",
      buttonLabel: "Repositórios",
    },
  ];

  return (
    <section id="contato" className="relative py-16 sm:py-24 overflow-hidden">
      {/* Luzes Ambientais de Fundo da Seção de Contato */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#00F2FE]/10 via-[#38BDF8]/05 to-transparent blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-40 w-[650px] h-[650px] bg-gradient-to-bl from-[#A855F7]/12 via-[#25D366]/05 to-transparent blur-[170px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Principal da Seção */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              <span className="text-gray-300 font-semibold tracking-wider uppercase">
                Status: Disponível para Conexões & Projetos
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Vamos Conversar?
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 font-mono">
              Escolha seu canal de preferência para contato direto, propostas ou networking.
            </p>
          </div>

          {/* Botões Utilitários do Header (Alinhados com largura total e centralizados no mobile) */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <button
              onClick={handleVoiceIntroduction}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-xs font-mono text-gray-300 flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
              title="Ouvir mensagem por voz"
            >
              <Volume2 className="w-4 h-4 text-[#00F2FE]" />
              <span>Ouvir Apresentação</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-[#00F2FE]/15 hover:bg-[#00F2FE]/25 border border-[#00F2FE]/40 text-xs font-mono text-[#00F2FE] flex items-center justify-center gap-2 transition-all cursor-pointer font-bold shadow-[0_0_20px_rgba(0,242,254,0.15)] text-center"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span className="text-[#10B981]">Todos Copiados!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Todos os Contatos</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grade de Cards Modernos de Contato (Sem descrições, visual limpo e direto) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {channels.map((chan) => (
            <div
              key={chan.id}
              className={`group relative p-5 sm:p-6 rounded-2xl bg-[#0F172A]/40 backdrop-blur-xl border ${chan.borderColor} transition-all duration-300 flex flex-col justify-between ${chan.hoverGlow}`}
            >
              {/* Efeito degradê interno suave no hover */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${chan.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
              />

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                      {chan.icon}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#00F2FE] transition-colors">
                      {chan.name}
                    </h3>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                    {chan.badge}
                  </span>
                </div>

                <div className="mt-3.5">
                  <p className="text-sm font-mono text-[#38BDF8] break-all font-semibold">
                    {chan.handle}
                  </p>
                </div>
              </div>

              {/* Botões de Ação do Card */}
              <div className="mt-5 pt-3.5 border-t border-white/[0.08] flex items-center gap-2">
                <a
                  href={chan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-200 hover:text-white flex items-center justify-center gap-1.5 transition-all group-hover:bg-[#00F2FE]/15 group-hover:text-[#00F2FE] group-hover:border-[#00F2FE]/40"
                >
                  <span>{chan.buttonLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                {chan.id === "email" && (
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Copiar endereço de e-mail"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}

                {chan.id === "whatsapp" && (
                  <button
                    onClick={handleCopyWhatsApp}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Copiar número do WhatsApp"
                  >
                    {copiedWhatsApp ? (
                      <Check className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Card Interativo 6: Disparo Rápido */}
          <div className="group relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#080B11]/90 to-[#0F172A]/80 border border-[#00F2FE]/30 shadow-[0_0_30px_rgba(0,242,254,0.1)] flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#00F2FE]/10 text-[#00F2FE]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-white font-mono">Disparo Rápido</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-mono text-[#10B981]">
                  <Clock className="w-3 h-3" />
                  <span>&lt; 2h resposta</span>
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                <div>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full text-xs font-mono bg-[#080B11] border border-white/10 rounded-xl px-3 py-2 text-gray-200 focus:outline-none focus:border-[#00F2FE] transition-colors"
                  >
                    <option value="Oportunidade / Projeto">💼 Oportunidade / Projeto</option>
                    <option value="Consultoria em IA & Visão">🧠 Consultoria em IA & Visão</option>
                    <option value="Arquitetura Backend Python">⚡ Backend & Python</option>
                    <option value="Outro Assunto">✉️ Outro Assunto</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={quickMessage}
                    onChange={(e) => setQuickMessage(e.target.value)}
                    placeholder="Mensagem rápida (opcional)..."
                    className="w-full text-xs font-mono bg-[#080B11] border border-white/10 rounded-xl p-2.5 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#00F2FE] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
              <a
                href={buildWhatsAppMessageUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                <span>WhatsApp</span>
              </a>

              <a
                href={buildEmailMessageUrl()}
                className="py-2 px-2 rounded-xl bg-[#00F2FE]/15 hover:bg-[#00F2FE]/25 border border-[#00F2FE]/40 text-[#00F2FE] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>E-mail</span>
              </a>
            </div>
          </div>
        </div>

        {/* Rodapé Interno com Garantia de Retorno Ágil */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <div className="p-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Retorno rápido garantido no mesmo dia útil.</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <span>Fortaleza, CE</span>
            <span>•</span>
            <span className="text-[#00F2FE]">Disponibilidade Global</span>
          </div>
        </div>
      </div>
    </section>
  );
};
