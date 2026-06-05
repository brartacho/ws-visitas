import type { AvailabilitySlot, VisitRequest } from "./types";

export function formatDateTime(date: string, time?: string) {
  const value = time ? `${date}T${time}:00` : `${date}T00:00:00`;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: time ? "short" : undefined,
  }).format(new Date(value));
}

export function capacityAvailable(slot: AvailabilitySlot) {
  return Math.max(slot.capacityTotal - slot.capacityUsed, 0);
}

export function isSlotSelectable(slot: AvailabilitySlot, visitorsCount: number) {
  return slot.status === "Disponível" && capacityAvailable(slot) >= visitorsCount;
}

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function whatsappUrl(phone: string, message?: string) {
  const normalized = normalizePhone(phone);
  const suffix = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${normalized}${suffix}`;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string) {
  const digits = normalizePhone(phone);
  return digits.length >= 12 && digits.length <= 13;
}

export function nextId(prefix: string, currentLength: number) {
  return `${prefix}-${String(2400 + currentLength + 1).padStart(4, "0")}`;
}

export function makeQrToken(id: string) {
  return `TOK-${id.replace(/\D/g, "").slice(-4)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function checkinLink(request: VisitRequest) {
  const token = request.qrToken ?? "";
  return `https://visitas.artacho.dev/checkin?requestId=${encodeURIComponent(request.id)}&token=${encodeURIComponent(token)}`;
}

export function statusTone(status: string) {
  if (["Aprovada", "Remarcada", "Check-in realizado", "Check-out realizado", "Concluída", "Respondida", "Conectado"].includes(status)) {
    return "success";
  }
  if (["Reprovada", "Cancelada", "Expirada", "Lotado", "Bloqueado", "Offline"].includes(status)) {
    return "danger";
  }
  if (["Nova", "Recebida", "Pendente de aprovação", "Em análise", "Reagendamento solicitado", "Verificando"].includes(status)) {
    return "warning";
  }
  return "neutral";
}
