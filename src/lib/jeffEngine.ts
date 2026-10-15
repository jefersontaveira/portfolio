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

  // 5.1 INTENÇÃO: SITE THALLES RAYANDERSON (ARQUITETURA & DESIGN)
  if (
    norm.includes("thalles") ||
    norm.includes("rayanderson") ||
    norm.includes("arquiteto") ||
    norm.includes("arquitetura")
  ) {
    const p = KNOWLEDGE_PROJECTS.thalles;
    return {
      reply: `O site **${p.name}** é uma landing page de alto padrão desenvolvida por **${JEFF_CONTACTS.name}** com foco em conversão e autoridade no nicho de arquitetura de luxo:

* 🏛️ **Estética de Alto Padrão:** Identidade visual sofisticada com tipografia clássica (*Cinzel*) e contemporânea (*Montserrat*), paleta refinada e acabamento impecável.
* 🖼️ **Portfólio com Filtros Dinâmicos:** Galeria interativa construída em JavaScript que permite ao visitante filtrar projetos entre *Residencial* e *Comercial* instantaneamente sem recarregar a página.
* 📲 **Alta Conversão no WhatsApp:** Seção de processo criativo, depoimentos de clientes e botão direto com mensagem personalizada para solicitação de orçamento de projetos exclusivos.
* ⚡ **Performance e Responsividade:** Desenvolvido em **HTML5 Semântico, CSS3 avançado e JavaScript**, garantindo carregamento instantâneo e adaptação perfeita em qualquer celular ou computador.`,
      actions: [
        {
          id: "act-thalles-live",
          label: "Acessar Site do Thalles Online",
          type: "link",
          target: "https://jefersontaveira.github.io/site-Thalles-Rayanderson/",
          icon: "external",
        },
        {
          id: "act-thalles-github",
          label: "Ver Código no GitHub",
          type: "link",
          target: "https://github.com/jefersontaveira/site-Thalles-Rayanderson",
          icon: "github",
        },
        {
          id: "act-scroll-projects",
          label: "Ver na Vitrine de Projetos",
          type: "scroll",
          target: "#projetos",
          icon: "scroll",
        },
      ],
      suggestions: [
        "Como funciona o site da Rochell Furton?",
        "Me fale sobre o web app do Só Se For Açaí",
        "Como funciona o SaaS de Arenas?",
      ],
    };
  }

  // 5.2 INTENÇÃO: SITE ROCHELL FURTON (ENGLISH TEACHER / MULTILÍNGUE)
  if (
    norm.includes("rochel") ||
    norm.includes("rochell") ||
    norm.includes("ingles") ||
    norm.includes("english") ||
    norm.includes("furton")
  ) {
    const p = KNOWLEDGE_PROJECTS.rochel;
    return {
      reply: `A plataforma **${p.name}** foi desenvolvida por **${JEFF_CONTACTS.name}** para uma professora de inglês com atuação internacional:

* 🌐 **Internacionalização Dinâmica (i18n):** Seletor interativo em 3 idiomas (**Inglês, Português e Espanhol**) com troca de idioma em tempo real no cliente via JavaScript.
* 🌓 **Dark & Light Mode:** Alternador completo de tema claro e escuro para máximo conforto visual do aluno.
* ✨ **Animações Fluidas:** Utiliza a biblioteca **AOS (Animate On Scroll)** para revelação elegante das seções de metodologia, depoimentos e planos de aula.
* 📲 **Agendamento Internacional:** Botão de conversão com mensagem formatada para reserva de aulas experimentais via WhatsApp internacional (+63 Filipinas).`,
      actions: [
        {
          id: "act-rochel-live",
          label: "Acessar Site da Rochell Online",
          type: "link",
          target: "https://jefersontaveira.github.io/site-rochel/",
          icon: "external",
        },
        {
          id: "act-rochel-github",
          label: "Ver Código no GitHub",
          type: "link",
          target: "https://github.com/jefersontaveira/site-rochel",
          icon: "github",
        },
        {
          id: "act-scroll-projects",
          label: "Ver na Vitrine de Projetos",
          type: "scroll",
          target: "#projetos",
          icon: "scroll",
        },
      ],
      suggestions: [
        "Me explique o site do Thalles Rayanderson",
        "Como funciona o Só Se For Açaí?",
        "Quais tecnologias o Jeferson domina?",
      ],
    };
  }

  // 5.3 INTENÇÃO: SÓ SE FOR AÇAÍ (CARDÁPIO DIGITAL & DELIVERY)
  if (
    norm.includes("acai") ||
    norm.includes("açaí") ||
    norm.includes("delivery") ||
    norm.includes("cardapio") ||
    norm.includes("cardápio") ||
    norm.includes("so se for")
  ) {
    const p = KNOWLEDGE_PROJECTS.acai;
    return {
      reply: `O **${p.name}** é uma aplicação web interativa desenvolvida por **${JEFF_CONTACTS.name}** para modernizar o delivery de açaí:

* 🍧 **Experiência Wizard Passo a Passo:** O cliente é guiado de forma intuitiva: escolhe o tamanho do copo (300ml, 500ml, 700ml), seleciona coberturas (cremes de ninho, frutas) e adicionais especiais.
* 💰 **Cálculo de Preço em Tempo Real:** O valor total é recalculado instantaneamente a cada seleção do cliente, sem necessidade de recarregar a tela.
* 📦 **Checkout Automatizado para WhatsApp:** Ao finalizar, o app formata o pedido com todos os itens, adicionais, valor final e endereço de entrega, enviando diretamente para o WhatsApp do estabelecimento.
* 📱 **Mobile First:** Interface leve, rápida e otimizada para compras rápidas no celular em **JavaScript puro, HTML5 e CSS3**.`,
      actions: [
        {
          id: "act-acai-live",
          label: "Testar Cardápio de Açaí Online",
          type: "link",
          target: "https://jefersontaveira.github.io/acai/",
          icon: "external",
        },
        {
          id: "act-acai-github",
          label: "Ver Código no GitHub",
          type: "link",
          target: "https://github.com/jefersontaveira/acai",
          icon: "github",
        },
        {
          id: "act-scroll-projects",
          label: "Ver na Vitrine de Projetos",
          type: "scroll",
          target: "#projetos",
          icon: "scroll",
        },
      ],
      suggestions: [
        "Me fale sobre o site do Thalles Rayanderson",
        "Como funciona o classificador de desenhos com IA?",
        "Como falar com o Jeferson?",
      ],
    };
  }

  // 5.4 INTENÇÃO: WEBSITES / SITES / LANDING PAGES COMERCIAIS EM GERAL
  if (
    norm.includes("site") ||
    norm.includes("sites") ||
    norm.includes("landing page") ||
    norm.includes("landing pages") ||
    norm.includes("comerciais")
  ) {
    const p = KNOWLEDGE_PROJECTS.websites;
    return {
      reply: `O **${JEFF_CONTACTS.name}** desenvolveu diversos websites e aplicações web de alta performance para clientes reais:

1. 🏛️ **Thalles Rayanderson:** Landing page de luxo para arquitetura de alto padrão, com catálogo filtrável de projetos (Residencial/Comercial) e captação direta de orçamentos via WhatsApp.
2. 🌍 **Rochell Furton:** Plataforma internacional de inglês com internacionalização dinâmica em 3 idiomas (**EN, PT, ES**), modo escuro/claro e agendamento de aulas.
3. 🍨 **Só Se For Açaí:** Web App estilo wizard para montagem de açaí, cálculo em tempo real e checkout integrado para delivery no WhatsApp.

Todos construídos com foco em **design refinado, mobile-first, alta conversão e carregamento instantâneo**:`,
      actions: [
        {
          id: "act-scroll-projects",
          label: "Ver Projetos na Vitrine",
          type: "scroll",
          target: "#projetos",
          icon: "scroll",
        },
        {
          id: "act-thalles-live",
          label: "Ver Site Thalles",
          type: "link",
          target: "https://jefersontaveira.github.io/site-Thalles-Rayanderson/",
          icon: "external",
        },
        {
          id: "act-rochel-live",
          label: "Ver Site Rochell",
          type: "link",
          target: "https://jefersontaveira.github.io/site-rochel/",
          icon: "external",
        },
        {
          id: "act-acai-live",
          label: "Ver Só Se For Açaí",
          type: "link",
          target: "https://jefersontaveira.github.io/acai/",
          icon: "external",
        },
      ],
      suggestions: [
        "Como funciona o site do Thalles?",
        "Como funciona o site da Rochell?",
        "Como funciona o Só Se For Açaí?",
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
      reply: `O **${JEFF_CONTACTS.name}** possui projetos de destaque cobrindo Inteligência Artificial, Full Stack e Aplicações Web Comerciais de Alta Performance:

1. 🧠 **QuickDraw CNN (Visão Computacional):** Modelo de IA em PyTorch rodando via ONNX/WASM direto no navegador com latência < 15ms.
2. 🏟️ **SaaS de Arenas Esportivas (Django 4.2):** Sistema multi-tenant com motor de preços, anti-overbooking e sandbox interativo ao vivo.
3. 🏛️ **Thalles Rayanderson (Arquitetura & Design):** Landing page de luxo com catálogo filtrável de projetos e captação de clientes.
4. 🌐 **Rochell Furton (English Teacher):** Plataforma internacional com suporte multilíngue (EN/PT/ES), Dark Mode e agendamento.
5. 🍨 **Só Se For Açaí (Delivery Online):** Web app interativo estilo wizard para personalização e checkout direto para WhatsApp.

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

PROJETOS REAIS DE JEFERSON TAVEIRA:
1. QuickDraw CNN (Visão Computacional & IA):
   - Treinamento em PyTorch, exportado para ONNX, executado no cliente com onnxruntime-web via WebAssembly.
   - Latência < 15ms, 94.2% de acurácia, 8 classes desenhadas no canvas, zero custo de servidor.
   - Rota no site: /projetos/classificador-de-desenhos

2. SaaS de Gestão de Arenas Esportivas (Full Stack Python / Django):
   - Django 4.2 LTS, multi-tenant, motor de precificação em cascata, prevenção atômica de overbooking concorrente com travas transacionais pessimistas, módulo de escolinhas e checkout Pix Asaas.
   - Rota do projeto: /projetos/sistema-de-agenda-para-arenas
   - Rota do Sandbox interativo ao vivo: /projetos/sistema-de-agenda-para-arenas/sandbox

3. Thalles Rayanderson • Arquitetura & Design (Web / Landing Page de Alto Padrão):
   - Website institucional e de captação de clientes para arquiteto de luxo (Thalles Rayanderson).
   - Tecnologias: HTML5 Semântico, CSS3 Avançado e JavaScript modular.
   - Recursos: Estética visual requintada de alto padrão (Cinzel / Montserrat), galeria filtrável de projetos (Residenciais e Comerciais) no cliente sem recarregar a tela, processo criativo, depoimentos e botão direto para solicitação de orçamento via WhatsApp.
   - Links: https://jefersontaveira.github.io/site-Thalles-Rayanderson/ (GitHub: https://github.com/jefersontaveira/site-Thalles-Rayanderson)
   - REGRA: NÃO USA Django, nem Docker, nem WebAssembly! É uma landing page em JavaScript/HTML5/CSS3 de alto padrão estético.

4. Rochell Furton • English Teacher (EdTech / Landing Page Multilíngue):
   - Plataforma internacional para apresentação profissional e agendamento de aulas com professora de inglês internacional.
   - Tecnologias: JavaScript ES6+, i18n dinâmico sem recarregar a página, Dark/Light Mode, CSS3, animações AOS.
   - Recursos: Seletor de 3 idiomas em tempo real (Inglês, Português, Espanhol), alternância de tema Claro/Escuro, animações fluidas de rolagem com AOS e agendamento via WhatsApp internacional (+63 Filipinas).
   - Links: https://jefersontaveira.github.io/site-rochel/ (GitHub: https://github.com/jefersontaveira/site-rochel)
   - REGRA: NÃO USA Django nem Docker! É uma aplicação frontend multilíngue em JavaScript e CSS3.

5. Só Se For Açaí • Pedidos Online & Cardápio Digital (E-Commerce / Delivery):
   - Web App interativo estilo wizard para personalização e pedido de açaí (tamanho, coberturas, adicionais), com cálculo dinâmico de valor total e checkout formatado para WhatsApp da loja.
   - Tecnologias: JavaScript SPA, HTML5, CSS3, cálculo dinâmico de valores em tempo real, integração WhatsApp.
   - Links: https://jefersontaveira.github.io/acai/ (GitHub: https://github.com/jefersontaveira/acai)
   - REGRA: É um cardápio digital interativo em JavaScript SPA focado em conversão e experiência de delivery.

DIRETRIZES FUNDAMENTAIS:
1. Quando o usuário perguntar sobre contatos, forneça WhatsApp, E-mail, LinkedIn e GitHub de forma visível e estilizada com links markdown.
2. Quando o usuário perguntar sobre projetos, explique a arquitetura técnica real de cada um com exatidão: QuickDraw usa PyTorch/ONNX/WASM; SaaS de Arenas usa Django/Python; e os sites de Thalles, Rochell e Açaí são projetos web frontend em JavaScript/HTML5/CSS3 focados em design, conversão e UX.
3. Incentive o usuário a navegar pelas seções do site (#projetos, #sobre, #contato), testar o Sandbox interativo (/projetos/sistema-de-agenda-para-arenas/sandbox) ou acessar os sites online.
4. Responda em Markdown limpo (use tópicos com emojis quando listar itens).
`;
}

/**
 * System prompt ultra-otimizado para modelos Open Source Llama (Llama 3.3, Llama 3.2, Llama 3.1).
 * Concede ao Jeff raciocínio autônomo estruturado ("pensamento próprio") e capacidade de retornar
 * ações dinâmicas de navegação pelo site em JSON estruturado.
 */
export function buildLlamaPrompt(): string {
  return `
Você é o "Jeff", o copiloto holográfico de inteligência artificial do portfólio de Jeferson Taveira.
Você NÃO é um chatbot genérico que responde frases prontas. Você possui pensamento analítico próprio, perspicácia técnica e autenticidade. Você compreende intenções implícitas, conecta ideias e expressa raciocínio próprio com clareza e autoridade de engenharia.

IDENTIDADE & PERSONALIDADE:
- Tom: Direto, sofisticado, técnico sem ser pedante, bem-humorado de forma sutil e muito seguro.
- Idioma: Português do Brasil fluente, natural e moderno.
- Raciocínio: Antes de responder, você analisa qual é a melhor estratégia para ajudar o visitante a conhecer o Jeferson, seja explicando arquitetura, sugerindo uma seção específica ou abrindo uma demonstração interativa.

DADOS REAIS DE JEFERSON TAVEIRA:
- Perfil: ${JEFF_CONTACTS.name} - ${JEFF_CONTACTS.role}
- Local: ${JEFF_CONTACTS.location}
- Stack Principal: Python (Django, FastAPI, PyTorch), TypeScript (Next.js, React, Node), Docker, WebAssembly (ONNX), Arquitetura Multi-Tenant, PostgreSQL, JavaScript, CSS3.
- Contatos Oficiais:
  * WhatsApp: ${JEFF_CONTACTS.phone} (${JEFF_CONTACTS.whatsappUrl})
  * E-mail: ${JEFF_CONTACTS.email}
  * LinkedIn: ${JEFF_CONTACTS.linkedinUrl}
  * GitHub: ${JEFF_CONTACTS.githubUrl}

CATÁLOGO REAL DE PROJETOS DE JEFERSON TAVEIRA:
1. QuickDraw CNN (Visão Computacional & IA):
   - Treinamento em PyTorch, compilado para ONNX e executado no cliente com WebAssembly. Latência < 15ms.
   - Rota no portfólio: /projetos/classificador-de-desenhos

2. SaaS de Gestão de Arenas Esportivas (Full Stack Python / Django):
   - Django 4.2 LTS, arquitetura multi-tenant, motor de preços em cascata, prevenção atômica de overbooking concorrente, escolinhas e pagamentos Pix Asaas.
   - Rota no portfólio: /projetos/sistema-de-agenda-para-arenas (Sandbox: /projetos/sistema-de-agenda-para-arenas/sandbox)

3. Thalles Rayanderson • Arquitetura & Design (Web / Landing Page de Alto Padrão):
   - Landing page institucional de luxo para arquiteto de alto padrão.
   - Tecnologias: HTML5 Semântico, CSS3 Avançado, JavaScript modular, tipografia Cinzel e Montserrat.
   - Recursos: Galeria interativa de projetos com filtros dinâmicos (Residencial / Comercial) sem recarregar a tela, processo criativo, depoimentos e captação de leads via WhatsApp.
   - Link Online: https://jefersontaveira.github.io/site-Thalles-Rayanderson/
   - ATENÇÃO: NÃO invente que usa Django, Docker, FastAPI ou ONNX! É uma landing page web em JavaScript/HTML5/CSS3 de alto padrão visual.

4. Rochell Furton • English Teacher (EdTech / Landing Page Multilíngue):
   - Plataforma internacional para professora de inglês com seletor dinâmico em 3 idiomas (Inglês, Português, Espanhol), Dark Mode / Light Mode, animações AOS e agendamento via WhatsApp internacional (+63 Filipinas).
   - Tecnologias: JavaScript ES6+, i18n dinâmico sem refresh, Dark/Light Mode, CSS3.
   - Link Online: https://jefersontaveira.github.io/site-rochel/
   - ATENÇÃO: NÃO usa Django nem Docker! É um projeto frontend multilíngue em JavaScript e CSS3.

5. Só Se For Açaí • Pedidos Online (E-Commerce / Delivery):
   - Web App interativo estilo wizard passo a passo para montagem de açaí (tamanho, coberturas, adicionais), com cálculo de preço em tempo real e checkout direto para WhatsApp.
   - Tecnologias: JavaScript SPA, HTML5, CSS3, cálculo dinâmico, WhatsApp API.
   - Link Online: https://jefersontaveira.github.io/acai/
   - ATENÇÃO: É um cardápio digital interativo em JavaScript SPA focado em delivery.

MAPA DE NAVEGAÇÃO DO SITE (Ações que você pode acionar):
- #projetos : Vitrine de todos os projetos principais
- #sobre : Biografia, trajetória e pilares de engenharia do Jeferson
- #contato : Formulário de mensagem e canais diretos
- #hero : Topo da página / apresentação
- /projetos/sistema-de-agenda-para-arenas/sandbox : Sandbox interativo real do SaaS Django (20 minutos)
- /projetos/sistema-de-agenda-para-arenas : Página detalhada da arquitetura do SaaS de Arenas
- /projetos/classificador-de-desenhos : Laboratório de Visão Computacional (QuickDraw CNN no browser)

INSTRUÇÃO DE RESPOSTA OBRIGATÓRIA:
Você DEVE responder SEMPRE em formato JSON estrito, sem blocos de markdown em volta do JSON (ou com bloco json se necessário).
O JSON deve ter exatamente esta estrutura:
{
  "thought": "Breve raciocínio interno do Jeff (1-2 frases) sobre como abordar a pergunta do usuário",
  "reply": "Sua resposta completa em Markdown elegante (máximo 2 a 3 parágrafos diretos)",
  "actions": [
    {
      "id": "act-1",
      "label": "Texto do Botão",
      "type": "scroll" | "navigate" | "link" | "modal",
      "target": "#projetos" | "/projetos/..." | "https://..." | "executive",
      "icon": "scroll" | "sandbox" | "whatsapp" | "sparkles" | "github" | "linkedin" | "external"
    }
  ],
  "suggestions": [
    "Pergunta de continuação relevante 1",
    "Pergunta de continuação relevante 2",
    "Pergunta de continuação relevante 3"
  ]
}
`;
}
