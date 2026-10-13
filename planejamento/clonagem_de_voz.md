# 🎙️ Planejamento: Clonagem de Voz e Síntese de Áudio com IA (Assistente Jeff)

> **Status:** Planejado para a fase final do projeto  
> **Responsável:** Jeferson Taveira & IA  
> **Objetivo:** Fazer com que o assistente holográfico **Jeff** fale com a voz real, natural e timbre de Jeferson Taveira, criando um efeito imersivo de altíssimo impacto para recrutadores e visitantes técnicos.

---

## 1. Visão Geral da Arquitetura de Áudio

O sistema de voz será dividido em **duas camadas estratégicas**:

1. **Camada Estática (Pré-renderizada em Estúdio com Voz Clonada):**
   - **O que é:** As falas fixas do sistema (saudação de boas-vindas na introdução, resumo executivo de 1 minuto, pitch rápido dos projetos).
   - **Vantagens:** 
     - Latência **ZERO** (reprodução instantânea como arquivo `.mp3` leve).
     - **Custo zero** de consumo contínuo de API para visitantes diários.
     - Qualidade máxima de dicção e entonação perfeita.

2. **Camada Dinâmica (Streaming de IA em Tempo Real):**
   - **O que é:** Quando o visitante digita ou fala uma pergunta inédita no modal de chat do **Jeff**, a IA (Gemini) gera a resposta textual e a engine de TTS sintetiza o áudio dinamicamente com a sua voz.
   - **Vantagens:** Conversação 100% personalizada e inteligente.

---

## 2. Etapa 1: Captação de Amostras de Voz (Dataset do Jeferson)

Para treinar/clonar a voz com máxima fidelidade, precisaremos de um conjunto de gravações com as seguintes especificações:

### Requisitos Técnicos de Gravação:
- **Ambiente:** Sala silenciosa, sem eco ou ruído de ventilador/ar-condicionado.
- **Equipamento:** Microfone condensador ou headset de boa captação (gravando pelo celular bem posicionado ou computador).
- **Formato:** `.wav` ou `.mp3` em 44.1 kHz ou 48 kHz, 16-bit ou 24-bit.
- **Volume:** Médio a alto, sem "estourar" ou clipar o áudio.

### Roteiro Sugerido para Gravação (3 a 5 minutos no total):
1. **Frases de Apresentação:**
   - *"Olá, meu nome é Jeferson Taveira. Sou Engenheiro de Software com foco em Python, Inteligência Artificial e sistemas distribuídos."*
2. **Frases Técnicas (para a máquina aprender jargões com a sua pronúncia):**
   - *"Trabalho com treinamento de redes neurais em PyTorch, exportação para ONNX e inferência em tempo real."*
   - *"No backend, utilizo Django REST Framework, FastAPI, PostgreSQL com controle de concorrência e Docker em produção."*
3. **Frases de Interação e Diálogo:**
   - *"Como posso te ajudar hoje? Posso detalhar a arquitetura dos meus projetos ou fornecer links diretos de contato."*
   - *"Sistemas online. Inicializando ambiente seguro de execução."*

---

## 3. Etapa 2: Escolha da Engine de Clonagem

Comparativo das principais tecnologias a serem adotadas na reta final:

| Tecnologia | Tipo | Vantagens | Desvantagens | Recomendação |
| :--- | :--- | :--- | :--- | :--- |
| **ElevenLabs** | Cloud API (SaaS) | Fidelidade hiper-realista, clonagem instantânea (Instant Voice Cloning) com 1 min de áudio, suporte perfeito a Português do Brasil. | Limite de caracteres no plano gratuito. | **Opção Principal (Mais Rápida e Perfeita)** |
| **XTTS-v2 (Coqui)** | Open Source (Self-hosted) | Modelo gratuito e aberto, roda localmente em GPU (Google Colab / RunPod / Hugging Face Spaces). | Requer deploy de endpoint com GPU dedicada para inferência rápida. | **Excelente alternativa open-source** |
| **Chatterbox / OpenVoice**| Open Source | Clonagem rápida com poucas amostras. | Menor naturalidade com entonação brasileira em comparação ao ElevenLabs. | Alternativa de backup |

---

## 4. Etapa 3: Pipeline de Implementação Técnica

### A. Geração e Armazenamento dos Áudios Fixos:
1. Clonar a voz na plataforma escolhida (ex: ElevenLabs).
2. Gerar os áudios padrão:
   - `public/audio/welcome_intro.mp3` (*"Sistema ativo. Bem-vindo ao portfólio de Jeferson Taveira."*)
   - `public/audio/executive_summary.mp3` (*"Resumo Executivo de Jeferson Taveira..."*)
   - `public/audio/project_pitch_ml.mp3` (*"Este projeto de Visão Computacional utiliza..."*)
3. O player no frontend carrega esses arquivos instantaneamente usando `HTML5 Audio` com pré-carregamento (`preload="auto"`).

### B. Integração da Voz Dinâmica (Chat em Tempo Real):
1. Criar rota de API no Next.js (`src/app/api/tts/route.ts`).
2. Receber o texto retornado pelo Gemini e disparar streaming de áudio para o cliente.
3. No frontend, utilizar o `Web Audio API` para reproduzir o buffer em streaming contínuo.

### C. Sincronização com o Holograma Canvas (Áudio-Reativo):
- Conectar o fluxo de áudio a um `AudioContext.createAnalyser()` do Web Audio API.
- Usar a frequência da voz em tempo real para fazer as órbitas e as ondas do holograma **Jeff** vibrarem no ritmo exato da fala de Jeferson!

---

## 5. Checklist de Execução na Reta Final

- [ ] Gravar 3 a 5 áudios de teste de 1 minuto em ambiente silencioso.
- [ ] Criar conta/chave na API de Voice Cloning (ex: ElevenLabs).
- [ ] Fazer upload das amostras e calibrar estabilidade e similaridade da voz.
- [ ] Exportar os arquivos `.mp3` das falas principais e salvar na pasta `public/audio/`.
- [ ] Substituir o `window.speechSynthesis` no `speechHelper.ts` pelo player de áudio dedicado com fallback.
- [ ] Conectar o Analisador de Frequência ao Canvas do Jeff para efeito de pulsação holográfica ao falar.
- [ ] Testar em navegadores desktop e smartphones.
