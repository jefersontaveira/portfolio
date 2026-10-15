"use client";

import React from "react";
import Image from "next/image";
import { 
  FileText, 
  ArrowRight,
  MapPin,
  Sparkles
} from "lucide-react";

export const AboutSection: React.FC = () => {
  const mainSkills = [
    "Python",
    "PyTorch & IA",
    "FastAPI & Django",
    "Next.js & React",
    "Docker & DevOps"
  ];

  return (
    <section id="sobre" className="relative py-16 sm:py-24 overflow-hidden border-t border-white/[0.06]">
      {/* Luzes Suaves de Fundo */}
      <div className="absolute top-1/2 -right-40 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-bl from-[#A855F7]/10 via-[#00F2FE]/05 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Foto Pessoal com Proporções Expandidas e Alinhadas à Grade */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[400px] sm:max-w-[440px] lg:max-w-full">
              <div className="relative rounded-3xl p-2.5 bg-gradient-to-b from-white/15 via-white/[0.04] to-transparent border border-white/10 shadow-[0_0_45px_rgba(0,242,254,0.14)]">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#0F172A]">
                  <Image
                    src="/images/profile.jpg"
                    alt="Jeferson Taveira - Engenheiro de Software Full Stack & IA"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  {/* Fusão suave na base */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#080B11] via-[#080B11]/60 to-transparent pointer-events-none" />

                  {/* Localização sutil */}
                  <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 text-xs font-mono text-gray-300 bg-[#080B11]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Brasil • Remoto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Alinhado Verticalmente à Foto */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:py-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300">
                <Sparkles className="w-3.5 h-3.5 text-[#00F2FE]" />
                <span className="uppercase tracking-wider font-semibold">Sobre Mim</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Jeferson Taveira
              </h2>

              <p className="text-sm sm:text-base font-mono text-[#38BDF8]">
                Engenheiro de Software Full Stack & Inteligência Artificial
              </p>
            </div>

            <div className="space-y-3.5 text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
              <p>
                Desenvolvo soluções de ponta a ponta unindo a modelagem de Inteligência Artificial aplicada (PyTorch e ONNX) à arquitetura de microsserviços em Python e interfaces web fluidas com Next.js.
              </p>
              <p className="text-xs sm:text-sm text-gray-400 font-mono">
                Foco em código limpo, alta performance, baixa latência e sistemas resilientes prontos para produção.
              </p>
            </div>

            {/* Stacks Principais em Formato Compacto */}
            <div className="pt-1 flex flex-wrap gap-2">
              {mainSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Botões de Ação */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
              <a
                href="#contato"
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#38BDF8] text-black font-extrabold text-sm sm:text-sm font-mono flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Falar Comigo</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-200 hover:text-white text-sm sm:text-sm font-mono flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <FileText className="w-4 h-4 text-[#00F2FE]" />
                <span>Currículo (PDF)</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
