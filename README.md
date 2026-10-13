# 🛸 Portfólio Interativo de Alta Performance — Jeferson Taveira
> **Full Stack & IA Engineer** | Python (Django, FastAPI, PyTorch) • React/Next.js • Docker • ONNX

Portfólio interativo construído na filosofia **"Show, Don't Tell"** (Demonstre, não apenas descreva), com **custo operacional zero**, ultraleve, otimizado para mobile e com suporte a comandos por voz.

---

## 🚀 Como Executar Localmente

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 3. Configurar IA do ORB (Opcional)
Para habilitar respostas dinâmicas com o modelo Gemini no chat do ORB, crie um arquivo `.env.local` na raiz:
```env
GEMINI_API_KEY=sua_chave_aqui
```
*(Se não configurado, o assistente opera em modo de contingência inteligente com respostas técnicas pré-programadas sem falhar).*

---

## 🧩 Como Adicionar Seus Projetos Existentes (Plug & Play)

Para plugar novos projetos já desenvolvidos, abra o arquivo:
📁 [`src/data/projectsRegistry.ts`](./src/data/projectsRegistry.ts)

E adicione um novo objeto na lista `PROJECTS_REGISTRY`:

```typescript
{
  id: "meu-projeto-python",
  title: "Nome do Projeto",
  tagline: "Resumo em uma linha do problema resolvido",
  description: "Descrição técnica de impacto e arquitetura.",
  category: "fullstack-python", // "ia-ml" | "fullstack-python" | "devops-cloud" | "frontend-mobile"
  categoryLabel: "Python & FastAPI",
  technologies: ["Python", "FastAPI", "PostgreSQL", "Docker"],
  githubUrl: "https://github.com/jeferson-taveira/meu-projeto",
  liveUrl: "https://meu-projeto.vercel.app",
  featured: true,
  accentColor: "#38BDF8",
  stats: [
    { label: "Tempo de Resposta", value: "32ms" },
    { label: "Throughput", value: "1.2k req/s" }
  ]
}
```
O projeto aparecerá automaticamente na vitrine com filtros por categoria e busca em tempo real.

---

## ⚡ Destaques de Engenharia

1. **Laboratório de Visão Computacional (QuickDraw CNN):**
   * Rede neural treinada em **PyTorch** exportada para **ONNX WebAssembly**.
   * Inferência local no navegador em < 15ms sem requisições HTTP a GPUs na nuvem.
   * Suporte a touch no mobile e mouse no desktop.

2. **SaaS de Arenas Esportivas (Django REST Framework):**
   * Sandbox simulando o agendamento de quadras com regras de concorrência.
   * Lock pessimista com `select_for_update()` para impedir overbooking.

3. **Cluster DevOps & Chaos Simulator:**
   * Topologia de microsserviços interativa: `Nginx ➔ Django ➔ Redis ➔ Postgres`.
   * Botão de Chaos Engineering com simulação de queda de container, logs em tempo real e auto-cura (restart policy).

4. **Copiloto ORB & Módulo de Voz:**
   * Síntese de voz (TTS) e microfone (STT) 100% nativos via **Web Speech API** (sem custos de APIs pagas de áudio).
   * Dock compacto adaptativo no mobile para não atrapalhar a leitura ou rolagem.

5. **Modo Executivo Rápido (1 Minuto):**
   * Resumo objetivo com métricas de impacto e download do currículo voltado a recrutadores com pouco tempo de triagem.
