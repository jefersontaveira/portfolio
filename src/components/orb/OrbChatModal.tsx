"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  Bot, 
  User, 
  ExternalLink,
  ArrowRight,
  ArrowDown,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Linkedin,
  Github,
  Terminal,
  Compass,
  Play
} from "lucide-react";
import { SpeechManager } from "@/lib/speechHelper";
import { ChatAction, JEFF_CONTACTS } from "@/lib/jeffKnowledge";

export interface ChatMessage {
  id: string;
  sender: "user" | "orb";
  text: string;
  timestamp: string;
  isTyping?: boolean;
  actions?: ChatAction[];
}

interface OrbChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onOpenExecutiveModal?: () => void;
}

const DEFAULT_SUGGESTIONS = [
  "📱 Quais são os contatos do Jeferson?",
  "🏟️ Me explique o SaaS de Arenas",
  "🧠 Como funciona o Classificador de IA (ONNX)?",
  "🧪 Como testar o Sandbox ao vivo?",
  "📍 Me leve para a seção Sobre",
];

export const OrbChatModal: React.FC<OrbChatModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
  onOpenExecutiveModal,
}) => {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "orb",
      text: `Olá! Sou o **Jeff**, copiloto de IA de **Jeferson Taveira**.\n\nPosso detalhar a arquitetura técnica de qualquer projeto (como o **SaaS de Arenas em Django**, a **CNN com PyTorch no browser** ou o **Cluster DevOps**), fornecer os contatos diretos do Jeferson ou te guiar por qualquer seção do site! Como posso ajudar você agora?`,
      timestamp: "Agora",
      actions: [
        {
          id: "act-init-contact",
          label: "Contatos do Jeferson",
          type: "link",
          target: JEFF_CONTACTS.whatsappUrl,
          icon: "whatsapp",
          description: JEFF_CONTACTS.phone,
        },
        {
          id: "act-init-projects",
          label: "Ver Projetos",
          type: "scroll",
          target: "#projetos",
          icon: "scroll",
        },
        {
          id: "act-init-sandbox",
          label: "Abrir Sandbox do SaaS",
          type: "navigate",
          target: "/projetos/sistema-de-agenda-para-arenas/sandbox",
          icon: "sandbox",
        },
      ],
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedActionId, setCopiedActionId] = useState<string | null>(null);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animação de entrada e saída suave (Fade-In & Smooth Slide)
  useEffect(() => {
    let animTimer: NodeJS.Timeout;
    if (isOpen) {
      setIsRendered(true);
      animTimer = setTimeout(() => {
        setIsVisible(true);
      }, 30);
    } else {
      setIsVisible(false);
      animTimer = setTimeout(() => {
        setIsRendered(false);
      }, 350);
    }
    return () => clearTimeout(animTimer);
  }, [isOpen]);

  // Limpeza de timers ao desmontar
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  // Se houver uma query inicial (ex: vinda por voz)
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      sendMessage(initialQuery);
    }
  }, [initialQuery]);

  // Bloqueia a rolagem de fundo enquanto o chat está aberto
  useEffect(() => {
    if (isOpen) {
      const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement | null;
        const isInsideChatScroll = target?.closest(".overflow-y-auto");
        if (!isInsideChatScroll) {
          e.preventDefault();
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isRendered) return null;

  const handleSpeech = (text: string) => {
    // Remove marcações markdown antes de falar
    const cleanText = text.replace(/[*#_`\[\]()]/g, "");
    SpeechManager.speak(cleanText);
  };

  const toggleMic = () => {
    if (isListening) {
      SpeechManager.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const ok = SpeechManager.startListening(
        (transcript) => {
          setInputValue(transcript);
        },
        () => setIsListening(false),
        () => setIsListening(false)
      );
      if (!ok) setIsListening(false);
    }
  };

  // Trata cliques nos botões de ação e direcionamento
  const handleActionClick = (action: ChatAction) => {
    if (action.type === "copy") {
      navigator.clipboard.writeText(action.target);
      setCopiedActionId(action.id);
      setTimeout(() => setCopiedActionId(null), 2500);
      return;
    }

    if (action.type === "link") {
      window.open(action.target, "_blank", "noopener,noreferrer");
      return;
    }

    if (action.type === "modal") {
      if (action.target === "executive" && onOpenExecutiveModal) {
        onClose();
        setTimeout(() => {
          onOpenExecutiveModal();
        }, 300);
      }
      return;
    }

    if (action.type === "navigate") {
      onClose();
      router.push(action.target);
      return;
    }

    if (action.type === "scroll") {
      onClose();
      setTimeout(() => {
        const elem = document.querySelector(action.target);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
        }
      }, 350);
      return;
    }
  };

  // Efeito de digitação com renderização contínua
  const streamResponse = (
    fullText: string, 
    messageId: string, 
    actions?: ChatAction[], 
    suggestions?: string[]
  ) => {
    let currentIdx = 0;
    const chunkSize = 3;
    const speed = 14;

    const newMsg: ChatMessage = {
      id: messageId,
      sender: "orb",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isTyping: true,
      actions: undefined,
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(false);

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      currentIdx += chunkSize;
      if (currentIdx >= fullText.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId 
              ? { ...m, text: fullText, isTyping: false, actions } 
              : m
          )
        );
        if (suggestions && suggestions.length > 0) {
          setDynamicSuggestions(suggestions);
        }
      } else {
        const currentSlice = fullText.slice(0, currentIdx);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId ? { ...m, text: currentSlice, isTyping: true } : m
          )
        );
      }
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, speed);
  };

  const sendMessage = async (contentToSend?: string) => {
    const text = (contentToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (response.ok) {
        const data = await response.json();
        streamResponse(
          data.reply || "Resposta recebida.", 
          String(Date.now() + 1),
          data.actions,
          data.suggestions
        );
      } else {
        throw new Error("Erro na resposta da API");
      }
    } catch {
      streamResponse(
        `Ocorreu uma instabilidade na conexão, mas você pode conferir todos os projetos de **${JEFF_CONTACTS.name}** ou falar diretamente com ele pelos canais oficiais:`,
        String(Date.now() + 1),
        [
          {
            id: "err-wa",
            label: "WhatsApp do Jeferson",
            type: "link",
            target: JEFF_CONTACTS.whatsappUrl,
            icon: "whatsapp",
          },
          {
            id: "err-email",
            label: "Copiar E-mail",
            type: "copy",
            target: JEFF_CONTACTS.email,
            icon: "email",
          },
        ]
      );
    }
  };

  // Renderizador simples de Markdown para formatação rica
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");

    return lines.map((line, lineIdx) => {
      // Processa itens de lista
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
      const rawLine = isBullet ? line.trim().substring(2) : line;

      // Processa negritos **palavra**
      const parts = rawLine.split(/(\*\*.*?\*\*)/g);

      const parsedLine = parts.map((part, partIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={partIdx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lineIdx} className="ml-4 list-disc marker:text-[#00F2FE] mb-1">
            {parsedLine}
          </li>
        );
      }

      if (line.trim() === "") {
        return <div key={lineIdx} className="h-2" />;
      }

      return (
        <p key={lineIdx} className="mb-1 leading-relaxed">
          {parsedLine}
        </p>
      );
    });
  };

  const getActionIcon = (action: ChatAction) => {
    switch (action.icon) {
      case "whatsapp":
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case "email":
        return <Mail className="w-3.5 h-3.5 text-cyan-400" />;
      case "linkedin":
        return <Linkedin className="w-3.5 h-3.5 text-blue-400" />;
      case "github":
        return <Github className="w-3.5 h-3.5 text-white" />;
      case "sandbox":
        return <Play className="w-3.5 h-3.5 text-purple-400" />;
      case "scroll":
        return <ArrowDown className="w-3.5 h-3.5 text-amber-400" />;
      case "sparkles":
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <ExternalLink className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overscroll-contain transition-opacity duration-500 ease-out ${
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-xl bg-[#0F172A] border border-[#00F2FE]/25 rounded-2xl shadow-[0_0_60px_rgba(0,242,254,0.2)] flex flex-col h-[80vh] sm:h-[600px] overflow-hidden transition-all duration-500 ease-out transform ${
          isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Superior de Ancoragem Holográfica */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00F2FE] to-transparent opacity-80" />

        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-[#080B11]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#A855F7] p-0.5">
              <div className="w-full h-full rounded-full bg-[#080B11] flex items-center justify-center text-[#00F2FE]">
                <Bot className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-white text-sm">Jeff Copilot (RAG)</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00F2FE]/10 text-[#00F2FE] font-mono border border-[#00F2FE]/20">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">IA Especialista em Jeferson Taveira</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Fechar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto overscroll-contain space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "orb" && (
                <div className="w-6 h-6 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[90%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-[#00F2FE]/20 to-[#38BDF8]/20 border border-[#00F2FE]/30 text-white"
                    : "bg-white/[0.04] border border-white/5 text-gray-200"
                }`}
              >
                <div>
                  {renderFormattedText(msg.text)}
                  {msg.isTyping && (
                    <span className="inline-block w-1.5 h-3.5 bg-[#00F2FE] ml-1 animate-pulse align-middle" />
                  )}
                </div>

                {/* BOTÕES DE AÇÃO E DIRECIONAMENTO (RAG ACTIONS) */}
                {msg.actions && msg.actions.length > 0 && !msg.isTyping && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-2">
                    {msg.actions.map((act) => {
                      const isCopied = copiedActionId === act.id;
                      return (
                        <button
                          key={act.id}
                          onClick={() => handleActionClick(act)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 hover:border-[#00F2FE]/50 text-white text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                          title={act.description || act.label}
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            getActionIcon(act)
                          )}
                          <span>{isCopied ? "Copiado!" : act.label}</span>
                          {act.type === "scroll" && <ArrowDown className="w-2.5 h-2.5 opacity-60" />}
                          {act.type === "navigate" && <ArrowRight className="w-2.5 h-2.5 opacity-60" />}
                          {act.type === "link" && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.sender === "orb" && !msg.isTyping && (
                    <button
                      onClick={() => handleSpeech(msg.text)}
                      className="text-[#00F2FE] hover:underline flex items-center gap-1 ml-2 cursor-pointer"
                      title="Ouvir esta resposta"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Ouvir</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-gray-400 font-mono py-1 animate-fade-in">
              <div className="w-6 h-6 rounded-full bg-[#00F2FE]/20 text-[#00F2FE] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-[#00F2FE]" />
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] border border-[#00F2FE]/20 px-3.5 py-1.5 rounded-full shadow-lg">
                <span className="text-[#00F2FE] font-medium">Jeff está consultando a base de dados...</span>
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-bounce" />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sugestões Dinâmicas de Perguntas Rápidas */}
        <div className="px-3.5 py-2 border-t border-white/5 bg-[#080B11]/60 flex flex-wrap items-center gap-1.5 max-h-[96px] overflow-y-auto">
          <span className="text-[10px] font-mono text-gray-400 uppercase mr-1 flex items-center gap-1 select-none shrink-0">
            <Compass className="w-3 h-3 text-[#00F2FE]" />
            Sugestões:
          </span>
          {dynamicSuggestions.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(chip.replace(/^[^\w\s]+/, "").trim())}
              className="px-2.5 py-1 rounded-full text-[11px] bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-[#00F2FE]/40 text-slate-300 hover:text-white transition-all font-mono cursor-pointer active:scale-95 text-left"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/10 bg-[#080B11]/80 flex items-center gap-2">
          {/* Microfone */}
          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isListening
                ? "bg-[#10B981] border-[#10B981] text-black animate-pulse"
                : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
            }`}
            title="Falar pergunta por voz"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={isListening ? "Fale agora no microfone..." : "Pergunte sobre projetos, contatos ou me peça para navegar..."}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F2FE]/60"
          />

          {/* Submit */}
          <button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
