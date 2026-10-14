import { 
  JEFF_CONTACTS, 
  KNOWLEDGE_PROJECTS, 
  SITE_SECTIONS, 
  ChatAction 
} from "./jeffKnowledge";

export interface JeffResponse {
  reply: string;
  actions: ChatAction[];
  suggestions: string[];
}

/**
 * Normaliza o texto removendo acentos e pontuações para correspondência semântica robusta.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Motor RAG Local & Processamento Semântico Inteligente.
 * Funciona de forma autônoma sem requisições externas ou quando a API do Gemini não estiver configurada.
 */
export function processLocalQuery(message: string): JeffResponse {
  const norm = normalize(message);

  // 1. INTENÇÃO: CONTATOS / CONTRATAÇÃO / ONDE FALAR COM O JEFERSON
  if (
    norm.includes("contato") ||
    norm.includes("falar") ||
    norm.includes("contrat") ||
    norm.includes("whatsapp") ||
    norm.includes("telefone") ||
    norm.includes("celular") ||
    norm.includes("email") ||
    norm.includes("e-mail") ||
    norm.includes("linkedin") ||
    norm.includes("github") ||
    norm.includes("onde te acho") ||
    norm.includes("onde acho") ||
    norm.includes("falar com ele")
  ) {
    return {
      reply: `Você pode entrar em contato diretamente com o **${JEFF_CONTACTS.name}** através dos canais oficiais abaixo. Ele está disponível para oportunidades como **${JEFF_CONTACTS.role}**, parcerias e projetos de engenharia:
      
* 💬 **WhatsApp:** [${JEFF_CONTACTS.phone}](${JEFF_CONTACTS.whatsappUrl})
* ✉️ **E-mail:** [${JEFF_CONTACTS.email}](mailto:${JEFF_CONTACTS.email})
* 💼 **LinkedIn:** [linkedin.com/in/jefersontaveira](${JEFF_CONTACTS.linkedinUrl})
* 🐙 **GitHub:** [github.com/jefersontaveira](${JEFF_CONTACTS.githubUrl})

Clique nos botões rápidos abaixo para falar diretamente ou rolar até o formulário do site:`,
      actions: [
        {
          id: "act-whatsapp",
          label: "Chamar no WhatsApp",
          type: "link",
          target: JEFF_CONTACTS.whatsappUrl,
          icon: "whatsapp",
          description: JEFF_CONTACTS.phone,
        },
        {
          id: "act-email",
          label: "Copiar E-mail",
          type: "copy",
          target: JEFF_CONTACTS.email,
          icon: "email",
          description: JEFF_CONTACTS.email,
        },
        {
          id: "act-linkedin",
          label: "Abrir LinkedIn",
          type: "link",
          target: JEFF_CONTACTS.linkedinUrl,
          icon: "linkedin",
        },
        {
          id: "act-scroll-contact",
          label: "Ir para Seção de Contato",
          type: "scroll",
          target: "#contato",
          icon: "scroll",
        },
      ],
      suggestions: [
        "Quais projetos o Jeferson desenvolveu?",
        "Qual a stack principal do Jeferson?",
        "Ver resumo executivo de 1 minuto",
      ],
    };
  }

  // 2. INTENÇÃO: DIRECIONAMENTO / NAVEGAÇÃO PELO SITE
  if (
    norm.includes("levar") ||
    norm.includes("direcion") ||
    norm.includes("onde fica") ||
    norm.includes("ir para") ||
    norm.includes("navegar") ||
    norm.includes("ver secao") ||
    norm.includes("mostrar secao") ||
    norm.includes("partes do site")
  ) {
    return {
      reply: `Posso te direcionar instantaneamente para qualquer área do portfólio de **${JEFF_CONTACTS.name}**! Selecione para onde deseja ir:`,
      actions: [
        {
          id: "nav-projetos",
          label: "Vitrine de Projetos",
          type: "scroll",
          target: "#projetos",
          icon: "scroll",
          description: "Hub com todos os projetos e filtros de tecnologia",
        },
        {
          id: "nav-sobre",
          label: "Sobre o Jeferson",
          type: "scroll",
          target: "#sobre",
          icon: "scroll",
          description: "Trajetória, foto, pilares de engenharia e stacks",
        },
        {
          id: "nav-contato",
          label: "Formulário de Contato",
          type: "scroll",
          target: "#contato",
          icon: "scroll",
          description: "Canais diretos e mensagem rápida",
        },
        {
          id: "nav-sandbox",
          label: "Sandbox do SaaS (Ao Vivo)",
          type: "navigate",
          target: "/projetos/sistema-de-agenda-para-arenas/sandbox",
          icon: "sandbox",
          description: "Teste o sistema Django ao vivo no navegador",
        },
        {
          id: "nav-quickdraw",
          label: "Laboratório de Visão Computacional",
          type: "navigate",
          target: "/projetos/classificador-de-desenhos",
          icon: "sparkles",
          description: "Desenhe na tela e teste a rede neural ONNX",
        },
      ],
      suggestions: [
        "Me fale sobre o SaaS de Arenas",
        "Como funciona o QuickDraw CNN?",
        "Como posso falar com o Jeferson?",
      ],
    };
  }

  // 3. INTENÇÃO: PROJETO QUICKDRAW (VISÃO COMPUTACIONAL / CNN / ONNX / DESENHO / PYTORCH)
  if (
    norm.includes("quickdraw") ||
    norm.includes("desenho") ||
    norm.includes("visao computacional") ||
    norm.includes("cnn") ||
    norm.includes("onnx") ||
    norm.includes("neural") ||
    norm.includes("canvas")
  ) {
    const p = KNOWLEDGE_PROJECTS.quickdraw;
    return {
      reply: `O **${p.name}** é um laboratório de Visão Computacional de ponta a ponta:

* 🧠 **Arquitetura Neural:** Rede Convolucional (CNN) treinada em **PyTorch** com 2 camadas Conv2D (32 e 64 filtros 3x3), MaxPool, Dropout e camada densa final, alcançando **94.2% de acurácia**.
* ⚡ **Execução no Browser:** O modelo foi compilado para formato **ONNX** e roda 100% no cliente usando **WebAssembly (WASM)** com **onnxruntime-web**.
* 🚀 **Vantagens de Engenharia:** Latência ultrabaixa (**< 15ms** por predição), privacidade total do usuário e **custo zero de servidor de inferência**.
* 🎨 **Classes Reconhecidas:** Maçã, bicicleta, relógio, estrela, carro, árvore, peixe e chave em tempo real enquanto você desenha.`,
      actions: [
        {
          id: "act-open-quickdraw",
          label: "Abrir Laboratório de Desenho",
          type: "navigate",
          target: p.navigation.pageUrl || "/projetos/classificador-de-desenhos",
          icon: "sparkles",
          description: "Desenhe e teste a IA no navegador",
        },
        {
          id: "act-github-quickdraw",
          label: "Ver Código no GitHub",
          type: "link",
          target: p.navigation.githubUrl || JEFF_CONTACTS.githubUrl,
          icon: "github",
        },
      ],
      suggestions: [
        "Me explique o SaaS de Arenas",
        "Como funciona o Cluster DevOps?",
        "Quais são os contatos do Jeferson?",
      ],
    };
  }

  // 4. INTENÇÃO: PROJETO SAAS DE ARENAS / DJANGO / QUADRAS / AGENDAMENTO / OVERBOOKING / SANDBOX
  if (
    norm.includes("arena") ||
    norm.includes("saas") ||
    norm.includes("agenda") ||
    norm.includes("quadra") ||
    norm.includes("django") ||
    norm.includes("overbooking") ||
    norm.includes("escolinha") ||
    norm.includes("concorrencia") ||
    norm.includes("sandbox")
  ) {
    const p = KNOWLEDGE_PROJECTS.arena;
    return {
      reply: `O **${p.name}** é uma plataforma multi-tenant completa desenvolvida em **Python & Django 4.2 LTS**:

* 🏟️ **Multi-Tenant Real:** Cada arena esportiva possui seu ambiente isolado, domínio/slug próprio, quadras personalizadas e regras de negócio.
* 🛡️ **Anti-Overbooking Concorrente:** Utiliza travas transacionais pessimistas no banco de dados e validação de concorrência atômica, eliminando 100% dos riscos de agendamentos duplicados em horários simultâneos.
* 💲 **Motor de Preços em Cascata:** Calcula tarifas dinâmicas considerando Horário Nobre da Quadra > Regra do Dia da Semana > Preço Padrão da Quadra > Tarifa Base da Arena.
* 🎓 **Gestão de Escolinhas:** Módulo completo de turmas, alunos, frequências e cobranças recorrentes.
* 🧪 **Sandbox Interativo:** Você pode testar o sistema real ao vivo aqui no portfólio (com login pré-configurado e banco auto-restaurável a cada 20 minutos)!`,
      actions: [
        {
          id: "act-open-sandbox",
          label: "Testar no Sandbox (Ao Vivo)",
          type: "navigate",
          target: p.navigation.sandboxUrl || "/projetos/sistema-de-agenda-para-arenas/sandbox",
          icon: "sandbox",
          description: "Acesse o painel do gestor agora mesmo",
        },
        {
          id: "act-open-arena-page",
          label: "Ver Detalhes do Projeto",
          type: "navigate",
          target: p.navigation.pageUrl || "/projetos/sistema-de-agenda-para-arenas",
          icon: "external",
        },
        {
          id: "act-github-arena",
          label: "Ver Código no GitHub",
          type: "link",
          target: p.navigation.githubUrl || JEFF_CONTACTS.githubUrl,
          icon: "github",
        },
      ],
      suggestions: [
        "Como funciona o classificador de desenhos?",
        "Como foi criado o Cluster Docker?",
        "Como contratar o Jeferson?",
      ],
    };
  }

  // 5. INTENÇÃO: PROJETO DEVOPS / DOCKER / CLUSTER / CAOS / NGINX / RESILIÊNCIA
  if (
    norm.includes("devops") ||
    norm.includes("docker") ||
    norm.includes("cluster") ||
    norm.includes("chaos") ||
    norm.includes("caos") ||
    norm.includes("nginx") ||
    norm.includes("redis") ||
    norm.includes("resiliencia") ||
    norm.includes("infra")
  ) {
    const p = KNOWLEDGE_PROJECTS.devops;
    return {
      reply: `O **${p.name}** demonstra práticas sólidas de engenharia de confiabilidade e alta disponibilidade:

* 🐳 **Orquestração Isolada:** Ambiente construído em containers com **Docker Compose**, segmentando aplicação, proxy reverso Nginx e cache Redis em rede interna bridge segura.
* 🔄 **Self-Healing Autônomo:** Configurado com políticas \`restart: always\` e health-checks ativos a cada 10 segundos, recuperando nós caídos em aproximadamente **1.8 segundos**.
* 💥 **Simulador de Caos:** Na vitrine do portfólio você pode derrubar intencionalmente os nós do cluster para visualizar a auto-recuperação em tempo real.`,
      actions: [
        {
          id: "act-scroll-cluster",
          label: "Ver Cluster na Vitrine",
          type: "scroll",
          target: "#projetos",
          icon: "scroll",
        },
        {
          id: "act-github-devops",
          label: "Ver Repositório no GitHub",
          type: "link",
          target: p.navigation.githubUrl || JEFF_CONTACTS.githubUrl,
          icon: "github",
        },
      ],
      suggestions: [
        "Me explique o SaaS de Arenas",
        "Como funciona o QuickDraw CNN?",
        "Quais são os contatos do Jeferson?",
      ],
    };
  }

  // 6. INTENÇÃO: HABILIDADES / STACKS / SOBRE O JEFERSON / EXPERIÊNCIA
  if (
    norm.includes("stack") ||
    norm.includes("habilidade") ||
    norm.includes("tecnologia") ||
    norm.includes("linguagem") ||
    norm.includes("quem e") ||
    norm.includes("experiencia") ||
    norm.includes("carreira") ||
    norm.includes("formacao")
  ) {
    return {
      reply: `O **${JEFF_CONTACTS.name}** é **${JEFF_CONTACTS.role}** com foco no ciclo completo de software:

* 🐍 **Python Especialista:** PyTorch para treinamento de modelos, Django REST Framework e FastAPI para backends de alta performance.
* 🧠 **Inteligência Artificial:** Modelos de Visão Computacional, inferência no cliente com ONNX Runtime / WebAssembly e integração com LLMs.
* 🌐 **Frontend Moderno:** React, Next.js, TypeScript, Tailwind CSS e interfaces ricas com animações e microinterações.
* 🛠️ **DevOps & Infra:** Docker, Docker Compose, Nginx, Redis, CI/CD GitHub Actions, Linux e PostgreSQL.

Você pode rolar até a seção **Sobre Mim** para ler a biografia e os pilares de engenharia:`,
      actions: [
        {
          id: "act-scroll-about",
          label: "Rolar até Sobre Mim",
          type: "scroll",
          target: "#sobre",
          icon: "scroll",
        },
        {
          id: "act-executive-modal",
          label: "Abrir Resumo Executivo (1 min)",
          type: "modal",
          target: "executive",
          icon: "sparkles",
        },
        {
          id: "act-contact",
          label: "Ver Contatos",
          type: "scroll",
          target: "#contato",
          icon: "whatsapp",
        },
      ],
      suggestions: [
        "Quais projetos em Python ele fez?",
        "Como funciona o classificador de IA?",
        "Como falar com o Jeferson?",
      ],
    };
  }

  // 7. INTENÇÃO: LISTAR TODOS OS PROJETOS
  if (
    norm.includes("projeto") ||
    norm.includes("portifolio") ||
    norm.includes("portfolio") ||
    norm.includes("o que ele fez") ||
    norm.includes("trabalhos")
  ) {
    return {
      reply: `O **${JEFF_CONTACTS.name}** possui projetos de destaque cobrindo IA, Full Stack e DevOps:

1. 🧠 **QuickDraw CNN (Visão Computacional):** Modelo de IA em PyTorch rodando via ONNX/WASM direto no navegador com latência < 15ms.
2. 🏟️ **SaaS de Arenas Esportivas (Django 4.2):** Sistema multi-tenant com motor de preços, anti-overbooking e sandbox interativo ao vivo.
3. 🐳 **Cluster de Microsserviços & Chaos:** Infraestrutura Docker com Nginx, Redis e auto-recuperação em ~1.8s.

Escolha um dos botões abaixo para explorar em detalhes:`,
      actions: [
        {
          id: "act-scroll-projects",
          label: "Ver Todos na Vitrine",
          type: "scroll",
          target: "#projetos",
          icon: "scroll",
        },
        {
          id: "act-arena-sandbox",
          label: "Testar Sandbox do SaaS",
          type: "navigate",
          target: "/projetos/sistema-de-agenda-para-arenas/sandbox",
          icon: "sandbox",
        },
        {
          id: "act-quickdraw-lab",
          label: "Testar Classificador CNN",
          type: "navigate",
          target: "/projetos/classificador-de-desenhos",
          icon: "sparkles",
        },
      ],
      suggestions: [
        "Como funciona a prevenção de overbooking?",
        "Qual a acurácia do modelo de visão?",
        "Como entrar em contato com o Jeferson?",
      ],
    };
  }

  // FALLBACK PADRÃO INTELIGENTE
  return {
    reply: `Sou o **Jeff**, copiloto de IA do portfólio de **${JEFF_CONTACTS.name}**. 
    
Posso te explicar a fundo a arquitetura técnica de qualquer projeto (como o **SaaS de Arenas em Django**, o **Classificador Neural QuickDraw CNN** ou o **Cluster DevOps**), fornecer os contatos diretos do Jeferson ou te guiar para qualquer seção do site!`,
    actions: [
      {
        id: "act-scroll-projects",
        label: "Explorar Projetos",
        type: "scroll",
        target: "#projetos",
        icon: "scroll",
      },
      {
        id: "act-contact",
        label: "Ver Contatos do Jeferson",
        type: "link",
        target: JEFF_CONTACTS.whatsappUrl,
        icon: "whatsapp",
      },
      {
        id: "act-sandbox",
        label: "Abrir Sandbox ao Vivo",
        type: "navigate",
        target: "/projetos/sistema-de-agenda-para-arenas/sandbox",
        icon: "sandbox",
      },
    ],
    suggestions: [
      "Quais são os contatos do Jeferson?",
      "Como funciona o SaaS de Arenas?",
      "Como foi treinado o classificador de IA?",
      "Me leve para a seção Sobre",
    ],
  };
}

/**
 * System prompt avançado de engenharia de contexto para o Google Gemini.
 */
export function buildGeminiPrompt(): string {
  return `
Você é o "Jeff", o copiloto holográfico de inteligência artificial de Jeferson Taveira.
Seu tom é técnico, perspicaz, inteligente, assertivo e prestativo.
Você fala em Português do Brasil de forma concisa (máximo 2 a 3 parágrafos bem estruturados em Markdown).

BASE DE CONHECIMENTO COMPLETA:
- Nome: ${JEFF_CONTACTS.name}
- Cargo: ${JEFF_CONTACTS.role}
- Localização: ${JEFF_CONTACTS.location}
- WhatsApp: ${JEFF_CONTACTS.phone} (Link: ${JEFF_CONTACTS.whatsappUrl})
- E-mail: ${JEFF_CONTACTS.email}
- LinkedIn: ${JEFF_CONTACTS.linkedinUrl}
- GitHub: ${JEFF_CONTACTS.githubUrl}

PROJETOS REAIS:
1. QuickDraw CNN (Visão Computacional):
   - Treinamento em PyTorch, exportado para ONNX, executado no cliente com onnxruntime-web via WebAssembly.
   - Latência < 15ms, 94.2% de acurácia, 8 classes desenhadas no canvas, zero custo de servidor.
   - Rota no site: /projetos/classificador-de-desenhos
2. SaaS de Arenas Esportivas:
   - Django 4.2 LTS, multi-tenant, motor de precificação em cascata, prevenção de concorrência com travas transacionais pessimistas, módulo de escolinhas e checkout Pix Asaas.
   - Rota do projeto: /projetos/sistema-de-agenda-para-arenas
   - Rota do Sandbox interativo ao vivo: /projetos/sistema-de-agenda-para-arenas/sandbox
3. Cluster DevOps & Chaos:
   - Docker Compose, proxy reverso Nginx, Redis, auto-recuperação em ~1.8s, health-checks a cada 10s.
   - Seção no site: #projetos

DIRETRIZES FUNDAMENTAIS:
1. Quando o usuário perguntar sobre contatos, forneça WhatsApp, E-mail, LinkedIn e GitHub de forma visível e estilizada com links markdown.
2. Quando o usuário perguntar sobre projetos, explique a arquitetura técnica real (Python, PyTorch, Django, Docker, ONNX) com detalhes de engenharia.
3. Incentive o usuário a navegar pelas seções do site (#projetos, #sobre, #contato) ou testar o Sandbox interativo (/projetos/sistema-de-agenda-para-arenas/sandbox).
4. Responda em Markdown limpo (use tópicos com emojis quando listar itens).
`;
}
