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
    liveUrl?: string;
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
  thalles: {
    id: "thalles",
    name: "Thalles Rayanderson • Arquitetura & Design",
    shortName: "Site Thalles Rayanderson",
    category: "Arquitetura, Luxo & Landing Page",
    tagline: "Landing page institucional de alto padrão com galeria filtrável de projetos e captação de clientes",
    summary:
      "Website exclusivo para arquiteto de alto padrão com estética visual de luxo, tipografia clássica (Cinzel) e moderna (Montserrat), catálogo filtrável de projetos residenciais e comerciais, processo criativo, depoimentos e canal de conversão via WhatsApp.",
    technicalDetails: {
      problemSolved:
        "Criar uma presença digital sofisticada e de alta autoridade para arquiteto de luxo, permitindo aos clientes explorar projetos anteriores por categoria e solicitar orçamentos personalizados com agilidade.",
      architecture:
        "Construído com HTML5 semântico, CSS3 avançado e JavaScript modular. Filtros dinâmicos no cliente para alternar projetos residenciais e comerciais instantaneamente sem recarregar a página, menu responsivo tátil e integração com a API do WhatsApp.",
      keyFeatures: [
        "Identidade visual requintada de alto padrão (paleta dourada, sombras e tipografia Cinzel/Montserrat)",
        "Filtros dinâmicos no portfólio (Todos, Residencial e Comercial)",
        "Seções estratégicas de autoridade: Portfólio, Depoimentos, Processo Criativo e Sobre",
        "Botão de alta conversão integrado com mensagem personalizada para o WhatsApp do arquiteto"
      ],
      metrics: [
        "100% Responsivo (Mobile, Tablet e Desktop)",
        "Carregamento ultra-rápido com zero dependência de frameworks pesados",
        "Alta taxa de conversão direta para WhatsApp"
      ],
      stacks: ["JavaScript", "HTML5", "CSS3", "Design de Luxo", "Filtros de Portfólio", "WhatsApp API"]
    },
    navigation: {
      liveUrl: "https://jefersontaveira.github.io/site-Thalles-Rayanderson/",
      githubUrl: "https://github.com/jefersontaveira/site-Thalles-Rayanderson",
      sectionId: "projetos"
    },
    sampleQuestions: [
      "Como foi desenvolvido o site do Thalles Rayanderson?",
      "Quais tecnologias foram usadas no site de arquitetura?",
      "Onde posso ver o site do Thalles funcionando?"
    ]
  },
  rochel: {
    id: "rochel",
    name: "Rochell Furton • English Teacher",
    shortName: "Site Rochell Furton",
    category: "EdTech, Internacionalização & Landing Page",
    tagline: "Plataforma internacional para professora de inglês com seletor multilíngue (EN/PT/ES) e Dark Mode",
    summary:
      "Landing page de alta conversão para professora de inglês internacional. Possui sistema de internacionalização (i18n) em 3 idiomas (Inglês, Português e Espanhol), alternador de tema Dark/Light Mode, animações de rolagem fluidas com AOS e agendamento de aulas com redirecionamento internacional.",
    technicalDetails: {
      problemSolved:
        "Apresentar a metodologia de ensino e a experiência corporativa de uma professora internacional para alunos globais, permitindo a leitura no idioma de preferência e contratação ágil de aulas particulares.",
      architecture:
        "Desenvolvido com JavaScript modular para i18n dinâmico (troca de textos sem refresh), persistência de preferência de tema (Dark/Light Mode), animações com AOS e estilização com CSS moderno adaptado para todos os dispositivos.",
      keyFeatures: [
        "Seletor multilíngue em tempo real: Inglês (EN), Português (PT) e Espanhol (ES)",
        "Alternador de Tema Claro e Escuro (Dark & Light Mode)",
        "Animações dinâmicas de rolagem com AOS (Animate On Scroll)",
        "Seções de Apresentação, Metodologia, Planos/Preços, Avaliações de Alunos e FAQ",
        "Botão de agendamento de primeira aula com redirecionamento internacional para WhatsApp (+63 Filipinas)"
      ],
      metrics: [
        "3 Idiomas com tradução instantânea",
        "Suporte completo a Dark Mode",
        "Alcance internacional de alunos"
      ],
      stacks: ["JavaScript ES6+", "i18n Multilíngue", "Dark / Light Mode", "AOS Animations", "CSS3 Flex/Grid", "Mobile First"]
    },
    navigation: {
      liveUrl: "https://jefersontaveira.github.io/site-rochel/",
      githubUrl: "https://github.com/jefersontaveira/site-rochel",
      sectionId: "projetos"
    },
    sampleQuestions: [
      "Como funciona a internacionalização no site da Rochell Furton?",
      "Quais idiomas estão disponíveis no site de inglês?",
      "Onde posso testar o site da Rochell?"
    ]
  },
  acai: {
    id: "acai",
    name: "Só Se For Açaí • Pedidos Online & Cardápio Digital",
    shortName: "Só Se For Açaí",
    category: "E-Commerce, Delivery & Cardápio Digital",
    tagline: "Web app de delivery interativo passo a passo com cálculo dinâmico de valores e checkout via WhatsApp",
    summary:
      "Aplicativo web interativo para delivery de açaí com experiência fluida estilo wizard. O cliente seleciona o tamanho do açaí, escolhe coberturas e adicionais especiais em tempo real, visualiza o subtotal atualizado instantaneamente e envia o pedido formatado com endereço direto para o WhatsApp da loja.",
    technicalDetails: {
      problemSolved:
        "Substituir cardápios estáticos em PDF por uma experiência de compra interativa e guiada, reduzindo erros de pedidos e automatizando o cálculo de preços e complementos para o delivery.",
      architecture:
        "Single Page Application (SPA) em JavaScript puro. Fluxo em etapas (wizard): Etapa 1 (Tamanho do Copo) -> Etapa 2 (Cremes e Coberturas) -> Etapa 3 (Adicionais) -> Etapa 4 (Dados de Entrega & Envio para WhatsApp).",
      keyFeatures: [
        "Montagem guiada do açaí passo a passo com interface intuitiva",
        "Totalizador dinâmico de preço calculado em tempo real a cada item adicionado",
        "Geração de mensagem estruturada e higienizada pronta para envio no WhatsApp da loja",
        "Feedbacks instantâneos de interação com alertas e toasts táteis"
      ],
      metrics: [
        "Zero atrito na montagem de pedidos",
        "Cálculo exato de valores sem divergências",
        "100% Otimizado para smartphones (Mobile First)"
      ],
      stacks: ["JavaScript SPA", "Cardápio Digital", "Cálculo Dinâmico", "Checkout WhatsApp", "CSS3 Responsivo", "UX Passo a Passo"]
    },
    navigation: {
      liveUrl: "https://jefersontaveira.github.io/acai/",
      githubUrl: "https://github.com/jefersontaveira/acai",
      sectionId: "projetos"
    },
    sampleQuestions: [
      "Como funciona o sistema de pedidos do Só Se For Açaí?",
      "O pedido é enviado diretamente para o WhatsApp?",
      "Como foi construído o cálculo de preços em tempo real?"
    ]
  },
  websites: {
    id: "websites",
    name: "Websites & Aplicações Web Comerciais",
    shortName: "Websites & Landing Pages",
    category: "Frontend, UX & Aplicações Comerciais",
    tagline: "Projetos reais em produção: Arquitetura de Luxo, EdTech Multilíngue e Delivery Interativo",
    summary:
      "Coleção de projetos web desenvolvidos por Jeferson Taveira para clientes reais: Thalles Rayanderson (Arquitetura de Alto Padrão), Rochell Furton (Plataforma Multilíngue com Dark Mode) e Só Se For Açaí (Web App de Delivery com Checkout WhatsApp).",
    technicalDetails: {
      problemSolved:
        "Criar interfaces de alto impacto visual, máxima conversão de vendas, responsividade absoluta e internacionalização com excelente velocidade de carregamento.",
      architecture:
        "Projetos com arquitetura mobile-first, layouts fluidos com CSS Grid/Flexbox, suporte a múltiplos idiomas (i18n), modos Claro/Escuro (Dark/Light mode) e integrações diretas de checkout via WhatsApp API.",
      keyFeatures: [
        "Thalles Rayanderson: estética de luxo, filtros dinâmicos de projetos residenciais/comerciais e captação de leads",
        "Rochell Furton: seletor de 3 idiomas (EN/PT/ES), Dark Mode nativo, animações AOS e agendamento internacional de aulas",
        "Só Se For Açaí: fluxo interativo wizard passo a passo, cálculo dinâmico de adicionais e checkout automático formatado para WhatsApp"
      ],
      metrics: [
        "100% Responsivos em celulares, tablets e desktops",
        "Zero dependência de backends pesados para landing pages de alta conversão",
        "Integração instantânea com WhatsApp Business"
      ],
      stacks: ["JavaScript ES6+", "HTML5 Semântico", "CSS3 Avançado", "i18n Multilíngue", "AOS Animations", "WhatsApp API"]
    },
    navigation: {
      sectionId: "projetos"
    },
    sampleQuestions: [
      "Quais sites e landing pages o Jeferson desenvolveu?",
      "Como funciona o sistema de delivery do Só Se For Açaí?",
      "Como foi implementada a internacionalização no site da Rochell Furton?"
    ]
  }
};
