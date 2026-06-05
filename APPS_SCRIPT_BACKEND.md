# Backend Google Apps Script

Este arquivo contém uma base copiável para o Google Apps Script. Antes de uso real, revise permissões, regras internas, LGPD, segurança da informação e validações com as áreas responsáveis.

## Instalação

1. Crie uma planilha Google Sheets.
2. Abra Extensões > Apps Script.
3. Cole o código abaixo em `Codigo.gs`.
4. Execute `setupHeaders`.
5. Publique como Web App.
6. Copie a URL `/exec`.
7. Configure `VITE_APPS_SCRIPT_WEB_APP_URL` no frontend.

## Código

```javascript
const SHEETS = {
  requests: "VisitRequests",
  participants: "VisitParticipants",
  slots: "AvailabilitySlots",
  hosts: "Hosts",
  emails: "EmailLogs",
  audits: "AuditLogs",
  settings: "Settings",
  checkins: "Checkins",
  questions: "VisitorQuestions",
};

const HEADERS = {
  VisitRequests: [
    "RequestID", "CreatedAt", "Status", "VisitorName", "VisitorEmail", "VisitorPhone",
    "Organization", "VisitType", "Mode", "VisitorsCount", "SlotID", "Unit", "Area",
    "HostID", "SafetyAccepted", "QuizScore", "QrToken", "CheckinURL",
    "EmailVisitorSent", "EmailHostSent", "EmailAdminSent", "LastEmailAt", "Notes"
  ],
  VisitParticipants: ["ParticipantID", "RequestID", "Name", "Document", "Organization", "Notes"],
  AvailabilitySlots: [
    "SlotID", "Date", "Time", "Unit", "Area", "TypeAllowed", "CapacityTotal",
    "CapacityUsed", "CapacityAvailable", "Status", "CreatedAt", "UpdatedAt"
  ],
  Hosts: ["HostID", "Name", "Email", "Phone", "Area", "Active", "CreatedAt", "UpdatedAt"],
  VisitorQuestions: [
    "QuestionID", "CreatedAt", "Name", "Email", "Phone", "Topic", "Message",
    "Status", "Answer", "AnsweredAt"
  ],
  EmailLogs: ["EmailLogID", "CreatedAt", "EntityType", "EntityID", "Recipient", "Subject", "Status", "Error"],
  AuditLogs: ["AuditID", "CreatedAt", "Actor", "Action", "EntityType", "EntityID", "PreviousStatus", "NewStatus", "Details"],
  Checkins: ["CheckinID", "RequestID", "QrToken", "StatusBefore", "StatusAfter", "CheckinAt", "CheckoutAt", "RegisteredBy", "Notes"],
  Settings: ["Key", "Value", "Description", "UpdatedAt"],
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Gestão de Visitas")
    .addItem("Criar/atualizar cabeçalhos", "setupHeaders")
    .addItem("Enviar confirmações pendentes", "sendPendingConfirmations")
    .addItem("Atualizar métricas", "getDashboardMetrics")
    .addToUi();
}

function doGet(e) {
  return route_(e.parameter || {});
}

function doPost(e) {
  const body = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
  return route_(body);
}

function route_(input) {
  try {
    setupHeaders();
    const action = input.action;
    const data = input.data || {};
    const id = input.id;

    const actions = {
      listAvailabilitySlots: () => listRows_(SHEETS.slots),
      createAvailabilitySlot: () => createAvailabilitySlot(data),
      updateAvailabilitySlot: () => updateById_(SHEETS.slots, "SlotID", id, data),
      deleteAvailabilitySlot: () => updateById_(SHEETS.slots, "SlotID", id, { Status: "Cancelado" }),
      blockAvailabilitySlot: () => updateById_(SHEETS.slots, "SlotID", id, { Status: "Bloqueado" }),
      listHosts: () => listRows_(SHEETS.hosts),
      createHost: () => createHost(data),
      updateHost: () => updateById_(SHEETS.hosts, "HostID", id, data),
      deleteHost: () => updateById_(SHEETS.hosts, "HostID", id, { Active: false }),
      createVisitRequest: () => createVisitRequest(data),
      listVisitRequests: () => listRows_(SHEETS.requests),
      getVisitRequestById: () => getById_(SHEETS.requests, "RequestID", id || input.requestId),
      approveVisitRequest: () => approveVisitRequest(id, data),
      rejectVisitRequest: () => changeRequestStatus_(id, "Reprovada", data),
      rescheduleVisitRequest: () => rescheduleVisitRequest(id, data),
      requestReschedule: () => changeRequestStatus_(id, "Reagendamento solicitado", data),
      cancelVisitRequest: () => changeRequestStatus_(id, "Cancelada", data),
      resendEmails: () => resendEmails(id),
      generateQrCode: () => generateQrCode(id),
      validateCheckinToken: () => validateCheckinToken(input.requestId, input.token),
      registerCheckin: () => registerCheckin(input.requestId, input.token),
      registerCheckout: () => registerCheckout(input.requestId, input.token),
      getDashboardMetrics: () => getDashboardMetrics(),
      createVisitorQuestion: () => createVisitorQuestion(data),
      listVisitorQuestions: () => listRows_(SHEETS.questions),
      getVisitorQuestionById: () => getById_(SHEETS.questions, "QuestionID", id),
      updateVisitorQuestionStatus: () => updateById_(SHEETS.questions, "QuestionID", id, data),
      answerVisitorQuestion: () => answerVisitorQuestion(id, data),
      sendVisitorQuestionResponse: () => answerVisitorQuestion(id, data),
    };

    if (!actions[action]) throw new Error("Ação inválida: " + action);
    return json_({ ok: true, data: actions[action]() });
  } catch (error) {
    return json_({ ok: false, error: String(error.message || error) });
  }
}

function setupHeaders() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(HEADERS).forEach((sheetName) => {
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    const headers = HEADERS[sheetName];
    const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (current.join("") !== headers.join("")) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
  });
}

function createAvailabilitySlot(data) {
  const now = new Date().toISOString();
  const capacityTotal = Number(data.capacityTotal || data.CapacityTotal || 0);
  if (!data.date && !data.Date) throw new Error("Informe a data.");
  if (!data.time && !data.Time) throw new Error("Informe o horário.");
  if (capacityTotal <= 0) throw new Error("Capacidade deve ser maior que zero.");
  const row = {
    SlotID: makeId_("SLOT"),
    Date: data.date || data.Date,
    Time: data.time || data.Time,
    Unit: data.unit || data.Unit,
    Area: data.area || data.Area,
    TypeAllowed: data.typeAllowed || data.TypeAllowed || "Visita técnica",
    CapacityTotal: capacityTotal,
    CapacityUsed: 0,
    CapacityAvailable: capacityTotal,
    Status: "Disponível",
    CreatedAt: now,
    UpdatedAt: now,
  };
  appendRow_(SHEETS.slots, row);
  audit_("Admin", "createAvailabilitySlot", "AvailabilitySlot", row.SlotID, "", "Disponível", "");
  return row;
}

function createHost(data) {
  if (!isValidEmail_(data.email || data.Email)) throw new Error("Informe e-mail válido.");
  const now = new Date().toISOString();
  const row = {
    HostID: makeId_("HOST"),
    Name: data.name || data.Name,
    Email: data.email || data.Email,
    Phone: normalizePhone_(data.phone || data.Phone || ""),
    Area: data.area || data.Area || "",
    Active: true,
    CreatedAt: now,
    UpdatedAt: now,
  };
  appendRow_(SHEETS.hosts, row);
  audit_("Admin", "createHost", "Host", row.HostID, "", "Ativo", "");
  return row;
}

function createVisitRequest(data) {
  validateVisitRequest_(data);
  const slot = getById_(SHEETS.slots, "SlotID", data.slotId || data.SlotID);
  if (!slot) throw new Error("Slot não encontrado.");
  if (slot.Status !== "Disponível") throw new Error("Slot indisponível.");

  const visitorsCount = Number(data.visitorsCount || data.VisitorsCount || 1);
  if (Number(slot.CapacityAvailable) < visitorsCount) throw new Error("Capacidade insuficiente.");

  const now = new Date().toISOString();
  const requestId = makeId_("REQ");
  const row = {
    RequestID: requestId,
    CreatedAt: now,
    Status: "Recebida",
    VisitorName: data.visitorName || data.VisitorName,
    VisitorEmail: data.visitorEmail || data.VisitorEmail,
    VisitorPhone: normalizePhone_(data.visitorPhone || data.VisitorPhone),
    Organization: data.organization || data.Organization,
    VisitType: data.visitType || data.VisitType,
    Mode: data.mode || data.Mode,
    VisitorsCount: visitorsCount,
    SlotID: slot.SlotID,
    Unit: slot.Unit,
    Area: slot.Area,
    HostID: data.hostId || data.HostID || "",
    SafetyAccepted: true,
    QuizScore: Number(data.quizScore || data.QuizScore),
    QrToken: "",
    CheckinURL: "",
    EmailVisitorSent: false,
    EmailHostSent: false,
    EmailAdminSent: false,
    LastEmailAt: "",
    Notes: data.notes || data.Notes || "",
  };

  appendRow_(SHEETS.requests, row);
  updateSlotCapacity_(slot.SlotID, visitorsCount);
  sendRequestReceivedEmails_(row);
  audit_("Visitante", "createVisitRequest", "VisitRequest", requestId, "", "Recebida", "");
  return getById_(SHEETS.requests, "RequestID", requestId);
}

function approveVisitRequest(id, data) {
  const token = "TOK-" + Utilities.getUuid().slice(0, 8).toUpperCase();
  const checkinUrl = "https://visitas.artacho.dev/checkin?requestId=" + encodeURIComponent(id) + "&token=" + encodeURIComponent(token);
  const result = updateById_(SHEETS.requests, "RequestID", id, {
    Status: "Aprovada",
    QrToken: token,
    CheckinURL: checkinUrl,
    LastEmailAt: new Date().toISOString(),
  });
  sendStatusEmail_(result, "Visita aprovada", data && data.message);
  audit_("Admin", "approveVisitRequest", "VisitRequest", id, "", "Aprovada", "");
  return result;
}

function changeRequestStatus_(id, status, data) {
  const before = getById_(SHEETS.requests, "RequestID", id);
  if (!before) throw new Error("Solicitação não encontrada.");
  if (status === "Reprovada" || status === "Cancelada") releaseSlotCapacity_(before.SlotID, Number(before.VisitorsCount));
  const result = updateById_(SHEETS.requests, "RequestID", id, {
    Status: status,
    Notes: data && data.reason ? data.reason : before.Notes,
    LastEmailAt: new Date().toISOString(),
  });
  sendStatusEmail_(result, "Atualização da solicitação", data && data.reason);
  audit_("Admin", "changeRequestStatus", "VisitRequest", id, before.Status, status, "");
  return result;
}

function rescheduleVisitRequest(id, data) {
  const before = getById_(SHEETS.requests, "RequestID", id);
  if (!before) throw new Error("Solicitação não encontrada.");
  const newSlot = getById_(SHEETS.slots, "SlotID", data.newSlotId);
  if (!newSlot || newSlot.Status !== "Disponível") throw new Error("Novo slot indisponível.");
  if (Number(newSlot.CapacityAvailable) < Number(before.VisitorsCount)) throw new Error("Capacidade insuficiente no novo slot.");
  releaseSlotCapacity_(before.SlotID, Number(before.VisitorsCount));
  updateSlotCapacity_(newSlot.SlotID, Number(before.VisitorsCount));
  const result = updateById_(SHEETS.requests, "RequestID", id, {
    Status: "Remarcada",
    SlotID: newSlot.SlotID,
    Unit: newSlot.Unit,
    Area: newSlot.Area,
    LastEmailAt: new Date().toISOString(),
  });
  sendStatusEmail_(result, "Visita remarcada", "");
  audit_("Admin", "rescheduleVisitRequest", "VisitRequest", id, before.Status, "Remarcada", "");
  return result;
}

function generateQrCode(id) {
  return approveVisitRequest(id, {});
}

function validateCheckinToken(requestId, token) {
  const request = getById_(SHEETS.requests, "RequestID", requestId);
  if (!request) throw new Error("Solicitação não encontrada.");
  const allowed = ["Aprovada", "Remarcada", "Check-in realizado"];
  if (request.QrToken !== token) throw new Error("Token inválido.");
  if (allowed.indexOf(request.Status) === -1) throw new Error("Status não permite check-in.");
  return request;
}

function registerCheckin(requestId, token) {
  const request = validateCheckinToken(requestId, token);
  const now = new Date().toISOString();
  appendRow_(SHEETS.checkins, {
    CheckinID: makeId_("CHK"),
    RequestID: requestId,
    QrToken: token,
    StatusBefore: request.Status,
    StatusAfter: "Check-in realizado",
    CheckinAt: now,
    CheckoutAt: "",
    RegisteredBy: "Portaria",
    Notes: "",
  });
  return updateById_(SHEETS.requests, "RequestID", requestId, { Status: "Check-in realizado" });
}

function registerCheckout(requestId, token) {
  const request = validateCheckinToken(requestId, token);
  return updateById_(SHEETS.requests, "RequestID", requestId, {
    Status: "Check-out realizado",
    Notes: (request.Notes || "") + " Check-out registrado em " + new Date().toISOString(),
  });
}

function createVisitorQuestion(data) {
  if (!isValidEmail_(data.email || data.Email)) throw new Error("Informe e-mail válido.");
  const row = {
    QuestionID: makeId_("DUV"),
    CreatedAt: new Date().toISOString(),
    Name: data.name || data.Name,
    Email: data.email || data.Email,
    Phone: normalizePhone_(data.phone || data.Phone || ""),
    Topic: data.topic || data.Topic,
    Message: data.message || data.Message,
    Status: "Nova",
    Answer: "",
    AnsweredAt: "",
  };
  appendRow_(SHEETS.questions, row);
  sendEmailSafe_(row.Email, "Dúvida recebida", "Recebemos sua dúvida e ela será analisada no fluxo acadêmico demonstrativo.", "VisitorQuestion", row.QuestionID);
  return row;
}

function answerVisitorQuestion(id, data) {
  const row = updateById_(SHEETS.questions, "QuestionID", id, {
    Status: "Respondida",
    Answer: data.answer || data.Answer,
    AnsweredAt: new Date().toISOString(),
  });
  sendEmailSafe_(row.Email, "Resposta sobre sua dúvida", row.Answer, "VisitorQuestion", id);
  return row;
}

function getDashboardMetrics() {
  const requests = listRows_(SHEETS.requests);
  const slots = listRows_(SHEETS.slots);
  const questions = listRows_(SHEETS.questions);
  return {
    requests: requests.length,
    pending: requests.filter((r) => String(r.Status).indexOf("Pendente") >= 0 || r.Status === "Recebida").length,
    approved: requests.filter((r) => r.Status === "Aprovada").length,
    rejected: requests.filter((r) => r.Status === "Reprovada").length,
    checkins: requests.filter((r) => r.Status === "Check-in realizado").length,
    availableSlots: slots.filter((s) => s.Status === "Disponível").length,
    fullSlots: slots.filter((s) => s.Status === "Lotado").length,
    newQuestions: questions.filter((q) => q.Status === "Nova").length,
  };
}

function resendEmails(id) {
  const request = getById_(SHEETS.requests, "RequestID", id);
  if (!request) throw new Error("Solicitação não encontrada.");
  sendRequestReceivedEmails_(request);
  return updateById_(SHEETS.requests, "RequestID", id, { LastEmailAt: new Date().toISOString() });
}

function sendPendingConfirmations() {
  listRows_(SHEETS.requests)
    .filter((r) => r.EmailVisitorSent !== true && r.EmailVisitorSent !== "true")
    .forEach(sendRequestReceivedEmails_);
}

function validateVisitRequest_(data) {
  if (!data.visitorName && !data.VisitorName) throw new Error("Informe o nome.");
  if (!isValidEmail_(data.visitorEmail || data.VisitorEmail)) throw new Error("Informe e-mail válido.");
  if (!isValidPhone_(data.visitorPhone || data.VisitorPhone)) throw new Error("Informe WhatsApp válido.");
  if ((data.mode || data.Mode) !== "Individual" && (data.mode || data.Mode) !== "Grupo") throw new Error("Modalidade inválida.");
  if (Number(data.quizScore || data.QuizScore) < 4) throw new Error("Quiz reprovado.");
  if (!(data.safetyAccepted || data.SafetyAccepted)) throw new Error("Aceite de segurança obrigatório.");
}

function updateSlotCapacity_(slotId, amount) {
  const slot = getById_(SHEETS.slots, "SlotID", slotId);
  const used = Number(slot.CapacityUsed) + amount;
  const available = Math.max(Number(slot.CapacityTotal) - used, 0);
  return updateById_(SHEETS.slots, "SlotID", slotId, {
    CapacityUsed: used,
    CapacityAvailable: available,
    Status: available === 0 ? "Lotado" : "Disponível",
    UpdatedAt: new Date().toISOString(),
  });
}

function releaseSlotCapacity_(slotId, amount) {
  const slot = getById_(SHEETS.slots, "SlotID", slotId);
  if (!slot) return null;
  const used = Math.max(Number(slot.CapacityUsed) - amount, 0);
  return updateById_(SHEETS.slots, "SlotID", slotId, {
    CapacityUsed: used,
    CapacityAvailable: Number(slot.CapacityTotal) - used,
    Status: "Disponível",
    UpdatedAt: new Date().toISOString(),
  });
}

function sendRequestReceivedEmails_(request) {
  const subject = "Solicitação de visita recebida - " + request.RequestID;
  const body = "Recebemos sua solicitação. Ela será analisada pela equipe responsável. " +
    "Projeto desenvolvido para fins educativos na KODIE Academy. Este sistema não representa canal oficial.";
  sendEmailSafe_(request.VisitorEmail, subject, body, "VisitRequest", request.RequestID);
  return updateById_(SHEETS.requests, "RequestID", request.RequestID, {
    EmailVisitorSent: true,
    EmailHostSent: true,
    EmailAdminSent: true,
    LastEmailAt: new Date().toISOString(),
  });
}

function sendStatusEmail_(request, subject, extra) {
  const body = "Sua solicitação " + request.RequestID + " está com status: " + request.Status + ". " +
    (extra || "") + " Projeto desenvolvido para fins educativos na KODIE Academy.";
  sendEmailSafe_(request.VisitorEmail, subject, body, "VisitRequest", request.RequestID);
}

function sendEmailSafe_(recipient, subject, body, entityType, entityId) {
  try {
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: "<div style='font-family:Arial,sans-serif;line-height:1.5;color:#172330'>" +
        "<h2>" + escapeHtml_(subject) + "</h2><p>" + escapeHtml_(body) + "</p>" +
        "<p><strong>Projeto desenvolvido para fins educativos na KODIE Academy.</strong></p>" +
        "<p>Esta solução acadêmica não representa um canal oficial da Wilson Sons.</p></div>"
    });
    appendRow_(SHEETS.emails, {
      EmailLogID: makeId_("MAIL"),
      CreatedAt: new Date().toISOString(),
      EntityType: entityType,
      EntityID: entityId,
      Recipient: recipient,
      Subject: subject,
      Status: "Enviado",
      Error: "",
    });
  } catch (error) {
    appendRow_(SHEETS.emails, {
      EmailLogID: makeId_("MAIL"),
      CreatedAt: new Date().toISOString(),
      EntityType: entityType,
      EntityID: entityId,
      Recipient: recipient,
      Subject: subject,
      Status: "Erro",
      Error: String(error.message || error),
    });
  }
}

function listRows_(sheetName) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift() || [];
  return values.filter((row) => row.join("") !== "").map((row) => rowToObject_(headers, row));
}

function getById_(sheetName, idColumn, id) {
  return listRows_(sheetName).find((row) => String(row[idColumn]) === String(id));
}

function appendRow_(sheetName, object) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const headers = HEADERS[sheetName];
  sheet.appendRow(headers.map((header) => object[header] !== undefined ? object[header] : ""));
}

function updateById_(sheetName, idColumn, id, patch) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf(idColumn);
  for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
    if (String(values[rowIndex][idIndex]) === String(id)) {
      Object.keys(patch).forEach((key) => {
        const col = headers.indexOf(key);
        if (col >= 0) sheet.getRange(rowIndex + 1, col + 1).setValue(patch[key]);
      });
      return getById_(sheetName, idColumn, id);
    }
  }
  throw new Error("Registro não encontrado: " + id);
}

function rowToObject_(headers, row) {
  return headers.reduce((object, header, index) => {
    object[header] = row[index];
    return object;
  }, {});
}

function audit_(actor, action, entityType, entityId, previousStatus, newStatus, details) {
  appendRow_(SHEETS.audits, {
    AuditID: makeId_("AUD"),
    CreatedAt: new Date().toISOString(),
    Actor: actor,
    Action: action,
    EntityType: entityType,
    EntityID: entityId,
    PreviousStatus: previousStatus,
    NewStatus: newStatus,
    Details: details,
  });
}

function makeId_(prefix) {
  return prefix + "-" + Utilities.getUuid().slice(0, 8).toUpperCase();
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function normalizePhone_(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.indexOf("55") === 0 ? digits : "55" + digits;
}

function isValidPhone_(phone) {
  const digits = normalizePhone_(phone);
  return digits.length >= 12 && digits.length <= 13;
}

function escapeHtml_(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json_(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Ações Suportadas

- `listAvailabilitySlots`
- `createAvailabilitySlot`
- `updateAvailabilitySlot`
- `deleteAvailabilitySlot`
- `blockAvailabilitySlot`
- `listHosts`
- `createHost`
- `updateHost`
- `deleteHost`
- `createVisitRequest`
- `listVisitRequests`
- `getVisitRequestById`
- `approveVisitRequest`
- `rejectVisitRequest`
- `rescheduleVisitRequest`
- `requestReschedule`
- `cancelVisitRequest`
- `resendEmails`
- `generateQrCode`
- `validateCheckinToken`
- `registerCheckin`
- `registerCheckout`
- `getDashboardMetrics`
- `createVisitorQuestion`
- `listVisitorQuestions`
- `getVisitorQuestionById`
- `updateVisitorQuestionStatus`
- `answerVisitorQuestion`
- `sendVisitorQuestionResponse`
