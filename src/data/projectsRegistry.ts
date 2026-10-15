export type ProjectCategory = 
  | "ia-ml" 
  | "fullstack-python" 
  | "frontend-mobile";

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
}

export interface ProjectStat {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  categoryLabel: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  accentColor: string; // ex: '#00F2FE', '#A855F7', '#F59E0B', '#38BDF8', '#EC4899'
  stats?: ProjectStat[];
  interactiveType?: "onnx-vision" | "django-sandbox" | "external";
  pythonSnippets?: CodeSnippet[];
}

export const CATEGORIES: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "Todos os Projetos" },
  { id: "ia-ml", label: "IA & Visão Computacional" },
  { id: "fullstack-python", label: "Python & Full Stack" },
  { id: "frontend-mobile", label: "Websites & Landing Pages" },
];

/**
 * REGISTRO CENTRAL DE PROJETOS DE JEFERSON TAVEIRA
 * Para adicionar novos projetos já existentes, basta incluir um novo objeto nesta lista.
 */
export const PROJECTS_REGISTRY: ProjectItem[] = [
  {
    id: "quickdraw-onnx-vision",
    title: "Laboratório de Visão Computacional (QuickDraw CNN)",
    tagline: "Inferência neural de alta performance rodando 100% no navegador via WebAssembly",
    description: 
      "Rede neural convolucional treinada em PyTorch e compilada para ONNX. O modelo é executado no próprio cliente usando onnxruntime-web com latência inferior a 15ms por predição, reconhecendo desenhos feitos à mão livre em tempo real.",
    category: "ia-ml",
    categoryLabel: "Inteligência Artificial",
    technologies: ["Python", "PyTorch", "ONNX WebAssembly", "TypeScript", "Canvas API", "CNN"],
    githubUrl: "https://github.com/jefersontaveira/classificador_de_desenhos",
    liveUrl: "/projetos/classificador-de-desenhos",
    featured: true,
    accentColor: "#00F2FE",
    interactiveType: "onnx-vision",
    stats: [
      { label: "Latência Média", value: "< 15ms" },
      { label: "Tamanho do Modelo", value: "890 KB" },
      { label: "Acurácia no Teste", value: "94.2%" },
      { label: "Custo de Servidor", value: "R$ 0,00" },
    ],
    pythonSnippets: [
      {
        title: "quickdraw_cnn.py (PyTorch Architecture)",
        language: "python",
        code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class QuickDrawCNN(nn.Module):
    def __init__(self, num_classes=8):
        super(QuickDrawCNN, self).__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.dropout1 = nn.Dropout(0.25)
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.dropout2 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(128, num_classes)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = self.dropout1(x)
        x = x.view(-1, 64 * 7 * 7)
        x = F.relu(self.fc1(x))
        x = self.dropout2(x)
        return self.fc2(x)`
      }
    ]
  },
  {
    id: "arena-saas-django",
    title: "SaaS de Gestão de Arenas Esportivas",
    tagline: "Ecossistema multi-tenant com motor de preços, gestão de escolinha e pagamentos Pix Asaas",
    description: 
      "Plataforma completa para gestão de centros esportivos (Beach Tennis, Padel, Vôlei e Futsal). Desenvolvido em Django 4.2 com arquitetura multi-tenant robusta, portal público personalizável do atleta, gestão completa de escolinhas esportivas (turmas, matrículas e mensalidades), motor dinâmico de tarifação de quadras e checkout Pix automatizado com conciliação via Asaas.",
    category: "fullstack-python",
    categoryLabel: "Python & Django",
    technologies: ["Python 3.11", "Django 4.2 LTS", "Multi-Tenant", "Asaas Pix & Webhooks", "Gestão de Escolinha", "Site Customizável", "SQLite/Postgres", "Jazzmin Admin"],
    githubUrl: "https://github.com/jefersontaveira/Sistema-de-Agenda-para-Arenas.git",
    liveUrl: "/projetos/sistema-de-agenda-para-arenas",
    featured: true,
    accentColor: "#A855F7",
    interactiveType: "django-sandbox",
    stats: [
      { label: "Tempo de Resposta", value: "28ms" },
      { label: "Arquitetura", value: "Multi-Tenant" },
      { label: "Módulo Escolinha", value: "Completo" },
      { label: "Checkout Pix", value: "Asaas Subcontas" },
    ],
    pythonSnippets: [
      {
        title: "backoffice/models.py (Motor de Preço Dinâmico)",
        language: "python",
        code: `@classmethod
def get_price_for_booking(cls, arena, court, start_datetime):
    """
    Calcula o preço da reserva verificando cascata de prioridades:
    1. Regra Específica da Quadra (Horário Nobre)
    2. Regra Geral da Arena por Dia da Semana
    3. Preço Padrão da Quadra
    4. Preço Padrão da Arena
    """
    if timezone.is_aware(start_datetime):
        start_datetime = timezone.localtime(start_datetime)

    weekday = start_datetime.weekday()
    time = start_datetime.time()

    rules = cls.objects.filter(
        arena=arena,
        days__number=weekday,
        start_time__lte=time,
        end_time__gt=time
    ).prefetch_related('days')

    court_rule = rules.filter(court=court).first()
    arena_rule = rules.filter(court__isnull=True).first()

    if court_rule:
        return court_rule.price
    elif arena_rule:
        return arena_rule.price
    elif court.price > 0:
        return court.price
    return arena.config.default_price`
      },
      {
        title: "backoffice/models.py (Prevenção Anti-Colisão Concorrente)",
        language: "python",
        code: `def clean(self):
    # Previne overbooking concorrente em tempo real
    if not self.court_id or not self.start_time or not self.end_time:
        return

    collision = Booking.objects.filter(
        court=self.court,
        status__in=['PENDING', 'CONFIRMED'],
        start_time__lt=self.end_time,
        end_time__gt=self.start_time
    ).exclude(pk=self.pk)

    if collision.exists():
        raise ValidationError("Já existe uma reserva para esta quadra neste horário!")`
      }
    ]
  },
  {
    id: "site-thalles-rayanderson",
    title: "Thalles Rayanderson • Arquitetura & Design",
    tagline: "Landing page institucional de alto padrão com galeria filtrável de projetos e captação de clientes",
    description: 
      "Website exclusivo para arquiteto de alto padrão com estética visual de luxo, tipografia clássica e moderna, catálogo categorizado de projetos residenciais e comerciais, seção de processo criativo, depoimentos e canal direto de conversão para solicitação de orçamentos via WhatsApp.",
    category: "frontend-mobile",
    categoryLabel: "Arquitetura & Luxo",
    technologies: ["JavaScript", "HTML5 Semântico", "CSS3 Avançado", "Filtros de Portfólio", "Design de Luxo", "WhatsApp API"],
    githubUrl: "https://github.com/jefersontaveira/site-Thalles-Rayanderson",
    liveUrl: "https://jefersontaveira.github.io/site-Thalles-Rayanderson/",
    featured: true,
    accentColor: "#F59E0B",
    interactiveType: "external",
    stats: [
      { label: "Estilo Visual", value: "High-End / Luxo" },
      { label: "Captação", value: "WhatsApp Direto" },
      { label: "Projetos", value: "Residencial & Comercial" },
      { label: "Experiência", value: "100% Responsivo" },
    ]
  },
  {
    id: "site-rochel-english",
    title: "Rochell Furton • English Teacher",
    tagline: "Plataforma internacional para professora de inglês com seletor multilíngue (EN/PT/ES) e Dark/Light Mode",
    description: 
      "Landing page de alta conversão para professora de inglês internacional. Possui sistema dinâmico de internacionalização (i18n) em 3 idiomas (Inglês, Português e Espanhol), alternância de tema Claro/Escuro, animações fluidas de rolagem com AOS e botão de reserva de primeira aula via WhatsApp internacional (+63 Filipinas).",
    category: "frontend-mobile",
    categoryLabel: "EdTech & Multilíngue",
    technologies: ["JavaScript ES6+", "i18n (EN/PT/ES)", "Dark / Light Mode", "AOS Animations", "CSS3 Flex/Grid", "Mobile First"],
    githubUrl: "https://github.com/jefersontaveira/site-rochel",
    liveUrl: "https://jefersontaveira.github.io/site-rochel/",
    featured: true,
    accentColor: "#38BDF8",
    interactiveType: "external",
    stats: [
      { label: "Internacionalização", value: "3 Idiomas (EN/PT/ES)" },
      { label: "Temas", value: "Dark & Light Mode" },
      { label: "Conversão", value: "Agendamento de Aulas" },
      { label: "Animações", value: "AOS Library" },
    ]
  },
  {
    id: "site-acai-delivery",
    title: "Só Se For Açaí • Pedidos Online & Cardápio Digital",
    tagline: "Web app de delivery interativo passo a passo com cálculo dinâmico de valores e checkout via WhatsApp",
    description: 
      "Aplicativo web interativo para delivery de açaí com experiência fluida estilo wizard. O cliente seleciona o tamanho do açaí, escolhe coberturas e adicionais especiais em tempo real, visualiza o subtotal atualizado instantaneamente e envia o pedido formatado com endereço direto para o WhatsApp da loja.",
    category: "frontend-mobile",
    categoryLabel: "E-Commerce & Delivery",
    technologies: ["JavaScript SPA", "Cardápio Digital", "Cálculo Dinâmico", "Checkout WhatsApp", "CSS3 Responsivo", "UX Passo a Passo"],
    githubUrl: "https://github.com/jefersontaveira/acai",
    liveUrl: "https://jefersontaveira.github.io/acai/",
    featured: true,
    accentColor: "#EC4899",
    interactiveType: "external",
    stats: [
      { label: "Experiência", value: "Wizard em 3 Etapas" },
      { label: "Totalizador", value: "Cálculo em Tempo Real" },
      { label: "Checkout", value: "WhatsApp Automatizado" },
      { label: "Público", value: "Mobile First" },
    ]
  }
];

// Funções utilitárias para consultar projetos
export function getAllProjects(): ProjectItem[] {
  return PROJECTS_REGISTRY;
}

export function getFeaturedProjects(): ProjectItem[] {
  return PROJECTS_REGISTRY.filter((p) => p.featured);
}

export function getProjectsByCategory(category: ProjectCategory | "all"): ProjectItem[] {
  if (category === "all") return PROJECTS_REGISTRY;
  return PROJECTS_REGISTRY.filter((p) => p.category === category);
}
