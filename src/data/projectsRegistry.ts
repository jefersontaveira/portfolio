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
    githubUrl: "https://github.com/jeferson-taveira/classificador_de_desenhos",
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
    tagline: "Ecossistema multi-quadras com motor anti-overbooking e concorrência transacional",
    description: 
      "Plataforma completa para gestão de centros esportivos (Beach Tennis, Padel, Futsal). Desenvolvido em Django REST Framework com PostgreSQL, autenticação JWT, controle de lock transacional para agendamentos simultâneos e dashboard financeiro em tempo real.",
    category: "fullstack-python",
    categoryLabel: "Python & Django",
    technologies: ["Python 3.12", "Django REST Framework", "PostgreSQL", "Redis", "JWT", "React", "Docker"],
    githubUrl: "https://github.com/jeferson-taveira/arena-saas",
    featured: true,
    accentColor: "#A855F7",
    interactiveType: "django-sandbox",
    stats: [
      { label: "Tempo de Resposta", value: "48ms" },
      { label: "Controle de Concorrência", value: "Pessimistic Lock" },
      { label: "Disponibilidade", value: "99.9%" },
    ],
    pythonSnippets: [
      {
        title: "services/booking.py (Django Atomic Booking)",
        language: "python",
        code: `from django.db import transaction
from rest_framework.exceptions import ValidationError
from .models import Agendamento, Quadra

@transaction.atomic
def criar_agendamento(quadra_id, data_hora_inicio, data_hora_fim, cliente):
    # Lock pessimista na quadra para evitar condição de corrida
    quadra = Quadra.objects.select_for_update().get(id=quadra_id)
    
    conflito = Agendamento.objects.filter(
        quadra=quadra,
        status='CONFIRMADO',
        data_hora_inicio__lt=data_hora_fim,
        data_hora_fim__gt=data_hora_inicio
    ).exists()
    
    if conflito:
        raise ValidationError({"error": "Horário indisponível. Conflito de agenda detectado."})
        
    return Agendamento.objects.create(
        quadra=quadra,
        cliente=cliente,
        data_hora_inicio=data_hora_inicio,
        data_hora_fim=data_hora_fim,
        status='CONFIRMADO'
    )`
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
