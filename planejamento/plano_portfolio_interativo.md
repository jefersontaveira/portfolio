# 🛸 Masterplan Executivo: Portfólio Interativo de Alta Tecnologia
> **Documento de Especificação Técnica & Arquitetura de Produto**  
> **Desenvolvedor:** Jeferson Taveira  
> **Objetivo:** Criar um portfólio interativo de padrão internacional ("Show, Don't Tell"), ultra leve, responsivo (mobile-first), com interações por voz e presença marcante de **Python**, gratuito para publicar e focado em encantar recrutadores técnicos e líderes de engenharia.

---

## 📑 Sumário Executivo
1. [Visão Estratégica & Proposta de Valor](#1-visão-estratégica--proposta-de-valor)
2. [Diretrizes de Performance, Leveza & Mobile-First](#2-diretrizes-de-performance-leveza--mobile-first)
3. [Identidade Visual & Design System ("Cyber-Clean Leve")](#3-identidade-visual--design-system-cyber-clean-leve)
4. [Especificação do Guia "ORB" & Interação por Voz](#4-especificação-do-guia-orb--interação-por-voz)
5. [Vitrine dos Projetos Interativos & Presença de Python](#5-vitrine-dos-projetos-interativos--presença-de-python)
   - [5.1. Laboratório de IA: Visão Computacional (PyTorch / ONNX Web)](#51-laboratório-de-ia-visão-computacional-pytorch--onnx-web)
   - [5.2. SaaS de Arenas Esportivas (Django REST + React Sandbox)](#52-saas-de-arenas-esportivas-django-rest--react-sandbox)
   - [5.3. Infraestrutura & DevOps (Interactive Cluster & Chaos Simulator)](#53-infraestrutura--devops-interactive-cluster--chaos-simulator)
   - [5.4. Backend & Serviços em Python (FastAPI Serverless)](#54-backend--serviços-em-python-fastapi-serverless)
6. [Assistente de Carreira com IA & Modo Executivo Rápido](#6-assistente-de-carreira-com-ia--modo-executivo-rápido)
7. [Arquitetura de Software & Estrutura de Pastas](#7-arquitetura-de-software--estrutura-de-pastas)
8. [Roadmap de Execução Passo a Passo](#8-roadmap-de-execução-passo-a-passo)

---

## 1. Visão Estratégica & Proposta de Valor

* **Posicionamento:** Engenheiro de Software Full Stack & IA especializado em **Python** (Django, FastAPI, PyTorch) e ecossistemas web modernos (React/Next.js, TypeScript, Docker).
* **Filosofia "Show, Don't Tell":** Recrutadores e gestores de engenharia interagem com código real, testam o modelo de visão computacional desenhando na tela, controlam o sandbox do SaaS e simulam o comportamento de containers e endpoints Python.
* **Custo Operacional Zero:** Arquitetura 100% serverless e client-side:
  * Hospedagem frontend e rotas serverless na **Vercel**.
  * Backend serverless em **Python (FastAPI)** rodando no tier gratuito da Vercel.
  * IA conversacional via **Gemini API (plano gratuito)**.
  * Inferência de IA local no cliente via **ONNX WebAssembly**.
  * Módulo de voz nativo via **Web Speech API** (sem custos de APIs pagas de áudio e latência zero).

---

## 2. Diretrizes de Performance, Leveza & Mobile-First

Para garantir carregamento instantâneo (< 1.5s), 60 FPS estáveis e navegação perfeita em smartphones:

1. **Anti-Bloatware (Sem Efeitos Pesados):**
   * Sem WebGL pesado ou Three.js consumindo memória e bateria do celular.
   * Sem grids infinitos calculados a cada pixel no `mousemove`. O efeito de iluminação (*Spotlight*) utiliza gradientes CSS puros acelerados por hardware via `transform` e `opacity`.
   * Animações gerenciadas com suporte estrito a `prefers-reduced-motion`.
2. **Mobile-First & Touch-Friendly:**
   * No desktop: o mascote ORB flutua com física LERP e interage com o cursor.
   * No mobile: o ORB se acopla de forma inteligente em um **Dock Inferior Flutuante** (Floating Action Card), não cobrindo o conteúdo de leitura e sem travar a rolagem da tela.
   * Canvas de desenho do laboratório de IA com `touch-action: none`, permitindo desenhar com a ponta dos dedos sem arrastar a página.
   * Alvos de toque (*tap targets*) mínimos de 44x44px em botões e controles.
3. **Pausa Inteligente (Eco Mode):**
   * O loop de renderização do ORB e canvas é pausado automaticamente quando a aba fica em segundo plano (`document.hidden`) ou quando a seção sai da tela de visão.

---

## 3. Identidade Visual & Design System ("Cyber-Clean Leve")

Estética tecnológica moderna e limpa, inspirada em ferramentas como *Linear* e *Raycast*, com alto contraste e legibilidade impecável.

### 🎨 Paleta de Cores & Tokens
* **Background Deep Slate:** `#080B11` (Preto azulado com profundidade e conforto visual).
* **Superfícies de Vidro Leve:** `rgba(15, 23, 42, 0.75)` com `border: 1px solid rgba(255, 255, 255, 0.08)` e desfoque suave de 12px.
* **Acentos Luminosos Estratégicos:**
  * 🐍 **Amarelo/Azul Python (`#38BDF8` & `#FACC15`):** Destaque aos módulos de Python e backend.
  * ⚡ **Ciano Quântico (`#00F2FE`):** IA, Modelos neurais e Tensores.
  * 🟣 **Violeta Neon (`#A855F7`):** SaaS de Arenas e regras de negócio.
  * 🟢 **Verde Esmeralda (`#10B981`):** DevOps, Status de APIs saudáveis e voz ativa.
  * 🔴 **Alerta Crimson (`#EF4444`):** Simulação de erros e interrupção.

---

## 4. Especificação do Guia "ORB" & Interação por Voz

O **ORB** atua como copiloto e assistente interativo da página, agora munido de **capacidades de voz**.

### 🎙️ Recursos de Voz (Audio & Speech)
1. **Síntese de Voz (Text-to-Speech - TTS):**
   * O ORB pode ler em voz alta suas mensagens e comentários ao clicar no ícone de áudio `[🔊 Voz Ativa / Silenciar]`.
   * Utiliza a **Web Speech Synthesis API** nativa (pt-BR / en-US), com carregamento instantâneo, sem delay de rede e sem custo.
2. **Reconhecimento de Voz (Speech-to-Text - STT):**
   * No chat com o assistente, o visitante pode clicar no ícone de microfone `[🎙️]` e falar sua pergunta diretamente ("Quais projetos em Python você desenvolveu?").
   * Transcrição em tempo real enviada direto para o assistente.
3. **Controle Total do Usuário:**
   * A voz nunca inicia sem autorização (respeitando acessibilidade e boas práticas da web). O usuário escolhe se deseja navegar em modo silencioso ou com narração.

### 📐 Comportamento Visual do ORB
* Renderizado via **Canvas 2D leve ou SVG dinâmico** (~3KB).
* Estados:
  * `IDLE`: Pulsação suave em Ciano/Azul.
  * `SPEAKING`: Ondas sonoras de energia ao narrar um texto.
  * `LISTENING`: Anel esmeralda enquanto captura a fala do microfone.
  * `THINKING`: Gradiente violeta enquanto a IA processa a resposta.

---

## 5. Vitrine dos Projetos Interativos & Presença de Python

### 5.1. Laboratório de IA: Visão Computacional (PyTorch / ONNX Web)
* **Pipeline Técnico:**
  1. Modelo CNN treinado em **Python com PyTorch** (`quickdraw_cnn.py`).
  2. Exportado para formato ONNX de alta performance (~900 KB).
  3. No cliente, o pacote `onnxruntime-web` processa o traço desenhado em tempo real com pré-processamento idêntico ao pipeline Python (redimensionamento para 28x28, normalização de tensores).
* **Interatividade:** O usuário desenha no canvas (com suporte a mouse e touch mobile) e a rede prevê em < 15ms com barra de probabilidades.
* **Snippet Python:** Aba expansível exibindo o código Python real de treinamento e inferência PyTorch.

---

### 5.2. SaaS de Arenas Esportivas (Django REST + React Sandbox)
* **Core Tecnológico:** **Python 3.12**, **Django REST Framework**, PostgreSQL, Redis e React.
* **Sandbox Interativo:**
  * Simulação de agenda de quadras (Beach Tennis, Padel, Futsal).
  * O visitante tenta criar agendamentos e visualiza a regra de concorrência em ação (prevenção de overbooking desenvolvida no backend Django).
  * Exibição das rotas REST e documentação Swagger/OpenAPI simulada.

---

### 5.3. Infraestrutura & DevOps (Interactive Cluster & Chaos Simulator)
* **Arquitetura:** `[Nginx Reverse Proxy] ➔ [Gunicorn / FastAPI & Django App] ➔ [Redis] ➔ [PostgreSQL]`.
* **Simulador de Falha (Chaos Engineering):**
  * O visitante clica em derrubar um serviço.
  * O nó pisca em vermelho, exibe log de erro e o health-check restaura o container automaticamente.

---

### 5.4. Backend & Serviços em Python (FastAPI Serverless)
* **Arquitetura Híbrida Vercel:**
  * O portfólio integra rotas em **Python (FastAPI)** sob `/api/py/` para tarefas de backend, análise e estatísticas.
  * Demonstra domínio de arquitetura moderna desacoplada e microsserviços em Python.

---

### 5.5. Arquitetura Modular para Novos Projetos & Repositórios Existentes (Project Registry)
O portfólio foi desenhado com um **Hub Extensível de Projetos (`src/data/projectsRegistry.ts`)**, permitindo que o Jeferson adicione facilmente seus projetos já desenvolvidos:
* **Estrutura Plug-and-Play:** Cada projeto é um objeto tipado com:
  * `id`, `title`, `tagline`, `category` (`IA & ML`, `Full Stack / Python`, `DevOps`, `Mobile & Web`).
  * `technologies`: Lista de badges de tecnologias (Python, PyTorch, Django, FastAPI, Docker, etc.).
  * `githubUrl` e `liveUrl`: Links diretos para código e produção.
  * `featured`: Flag para destacar no topo da grade.
  * `metrics`: Destaques numéricos de impacto (ex: *"98.4% acurácia"*, *"-40% latência"*).
  * `interactiveComponent`: Referência opcional para componente interativo/sandbox embutido.
  * `codeSnippets`: Trechos de código Python/arquitetura para recrutadores inspecionarem direto na página.
* **Filtros Dinâmicos:** Filtros por categoria e busca em tempo real na vitrine.


---

## 6. Assistente de Carreira com IA & Modo Executivo Rápido

### ⚡ Modo Executivo (Para recrutadores com pouco tempo)
* Logo no cabeçalho/Hero:
  * `[ 📄 Baixar Currículo PDF ]`
  * `[ ⚡ Visão Rápida em 1 Minuto ]` (Abre modal sucinto com perfil técnico, stacks principais, anos de experiência e links diretos para GitHub, LinkedIn e WhatsApp).

### 🤖 Chatbot com IA do ORB
* Integração segura com o modelo Gemini via backend.
* **Proteção de Prompt:** Responde estritamente sobre a trajetória e projetos de Jeferson Taveira, com tom profissional, técnico e conciso.
* Atalhos rápidos (*Prompt Chips*):
  * `[Quais suas principais stacks em Python?]`
  * `[Como funciona o SaaS de Arenas?]`
  * `[Como o modelo de visão computacional foi treinado?]`
  * `[Quero marcar uma entrevista / contato]`

---

## 7. Arquitetura de Software & Estrutura de Pastas

Estrutura limpa, modular e altamente otimizada:

```text
portfolio/
├── docs/
│   └── plano_portfolio_interativo.md     # Este documento mestre
├── api/
│   └── index.py                          # Backend serverless em Python (FastAPI)
├── public/
│   ├── models/
│   │   └── quickdraw_cnn.onnx            # Modelo de ML exportado
│   └── resume.pdf                        # Currículo atualizado
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts             # Rota serverless para IA conversacional
│   │   ├── layout.tsx                    # Shell da aplicação (SEO, fontes, meta tags)
│   │   └── page.tsx                      # Single Page Application fluida
│   ├── components/
│   │   ├── orb/
│   │   │   ├── OrbCompanion.tsx          # ORB visual adaptativo (Desktop + Mobile)
│   │   │   ├── OrbVoiceController.tsx    # Gerenciador de Speech (TTS + STT)
│   │   │   └── OrbChatModal.tsx          # Modal de conversa com IA
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx           # Chamada de alto impacto
│   │   │   └── ExecutiveModal.tsx        # Resumo executivo rápido de 1 minuto
│   │   ├── projects/
│   │   │   ├── MlVisionLab.tsx           # Canvas de desenho + ONNX Runtime
│   │   │   ├── ArenaSaasSandbox.tsx      # Simulador interativo do SaaS Django
│   │   │   ├── ContainerCluster.tsx      # Simulador de DevOps & Chaos
│   │   │   └── PythonCodeViewer.tsx      # Visualizador de código Python com tabs
│   │   ├── ui/
│   │   │   ├── SpotlightCard.tsx         # Card leve acelerado por hardware
│   │   │   ├── CommandMenu.tsx           # Menu Cmd+K / Ctrl+K
│   │   │   └── Badge.tsx
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── speechHelper.ts               # Utilitários de voz nativa (STT/TTS)
│   │   ├── onnxHelper.ts                 # Pré-processamento e inferência ONNX
│   │   └── careerContext.ts              # System prompt e biografia técnica
│   └── styles/
│       └── globals.css                   # Tokens e utilitários CSS ultra-leves
├── package.json
├── requirements.txt                      # Dependências Python para FastAPI
├── tailwind.config.ts
└── tsconfig.json
```

---

## 8. Roadmap de Execução Passo a Passo

1. **Sprint 1 — Fundação & Shell de Alta Performance:**
   * Inicializar Next.js + TypeScript + Tailwind CSS na raiz.
   * Criar layout responsivo, sistema de temas "Cyber-Clean Leve" e Navbar com botão de "Modo Executivo" e PDF.
   * Criar o componente do **ORB adaptativo** com controle de voz nativo (TTS/STT).

2. **Sprint 2 — Módulo de IA & Visão Computacional (Python & ONNX):**
   * Configurar pipeline de carregamento ONNX WebAssembly.
   * Criar canvas de desenho com suporte completo a gestos touch no mobile.
   * Adicionar painel de código Python demonstrando a arquitetura do modelo em PyTorch.

3. **Sprint 3 — Sandbox do SaaS Django & Cluster DevOps:**
   * Implementar o simulador interativo de agendamento de quadras (Django REST).
   * Implementar o simulador visual de clusters e botão de Chaos Engineering.

4. **Sprint 4 — Backend Python & IA Conversacional do ORB:**
   * Configurar endpoint Python (FastAPI) e integração com Gemini para o chat do ORB.
   * Testar comandos de voz bidirecionais (falar no microfone e ouvir o ORB).

5. **Sprint 5 — Polimento, Testes Mobile, SEO & Deploy:**
   * Auditoria de performance Lighthouse (Core Web Vitals).
   * Validação em tela de celular e desktop.
   * Publicação na Vercel com domínio configurado.
