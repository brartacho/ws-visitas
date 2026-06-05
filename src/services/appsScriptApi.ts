import { APPS_SCRIPT_WEB_APP_URL, isAppsScriptConfigured } from "../config/integrations";

type ApiPayload = Record<string, unknown>;

type AppsScriptEnvelope<T = unknown> = {
  ok?: boolean;
  data?: T;
  error?: string;
};

const readOnlyActions = new Set([
  "ping",
  "listAvailabilitySlots",
  "listHosts",
  "listVisitRequests",
  "getVisitRequestById",
  "getDashboardMetrics",
  "listVisitorQuestions",
  "getVisitorQuestionById",
]);

async function callAppsScript<T>(action: string, payload: ApiPayload = {}): Promise<T> {
  if (!isAppsScriptConfigured) {
    if (!readOnlyActions.has(action)) {
      throw new Error("Serviço de integração não configurado.");
    }
    return {
      ok: false,
      offline: true,
      message: "Serviço de integração indisponível no momento.",
      action,
      payload,
    } as T;
  }

  const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...payload }),
  });

  const responseText = await response.text();
  const redirectedToLogin =
    response.url.includes("accounts.google.com") ||
    responseText.includes("ServiceLogin") ||
    responseText.includes("Faça login") ||
    responseText.includes("Fazer login nas Contas do Google");

  if (redirectedToLogin || response.status === 401) {
    throw new Error("Serviço de integração indisponível por restrição de acesso.");
  }

  let result: AppsScriptEnvelope;
  try {
    result = JSON.parse(responseText) as AppsScriptEnvelope;
  } catch {
    throw new Error("Serviço de integração retornou uma resposta inválida.");
  }

  if (!response.ok) {
    throw new Error(result.error || `Serviço de integração respondeu com status ${response.status}`);
  }

  if (result && typeof result === "object" && result.ok === false) {
    throw new Error(String(result.error || "Serviço de integração retornou erro."));
  }
  return result as T;
}

export const appsScriptApi = {
  ping: () => callAppsScript("ping"),
  getBootstrapData: () => callAppsScript("getBootstrapData"),
  listAvailabilitySlots: () => callAppsScript("listAvailabilitySlots"),
  createAvailabilitySlot: (data: ApiPayload) => callAppsScript("createAvailabilitySlot", { data }),
  createAvailabilitySlots: (data: ApiPayload) => callAppsScript("createAvailabilitySlots", { data }),
  updateAvailabilitySlot: (id: string, data: ApiPayload) => callAppsScript("updateAvailabilitySlot", { id, data }),
  deleteAvailabilitySlot: (id: string) => callAppsScript("deleteAvailabilitySlot", { id }),
  listHosts: () => callAppsScript("listHosts"),
  createHost: (data: ApiPayload) => callAppsScript("createHost", { data }),
  updateHost: (id: string, data: ApiPayload) => callAppsScript("updateHost", { id, data }),
  createVisitRequest: (data: ApiPayload) => callAppsScript("createVisitRequest", { data }),
  listVisitRequests: (filters: ApiPayload = {}) => callAppsScript("listVisitRequests", { filters }),
  getVisitRequestById: (id: string) => callAppsScript("getVisitRequestById", { id }),
  approveVisitRequest: (id: string, data: ApiPayload) => callAppsScript("approveVisitRequest", { id, data }),
  rejectVisitRequest: (id: string, data: ApiPayload) => callAppsScript("rejectVisitRequest", { id, data }),
  rescheduleVisitRequest: (id: string, data: ApiPayload) => callAppsScript("rescheduleVisitRequest", { id, data }),
  requestReschedule: (id: string, data: ApiPayload) => callAppsScript("requestReschedule", { id, data }),
  cancelVisitRequest: (id: string, data: ApiPayload) => callAppsScript("cancelVisitRequest", { id, data }),
  registerCheckin: (requestId: string, token: string) => callAppsScript("registerCheckin", { requestId, token }),
  registerCheckout: (requestId: string, token: string) => callAppsScript("registerCheckout", { requestId, token }),
  getDashboardMetrics: () => callAppsScript("getDashboardMetrics"),
  createVisitorQuestion: (data: ApiPayload) => callAppsScript("createVisitorQuestion", { data }),
  listVisitorQuestions: (filters: ApiPayload = {}) => callAppsScript("listVisitorQuestions", { filters }),
  getVisitorQuestionById: (id: string) => callAppsScript("getVisitorQuestionById", { id }),
  updateVisitorQuestionStatus: (id: string, data: ApiPayload) => callAppsScript("updateVisitorQuestionStatus", { id, data }),
  answerVisitorQuestion: (id: string, data: ApiPayload) => callAppsScript("answerVisitorQuestion", { id, data }),
  sendVisitorQuestionResponse: (id: string, data: ApiPayload) => callAppsScript("sendVisitorQuestionResponse", { id, data }),
};
