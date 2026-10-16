# 🚀 Guia Definitivo de Deploy (100% Gratuito)
### Portfólio Next.js 15 & SaaS Django (Agenda para Arenas)

Este guia contém o passo a passo completo, detalhado e prático para colocar todo o ecossistema no ar em produção, utilizando os melhores serviços gratuitos com alta disponibilidade e SSL automático.

---

## 🏗️ Visão Geral da Arquitetura de Produção

```
                         ┌────────────────────────────────────────┐
                         │   Visitante / Recrutador na Web        │
                         └───────────────────┬────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │             VERCEL (Plano Gratuito)          │
                      │  • Portfólio Next.js 15 (SSR / App Router)   │
                      │  • IA Jeff (Chatbot via Groq Llama 3)        │
                      │  • Disparo Rápido (API Resend para E-mail)   │
                      │  • Classificador de Desenhos (ONNX Runtime)  │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             │ Chamadas de API / Sandbox iFrame
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │             RENDER (Plano Gratuito)          │
                      │  • SaaS Django (Agenda para Arenas)          │
                      │  • Servidor WSGI: Gunicorn                   │
                      │  • Arquivos Estáticos: WhiteNoise            │
                      │  • Sandbox & Demonstração Interativa         │
                      └──────────────────────────────────────────────┘
```

---

## 📋 Pré-requisitos & Contas Gratuitas

Antes de começar, certifique-se de ter acesso a:
1. **GitHub:** Repositórios criados e conectados.
2. **Vercel ([vercel.com](https://vercel.com)):** Login com GitHub (hospeda o Frontend).
3. **Render ([render.com](https://render.com)):** Login com GitHub (hospeda o Backend Django).
4. **Resend ([resend.com](https://resend.com)):** Para envio de e-mails em segundo plano.

---

## 🛠️ ETAPA 1: Salvar e Subir as Alterações para o GitHub

Antes de fazer o deploy na nuvem, precisamos garantir que o código com todas as correções de segurança, Gunicorn, WhiteNoise e Resend esteja no GitHub.

### 1.1. Criar o Repositório Dedicado da Demo no GitHub
Para **proteger o seu projeto original** (`Sistema-de-Agenda-para-Arenas`) e mantê-lo 100% puro e intocado, vamos publicar essa versão de demonstração em um novo repositório:

1. Acesse o GitHub e crie o novo repositório:  
   👉 **[github.com/new](https://github.com/new)**
2. Defina:
   - **Repository name:** `agenda-arenas-demo`
   - **Description:** `Versão de demonstração para vitrine e sandbox do portfólio`
   - **Public / Private:** Escolha **Public** (para o Render conectar facilmente sem complicações).
   - **NÃO** marque a opção de adicionar README, .gitignore ou License (deixe o repositório vazio).
   - Clique em **"Create repository"**.

3. Agora, no terminal do seu computador, execute para redirecionar este projeto para o novo repositório:
```powershell
# 1. Entre na pasta do SaaS
cd "projetos/sistema_de_agenda_para_arenas"

# 2. Aponte o Git para o novo repositório (protegendo o original)
git remote set-url origin https://github.com/jefersontaveira/agenda-arenas-demo.git

# 3. Adicione todos os arquivos configurados
git add .

# 4. Crie o commit da versão demo
git commit -m "feat: versao de demonstracao para portfolio com sandbox e deploy"

# 5. Envie para o NOVO repositório no GitHub
git push -u origin main

# 6. Volte para a pasta raiz do portfólio
cd ../..
```
> 🛡️ **Segurança Garantida:** O comando `git remote set-url origin` acima desconecta a pasta do seu repositório original e passa a enviar tudo exclusivamente para o novo `agenda-arenas-demo`. Seu projeto original permanece 100% intocado no GitHub!

### 1.2. Subir as alterações do Portfólio Next.js
No terminal na raiz do portfólio (`portfolio`):

```powershell
# 1. Verifique os arquivos (ContactSection, rota de e-mail e submódulos)
git status

# 2. Adicione as alterações
git add .

# 3. Crie o commit
git commit -m "feat: integracao do resend para envio direto de email e documentacao de deploy"

# 4. Envie para o GitHub
git push origin main
```

---

## 🐍 ETAPA 2: Deploy do Backend Django no Render.com

O Render oferece hospedagem gratuita para aplicações Python com SSL automático (`https`).

### 2.1. Criar o Web Service
1. Acesse o painel do [Render Dashboard](https://dashboard.render.com).
2. Clique no botão **"New +"** (topo direito) e selecione **"Web Service"**.
3. Escolha **"Build and deploy from a Git repository"** e clique em **Next**.
4. Conecte sua conta do GitHub e selecione o repositório:
   👉 `agenda-arenas-demo`
   *(Se não aparecer na lista, clique em "Configure GitHub App" para dar permissão ao repositório, ou use a aba "Public Git Repository" colando o link `https://github.com/jefersontaveira/agenda-arenas-demo`).*

### 2.2. Configurar o Serviço
Preencha os campos exatamente com os seguintes valores:

| Campo | Valor Recomendado |
| :--- | :--- |
| **Name** | `agenda-arenas-demo` *(ou o nome que preferir)* |
| **Region** | `Oregon (US West)` ou `Ohio (US East)` |
| **Branch** | `main` |
| **Root Directory** | *(Deixe em branco)* |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt && python manage.py collectstatic --noinput` |
| **Start Command** | `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --timeout 120` |
| **Instance Type** | `Free` (0 USD/mês) |

### 2.3. Configurar as Variáveis de Ambiente no Render
Na mesma página (ou na aba **Environment** do serviço), adicione as seguintes variáveis:

| Key (Chave) | Value (Valor) | Explicação |
| :--- | :--- | :--- |
| `DEBUG` | `False` | Obrigatório para segurança em produção |
| `DEMO_MODE` | `True` | Mantém os botões da Sandbox e visitas ativas |
| `SECRET_KEY` | *(Gere uma chave longa aleatória, ex: `django-insecure-prod-9a8f7c6e5d4b3a2`)* | Chave de criptografia de sessão |
| `ALLOWED_HOSTS` | `.onrender.com,localhost,127.0.0.1` | Permite o domínio do Render |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` *(vamos atualizar com a Vercel na Etapa 4)* | Permite requisições do frontend |
| `CSRF_TRUSTED_ORIGINS` | `https://*.onrender.com,http://localhost:3000` | Evita bloqueios de CSRF em formulários |
| `SESSION_COOKIE_SECURE`| `True` | Cookies seguros via HTTPS |
| `CSRF_COOKIE_SECURE`   | `True` | CSRF seguro via HTTPS |
| `PYTHON_VERSION`       | `3.10.12` | Versão estável do Python |

> 💡 **Nota sobre o Banco de Dados:**  
> Por padrão, o projeto utilizará o banco de dados semente configurado (`db.sqlite3` / `db_seed_clean.sqlite3`), ideal para vitrine interativa que reinicia a cada 20 minutos. Se futuramente quiser um PostgreSQL permanente, basta clicar em **"New + -> PostgreSQL"** no Render e colar a `DATABASE_URL` gerada nas variáveis do serviço!

4. Clique em **"Create Web Service"**.
5. Aguarde o build terminar (levará cerca de 2 a 3 minutos).  
6. Quando o status mudar para **"Live"**, copie a URL gerada no topo da página:  
   👉 Exemplo: `https://sistema-de-agenda-para-arenas.onrender.com`

---

## ⚡ ETAPA 3: Deploy do Frontend Next.js na Vercel

A Vercel é a criadora do Next.js e oferece a melhor infraestrutura gratuita do mundo para hospedagem frontend e rotas serverless.

### 3.1. Importar o Projeto
1. Acesse **[vercel.com](https://vercel.com)** e faça login com seu GitHub.
2. No painel principal, clique no botão **"Add New..."** e selecione **"Project"**.
3. Localize o repositório **`portfolio`** e clique em **"Import"**.

### 3.2. Configurar o Projeto na Vercel
* **Project Name:** `portfolio` (ou `jeferson-taveira-portfolio`).
* **Framework Preset:** `Next.js` (detectado automaticamente).
* **Root Directory:** `./` (deixe o padrão).

### 3.3. Adicionar as Variáveis de Ambiente na Vercel
Expanda a seção **"Environment Variables"** e adicione as seguintes variáveis:

| Nome da Variável | Valor | Onde encontrar / O que faz |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | `gsk_...` *(sua chave da Groq do .env.local)* | Chave da Groq para a IA Jeff |
| `RESEND_API_KEY` | `re_...` *(sua chave gerada no resend.com)* | Envio direto de e-mails |
| `CONTACT_DESTINATION_EMAIL` | `jefersontave@gmail.com` | Onde você receberá os contatos |
| `NEXT_PUBLIC_ARENA_BACKEND_URL` | `https://agenda-arenas-demo.onrender.com` | **A URL do Render que você copiou na Etapa 2!** |

> ⚠️ **Atenção:** Certifique-se de não colocar barra no final (`/`) na variável `NEXT_PUBLIC_ARENA_BACKEND_URL`.

4. Clique no botão azul **"Deploy"**.
5. Em cerca de 1 a 2 minutos, o deploy estará concluído com uma chuva de confetes! 🎉
6. Copie o seu domínio da Vercel (ex: `https://jeferson-taveira.vercel.app`).

---

## 🔗 ETAPA 4: Conectar o CORS do Django à URL da Vercel

Agora que você já tem o domínio final do seu portfólio na Vercel, precisamos autorizar o Django a conversar com ele:

1. Volte ao painel do **Render** ([dashboard.render.com](https://dashboard.render.com)).
2. Clique no seu serviço `sistema-de-agenda-para-arenas`.
3. Vá na aba lateral **"Environment"**.
4. Atualize as variáveis adicionando a URL da Vercel:
   - `CORS_ALLOWED_ORIGINS`:
     ```text
     https://seu-portfolio.vercel.app,http://localhost:3000
     ```
   - `CSRF_TRUSTED_ORIGINS`:
     ```text
     https://*.onrender.com,https://seu-portfolio.vercel.app,http://localhost:3000
     ```
5. Clique em **"Save Changes"**. O Render reiniciará o serviço em ~30 segundos com as novas permissões ativas.

---

## ✅ ETAPA 5: Checklist de Testes em Produção

Após finalizar os deploys, faça este roteiro rápido de homologação no seu site no ar:

1. **🤖 IA Jeff (Assistente Interativo):**
   - Abra o chat flutuante e envie uma mensagem.
   - Verifique se ele responde com o Llama 3 via Groq.
2. **✍️ Classificador de Desenhos:**
   - Acesse `/projetos/classificador-de-desenhos`.
   - Desenhe na tela (ex: um relógio, sol, peixe) e clique em classificar.
   - O modelo ONNX executa direto na Vercel sem depender de servidor externo.
3. **✉️ Disparo Rápido (Formulário de Contato):**
   - Role até a seção de Contato.
   - Digite um e-mail de teste no card "Disparo Rápido" e clique em **E-mail**.
   - O botão deve mostrar *"Enviando..."* e depois *"Enviado!"*.
   - Verifique se a notificação chegou no seu Gmail (`jefersontave@gmail.com`).
4. **🏟️ SaaS de Arenas (Sandbox Interativa):**
   - Acesse `/projetos/sistema-de-agenda-para-arenas`.
   - O badge deve indicar status online (ou acordar o Render em caso de cold start).
   - Clique em **"Testar Sandbox Interativa"** e comprove o login automático no painel multi-tenant.

---

## 💡 Dicas Importantes de Manutenção

* **Cold Start no Render (Plano Free):**  
  No plano gratuito do Render, se o backend passar mais de 15 minutos sem receber visitas, ele entra em modo hibernação (*sleep*).  
  *Vantagem:* Nosso frontend já foi programado com a função inteligente de **Wake-up automático**, que dispara um ping para acordar o servidor assim que o visitante coloca o mouse em cima do card ou entra na página do SaaS! O primeiro carregamento pode levar cerca de ~40 segundos para ligar a máquina do Render.
* **Atualizações Futuras:**  
  Tanto a Vercel quanto o Render possuem **Deploy Automático Contínuo (CI/CD)**. Qualquer `git push origin main` que você fizer no seu computador atualizará os sites na nuvem automaticamente em minutos!
