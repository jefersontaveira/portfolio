export type ProjectCategory = 
  | "ia-ml" 
  | "fullstack-python" 
  | "devops-cloud" 
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
  accentColor: string; // ex: '#00F2FE', '#A855F7', '#10B981', '#FACC15'
  stats?: ProjectStat[];
  interactiveType?: "onnx-vision" | "django-sandbox" | "devops-chaos" | "python-snippet" | "external";
  pythonSnippets?: CodeSnippet[];
}

export const CATEGORIES: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "Todos os Projetos" },
  { id: "ia-ml", label: "IA & Visão Computacional" },
  { id: "fullstack-python", label: "Python & Full Stack" },
  { id: "devops-cloud", label: "DevOps & Containers" },
  { id: "frontend-mobile", label: "Frontend & Mobile" },
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
    id: "devops-interactive-cluster",
    title: "Cluster de Microsserviços & Chaos Simulator",
    tagline: "Arquitetura resiliente com auto-recuperação, balanceamento Nginx e health-checks",
    description: 
      "Orquestração de ambiente em containers Docker com proxy reverso Nginx, aplicação Python/Django distribuída, cache Redis e banco de dados relacional. Inclui monitoramento de integridade e políticas automáticas de reinício e isolamento de rede.",
    category: "devops-cloud",
    categoryLabel: "DevOps & Infra",
    technologies: ["Docker", "Docker Compose", "Nginx", "Redis", "CI/CD GitHub Actions", "Linux"],
    githubUrl: "https://github.com/jeferson-taveira/infra-cluster",
    featured: true,
    accentColor: "#10B981",
    interactiveType: "devops-chaos",
    stats: [
      { label: "Tempo de Auto-Cura", value: "~1.8s" },
      { label: "Isolamento de Rede", value: "Bridge Segregada" },
      { label: "Builds", value: "Multi-Stage" },
    ],
    pythonSnippets: [
      {
        title: "docker-compose.yml (Health Check & Restart Policy)",
        language: "yaml",
        code: `services:
  api:
    build:
      context: .
      target: production
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8000/health/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      - internal-net`
      }
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
