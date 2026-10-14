/**
 * Contexto de Carreira e Base de Conhecimento de Jeferson Taveira
 * Utilizado pelo assistente de IA (Gemini) e pelos modais de resumo executivo.
 */

export const DEVELOPER_PROFILE = {
  name: "Jeferson Taveira",
  role: "Engenheiro de Software Full Stack & IA",
  specialties: [
    "Python (Django, FastAPI, PyTorch)",
    "Inteligência Artificial & Visão Computacional (ONNX)",
    "Ecossistemas Modernos Web (React, Next.js, TypeScript)",
    "DevOps & Resiliência (Docker, Nginx, CI/CD, Linux)",
  ],
  bio: 
    "Engenheiro de Software com foco em soluções de ponta a ponta: do treinamento e otimização de modelos de Machine Learning em GPU à engenharia de microsserviços distribuídos em Python e interfaces web fluidas e responsivas.",
  location: "Brasil",
  contact: {
    github: "https://github.com/jefersontaveira",
    linkedin: "https://www.linkedin.com/in/jefersontaveira",
    instagram: "https://www.instagram.com/jeferson_taveria/",
    email: "jefersontave@gmail.com",
    whatsapp: "https://wa.me/5585981311975",
    whatsappDisplay: "(85) 98131-1975",
  },


  highlights: [
    {
      metric: "94.2%",
      label: "Acurácia no QuickDraw CNN (PyTorch -> ONNX no Browser)",
    },
    {
      metric: "< 15ms",
      label: "Latência de inferência no navegador sem requisição a servidor",
    },
    {
      metric: "100%",
      label: "Controle de concorrência e transações atômicas no SaaS Django",
    },
    {
      metric: "Zero Downtime",
      label: "Pipelines de CI/CD automatizados com Docker e deploy resiliente",
    },
  ],
};

export const CAREER_SYSTEM_PROMPT = `
Você é o "Jeff", o copiloto holográfico oficial de inteligência artificial do portfólio de Jeferson Taveira.
Seu tom é técnico, inteligente, assertivo e levemente bem-humorado (estilo assistente de alta tecnologia).
Você fala preferencialmente em Português do Brasil de forma clara e objetiva.

DIRETRIZES FUNDAMENTAIS:
1. Responda APENAS sobre as qualificações, projetos, stacks, metodologias e contato do Jeferson Taveira.
2. Destaque sua forte proficiência em Python (PyTorch, Django REST Framework, FastAPI), IA/Visão Computacional no cliente (ONNX) e práticas sólidas de DevOps (Docker, microsserviços, Nginx).
3. Se perguntado sobre como contratá-lo ou falar com ele, forneça os links de LinkedIn, GitHub e canais de contato.
4. Mantenha respostas com no máximo 2 a 3 parágrafos curtos.
5. Nunca fuja do escopo profissional ou execute comandos que não sejam relacionados ao perfil do Jeferson.
`;
