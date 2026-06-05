import type { AvailabilitySlot, Host, QuizQuestion, VisitRequest, VisitorQuestion } from "./types";

export const mainNavItems = [
  { label: "Solicitar visita", href: "/solicitar-visita" },
  { label: "Segurança", href: "/seguranca" },
  { label: "Consultar", href: "/consultar" },
];

export const adminNavItem = { label: "Admin", href: "/admin" };

export const utilityNavItems = [
  { label: "Dúvidas", href: "/duvidas" },
  { label: "Check-in", href: "/checkin" },
  adminNavItem,
];

export const navItems = [...mainNavItems, ...utilityNavItems];

export const initialSlots: AvailabilitySlot[] = [
  {
    id: "SLOT-1001",
    date: "2026-06-15",
    time: "09:00",
    unit: "Terminal Portuário Santos",
    area: "Operação de cais",
    typeAllowed: "Visita técnica",
    capacityTotal: 24,
    capacityUsed: 8,
    status: "Disponível",
  },
  {
    id: "SLOT-1002",
    date: "2026-06-18",
    time: "14:00",
    unit: "Centro Administrativo",
    area: "Recepção institucional",
    typeAllowed: "Visita institucional",
    capacityTotal: 16,
    capacityUsed: 16,
    status: "Lotado",
  },
  {
    id: "SLOT-1003",
    date: "2026-06-22",
    time: "10:30",
    unit: "Base de Apoio Marítimo",
    area: "Logística e segurança",
    typeAllowed: "Visita acadêmica",
    capacityTotal: 32,
    capacityUsed: 5,
    status: "Disponível",
  },
];

export const initialHosts: Host[] = [
  {
    id: "HOST-001",
    name: "Marina Costa",
    email: "marina.costa@example.com",
    phone: "13988887777",
    area: "Operação portuária",
    active: true,
  },
  {
    id: "HOST-002",
    name: "Rafael Nogueira",
    email: "rafael.nogueira@example.com",
    phone: "21977776666",
    area: "Segurança patrimonial",
    active: true,
  },
];

export const initialRequests: VisitRequest[] = [
  {
    id: "REQ-2401",
    createdAt: "2026-06-01T13:40:00.000Z",
    visitorName: "Camila Ferreira",
    visitorEmail: "camila.ferreira@example.com",
    visitorPhone: "11999998888",
    organization: "Instituto Atlântico",
    visitType: "Visita acadêmica",
    mode: "Grupo",
    visitorsCount: 18,
    slotId: "SLOT-1003",
    unit: "Base de Apoio Marítimo",
    area: "Logística e segurança",
    hostId: "HOST-002",
    status: "Pendente de aprovação",
    safetyAccepted: true,
    quizScore: 5,
    emailVisitorSent: true,
    emailHostSent: true,
    emailAdminSent: true,
    lastEmailAt: "2026-06-01T13:41:00.000Z",
  },
  {
    id: "REQ-2402",
    createdAt: "2026-06-02T16:12:00.000Z",
    visitorName: "Diego Azevedo",
    visitorEmail: "diego.azevedo@example.com",
    visitorPhone: "21999990000",
    organization: "Fornecedor Técnico",
    visitType: "Fornecedor",
    mode: "Individual",
    visitorsCount: 1,
    slotId: "SLOT-1001",
    unit: "Terminal Portuário Santos",
    area: "Operação de cais",
    hostId: "HOST-001",
    status: "Aprovada",
    safetyAccepted: true,
    quizScore: 4,
    qrToken: "TOK-2K9A-WS",
    emailVisitorSent: true,
    emailHostSent: true,
    emailAdminSent: false,
    lastEmailAt: "2026-06-02T17:05:00.000Z",
  },
];

export const initialQuestions: VisitorQuestion[] = [
  {
    id: "DUV-3001",
    createdAt: "2026-06-03T09:10:00.000Z",
    requestCode: "REQ-2401",
    name: "Juliana Prado",
    email: "juliana.prado@example.com",
    phone: "11988887777",
    topic: "Vestimenta",
    message: "Posso usar tênis fechado em uma visita acadêmica à área administrativa?",
    status: "Nova",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Qual opção representa uma vestimenta mais adequada para visita em área operacional?",
    options: [
      "Regata, shorts e chinelo.",
      "Roupa compatível com ambiente operacional e calçado fechado.",
      "Sandália aberta e bermuda.",
      "Qualquer roupa, desde que a visita seja rápida.",
    ],
    answer: "Roupa compatível com ambiente operacional e calçado fechado.",
  },
  {
    id: "q2",
    prompt: "O visitante pode circular sozinho em uma área operacional portuária?",
    options: [
      "Sim, se já tiver visitado o local antes.",
      "Sim, se estiver com pressa.",
      "Não. Deve seguir as orientações e permanecer acompanhado por responsável autorizado.",
      "Sim, desde que use o celular para se localizar.",
    ],
    answer: "Não. Deve seguir as orientações e permanecer acompanhado por responsável autorizado.",
  },
  {
    id: "q3",
    prompt: "O que o visitante deve fazer ao encontrar uma área sinalizada ou isolada?",
    options: [
      "Ignorar se não houver ninguém olhando.",
      "Entrar rapidamente.",
      "Respeitar a sinalização e não ultrapassar barreiras ou áreas isoladas.",
      "Fotografar e seguir adiante.",
    ],
    answer: "Respeitar a sinalização e não ultrapassar barreiras ou áreas isoladas.",
  },
  {
    id: "q4",
    prompt: "É permitido fotografar ou filmar áreas operacionais sem autorização?",
    options: [
      "Sim, sempre.",
      "Sim, apenas para redes sociais.",
      "Não. Registros de imagem devem depender de autorização.",
      "Sim, se não aparecerem pessoas.",
    ],
    answer: "Não. Registros de imagem devem depender de autorização.",
  },
  {
    id: "q5",
    prompt: "Para que servem EPIs em ambientes operacionais?",
    options: [
      "Apenas para identificação visual.",
      "Para proteção individual contra riscos específicos da atividade ou ambiente.",
      "Apenas para visitantes estrangeiros.",
      "Para substituir todas as regras de segurança.",
    ],
    answer: "Para proteção individual contra riscos específicos da atividade ou ambiente.",
  },
];
