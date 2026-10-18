const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const QRCode = require('qrcode');

async function generateResume() {
  console.log('🚀 Iniciando geração do currículo executivo de alta fidelidade...');

  const rootDir = path.resolve(__dirname, '..');
  const photoPath = path.join(rootDir, 'public', 'images', 'profile.JPG');
  const outputPath = path.join(rootDir, 'public', 'resume.pdf');
  const tempHtmlPath = path.join(rootDir, 'resume_render_temp.html');

  if (!fs.existsSync(photoPath)) {
    throw new Error(`Foto não encontrada em: ${photoPath}`);
  }

  // 1. Converter foto para Base64
  const photoBase64 = `data:image/jpeg;base64,${fs.readFileSync(photoPath).toString('base64')}`;
  console.log('✅ Foto de perfil carregada e codificada em Base64.');

  // 2. Gerar QR Codes estilizados em alta resolução (DataURL)
  const portfolioUrl = 'https://jefersontave.vercel.app/';
  const whatsappUrl = 'https://wa.me/5585981311975?text=Ol%C3%A1%20Jeferson!%20Vi%20seu%20curr%C3%ADculo%20e%20gostaria%20de%20conversar.';
  
  const qrPortfolioBase64 = await QRCode.toDataURL(portfolioUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 250,
    color: {
      dark: '#00F2FE', // Ciano futurista
      light: '#0D131F' // Fundo do card
    }
  });

  const qrWhatsAppBase64 = await QRCode.toDataURL(whatsappUrl, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 250,
    color: {
      dark: '#10B981', // Verde esmeralda para WhatsApp
      light: '#0D131F' // Fundo do card
    }
  });

  console.log('✅ QR Codes (Portfólio & WhatsApp) gerados com sucesso.');

  // 3. Montar template HTML & CSS moderno (A4, 2 páginas perfeitas)
  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Currículo - Jeferson Taveira | Engenheiro de Software Full Stack & IA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 210mm;
      margin: 0;
      padding: 0;
      background-color: #080B11;
      color: #E2E8F0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      font-size: 9pt;
      line-height: 1.4;
      -webkit-font-smoothing: antialiased;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    .page {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      box-sizing: border-box;
      page-break-after: always;
      page-break-inside: avoid;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: row;
      background-color: #080B11;
    }

    /* Coluna Lateral (Sidebar - 32%) */
    .sidebar {
      width: 68mm;
      height: 297mm;
      background: linear-gradient(180deg, #0B111E 0%, #080D17 100%);
      border-right: 1px solid rgba(255, 255, 255, 0.07);
      padding: 12mm 6mm 10mm 7mm;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 2;
    }

    /* Coluna Principal (Conteúdo - 68%) */
    .main {
      width: 142mm;
      height: 297mm;
      background-color: #080B11;
      padding: 12mm 10mm 10mm 9mm;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 2;
    }

    /* Elementos Decorativos de Fundo */
    .glow-cyan {
      position: absolute;
      top: -30mm;
      right: -30mm;
      width: 100mm;
      height: 100mm;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 1;
    }
    .glow-violet {
      position: absolute;
      bottom: -30mm;
      left: -30mm;
      width: 100mm;
      height: 100mm;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 1;
    }

    /* Foto de Perfil */
    .profile-photo-wrapper {
      position: relative;
      width: 36mm;
      height: 36mm;
      margin: 0 auto 3.5mm auto;
      border-radius: 50%;
      padding: 2.5px;
      background: linear-gradient(135deg, #00F2FE 0%, #A855F7 60%, #10B981 100%);
      box-shadow: 0 0 20px rgba(0, 242, 254, 0.25);
    }
    .profile-photo {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: top center;
      display: block;
      background-color: #0F172A;
    }

    /* Status Badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10B981;
      font-size: 6.8pt;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
      margin: 0 auto 3.5mm auto;
      align-self: center;
    }
    .pulse-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #10B981;
      display: inline-block;
    }

    /* Sidebar Headings */
    .sidebar-title {
      font-size: 7.2pt;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #94A3B8;
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 2.5mm;
      display: flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      padding-bottom: 1.2mm;
    }
    .sidebar-title::before {
      content: "";
      width: 3px;
      height: 10px;
      background: #00F2FE;
      border-radius: 2px;
    }
    .sidebar-title.violet::before {
      background: #A855F7;
    }
    .sidebar-title.emerald::before {
      background: #10B981;
    }

    /* Contatos na Sidebar */
    .contact-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1.8mm;
      margin-bottom: 3.5mm;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 7.2pt;
      color: #CBD5E1;
    }
    .contact-item a:hover {
      color: #00F2FE;
      text-decoration: underline;
    }
    .contact-icon {
      width: 13px;
      height: 13px;
      flex-shrink: 0;
      color: #00F2FE;
    }

    /* Box de QR Code */
    .qr-card {
      background: #0D131F;
      border: 1px solid rgba(0, 242, 254, 0.25);
      border-radius: 10px;
      padding: 2.5mm;
      text-align: center;
      margin-bottom: 3.5mm;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    }
    .qr-card.emerald-border {
      border-color: rgba(16, 185, 129, 0.35);
    }
    .qr-image {
      width: 30mm;
      height: 30mm;
      border-radius: 6px;
      display: block;
      margin: 0 auto 1.5mm auto;
    }
    .qr-label {
      font-size: 7pt;
      font-weight: 700;
      color: #F8FAFC;
      letter-spacing: 0.02em;
      margin-bottom: 1mm;
    }
    .qr-sub {
      font-size: 6pt;
      color: #94A3B8;
      font-family: 'JetBrains Mono', monospace;
    }

    /* Tech Skills Pills */
    .skills-group {
      margin-bottom: 4mm;
    }
    .skills-group-label {
      font-size: 7pt;
      color: #38BDF8;
      font-weight: 600;
      margin-bottom: 1.5mm;
      font-family: 'JetBrains Mono', monospace;
    }
    .pills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
    }
    .tech-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.09);
      color: #E2E8F0;
      font-size: 6.5pt;
      font-family: 'JetBrains Mono', monospace;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .tech-pill.highlight {
      background: rgba(0, 242, 254, 0.08);
      border-color: rgba(0, 242, 254, 0.3);
      color: #00F2FE;
      font-weight: 600;
    }
    .tech-pill.violet-pill {
      background: rgba(168, 85, 247, 0.08);
      border-color: rgba(168, 85, 247, 0.3);
      color: #C084FC;
      font-weight: 600;
    }

    /* Coluna Principal - Cabeçalho */
    .header {
      margin-bottom: 5mm;
    }
    .name-title {
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #FFFFFF;
      line-height: 1.1;
      margin-bottom: 1.5mm;
    }
    .name-gradient {
      background: linear-gradient(90deg, #FFFFFF 0%, #E2E8F0 60%, #00F2FE 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .role-title {
      font-size: 11pt;
      font-weight: 600;
      color: #00F2FE;
      letter-spacing: -0.01em;
      margin-bottom: 2mm;
    }
    .header-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .h-badge {
      font-size: 7pt;
      font-family: 'JetBrains Mono', monospace;
      color: #94A3B8;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 2px 7px;
      border-radius: 12px;
    }

    /* Seções Principais */
    .section-title {
      font-size: 9.5pt;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 3mm;
      padding-bottom: 1.5mm;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      font-family: 'JetBrains Mono', monospace;
    }
    .section-icon {
      color: #00F2FE;
      width: 14px;
      height: 14px;
    }
    .section-title.violet .section-icon {
      color: #A855F7;
    }

    /* Resumo Profissional */
    .summary-text {
      font-size: 8pt;
      color: #CBD5E1;
      line-height: 1.5;
      margin-bottom: 4.5mm;
      text-align: justify;
    }

    /* Grid de Métricas de Engenharia */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2.5mm;
      margin-bottom: 5mm;
    }
    .metric-card {
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 8px;
      padding: 2.5mm 2mm;
      text-align: center;
    }
    .metric-val {
      font-size: 11pt;
      font-weight: 800;
      color: #00F2FE;
      font-family: 'JetBrains Mono', monospace;
      display: block;
      margin-bottom: 0.8mm;
    }
    .metric-card.violet .metric-val {
      color: #A855F7;
    }
    .metric-card.emerald .metric-val {
      color: #10B981;
    }
    .metric-card.sky .metric-val {
      color: #38BDF8;
    }
    .metric-desc {
      font-size: 6pt;
      color: #94A3B8;
      line-height: 1.25;
      display: block;
    }

    /* Cards de Projetos de Destaque */
    .project-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 8px;
      padding: 3.5mm 4mm;
      margin-bottom: 3.5mm;
      position: relative;
    }
    .project-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 3px;
      border-radius: 8px 0 0 8px;
      background: #00F2FE;
    }
    .project-card.violet-border::before {
      background: #A855F7;
    }
    .project-card.amber-border::before {
      background: #F59E0B;
    }
    .project-card.emerald-border::before {
      background: #10B981;
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1.2mm;
    }
    .project-title {
      font-size: 9pt;
      font-weight: 700;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .project-tagline {
      font-size: 7.2pt;
      font-style: italic;
      color: #38BDF8;
      margin-bottom: 1.5mm;
    }
    .project-desc {
      font-size: 7.5pt;
      color: #CBD5E1;
      line-height: 1.45;
      margin-bottom: 2mm;
      text-align: justify;
    }
    .project-bullets {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1.2mm;
      margin-bottom: 2.2mm;
    }
    .project-bullet {
      font-size: 7.2pt;
      color: #94A3B8;
      display: flex;
      align-items: flex-start;
      gap: 5px;
      line-height: 1.35;
    }
    .bullet-arrow {
      color: #00F2FE;
      font-size: 8pt;
      line-height: 1;
      flex-shrink: 0;
      margin-top: 0.5px;
    }
    .project-card.violet-border .bullet-arrow {
      color: #A855F7;
    }
    .project-card.amber-border .bullet-arrow {
      color: #F59E0B;
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
    }
    .ptag {
      font-size: 6.2pt;
      font-family: 'JetBrains Mono', monospace;
      color: #CBD5E1;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 1.5px 5.5px;
      border-radius: 4px;
    }

    /* Pilares Arquiteturais (Página 2) */
    .pillars-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5mm;
      margin-bottom: 4mm;
    }
    .pillar-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 7px;
      padding: 2.5mm 3mm;
    }
    .pillar-title {
      font-size: 7.8pt;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 1mm;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .pillar-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00F2FE;
    }
    .pillar-dot.violet { background: #A855F7; }
    .pillar-dot.emerald { background: #10B981; }
    .pillar-dot.sky { background: #38BDF8; }
    .pillar-desc {
      font-size: 6.8pt;
      color: #94A3B8;
      line-height: 1.35;
    }

    /* Rodapé da Página */
    .page-footer {
      margin-top: auto;
      padding-top: 2.5mm;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 6.5pt;
      color: #64748B;
      font-family: 'JetBrains Mono', monospace;
    }
    .page-footer a {
      color: #38BDF8;
    }
  </style>
</head>
<body>

  <!-- ========================================== -->
  <!-- PÁGINA 1: PERFIL, FLAGSHIPS & EDGE AI      -->
  <!-- ========================================== -->
  <div class="page">
    <div class="glow-cyan"></div>
    <div class="glow-violet"></div>

    <!-- SIDEBAR PÁGINA 1 -->
    <aside class="sidebar">
      <!-- FOTO DE PERFIL DO SITE -->
      <div class="profile-photo-wrapper">
        <img src="${photoBase64}" alt="Jeferson Taveira" class="profile-photo">
      </div>

      <!-- STATUS ATIVO -->
      <div class="status-badge">
        <span class="pulse-dot"></span>
        <span>Disponível para Oportunidades</span>
      </div>

      <!-- CONTATOS DIRETOS -->
      <div class="sidebar-title">Conexões & Contato</div>
      <ul class="contact-list">
        <li class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>Fortaleza - CE, Brasil (Remoto)</span>
        </li>
        <li class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <a href="mailto:jefersontave@gmail.com">jefersontave@gmail.com</a>
        </li>
        <li class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          <a href="${whatsappUrl}">(85) 98131-1975</a>
        </li>
        <li class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          <a href="https://linkedin.com/in/jefersontaveira">in/jefersontaveira</a>
        </li>
        <li class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <a href="https://github.com/jefersontaveira">github.com/jefersontaveira</a>
        </li>
        <li class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          <a href="https://jefersontave.vercel.app/">jefersontave.vercel.app</a>
        </li>
      </ul>

      <!-- QR CODE 1: PORTFÓLIO & REPOSITÓRIOS -->
      <div class="qr-card">
        <img src="${qrPortfolioBase64}" alt="QR Code Portfólio" class="qr-image">
        <div class="qr-label">Portfólio & Demos Online</div>
        <div class="qr-sub">jefersontave.vercel.app</div>
      </div>

      <!-- COMPETÊNCIAS TÉCNICAS (HARD SKILLS) -->
      <div class="sidebar-title">Stack & Competências</div>
      
      <div class="skills-group">
        <div class="skills-group-label">IA & VISÃO COMPUTACIONAL</div>
        <div class="pills-container">
          <span class="tech-pill highlight">PyTorch</span>
          <span class="tech-pill highlight">ONNX Runtime</span>
          <span class="tech-pill">CNNs</span>
          <span class="tech-pill">Computer Vision</span>
          <span class="tech-pill">Quantização</span>
        </div>
      </div>

      <div class="skills-group">
        <div class="skills-group-label">BACK-END & ENGENHARIA</div>
        <div class="pills-container">
          <span class="tech-pill highlight">Python 3.11+</span>
          <span class="tech-pill highlight">Django 4.2 LTS</span>
          <span class="tech-pill">FastAPI</span>
          <span class="tech-pill">PostgreSQL</span>
          <span class="tech-pill">Multi-Tenant</span>
          <span class="tech-pill">Atomic Locks</span>
          <span class="tech-pill">REST APIs</span>
        </div>
      </div>

      <div class="skills-group">
        <div class="skills-group-label">FRONT-END & DEVOPS</div>
        <div class="pills-container">
          <span class="tech-pill violet-pill">Next.js 15</span>
          <span class="tech-pill violet-pill">React 19</span>
          <span class="tech-pill">TypeScript</span>
          <span class="tech-pill">Tailwind CSS</span>
          <span class="tech-pill">Docker</span>
          <span class="tech-pill">CI/CD</span>
          <span class="tech-pill">Nginx</span>
          <span class="tech-pill">Linux</span>
        </div>
      </div>

      <!-- IDIOMAS -->
      <div class="sidebar-title" style="margin-top: 2mm;">Idiomas & Comunicação</div>
      <div class="pills-container" style="margin-bottom: 3.5mm;">
        <span class="tech-pill highlight">Português (Nativo)</span>
        <span class="tech-pill highlight">Espanhol (Fluente)</span>
        <span class="tech-pill">Inglês (Técnico / Avançado)</span>
      </div>

      <!-- DIFERENCIAIS DE ATUAÇÃO -->
      <div class="sidebar-title" style="margin-top: 1mm;">Diferenciais de Atuação</div>
      <div style="font-size: 6.8pt; color: #94A3B8; line-height: 1.45;">
        <div style="margin-bottom: 1.5mm;"><strong style="color: #00F2FE;">&bull; Entrega Ponta a Ponta:</strong> Do treinamento e otimização do modelo ao deploy de microsserviços.</div>
        <div style="margin-bottom: 1.5mm;"><strong style="color: #A855F7;">&bull; Autonomia & Foco em Negócio:</strong> Foco absoluto na resolução de problemas reais e satisfação do usuário.</div>
        <div><strong style="color: #10B981;">&bull; Cultura de Qualidade:</strong> Código desacoplado, tipagem estrita e documentação clara.</div>
      </div>
    </aside>

    <!-- CONTEÚDO PRINCIPAL PÁGINA 1 -->
    <main class="main">
      <!-- CABEÇALHO -->
      <header class="header">
        <h1 class="name-title name-gradient">JEFERSON TAVEIRA</h1>
        <div class="role-title">Engenheiro de Software Full Stack & Inteligência Artificial</div>
        <div class="header-badges">
          <span class="h-badge">Arquitetura de Microsserviços</span>
          <span class="h-badge">Edge AI & Inference</span>
          <span class="h-badge">Clean Code & ACID</span>
          <span class="h-badge">FinTech & Pagamentos Pix</span>
        </div>
      </header>

      <!-- RESUMO PROFISSIONAL -->
      <section>
        <div class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Perfil & Síntese Executiva</span>
        </div>
        <p class="summary-text">
          Engenheiro de Software com foco em soluções de alto impacto: do treinamento e otimização de modelos de Machine Learning (PyTorch e ONNX no navegador) à arquitetura de microsserviços em Python (Django 4.2 LTS, FastAPI, concorrência transacional) e interfaces reativas modernas com Next.js 15 e TypeScript.
        </p>
      </section>

      <!-- MÉTRICAS DE ENGENHARIA -->
      <section>
        <div class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          <span>Métricas de Engenharia Comprovadas</span>
        </div>
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-val">94.2%</span>
            <span class="metric-desc">Acurácia CNN QuickDraw (PyTorch -> ONNX)</span>
          </div>
          <div class="metric-card sky">
            <span class="metric-val">&lt; 15ms</span>
            <span class="metric-desc">Latência de inferência no navegador (Client)</span>
          </div>
          <div class="metric-card emerald">
            <span class="metric-val">100%</span>
            <span class="metric-desc">Transações atômicas anti-overbooking</span>
          </div>
          <div class="metric-card violet">
            <span class="metric-val">Zero Downtime</span>
            <span class="metric-desc">Pipelines automatizados com Docker</span>
          </div>
        </div>
      </section>

      <!-- PROJETOS FLAGSHIP (PÁGINA 1) -->
      <section>
        <div class="section-title violet">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          <span>Projetos de Engenharia em Destaque</span>
        </div>

        <!-- PROJETO 1: QUICKDRAW ONNX VISION -->
        <div class="project-card">
          <div class="project-header">
            <div class="project-title">
              <span>Laboratório de Visão Computacional (QuickDraw CNN)</span>
            </div>
            <span class="ptag" style="color: #00F2FE; border-color: rgba(0,242,254,0.3);">PyTorch &bull; ONNX Web</span>
          </div>
          <div class="project-tagline">Inferência neural de alta performance rodando 100% no cliente sem custo de servidor</div>
          <p class="project-desc">
            Pipeline completo de Deep Learning: concepção de rede CNN em PyTorch (2 blocos Conv2D, Dropout e Softmax), treinada com o dataset QuickDraw e exportada para ONNX.
          </p>
          <ul class="project-bullets">
            <li class="project-bullet">
              <span class="bullet-arrow">&rsaquo;</span>
              <span><strong>Execução Client-Side:</strong> Execução no navegador via <code>onnxruntime-web</code>, eliminando custos de GPU na nuvem e garantindo privacidade total.</span>
            </li>
            <li class="project-bullet">
              <span class="bullet-arrow">&rsaquo;</span>
              <span><strong>Ultra Baixa Latência:</strong> Reconhecimento de 8 classes de desenhos em tempo real com pré-processamento automático e predição em menos de 15ms (94.2% de acurácia).</span>
            </li>
          </ul>
          <div class="project-tags">
            <span class="ptag">Python</span>
            <span class="ptag">PyTorch</span>
            <span class="ptag">ONNX Runtime</span>
            <span class="ptag">TypeScript</span>
            <span class="ptag">Canvas API</span>
          </div>
        </div>

        <!-- PROJETO 2: SAAS DE GESTÃO DE ARENAS -->
        <div class="project-card violet-border">
          <div class="project-header">
            <div class="project-title">
              <span>SaaS de Gestão de Arenas Esportivas (Multi-Tenant & FinTech)</span>
            </div>
            <span class="ptag" style="color: #C084FC; border-color: rgba(168,85,247,0.3);">Django 4.2 LTS &bull; Asaas Pix</span>
          </div>
          <div class="project-tagline">Plataforma escalável com motor de preços em cascata, escolinhas e checkout Pix</div>
          <p class="project-desc">
            Ecossistema para centros esportivos (Beach Tennis, Padel, Futsal) com isolamento multi-tenant por arena, portal público do atleta e conciliação bancária automatizada.
          </p>
          <ul class="project-bullets">
            <li class="project-bullet">
              <span class="bullet-arrow">&rsaquo;</span>
              <span><strong>Concorrência & ACID:</strong> Locks pessimistas no banco de dados e transações atômicas para blindar contra overbooking e race conditions em reservas simultâneas.</span>
            </li>
            <li class="project-bullet">
              <span class="bullet-arrow">&rsaquo;</span>
              <span><strong>Motor de Tarifação Dinâmico:</strong> Algoritmo de resolução de preços em cascata (Horário Nobre &gt; Dia da Semana &gt; Quadra &gt; Tarifa Padrão).</span>
            </li>
            <li class="project-bullet">
              <span class="bullet-arrow">&rsaquo;</span>
              <span><strong>Integração FinTech:</strong> Cobranças Pix instantâneas via API/Webhooks do Asaas com expiração automática em 15 minutos e split financeiro.</span>
            </li>
          </ul>
          <div class="project-tags">
            <span class="ptag">Python 3.11</span>
            <span class="ptag">Django 4.2</span>
            <span class="ptag">Multi-Tenant</span>
            <span class="ptag">Asaas API</span>
            <span class="ptag">PostgreSQL</span>
            <span class="ptag">Docker</span>
          </div>
        </div>
      </section>

      <!-- RODAPÉ PÁGINA 1 -->
      <footer class="page-footer">
        <span>Jeferson Taveira &bull; Currículo Executivo</span>
        <span>Página 1 de 2</span>
      </footer>
    </main>
  </div>

  <!-- ========================================== -->
  <!-- PÁGINA 2: PROJETOS COMERCIAIS & ENGENHARIA -->
  <!-- ========================================== -->
  <div class="page">
    <div class="glow-cyan"></div>
    <div class="glow-violet"></div>

    <!-- SIDEBAR PÁGINA 2 -->
    <aside class="sidebar">
      <!-- QR CODE 2: WHATSAPP DIRETO -->
      <div class="qr-card emerald-border">
        <img src="${qrWhatsAppBase64}" alt="QR Code WhatsApp" class="qr-image">
        <div class="qr-label" style="color: #10B981;">WhatsApp Direto</div>
        <div class="qr-sub">Converse diretamente comigo</div>
      </div>

      <!-- PILARES DE ARQUITETURA -->
      <div class="sidebar-title violet">Princípios Técnicos</div>
      <ul class="contact-list" style="margin-bottom: 3.5mm;">
        <li class="contact-item" style="font-size: 7pt;">
          <svg class="contact-icon" style="color: #A855F7;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span><strong>Clean Architecture:</strong> Desacoplamento estrito de regras de negócio.</span>
        </li>
        <li class="contact-item" style="font-size: 7pt;">
          <svg class="contact-icon" style="color: #00F2FE;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
          <span><strong>Performance:</strong> Foco obsessivo em milissegundos e baixa latência.</span>
        </li>
        <li class="contact-item" style="font-size: 7pt;">
          <svg class="contact-icon" style="color: #10B981;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span><strong>Show, Don't Tell:</strong> Demos funcionais e código aberto para inspeção.</span>
        </li>
      </ul>

      <!-- METODOLOGIA & FERRAMENTAS -->
      <div class="sidebar-title emerald">Metodologia & Ferramentas</div>
      <div class="skills-group" style="margin-bottom: 3mm;">
        <div class="pills-container">
          <span class="tech-pill highlight">Git Flow</span>
          <span class="tech-pill">CI/CD Pipelines</span>
          <span class="tech-pill">Gunicorn</span>
          <span class="tech-pill">WhiteNoise</span>
          <span class="tech-pill highlight">Docker Compose</span>
          <span class="tech-pill">PyTest</span>
          <span class="tech-pill">Vercel & Render</span>
        </div>
      </div>

      <!-- FORMAÇÃO & EDUCAÇÃO CONTÍNUA -->
      <div class="sidebar-title" style="margin-top: 1mm;">Formação & Especialização</div>
      <div style="font-size: 7pt; color: #CBD5E1; line-height: 1.4; margin-bottom: 3mm;">
        <strong style="color: #00F2FE; display: block; margin-bottom: 0.5mm;">Pós em Machine Learning</strong>
        <span>Especialização em Inteligência Artificial, redes neurais profundas, visão computacional e otimização de modelos.</span>
      </div>

      <!-- ESPECIALIZAÇÕES & PESQUISA -->
      <div class="sidebar-title" style="margin-top: 1mm;">Áreas de Especialização</div>
      <div class="pills-container" style="margin-bottom: 3mm;">
        <span class="tech-pill highlight">Pós em Machine Learning</span>
        <span class="tech-pill highlight">Computer Vision</span>
        <span class="tech-pill violet-pill">Microsserviços</span>
        <span class="tech-pill">ONNX & PyTorch</span>
        <span class="tech-pill">FinTech Integrations</span>
        <span class="tech-pill">SaaS Multi-Tenant</span>
      </div>

      <!-- LINKS OFICIAIS -->
      <div class="sidebar-title" style="margin-top: 1mm;">Canais & Repositórios</div>
      <ul class="contact-list" style="font-size: 7pt;">
        <li class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path></svg>
          <a href="https://jefersontave.vercel.app/">jefersontave.vercel.app</a>
        </li>
        <li class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <a href="https://github.com/jefersontaveira">github.com/jefersontaveira</a>
        </li>
        <li class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          <a href="https://linkedin.com/in/jefersontaveira">in/jefersontaveira</a>
        </li>
      </ul>
    </aside>

    <!-- CONTEÚDO PRINCIPAL PÁGINA 2 -->
    <main class="main">
      <!-- PROJETOS COMERCIAIS & CLIENTES REAIS -->
      <section>
        <div class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <span>Aplicações Web Comerciais em Produção</span>
        </div>

        <!-- PROJETO 3: THALLES RAYANDERSON -->
        <div class="project-card amber-border">
          <div class="project-header">
            <div class="project-title">
              <span>Thalles Rayanderson &bull; Arquitetura & Design</span>
            </div>
            <span class="ptag" style="color: #F59E0B; border-color: rgba(245,158,11,0.3);">Landing Page de Luxo &bull; Alta Conversão</span>
          </div>
          <div class="project-tagline">Presença digital sofisticada com galeria categorizada e captação direta de clientes</div>
          <p class="project-desc">
            Website para arquiteto de alto padrão. Layout elegante, catálogo dinâmico de projetos residenciais e comerciais com filtros instantâneos, captação direta via WhatsApp e carregamento veloz.
          </p>
          <div class="project-tags">
            <span class="ptag">JavaScript</span>
            <span class="ptag">HTML5 Semântico</span>
            <span class="ptag">CSS3 Grid/Flex</span>
            <span class="ptag">Filtros Client-Side</span>
            <span class="ptag">WhatsApp API</span>
          </div>
        </div>

        <!-- PROJETO 4: ROCHELL FURTON -->
        <div class="project-card" style="border-left-color: #38BDF8;">
          <div class="project-header">
            <div class="project-title">
              <span>Rochell Furton &bull; English Teacher (EdTech)</span>
            </div>
            <span class="ptag" style="color: #38BDF8; border-color: rgba(56,189,248,0.3);">i18n Multilíngue &bull; Dark/Light Mode</span>
          </div>
          <div class="project-tagline">Plataforma internacional com seletor instantâneo de idioma (EN/PT/ES) e animações fluidas</div>
          <p class="project-desc">
            Landing page corporativa para professora internacional de inglês. Sistema de internacionalização (i18n) em 3 idiomas sem recarregamento, suporte a Dark & Light Mode com LocalStorage e agendamento de aulas.
          </p>
          <div class="project-tags">
            <span class="ptag">JavaScript ES6+</span>
            <span class="ptag">i18n Engine</span>
            <span class="ptag">Dark & Light Mode</span>
            <span class="ptag">AOS Library</span>
            <span class="ptag">Mobile First</span>
          </div>
        </div>

        <!-- PROJETO 5: SÓ SE FOR AÇAÍ -->
        <div class="project-card emerald-border">
          <div class="project-header">
            <div class="project-title">
              <span>Só Se For Açaí &bull; Delivery Interativo & Wizard</span>
            </div>
            <span class="ptag" style="color: #10B981; border-color: rgba(168,85,247,0.3);">Single Page App &bull; Checkout WhatsApp</span>
          </div>
          <div class="project-tagline">Web app estilo wizard passo a passo com cálculo dinâmico de adicionais e checkout</div>
          <p class="project-desc">
            Aplicativo web interativo para delivery eliminando cardápios estáticos em PDF. Montagem do açaí em 4 etapas, totalizador em tempo real e geração de pedido formatado para o WhatsApp da loja.
          </p>
          <div class="project-tags">
            <span class="ptag">JavaScript SPA</span>
            <span class="ptag">Cardápio Digital</span>
            <span class="ptag">Cálculo Dinâmico</span>
            <span class="ptag">UX Passo a Passo</span>
            <span class="ptag">WhatsApp Checkout</span>
          </div>
        </div>
      </section>

      <!-- PILARES DE ARQUITETURA & BOAS PRÁTICAS -->
      <section style="margin-top: 1.5mm;">
        <div class="section-title violet">
          <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
          <span>Pilares Arquiteturais & Filosofia de Desenvolvimento</span>
        </div>
        <div class="pillars-grid">
          <div class="pillar-box">
            <div class="pillar-title">
              <span class="pillar-dot"></span>
              <span>Clean Code & SOLID</span>
            </div>
            <div class="pillar-desc">
              Código modular, desacoplamento de responsabilidades, tipagem estrita com TypeScript e manutenibilidade a longo prazo.
            </div>
          </div>

          <div class="pillar-box">
            <div class="pillar-title">
              <span class="pillar-dot violet"></span>
              <span>Concorrência & ACID</span>
            </div>
            <div class="pillar-desc">
              Locks transacionais no banco de dados, idempotência de webhooks financeiros e prevenção contra race conditions.
            </div>
          </div>

          <div class="pillar-box">
            <div class="pillar-title">
              <span class="pillar-dot sky"></span>
              <span>Otimização para Edge AI</span>
            </div>
            <div class="pillar-desc">
              Conversão de modelos PyTorch para ONNX, minimizando overhead de memória e transferindo inferência para o hardware do cliente.
            </div>
          </div>

          <div class="pillar-box">
            <div class="pillar-title">
              <span class="pillar-dot emerald"></span>
              <span>Resiliência & CI/CD</span>
            </div>
            <div class="pillar-desc">
              Conteinerização padronizada com Docker, automação de deploys contínuos e monitoramento preventivo com fallbacks.
            </div>
          </div>
        </div>
      </section>

      <!-- SEGURANÇA & PRONTIDÃO PARA PRODUÇÃO -->
      <section style="margin-top: 1.5mm;">
        <div class="section-title" style="border-bottom-color: rgba(16, 185, 129, 0.2);">
          <svg class="section-icon" style="color: #10B981;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>Segurança & Resiliência em Produção</span>
        </div>
        <div style="background: rgba(16, 185, 129, 0.04); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 7px; padding: 2.5mm 3.5mm; font-size: 7.2pt; color: #CBD5E1; line-height: 1.45; margin-bottom: 2mm;">
          <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 1mm;">
            <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></span>
            <strong style="color: #FFFFFF;">Padrões de Produção Enterprise:</strong>
            <span style="color: #94A3B8;">Sanitização de inputs, proteção CSRF/CORS, isolamento multi-tenant, graceful recovery e logging estruturado.</span>
          </div>
        </div>
      </section>

      <!-- DISPONIBILIDADE EXECUTIVA -->
      <div style="background: rgba(0, 242, 254, 0.04); border: 1px solid rgba(0, 242, 254, 0.25); border-radius: 8px; padding: 2mm 3.5mm; display: flex; justify-content: space-between; align-items: center; font-size: 7.2pt; color: #E2E8F0; margin-bottom: 1mm;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #00F2FE; display: inline-block;"></span>
          <span><strong>Disponibilidade:</strong> Imediata para contratação (CLT / PJ) ou projetos estratégicos de engenharia.</span>
        </div>
        <span style="font-family: 'JetBrains Mono', monospace; color: #00F2FE; font-weight: 600;">Remoto &bull; Híbrido</span>
      </div>

      <!-- RODAPÉ PÁGINA 2 -->
      <footer class="page-footer">
        <span>Jeferson Taveira &bull; <a href="https://jefersontave.vercel.app/">jefersontave.vercel.app</a> &bull; (85) 98131-1975</span>
        <span>Página 2 de 2</span>
      </footer>
    </main>
  </div>

</body>
</html>`;

  // 4. Salvar arquivo HTML temporário
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');
  console.log('✅ Arquivo HTML do currículo compilado temporariamente em:', tempHtmlPath);

  // 5. Executar Chrome headless para gerar o PDF A4 perfeito
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browserPath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log(`🖨️ Usando motor de renderização: ${browserPath}`);
  console.log('⏳ Renderizando PDF em alta resolução via Chrome/Edge Headless...');

  const { spawnSync } = require('child_process');
  const browserResult = spawnSync(browserPath, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${outputPath}`,
    `file:///${tempHtmlPath.replace(/\\/g, '/')}`
  ], { stdio: 'inherit' });

  if (browserResult.error) {
    throw browserResult.error;
  }

  // 6. Verificar se o arquivo foi criado com sucesso
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log(`🎉 SUCESSO! Currículo PDF gerado com perfeição em: ${outputPath}`);
    console.log(`📦 Tamanho do arquivo: ${(stats.size / 1024).toFixed(1)} KB`);
  } else {
    throw new Error('Falha ao gerar o arquivo PDF: o arquivo de saída não foi encontrado.');
  }

  // 7. Limpar arquivo HTML temporário
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
  console.log('✨ Processo concluído com êxito!');
}

generateResume().catch(err => {
  console.error('❌ Erro durante a geração do currículo:', err);
  process.exit(1);
});
