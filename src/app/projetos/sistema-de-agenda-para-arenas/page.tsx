"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Users,
  CreditCard,
  Building2,
  Sparkles,
  Layers,
  Code2,
  Lock,
  ChevronRight,
  Info,
  Server,
  Database,
  Radio,
  FileText
} from "lucide-react";

export default function ArenaSaasOverviewPage() {
  const [serverState, setServerState] = useState<"online" | "starting" | "offline" | "checking">("checking");
  const [wakeFeedback, setWakeFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"visao-geral" | "arquitetura" | "seguranca" | "regras">("visao-geral");

  const checkOrWakeServer = async (wake: boolean = true) => {
    try {
      const url = wake ? "/api/arena-demo?action=wake" : "/api/arena-demo";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (data.status === "online") {
        setServerState("online");
        setWakeFeedback(null);
      } else if (data.status === "starting") {
        setServerState("starting");
        setWakeFeedback(data.message || "Inicializando backend em segundo plano...");
        setTimeout(() => checkOrWakeServer(false), 2500);
      } else {
        setServerState("offline");
      }
    } catch {
      setServerState("offline");
    }
  };

  useEffect(() => {
    // Ao acessar a página, dispara o comando para acordar/ligar o backend em segundo plano
    checkOrWakeServer(true);
  }, []);

  const openSandboxWindow = () => {
    // Se o backend estiver em standby, acorda-o em segundo plano antes de abrir
    if (serverState !== "online") {
      checkOrWakeServer(true);
    }
    // Abre a janela de sandbox interativa com o contador de 20 min
    window.open(
      "/projetos/sistema-de-agenda-para-arenas/sandbox",
      "ArenaSaaSSandbox",
      "width=1380,height=880,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes"
    );
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background Decorativo */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 left-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      {/* Header de Navegação */}
      <header className="border-b border-white/5 bg-[#080B1A]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link
            href="/#projetos"
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors group shrink-0"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Voltar ao Portfólio</span>
            <span className="sm:hidden font-medium">Voltar</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono bg-purple-500/10 border border-purple-500/20 text-purple-300 whitespace-nowrap">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="hidden sm:inline">SaaS Multi-Tenant • </span>
              <span>Django 4.2</span>
            </div>

            {/* Badge de Status Interativo do Backend */}
            {serverState === "online" && (
              <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5 whitespace-nowrap bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Backend Ativo (Porta 8000)</span>
                <span className="sm:hidden">Online</span>
              </span>
            )}

            {serverState === "starting" && (
              <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5 whitespace-nowrap bg-purple-500/15 text-purple-300 border border-purple-500/30 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                <span className="hidden sm:inline">Iniciando em 2º plano...</span>
                <span className="sm:hidden">Iniciando...</span>
              </span>
            )}

            {serverState === "offline" && (
              <button
                onClick={() => checkOrWakeServer(true)}
                title="Clique para ligar o servidor backend em segundo plano"
                className="text-[11px] sm:text-xs px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5 whitespace-nowrap bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Ligar Backend</span>
              </button>
            )}

            {serverState === "checking" && (
              <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-md font-mono text-slate-400 bg-white/5 border border-white/10">
                Checando...
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-8 sm:space-y-12">
        {/* Banner de Aviso de Versão Teste & Futura Implantação */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-[#10142E] to-cyan-950/30 p-5 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Versão Demonstrativa Interativa Sandbox</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Sistema de Agenda & Gestão de Arenas Esportivas
              </h1>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Plataforma SaaS completa voltada para complexos esportivos (Beach Tennis, Padel, Vôlei e Futsal).
                Atualmente na <strong className="text-purple-300">versão de testes interativa</strong> e{" "}
                <span className="text-cyan-300 font-medium">logo será implementado em arenas esportivas reais</span>.
              </p>
            </div>

            {/* CTA para Abrir Janela Sandbox */}
            <div className="w-full md:w-auto flex flex-col gap-2 shrink-0">
              <button
                onClick={openSandboxWindow}
                className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-purple-900/30 hover:shadow-purple-700/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Clock className="w-5 h-5 text-purple-200 animate-spin-slow" />
                <span>Abrir Demonstração (20 min)</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
              </button>
              <span className="text-[11px] text-slate-400 text-center font-mono">
                Sessão temporária de 20 minutos • Auto-reset
              </span>
            </div>
          </div>
        </div>

        {/* Regras e Parâmetros do Sandbox (20 min + 1 Arena + Reset) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="p-4 sm:p-5 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-sm flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-white">Limite de 20 Minutos</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ao abrir o sistema, um cronômetro regressivo é iniciado no topo da janela.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-sm flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-white">Acesso a 1 Arena Modelo</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acesso focado na <strong>Arena Prime Beach & Sports</strong>, com 4 quadras e regras dinâmicas.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-sm flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-white">Exclusão Automática dos Dados</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ao término do tempo ou ao clicar em resetar, todo dado cadastrado é purgado instantaneamente.
              </p>
            </div>
          </div>
        </div>

        {/* Abas Explicativas de Arquitetura e Funcionalidades (Sem barra horizontal, em grid no mobile e flex no PC) */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:flex sm:border-b sm:border-white/10 gap-2 sm:gap-4 pb-1">
            <button
              onClick={() => setActiveTab("visao-geral")}
              className={`p-3 sm:p-0 sm:pb-3 sm:px-3 rounded-xl sm:rounded-none text-xs sm:text-sm font-medium transition-all text-center sm:text-left cursor-pointer border sm:border-0 sm:border-b-2 whitespace-normal sm:whitespace-nowrap ${
                activeTab === "visao-geral"
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-300 font-semibold shadow-[0_0_15px_rgba(168,85,247,0.2)] sm:bg-transparent sm:shadow-none sm:border-purple-500 sm:text-purple-400"
                  : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/40 sm:bg-transparent sm:border-transparent"
              }`}
            >
              <span className="sm:hidden">Visão Geral</span>
              <span className="hidden sm:inline">Visão Geral do Sistema</span>
            </button>
            <button
              onClick={() => setActiveTab("arquitetura")}
              className={`p-3 sm:p-0 sm:pb-3 sm:px-3 rounded-xl sm:rounded-none text-xs sm:text-sm font-medium transition-all text-center sm:text-left cursor-pointer border sm:border-0 sm:border-b-2 whitespace-normal sm:whitespace-nowrap ${
                activeTab === "arquitetura"
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-300 font-semibold shadow-[0_0_15px_rgba(168,85,247,0.2)] sm:bg-transparent sm:shadow-none sm:border-purple-500 sm:text-purple-400"
                  : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/40 sm:bg-transparent sm:border-transparent"
              }`}
            >
              <span className="sm:hidden">Arquitetura SaaS</span>
              <span className="hidden sm:inline">Arquitetura Multi-Tenant & Backend</span>
            </button>
            <button
              onClick={() => setActiveTab("seguranca")}
              className={`p-3 sm:p-0 sm:pb-3 sm:px-3 rounded-xl sm:rounded-none text-xs sm:text-sm font-medium transition-all text-center sm:text-left cursor-pointer border sm:border-0 sm:border-b-2 whitespace-normal sm:whitespace-nowrap ${
                activeTab === "seguranca"
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-300 font-semibold shadow-[0_0_15px_rgba(168,85,247,0.2)] sm:bg-transparent sm:shadow-none sm:border-purple-500 sm:text-purple-400"
                  : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/40 sm:bg-transparent sm:border-transparent"
              }`}
            >
              <span className="sm:hidden">Segurança</span>
              <span className="hidden sm:inline">Segurança & Isolamento de Dados</span>
            </button>
            <button
              onClick={() => setActiveTab("regras")}
              className={`p-3 sm:p-0 sm:pb-3 sm:px-3 rounded-xl sm:rounded-none text-xs sm:text-sm font-medium transition-all text-center sm:text-left cursor-pointer border sm:border-0 sm:border-b-2 whitespace-normal sm:whitespace-nowrap ${
                activeTab === "regras"
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-300 font-semibold shadow-[0_0_15px_rgba(168,85,247,0.2)] sm:bg-transparent sm:shadow-none sm:border-purple-500 sm:text-purple-400"
                  : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/40 sm:bg-transparent sm:border-transparent"
              }`}
            >
              <span className="sm:hidden">Regras de Preço</span>
              <span className="hidden sm:inline">Motor de Preços & Regras de Quadras</span>
            </button>
          </div>

          {/* Conteúdo da Aba 1: Visão Geral */}
          {activeTab === "visao-geral" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    O que o Sistema de Arenas faz?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Desenvolvido para eliminar o uso de planilhas e mensagens descentralizadas de WhatsApp, o sistema
                    automatiza todo o ciclo operacional de uma arena esportiva em dois ecossistemas integrados:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-white/5 bg-slate-900/60">
                    <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" />
                      1. Painel Administrativo do Gestor (Backoffice)
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Grid visual de reservas em tempo real com controle de horários, bloqueios de manutenção, regras
                      dinâmicas de preços (horário nobre, diurno e fins de semana), gestão de aluguel de equipamentos e relatórios.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/5 bg-slate-900/60">
                    <h4 className="text-sm font-semibold text-cyan-300 flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4" />
                      2. Portal de Agendamento do Atleta (Scheduler)
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Link público customizado por arena (<code className="text-cyan-400 font-mono">/app/arena-demo/</code>) onde o
                      próprio jogador escolhe a quadra, a modalidade (Beach Tennis, Padel, Vôlei), o horário disponível e conclui o agendamento.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/5 bg-slate-900/60">
                    <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4" />
                      3. Gestão Completa de Escolinhas & Mensalidades
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Gestão de turmas coletivas e aulas particulares, lista de chamada, vínculo com professores por cor na grade de reservas,
                      detalhes dos alunos matriculados e régua de cobrança automática com acompanhamento de inadimplência.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/5 bg-slate-900/60">
                    <h4 className="text-sm font-semibold text-emerald-300 flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4" />
                      4. Customização do Site da Arena & Políticas de Cobrança
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Motor de personalização com upload de banner, logo, cores da marca e política de pagamentos: 100% integral obrigatório, sinal de 50% ou opção de pagamento no balcão.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/5 bg-slate-900/60">
                    <h4 className="text-sm font-semibold text-indigo-300 flex items-center gap-2 mb-1">
                      <Radio className="w-4 h-4" />
                      5. Subcontas Asaas & Pix com Timer Regressivo
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Split de pagamentos nativo para cada arena via subconta Asaas, QR Code Pix dinâmico com 1-clique copia e cola, timer regressivo e atualização automática de status via webhooks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Resumo do Sandbox Preparado */}
              <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
                      Dados Pré-Carregados na Demonstração
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Seed Ativo
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-300 mb-6">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span><strong>Arena Modelo:</strong> Arena Prime Beach & Sports (arena-demo)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span><strong>4 Quadras Configuradas:</strong> Central Beach, Padel Pro, Areia Sunset e Training Sand</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span><strong>Clientes Reais Fictícios:</strong> Lucas Menezes, Camila Vasconcelos, Rodrigo Albuquerque</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span><strong>Corpo Docente:</strong> Prof. Carlos Eduardo (Kadu) e Profa. Ana Clara Silva</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span><strong>Turmas Regulares:</strong> Beach Tennis Iniciante e Futevôlei Intermediário/Avançado</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span><strong>Grade de Horários:</strong> Agendamentos para hoje e amanhã prontos para visualização e edição</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Modo de Acesso:</span>
                    <span className="text-purple-300 font-mono font-medium">Auto-Login como Gestor Demo</span>
                  </div>
                  <button
                    onClick={openSandboxWindow}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Iniciar Sessão de Testes Agora</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo da Aba 2: Arquitetura */}
          {activeTab === "arquitetura" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-white/5 bg-slate-900/60">
                  <div className="text-xs font-mono text-slate-400 mb-1">Backend Framework</div>
                  <div className="text-base font-bold text-white">Django 4.2 LTS</div>
                  <div className="text-xs text-slate-500 mt-1">Python 3.11 / 3.13</div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-slate-900/60">
                  <div className="text-xs font-mono text-slate-400 mb-1">Isolamento Multi-Tenant</div>
                  <div className="text-base font-bold text-white">TenantManager ORM</div>
                  <div className="text-xs text-slate-500 mt-1">Filtro automático por arena</div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-slate-900/60">
                  <div className="text-xs font-mono text-slate-400 mb-1">Persistência</div>
                  <div className="text-base font-bold text-white">SQLite / PostgreSQL</div>
                  <div className="text-xs text-slate-500 mt-1">Transações ACID</div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-slate-900/60">
                  <div className="text-xs font-mono text-slate-400 mb-1">Checkout & Webhooks</div>
                  <div className="text-base font-bold text-white">ASAAS API v3</div>
                  <div className="text-xs text-slate-500 mt-1">Cobranças Pix & Webhooks</div>
                </div>
              </div>

              {/* Diagrama de Arquitetura Simplificado */}
              <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 space-y-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Estrutura de Aplicações Modulares do Django
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-black/40 border border-purple-500/20 text-slate-300">
                    <span className="text-purple-400 font-bold block mb-1">apps.saas</span>
                    Modelo Arena, Dono, Slugs e Assinaturas
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-purple-500/20 text-slate-300">
                    <span className="text-purple-400 font-bold block mb-1">apps.backoffice</span>
                    Quadras, Regras de Preço, Horários e Reservas
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-purple-500/20 text-slate-300">
                    <span className="text-purple-400 font-bold block mb-1">apps.scheduler</span>
                    Portal público do atleta e checkout de reservas
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-purple-500/20 text-slate-300">
                    <span className="text-purple-400 font-bold block mb-1">apps.lessons</span>
                    Turmas, Professores, Alunos e Mensalidades
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-purple-500/20 text-slate-300">
                    <span className="text-purple-400 font-bold block mb-1">apps.core</span>
                    Mixins de auditoria e contexto compartilhado
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo da Aba 3: Segurança */}
          {activeTab === "seguranca" && (
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                Segurança dos Dados & Proteção do Código
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Para viabilizar este teste interativo público no portfólio sem expor dados confidenciais ou sobrecarregar servidores de produção:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-2">
                  <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Sandbox com Snapshot Isolado
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    A demonstração utiliza um banco de dados espelho pré-higienizado (<code className="text-slate-300">db_seed_clean.sqlite3</code>).
                    Nenhum dado cadastrado é salvo permanentemente ou mesclado com arenas de clientes reais.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-2">
                  <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Segredos e Credenciais Sanitizadas
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Integrações de cobrança (ASAAS Pix) e senhas operam com sandbox isolado,
                    garantindo total conformidade de segurança e prevenção contra vazamento de credenciais.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo da Aba 4: Regras de Preço */}
          {activeTab === "regras" && (
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 space-y-4">
              <h3 className="text-lg font-bold text-white">Motor de Cálculo Dinâmico de Tarifas</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                O SaaS calcula o preço de cada reserva aplicando uma cascata de prioridades configurável por arena:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                <li><strong>Regra Específica da Quadra:</strong> Horários nobres dedicados a uma quadra em particular.</li>
                <li><strong>Regra Geral da Arena:</strong> Tarifas diferenciadas por dia da semana (ex: R$ 120 após as 18h de Seg a Sex).</li>
                <li><strong>Preço Padrão da Quadra:</strong> Valor base configurado para aquela quadra.</li>
                <li><strong>Preço Geral da Arena:</strong> Valor padrão cadastrado no perfil da arena.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Rodapé da Página do Projeto */}
        <div className="pt-8 pb-14 sm:pb-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 text-center sm:text-left">
          <Link
            href="/#projetos"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos Projetos do Portfólio</span>
          </Link>
          <span>Desenvolvido com Django 4.2 LTS & Python</span>
        </div>
      </main>
    </div>
  );
}
