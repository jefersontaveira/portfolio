/**
 * BASE DE CONHECIMENTO RAG DE JEFERSON TAVEIRA
 * Utilizada pelo copiloto de IA "Jeff" para responder com alta fidelidade,
 * fornecer contatos, detalhar projetos e disparar ações de navegação pelo site.
 */

export interface KnowledgeProject {
  id: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  summary: string;
  technicalDetails: {
    problemSolved: string;
    architecture: string;
    keyFeatures: string[];
    metrics: string[];
    stacks: string[];
  };
  navigation: {
    pageUrl?: string;
    sandboxUrl?: string;
    githubUrl?: string;
    sectionId?: string;
  };
  sampleQuestions: string[];
}

export interface ChatAction {
  id: string;
  label: string;
  type: "scroll" | "navigate" | "link" | "copy" | "modal";
  target: string;
  icon?: "whatsapp" | "email" | "linkedin" | "github" | "sandbox" | "external" | "scroll" | "sparkles";
  description?: string;
}

export const JEFF_CONTACTS = {
  name: "Jeferson Taveira",
  role: "Engenheiro de Software Full Stack & IA",
  location: "Fortaleza - CE, Brasil",
  email: "jefersontave@gmail.com",
  phone: "(85) 98131-1975",
  whatsappUrl: "https://wa.me/5585981311975?text=Ol%C3%A1%20Jeferson!%20Vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar.",
  linkedinUrl: "https://www.linkedin.com/in/jefersontaveira",
  githubUrl: "https://github.com/jefersontaveira",
  instagramUrl: "https://www.instagram.com/jeferson_taveria/",
};

export const SITE_SECTIONS = [
  { id: "hero", name: "Início", hash: "#hero", description: "Apresentação e visão geral" },
  { id: "projetos", name: "Projetos", hash: "#projetos", description: "Vitrine completa de engenharia" },
  { id: "sobre", name: "Sobre Mim", hash: "#sobre", description: "Trajetória, formação e pilares" },
  { id: "contato", name: "Contato", hash: "#contato", description: "Formulário e conexões diretas" },
];

export const KNOWLEDGE_PROJECTS: Record<string, KnowledgeProject> = {
  quickdraw: {
    id: "quickdraw",
    name: "Laboratório de Visão Computacional (QuickDraw CNN)",
    shortName: "Classificador de Desenhos IA",
    category: "Inteligência Artificial & Edge Computing",
    tagline: "Inferência neural de alta performance rodando 100% no cliente via WebAssembly",
    summary:
      "Rede neural convolucional (CNN) treinada em PyTorch e exportada para ONNX. Roda diretamente no navegador usando WebAssembly com latência < 15ms por predição e zero custo de servidor.",
    technicalDetails: {
      problemSolved:
        "Eliminar custos de GPU e servidores de inferência na nuvem, trazendo a execução do modelo para o navegador do cliente em tempo real com privacidade total dos dados.",
      architecture:
        "Pipeline de treinamento com PyTorch: 2 blocos Conv2D (32 e 64 filtros, kernel 3x3), ativação ReLU, MaxPool2d(2,2) e Dropout para regularização. Exportação otimizada para formato ONNX executada com onnxruntime-web via WebAssembly.",
      keyFeatures: [
        "Reconhecimento de 8 classes de desenhos em tempo real (maçã, bicicleta, relógio, estrela, carro, árvore, peixe, chave)",
        "Canvas interativo com pré-processamento de imagem automático (resize 28x28 grayscale normalizado)",
        "Inferência contínua com debounce a cada traço desenhado",
        "Probabilidade percentual de confiança calculada por Softmax"
      ],
      metrics: [
        "94.2% de Acurácia no conjunto de teste",
        "< 15ms de Latência média de predição",
        "890 KB de Tamanho total do modelo compilado",
        "R$ 0,00 de Custo de infraestrutura de servidor"
      ],
      stacks: ["Python", "PyTorch", "ONNX", "WebAssembly", "TypeScript", "Canvas API", "React/Next.js"]
    },
    navigation: {
      pageUrl: "/projetos/classificador-de-desenhos",
      githubUrl: "https://github.com/jefersontaveira/classificador_de_desenhos",
      sectionId: "projetos"
    },
    sampleQuestions: [
      "Como funciona o classificador de desenhos?",
      "Qual a acurácia do modelo de visão computacional?",
      "Como você rodou o modelo PyTorch no navegador?"
    ]
  },
  arena: {
    id: "arena",
    name: "SaaS de Gestão de Arenas Esportivas",
    shortName: "SaaS de Arenas",
    category: "Full Stack & Arquitetura SaaS",
    tagline: "Ecossistema multi-tenant com motor de preços em cascata, escolinhas e checkout Pix",
    summary:
      "Plataforma completa para gestão de centros esportivos (Beach Tennis, Futsal, Vôlei). Desenvolvido em Django 4.2 com arquitetura multi-tenant, motor de precificação dinâmico, controle concorrente anti-overbooking e integração Pix Asaas.",
    technicalDetails: {
      problemSolved:
        "Centralizar agendamentos, impedir conflitos de horários em reservas simultâneas, automatizar mensalidades de turmas esportivas e eliminar o atrito de confirmações manuais por WhatsApp.",
      architecture:
        "Backoffice em Django 4.2 LTS com arquitetura multi-tenant robusta. Motor de tarifação com cascata de 4 níveis de prioridade. Prevenção de conflito com locks transacionais no banco de dados e rotinas de expiração de reservas pendentes em 15 minutos.",
      keyFeatures: [
        "Motor de precificação dinâmico (regras por horário nobre, dia da semana, quadra e padrão)",
        "Prevenção atômica de concorrência e overbooking com validação transacional",
        "Módulo completo de escolinhas esportivas (turmas, controle de alunos, frequências e mensalidades)",
        "Portal do atleta público responsivo para agendamento online",
        "Sandbox interativo embarcado com banco de teste auto-restaurável a cada 20 minutos"
      ],
      metrics: [
        "28ms de Tempo médio de resposta em consultas",
        "100% de Proteção contra reservas simultâneas concorrentes",
        "Multi-Tenant completo com isolamento de dados por Arena",
        "Sessão interativa demonstrativa com auto-reset em 20 min"
      ],
      stacks: ["Python 3.11", "Django 4.2 LTS", "PostgreSQL/SQLite", "Asaas Pix & Webhooks", "Jazzmin Admin", "Bootstrap 5", "Next.js"]
    },
    navigation: {
      pageUrl: "/projetos/sistema-de-agenda-para-arenas",
      sandboxUrl: "/projetos/sistema-de-agenda-para-arenas/sandbox",
      githubUrl: "https://github.com/jefersontaveira/Sistema-de-Agenda-para-Arenas.git",
      sectionId: "projetos"
    },
    sampleQuestions: [
      "Como funciona o SaaS de Arenas?",
      "Como você resolveu o problema de concorrência e overbooking?",
      "Onde posso testar o sistema ao vivo?"
    ]
  },
  devops: {
    id: "devops",
    name: "Cluster de Microsserviços & Chaos Simulator",
    shortName: "Cluster DevOps",
    category: "DevOps & Resiliência de Infraestrutura",
    tagline: "Arquitetura distribuída em containers Docker com Nginx, Redis e auto-recuperação",
    summary:
      "Ambiente de microsserviços orquestrado via Docker Compose com proxy reverso Nginx, aplicação Python distribuída, cache Redis e políticas ativas de health-check e reinício automático.",
    technicalDetails: {
      problemSolved:
        "Garantir alta disponibilidade e tolerância a falhas em sistemas de missão crítica, com monitoramento contínuo de nós e recuperação autônoma de instâncias caídas.",
      architecture:
        "Orquestração declarativa com Docker Compose. Proxy reverso Nginx para balanceamento de carga, banco de dados isolado em rede interna bridge, cache Redis para sessões e health-checks a cada 10s com política restart: always.",
      keyFeatures: [
        "Balanceamento de carga round-robin via Nginx",
        "Políticas de auto-recuperação de containers (Self-Healing em ~1.8s)",
        "Isolamento estrito de rede interna (bridge segregada)",
        "Simulador interativo de caos para derrubar nós e observar recuperação em tempo real"
      ],
      metrics: [
        "~1.8s de Tempo médio de auto-cura após crash de container",
        "Zero exposição pública de portas de banco de dados",
        "Builds multi-stage otimizadas para produção"
      ],
      stacks: ["Docker", "Docker Compose", "Nginx", "Redis", "Linux", "CI/CD GitHub Actions", "Python"]
    },
    navigation: {
      githubUrl: "https://github.com/jeferson-taveira/infra-cluster",
      sectionId: "projetos"
    },
    sampleQuestions: [
      "Como você implementou o cluster Docker?",
      "O que é o simulador de caos?",
      "Como funciona a política de auto-cura?"
    ]
  }
};
