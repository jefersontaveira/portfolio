"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  RotateCcw,
  AlertTriangle,
  Building2,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Key,
  Sparkles,
  Copy
} from "lucide-react";

export default function ArenaSandboxWindow() {
  const TOTAL_SECONDS = 20 * 60; // 20 minutos = 1200s
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_SECONDS);
  const [isResetting, setIsResetting] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [timeExpired, setTimeExpired] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string>("http://localhost:8000/accounts/login/");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [checkingServer, setCheckingServer] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const getBackendUrl = (path: string = "/accounts/login/") => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname || "localhost";
      return `http://${host}:8000${path}`;
    }
    return `http://localhost:8000${path}`;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIframeUrl(getBackendUrl("/accounts/login/"));
    }
  }, []);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const checkServerStatus = async () => {
    setCheckingServer(true);
    try {
      const res = await fetch("/api/arena-demo", { cache: "no-store" });
      const data = await res.json();
      const online = data.status === "online";
      setServerOnline(online);
      if (online && iframeRef.current && !iframeRef.current.src) {
        iframeRef.current.src = getBackendUrl("/accounts/login/");
      }
    } catch {
      setServerOnline(false);
    } finally {
      setCheckingServer(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
    const serverInterval = setInterval(checkServerStatus, 15000);
    return () => clearInterval(serverInterval);
  }, []);

  // Inicializa o timer de 20 minutos
  useEffect(() => {
    // Se o usuário já tiver um timer salvo no sessionStorage, continua dele
    const savedTime = sessionStorage.getItem("arena_demo_timer");
    if (savedTime) {
      const parsed = parseInt(savedTime, 10);
      if (parsed > 0) setSecondsLeft(parsed);
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeExpire();
          return 0;
        }
        const updated = prev - 1;
        sessionStorage.setItem("arena_demo_timer", updated.toString());
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTimeExpire = async () => {
    setTimeExpired(true);
    await triggerDatabaseReset();
  };

  const triggerDatabaseReset = async () => {
    setIsResetting(true);
    setResetFeedback("Resetando banco de dados para o estado original...");
    try {
      const res = await fetch("/api/arena-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setResetFeedback("✓ Banco restaurado! Todas as informações temporárias foram limpas.");
        // Reinicia o tempo para mais 20 min
        setSecondsLeft(TOTAL_SECONDS);
        sessionStorage.setItem("arena_demo_timer", TOTAL_SECONDS.toString());
        setTimeExpired(false);
        // Recarrega o iframe
        if (iframeRef.current) {
          iframeRef.current.src = getBackendUrl("/accounts/login/");
        }
      }
    } catch {
      setResetFeedback("Erro ao tentar resetar o banco de dados.");
    } finally {
      setIsResetting(false);
      setTimeout(() => setResetFeedback(null), 5000);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;
  };

  const isLowTime = secondsLeft <= 3 * 60; // Menos de 3 minutos

  const switchView = (view: SandboxView) => {
    setCurrentView(view);
    if (iframeRef.current) {
      iframeRef.current.src = viewUrls[view];
    }
  };

  return (
    <div className="h-screen w-screen bg-[#070913] text-white flex flex-col overflow-hidden font-sans">
      {/* BARRA SUPERIOR DE CONTROLE SANDBOX (HUD 20 MIN) */}
      <header className="bg-[#0B0E1E] border-b border-purple-500/20 px-4 py-2.5 flex items-center justify-between shrink-0 z-50">
        {/* Lado Esquerdo: Info da Arena Modelo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Arena Prime Beach & Sports
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                1 Arena Modelo
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>Modo Teste Interativo</span>
              <span>•</span>
              <span className="text-purple-300">Gestor: demo_gestor</span>
              {serverOnline !== null && (
                <>
                  <span>•</span>
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      serverOnline
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        serverOnline ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                      }`}
                    />
                    {serverOnline ? "Online (8000)" : "Offline"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>



        {/* Lado Direito: Cronômetro de 20 min & Ação de Reset */}
        <div className="flex items-center gap-3">
          {/* Cronômetro */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all ${
              isLowTime
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                : "bg-purple-950/40 text-purple-300 border-purple-500/30"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="text-sm">{formatTime(secondsLeft)}</span>
            <span className="text-[10px] opacity-75 font-sans font-normal hidden md:inline">restantes</span>
          </div>

          {/* Botão de Reset Instantâneo */}
          <button
            onClick={triggerDatabaseReset}
            disabled={isResetting}
            title="Exclui tudo o que você cadastrou e retorna ao estado original"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin text-purple-400" : ""}`} />
            <span className="hidden md:inline">Resetar Dados</span>
          </button>

          {/* Botão para Abrir em Aba Cheia Direta */}
          <a
            href={getBackendUrl("/accounts/login/")}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir diretamente em nova aba do navegador"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* BARRA DE PROGRESSO DO TEMPO DE TESTE (20 MIN) */}
      <div className="w-full h-1 bg-slate-800 relative shrink-0">
        <div
          className={`h-full transition-all duration-1000 ${
            isLowTime ? "bg-rose-500" : "bg-gradient-to-r from-purple-500 to-indigo-500"
          }`}
          style={{ width: `${100 - getProgressPercentage()}%` }}
        />
      </div>

      {/* FEEDBACK DE RESET (TOAST) */}
      {resetFeedback && (
        <div className="bg-purple-900/90 border-b border-purple-500/30 px-4 py-2 text-center text-xs text-purple-200 font-medium flex items-center justify-center gap-2 animate-fadeIn shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{resetFeedback}</span>
        </div>
      )}

      {/* BANNER INFORMATIVO DISCRETO */}
      <div className="bg-gradient-to-r from-purple-950/60 via-[#0A0D1F] to-purple-950/60 border-b border-white/5 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-300 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>
            <strong>Aviso:</strong> Sistema na versão de teste interativa. Pagamentos via PIX real desativados nesta demonstração.
          </span>
        </div>
        <span className="text-slate-400 hidden sm:inline">
          Todas as alterações feitas nesta sessão de 20 min são excluídas automaticamente ao expirar o tempo.
        </span>
      </div>

      {/* BARRA DE CREDENCIAIS VISÍVEIS DE TESTE */}
      <div className="bg-[#0c0f24] border-b border-purple-500/20 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Credenciais de Teste:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-md border border-white/10">
            <span className="text-slate-400 font-mono text-[11px]">E-mail:</span>
            <span className="text-white font-mono text-[11px] font-medium selection:bg-purple-500">gestor.demo@arenaexemplo.com</span>
            <button
              onClick={() => copyToClipboard("gestor.demo@arenaexemplo.com", "email")}
              title="Copiar e-mail"
              className="ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
            >
              <Copy className="w-3 h-3" />
            </button>
            {copiedField === "email" && <span className="text-[10px] text-emerald-400 font-medium">Copiado!</span>}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-md border border-white/10">
            <span className="text-slate-400 font-mono text-[11px]">Senha:</span>
            <span className="text-white font-mono text-[11px] font-medium selection:bg-purple-500">demo1234</span>
            <button
              onClick={() => copyToClipboard("demo1234", "password")}
              title="Copiar senha"
              className="ml-1 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
            >
              <Copy className="w-3 h-3" />
            </button>
            {copiedField === "password" && <span className="text-[10px] text-emerald-400 font-medium">Copiado!</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (iframeRef.current) {
                iframeRef.current.src = getBackendUrl("/demo/entrar/");
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Entra direto no painel da arena pulando a tela de login"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Entrar Direto (Auto-Login)</span>
          </button>
        </div>
      </div>

      {/* IFRAME COM O SISTEMA REAL DJANGO */}
      <div className="flex-1 w-full h-full relative bg-slate-950">
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          className="w-full h-full border-0 bg-white"
          title="Demonstração do Sistema de Arenas"
        />

        {/* OVERLAY CASO O SERVIDOR LOCAL ESTEJA OFFLINE */}
        {serverOnline === false && (
          <div className="absolute inset-0 bg-[#070913]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Servidor Django Desconectado</h3>
            <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              O sandbox interativo se conecta ao backend Django em <code className="text-purple-300 font-mono px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/20">http://127.0.0.1:8000</code>.
              Inicie o servidor para liberar o acesso:
            </p>
            <div className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-purple-300 mb-6 flex items-center gap-3 shadow-inner">
              <span>python manage.py runserver 127.0.0.1:8000</span>
            </div>
            <button
              onClick={checkServerStatus}
              disabled={checkingServer}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-purple-900/30 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${checkingServer ? "animate-spin" : ""}`} />
              <span>{checkingServer ? "Verificando Conexão..." : "Tentar Reconectar Agora"}</span>
            </button>
          </div>
        )}

        {/* Fallback de Ajuda Flutuante no Canto Inferior */}
        <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-white/10 backdrop-blur-md rounded-xl p-3 shadow-xl max-w-sm flex items-center justify-between gap-3 text-xs z-20">
          <div className="text-slate-300">
            <span>Deseja abrir em tela cheia na sua janela?</span>
          </div>
          <a
            href={getBackendUrl("/accounts/login/")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>Abrir Aba Direta</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* MODAL CASO O TEMPO EXPIRE */}
        {timeExpired && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="max-w-md w-full bg-[#0E1226] border border-purple-500/30 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white">Tempo de Teste Concluído (20 min)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                O limite de 20 minutos da sua sessão foi atingido. Conforme o protocolo de segurança,
                todas as informações criadas foram apagadas e o banco de dados retornou ao estado original.
              </p>
              <button
                onClick={triggerDatabaseReset}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Iniciar Nova Sessão de 20 Minutos</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
