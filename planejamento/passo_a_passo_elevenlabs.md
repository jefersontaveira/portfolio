# 🎙️ Guia de Clonagem de Voz (ATUALIZADO: Ferramenta 100% Gratuita)

> ⚠️ **ATENÇÃO:** O ElevenLabs agora cobra mensalidade em dólar para clonagem.  
> 🟢 **GUIA ATUALIZADO 100% GRATUITO:** Acesse o novo guia definitivo usando Fish Audio e Hugging Face F5-TTS em:  
> 👉 [`planejamento/passo_a_passo_clonagem_gratuita.md`](./passo_a_passo_clonagem_gratuita.md)

---

## 📋 Parte 1: Roteiro de Leitura para Gravação

Grave este texto em um ambiente silencioso (pelo gravador do celular ou pelo PC).  
Fale de forma natural, segura, em ritmo de conversa técnica, sem pressa. Respeite as pausas indicadas pelas vírgulas e pontos.

> ⏱️ **Tempo estimado:** ~1 minuto e 30 segundos.

---

### 📜 Texto para Gravação (Leia em voz alta):

> *"Olá! Eu sou o Jeff, a inteligência artificial interativa do portfólio de Jeferson Taveira.*
>
> *Sou Engenheiro de Software especializado em desenvolvimento backend de alta performance, Inteligência Artificial aplicada e arquitetura de sistemas escaláveis.*
>
> *No meu dia a dia, trabalho com tecnologias como Python, Django REST Framework, FastAPI, Next.js, Docker, PostgreSQL e inferência de redes neurais com PyTorch e ONNX.*
>
> *Posso te guiar por todo o portfólio: você pode me pedir para detalhar a arquitetura de qualquer projeto, abrir demonstrações ao vivo ou navegar pelas seções da página.*
>
> *Se você quiser bater um papo diretamente com o Jeferson ou agendar uma conversa técnica, estou te levando agora para a seção de contatos. O WhatsApp dele é DDD 85 98131-975, e o e-mail é jeferson.taveira@outlook.com.*
>
> *Fique à vontade para explorar os projetos e testar meus recursos de visão computacional e interação por voz!"*

---

### 💡 Dicas de Ouro para a Gravação:
1. **Microfone:** Deixe o celular a um palmo da boca (cerca de 15 a 20 cm) em ângulo de 45° para evitar o ar da respiração bater no microfone.
2. **Ambiente:** Quarto com cama/cortinas é excelente (tecidos absorvem eco). Desligue ventilador ou ar-condicionado por 2 minutos.
3. **Formato:** Pode ser `.mp3`, `.m4a` ou `.wav` (qualquer gravador nativo do iPhone ou Android serve).

---

## 🚀 Parte 2: Passo a Passo no ElevenLabs

### 1. Criar a Conta
1. Acesse o site oficial: [elevenlabs.io](https://elevenlabs.io)
2. Clique em **"Sign Up"** (ou faça login com sua conta Google/GitHub).
3. O plano gratuito já oferece créditos suficientes para testar a clonagem e gerar as falas. *(Nota: O Instant Voice Cloning está disponível nos planos de teste ou Starter).*

### 2. Acessar a Ferramenta de Vozes
1. No menu lateral esquerdo, clique em **"Voices"** (ou **"VoiceLab"**).
2. Clique no botão azul no topo direito: **"+ Add a new voice"** (ou **"Add Generative or Cloned Voice"**).

### 3. Selecionar Clonagem Instantânea
1. Escolha a opção **"Instant Voice Cloning"** (ou **"PVC / Professional"** se preferir, mas Instant é o mais rápido).
2. Preencha os campos:
   - **Name:** `Jeff - Jeferson Taveira`
   - **Labels:** `Gender: Male`, `Age: Young/Middle-Aged`, `Accent: Brazilian Portuguese`, `Use Case: Assistant / Tech`.
   - **Description:** `Voz natural do Jeferson Taveira para assistente de IA do portfólio`.

### 4. Fazer o Upload do Áudio
1. Na área **"Upload Samples"**, arraste ou selecione o arquivo de áudio que você gravou.
2. *(Opcional)* Se tiver mais de um áudio curto, pode enviar até 3 ou 4 amostras para aumentar a fidelidade.
3. Marque a caixa de verificação legal (confirmando que a voz é sua).
4. Clique em **"Add Voice"**.

### 5. Copiar o `Voice ID`
1. Na lista de vozes, localize o card da sua voz recém-criada (`Jeff - Jeferson Taveira`).
2. Clique no ícone de configurações / detalhes (ou no menu `...`).
3. Clique em **"Copy Voice ID"** (será uma sequência de letras e números parecida com: `21m00Tcm4TlvDq8ikWAM`).
4. **Guarde esse ID!** É ele que vamos colocar no código do projeto.

### 6. Obter sua Chave de API (`XI_API_KEY`)
1. Clique na sua foto de perfil no canto inferior esquerdo.
2. Vá em **"Profile + API key"**.
3. Clique no botão de olho ou em **"Copy API Key"**.
4. Guarde essa chave em segurança.

---

## 🛠️ Parte 3: Próximos Passos no Código do Portfólio

Assim que você tiver o **`Voice ID`** e a **`API Key`**, nós realizamos a integração completa em poucos minutos:

### 1. Salvar Variáveis no `.env.local`
No arquivo `.env.local` do portfólio, adicionaremos:
```env
ELEVENLABS_API_KEY="sua_chave_aqui"
ELEVENLABS_VOICE_ID="seu_voice_id_aqui"
```

### 2. Rota de Backend Segura (`/api/voice`)
Criaremos o endpoint no Next.js:
- Recebe o texto que o Jeff vai falar (ex: *"Estou te levando agora para a seção de contatos..."*).
- Chama a API da ElevenLabs usando o modelo ultra rápido `eleven_multilingual_v2` ou `eleven_turbo_v2_5`.
- Devolve o streaming de áudio diretamente para o navegador sem salvar arquivos pesados no servidor.

### 3. Orquestração no Frontend (Falar + Navegar Simultaneamente)
Conectamos a resposta do Llama com a execução no site:
1. O usuário fala ou clica para perguntar algo.
2. O Llama responde o texto e emite a ação `{ type: "scroll", target: "#contato" }`.
3. O player toca a sua voz clonada com qualidade de estúdio.
4. O holograma vibra no ritmo das ondas sonoras.
5. A página rola suavemente até o contato ou o projeto solicitado.

### 4. Áudio Fixo Offline (Opcional - Economia de Créditos)
Podemos exportar do ElevenLabs 2 arquivos MP3 prontos:
- `welcome_intro.mp3`: Boas-vindas da introdução holográfica.
- `executive_summary.mp3`: Pitch executivo do modal de 1 minuto.  
Esses 2 tocam instantaneamente com **latência zero** e **sem gastar 1 centavo de créditos** da API!
