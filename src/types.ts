export type VisitStatus =
  | "Recebida"
  | "Pendente de aprovação"
  | "Reagendamento solicitado"
  | "Remarcada"
  | "Aprovada"
  | "Reprovada"
  | "Cancelada"
  | "Check-in realizado"
  | "Check-out realizado"
  | "Concluída"
  | "Expirada";

export type SlotStatus = "Disponível" | "Lotado" | "Bloqueado" | "Cancelado";
export type VisitMode = "Individual" | "Grupo";
export type QuestionStatus = "Nova" | "Em análise" | "Respondida" | "Arquivada";

export interface AvailabilitySlot {
  id: string;
  date: string;
  time: string;
  unit: string;
  area: string;
  typeAllowed: string;
  capacityTotal: number;
  capacityUsed: number;
  status: SlotStatus;
}

export interface Host {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  active: boolean;
}

export interface VisitRequest {
  id: string;
  createdAt: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  organization: string;
  visitType: string;
  mode: VisitMode;
  visitorsCount: number;
  slotId: string;
  unit: string;
  area: string;
  hostId: string;
  status: VisitStatus;
  safetyAccepted: boolean;
  quizScore: number;
  qrToken?: string;
  checkinAt?: string;
  checkoutAt?: string;
  emailVisitorSent: boolean;
  emailHostSent: boolean;
  emailAdminSent: boolean;
  lastEmailAt?: string;
  notes?: string;
}

export interface VisitorQuestion {
  id: string;
  createdAt: string;
  requestCode: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: QuestionStatus;
  answer?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
}
