"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ProjectItem, 
  CATEGORIES, 
  ProjectCategory, 
  PROJECTS_REGISTRY 
} from "@/data/projectsRegistry";
import { 
  Github, 
  ExternalLink, 
  Sparkles, 
  Search, 
  Filter, 
  Code2, 
  ChevronRight,
  Layers
} from "lucide-react";

export const ProjectsRegistryGrid: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = PROJECTS_REGISTRY.filter((project) => {
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;

    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projetos" className="my-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da Vitrine */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F2FE] mb-2">
              <Layers className="w-4 h-4" />
              <span>REGISTRO MODULAR DE ENGENHARIA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Vitrine de Projetos & Soluções
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Hub modular e extensível de projetos desenvolvidos por Jeferson Taveira. Alterne filtros por tecnologia ou busque por stacks específicas.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por Python, Docker, IA..."
              className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F2FE]/50"
            />
          </div>
        </div>

        {/* Categorias / Filtros */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-[#00F2FE]/15 to-[#38BDF8]/15 border border-[#00F2FE]/50 text-[#00F2FE] shadow-sm"
                  : "bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:border-white/15"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grade de Cards de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl bg-[#0F172A]/60 border border-white/10 hover:border-[#00F2FE]/40 p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm"
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded"
                    style={{
                      color: project.accentColor,
                      backgroundColor: `${project.accentColor}15`,
                      border: `1px solid ${project.accentColor}30`,
                    }}
                  >
                    {project.categoryLabel}
                  </span>

                  {project.featured && (
                    <span className="text-[10px] font-mono text-[#FACC15] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Destaque
                    </span>
                  )}
                </div>

                {/* Título & Descrição */}
                <h3 className="text-lg font-bold text-white group-hover:text-[#00F2FE] transition-colors leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Métricas do Projeto */}
                {project.stats && (
                  <div className="mt-4 grid grid-cols-2 gap-2 bg-[#080B11]/50 p-2.5 rounded-xl border border-white/5">
                    {project.stats.slice(0, 2).map((st, i) => (
                      <div key={i}>
                        <div className="text-[10px] text-gray-400 font-mono">{st.label}</div>
                        <div className="text-xs font-bold text-white font-mono mt-0.5">
                          {st.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Badges de Tecnologias */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-gray-300 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ações do Card */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/25 text-gray-300 hover:text-white transition-colors"
                      title="Ver Repositório no GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/25 text-gray-300 hover:text-white transition-colors"
                      title="Acessar Demonstração Externa"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {project.id === "quickdraw-onnx-vision" ? (
                  <Link
                    href="/projetos/classificador-de-desenhos"
                    className="text-xs font-mono font-medium text-[#00F2FE] hover:underline flex items-center gap-1"
                  >
                    <span>Testar Demo & Detalhes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : project.interactiveType ? (
                  <a
                    href={
                      project.interactiveType === "django-sandbox"
                        ? "#arena-saas"
                        : "#devops-cluster"
                    }
                    className="text-xs font-mono font-medium text-[#00F2FE] hover:underline flex items-center gap-1"
                  >
                    <span>Testar Demo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                ) : null}
              </div>
            </div>
          ))}

          {/* Card Especial para Plug de Novos Projetos */}
          <div className="rounded-2xl border border-dashed border-white/20 p-6 flex flex-col justify-center items-center text-center bg-white/[0.01] hover:border-[#38BDF8]/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center mb-3">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Arquitetura Pronta para Mais Projetos
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
              Para plugar qualquer outro projeto que você já tenha criado, basta incluir um novo item no arquivo{" "}
              <code className="text-[#38BDF8] font-mono">src/data/projectsRegistry.ts</code>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
