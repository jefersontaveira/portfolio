"use client";

import React, { useState } from "react";
import { Server, ShieldAlert, RefreshCw, CheckCircle2, AlertOctagon, Terminal, Code2 } from "lucide-react";

interface NodeStatus {
  id: string;
  name: string;
  role: string;
  status: "healthy" | "crashed" | "restarting";
  latency: string;
}

export const ContainerCluster: React.FC = () => {
  const [nodes, setNodes] = useState<NodeStatus[]>([
    { id: "nginx", name: "nginx-proxy", role: "Gateway & SSL", status: "healthy", latency: "2ms" },
    { id: "django", name: "django-api-1", role: "Python Backend", status: "healthy", latency: "14ms" },
    { id: "redis", name: "redis-cache", role: "Sessões & Cache", status: "healthy", latency: "1ms" },
    { id: "postgres", name: "postgres-db", role: "Banco Relacional", status: "healthy", latency: "4ms" },
  ]);

  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Cluster inicializado com sucesso via Docker Compose.",
    "[HEALTH] Todos os 4 nós operando com 100% de disponibilidade.",
  ]);

  const [isSimulatingChaos, setIsSimulatingChaos] = useState(false);
  const [activeTab, setActiveTab] = useState<"cluster" | "dockerCompose">("cluster");

  const triggerChaosEngineering = () => {
    if (isSimulatingChaos) return;
    setIsSimulatingChaos(true);

    // 1. Derruba o container Django
    setNodes((prev) =>
      prev.map((n) =>
        n.id === "django" ? { ...n, status: "crashed", latency: "TIMEOUT" } : n
      )
    );

    setLogs((prev) => [
      `[CRITICAL] Falha induzida em "django-api-1": SIGKILL recebido!`,
      `[GATEWAY] Nginx retornando 502 Bad Gateway para requisições entrantes.`,
      ...prev,
    ]);

    // 2. Restart policy entra em ação após 1.2s
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === "django" ? { ...n, status: "restarting", latency: "Booting..." } : n
        )
      );

      setLogs((prev) => [
        `[DAEMON] Docker Restart Policy disparada (restart: always).`,
        `[HEALTH] Aguardando probe de inicialização /health/ passar...`,
        ...prev,
      ]);
    }, 1200);

    // 3. Auto-cura concluída após 2.5s
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === "django" ? { ...n, status: "healthy", latency: "12ms" } : n
        )
      );

      setLogs((prev) => [
        `[SUCCESS] Healthcheck 200 OK. Container recuperado e tráfego restabelecido em 1.3s!`,
        ...prev,
      ]);

      setIsSimulatingChaos(false);
    }, 2800);
  };

  return (
    <div id="devops-cluster" className="my-16 scroll-mt-20">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0F172A]/70 border border-[#10B981]/25 backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                <Server className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Cluster de Microsserviços & Chaos Simulator
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Demonstração de resiliência e auto-cura de containers Docker gerenciados com health-checks.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 bg-[#080B11] p-1 rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("cluster")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === "cluster"
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Simulador Vivo
            </button>
            <button
              onClick={() => setActiveTab("dockerCompose")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === "dockerCompose"
                  ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>docker-compose.yml</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Simulador Vivo */}
        {activeTab === "cluster" && (
          <div className="mt-6 space-y-6">
            {/* Topologia dos Nós do Cluster */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-4 rounded-xl border transition-all ${
                    node.status === "healthy"
                      ? "bg-white/[0.03] border-white/10"
                      : node.status === "crashed"
                      ? "bg-[#EF4444]/15 border-[#EF4444]/60 animate-pulse"
                      : "bg-[#F59E0B]/15 border-[#F59E0B]/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">
                      {node.name}
                    </span>
                    {node.status === "healthy" ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    ) : node.status === "crashed" ? (
                      <AlertOctagon className="w-4 h-4 text-[#EF4444]" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-[#F59E0B] animate-spin" />
                    )}
                  </div>

                  <div className="text-[11px] text-gray-400 font-mono mt-1">
                    {node.role}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span
                      className={
                        node.status === "healthy"
                          ? "text-[#10B981]"
                          : node.status === "crashed"
                          ? "text-[#EF4444]"
                          : "text-[#F59E0B]"
                      }
                    >
                      {node.status === "healthy"
                        ? "HEALTHY"
                        : node.status === "crashed"
                        ? "UNHEALTHY"
                        : "RESTARTING"}
                    </span>
                    <span className="text-gray-400">{node.latency}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ação de Chaos Engineering */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#080B11]/60 border border-white/5">
              <div>
                <div className="text-xs font-mono font-semibold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                  <span>Simulador de Resiliência (Chaos Monkey)</span>
                </div>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                  Teste como a orquestração reage quando a aplicação Python sofre uma pane inesperada.
                </p>
              </div>

              <button
                onClick={triggerChaosEngineering}
                disabled={isSimulatingChaos}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#F43F5E] text-white text-xs font-mono font-semibold disabled:opacity-40 flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-[#EF4444]/20 transition-all"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>{isSimulatingChaos ? "Recuperando Cluster..." : "Simular Falha no Container"}</span>
              </button>
            </div>

            {/* Terminal de Logs em Tempo Real */}
            <div className="bg-[#080B11] rounded-xl border border-white/10 p-3.5 font-mono text-[11px]">
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/10 text-gray-400 text-[10px]">
                <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Docker Daemon Event Stream</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {logs.slice(0, 5).map((log, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      log.includes("CRITICAL") || log.includes("502")
                        ? "text-[#EF4444]"
                        : log.includes("SUCCESS")
                        ? "text-[#10B981]"
                        : log.includes("DAEMON")
                        ? "text-[#F59E0B]"
                        : "text-gray-300"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: docker-compose.yml */}
        {activeTab === "dockerCompose" && (
          <div className="mt-6 bg-[#080B11] p-4 sm:p-5 rounded-2xl border border-white/10 overflow-x-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono text-gray-400">
              <span>docker-compose.production.yml</span>
              <span className="text-[#10B981]">Docker Compose v2</span>
            </div>
            <pre className="text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto">
{`version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - django-api
    networks:
      - frontend-net

  django-api:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    environment:
      - DATABASE_URL=postgres://user:pass@postgres-db:5432/arena_db
      - REDIS_URL=redis://redis-cache:6379/1
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8000/health/ || exit 1"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 5s
    depends_on:
      - postgres-db
      - redis-cache
    networks:
      - frontend-net
      - backend-net

  redis-cache:
    image: redis:7-alpine
    restart: always
    networks:
      - backend-net

  postgres-db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: arena_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: secret_password
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - backend-net

volumes:
  pgdata:

networks:
  frontend-net:
  backend-net:`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
