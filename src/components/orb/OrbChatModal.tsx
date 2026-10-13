"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Mic, MicOff, Volume2, Bot, User, CornerDownLeft } from "lucide-react";
import { SpeechManager } from "@/lib/speechHelper";
import { DEVELOPER_PROFILE } from "@/lib/careerContext";

interface ChatMessage {
  id: string;
  sender: "user" | "orb";
  text: string;
  timestamp: string;
  isTyping?: boolean;
}

interface OrbChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const QUICK_PROMPT_CHIPS = [
  "Quais projetos em Python você desenvolveu?",
  "Como funciona o classificador de IA (ONNX)?",
  "Como posso entrar em contato ou contratar?",
];

export const OrbChatModal: React.FC<OrbChatModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "orb",
      text: `Olá! Sou o Jeff, copiloto de inteligência artificial de Jeferson Taveira. Posso detalhar a arquitetura de projetos, tecnologias, visão computacional ou formas de contato. Como posso ajudar?`,
      timestamp: "Agora",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
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

  // Bloqueia a rolagem do site ao fundo sem sumir com a barra lateral nem deslocar o layout
  useEffect(() => {
    if (isOpen) {
      const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement | null;
        // Permite rolagem apenas dentro da área de mensagens do chat
        const isInsideChatScroll = target?.closest(".overflow-y-auto");
        if (!isInsideChatScroll) {
          e.preventDefault();
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        const isInsideChatScroll = target?.closest(".overflow-y-auto");
        if (!isInsideChatScroll) {
          e.preventDefault();
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
          return;
        }
        // Evita rolagem da página por teclas de navegação se não estiver digitando
        if (["Space", "PageUp", "PageDown"].includes(e.code)) {
          const target = e.target as HTMLElement | null;
          const isInput = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
          if (!isInput) {
            e.preventDefault();
          }
        }
      };

      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isRendered) return null;

  const handleSpeech = (text: string) => {
    SpeechManager.speak(text);
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

  // Efeito de digitação tipo ChatGPT (Typewriter streaming com auto-scroll)
  const streamResponse = (fullText: string, messageId: string) => {
    let currentIdx = 0;
    const chunkSize = 2; // caracteres por tick
    const speed = 16; // ms

    // Cria mensagem vazia com estado de digitação ativo
    const newMsg: ChatMessage = {
      id: messageId,
      sender: "orb",
      text: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isTyping: true,
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
            m.id === messageId ? { ...m, text: fullText, isTyping: false } : m
          )
        );
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
        streamResponse(data.reply || "Resposta recebida.", String(Date.now() + 1));
      } else {
        throw new Error("Erro na resposta da API");
      }
    } catch (err) {
      // Resposta inteligente de fallback local se a chave da API do Gemini ainda não estiver configurada
      let fallbackText = `O ${DEVELOPER_PROFILE.name} é especialista em Python (PyTorch, Django REST, FastAPI) e arquitetura de software de ponta a ponta.`;
      const lower = text.toLowerCase();
      if (lower.includes("python") || lower.includes("stack")) {
        fallbackText = `O Jeferson domina Python para IA (PyTorch, exportação ONNX), backends robustos com Django REST Framework e microsserviços modernos com FastAPI.`;
      } else if (lower.includes("arena") || lower.includes("saas") || lower.includes("django")) {
        fallbackText = `O SaaS de Arenas foi construído com Django 3.12, PostgreSQL e React. O grande diferencial de engenharia é o controle de concorrência com lock transacional no banco para evitar conflito de horários de quadras.`;
      } else if (lower.includes("contato") || lower.includes("contratar")) {
        fallbackText = `Você pode falar diretamente com o Jeferson pelo LinkedIn (${DEVELOPER_PROFILE.contact.linkedin}) ou conferir seus códigos no GitHub (${DEVELOPER_PROFILE.contact.github}).`;
      }

      streamResponse(fallbackText, String(Date.now() + 1));
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
        className={`relative w-full max-w-xl bg-[#0F172A] border border-[#00F2FE]/25 rounded-2xl shadow-[0_0_60px_rgba(0,242,254,0.2)] flex flex-col h-[78vh] sm:h-[590px] overflow-hidden mt-12 sm:mt-16 transition-all duration-500 ease-out transform ${
          isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Superior de Ancoragem Holográfica */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00F2FE] to-transparent opacity-80" />

        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#080B11]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00F2FE] to-[#A855F7] p-0.5">
              <div className="w-full h-full rounded-full bg-[#080B11] flex items-center justify-center text-[#00F2FE]">
                <Bot className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-white text-sm">Jeff Copilot</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00F2FE]/10 text-[#00F2FE] font-mono border border-[#00F2FE]/20">
                  IA de Carreira
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">Assistente Interativo de Jeferson Taveira</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto overscroll-contain space-y-3.5">
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
                className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-[#00F2FE]/20 to-[#38BDF8]/20 border border-[#00F2FE]/30 text-white"
                    : "bg-white/[0.04] border border-white/5 text-gray-200"
                }`}
              >
                <p className="whitespace-pre-wrap">
                  {msg.text}
                  {msg.isTyping && (
                    <span className="inline-block w-1.5 h-3.5 bg-[#00F2FE] ml-1 animate-pulse align-middle" />
                  )}
                </p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.sender === "orb" && !msg.isTyping && (
                    <button
                      onClick={() => handleSpeech(msg.text)}
                      className="text-[#00F2FE] hover:underline flex items-center gap-1 ml-2"
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
                <span className="text-[#00F2FE] font-medium">Jeff está digitando</span>
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

        {/* Sugestões de Perguntas Rápidas (Ocultas assim que o primeiro prompt é digitado ou enviado) */}
        {!(messages.some((m) => m.sender === "user") || inputValue.trim().length > 0) && (
          <div className="px-4 py-2 border-t border-white/5 bg-[#080B11]/30 flex flex-wrap gap-1.5 sm:gap-2 items-center animate-fade-in">
            {QUICK_PROMPT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(chip)}
                className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#00F2FE]/30 text-gray-300 transition-colors font-mono hover:text-white"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 border-t border-white/10 bg-[#080B11]/70 flex items-center gap-2">
          {/* Microfone */}
          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-xl border transition-colors ${
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
            placeholder={isListening ? "Fale agora no microfone..." : "Pergunte algo ao Jeff sobre o Jeferson..."}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00F2FE]/60"
          />

          {/* Submit */}
          <button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
