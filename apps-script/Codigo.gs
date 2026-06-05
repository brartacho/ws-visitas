const SPREADSHEET_ID = "1iHCUTJSNBtdK7FSga2KXZ3PmkekVGxe7HC6U_zqN8LE";
const DEFAULT_ADMIN_EMAIL = "br.artacho@gmail.com";

const SHEETS = {
  requests: "VisitRequests",
  slots: "AvailabilitySlots",
  hosts: "Hosts",
  questions: "VisitorQuestions",
  emails: "EmailLogs",
  checkins: "Checkins",
  settings: "Settings",
};

const HEADERS = {
  VisitRequests: [
    "RequestID", "CreatedAt", "Status", "VisitorName", "VisitorEmail", "VisitorPhone",
    "Organization", "VisitType", "Mode", "VisitorsCount", "SlotID", "Unit", "Area",
    "HostID", "SafetyAccepted", "QuizScore", "QrToken", "CheckinURL",
    "EmailVisitorSent", "EmailHostSent", "EmailAdminSent", "LastEmailAt", "Notes",
    "CheckinAt", "CheckoutAt"
  ],
  AvailabilitySlots: [
    "SlotID", "Date", "Time", "Unit", "Area", "TypeAllowed", "CapacityTotal",
    "CapacityUsed", "CapacityAvailable", "Status", "CreatedAt", "UpdatedAt"
  ],
  Hosts: ["HostID", "Name", "Email", "Phone", "Area", "Active", "CreatedAt", "UpdatedAt"],
  VisitorQuestions: [
    "QuestionID", "CreatedAt", "RequestCode", "Name", "Email", "Phone", "Topic",
    "Message", "Status", "Answer", "AnsweredAt"
  ],
  EmailLogs: ["EmailLogID", "CreatedAt", "EntityType", "EntityID", "Recipient", "Subject", "Status", "Error"],
  Checkins: ["CheckinID", "RequestID", "QrToken", "StatusBefore", "StatusAfter", "CheckinAt", "CheckoutAt"],
  Settings: ["Key", "Value", "Description", "UpdatedAt"],
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Gestão de Visitas")
    .addItem("Criar/atualizar abas", "setupHeaders")
    .addItem("Inserir dados exemplo", "seedDemoData")
    .addItem("Limpar dados operacionais", "clearOperationalData")
    .addItem("Reparar configuracoes", "repairSettings")
    .addToUi();
}

function doGet(e) {
  return route_(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  const body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
  return route_(body);
}

function route_(input) {
  try {
    setupHeaders();
    const action = input.action;
    const data = input.data || {};
    const id = input.id;
    const actions = {
      ping: () => ({ spreadsheetId: SPREADSHEET_ID, sheets: Object.keys(HEADERS), now: new Date().toISOString() }),
      getBootstrapData: () => getBootstrapData_(),
      listAvailabilitySlots: () => listRows_(SHEETS.slots),
      createAvailabilitySlot: () => createAvailabilitySlot(data),
      createAvailabilitySlots: () => createAvailabilitySlots(data),
      updateAvailabilitySlot: () => updateById_(SHEETS.slots, "SlotID", id, data),
      listHosts: () => listRows_(SHEETS.hosts),
      createHost: () => createHost(data),
      updateHost: () => updateById_(SHEETS.hosts, "HostID", id, data),
      createVisitRequest: () => createVisitRequest(data),
      listVisitRequests: () => listRows_(SHEETS.requests),
      getVisitRequestById: () => getById_(SHEETS.requests, "RequestID", id),
      approveVisitRequest: () => approveVisitRequest(id),
      rejectVisitRequest: () => changeRequestStatus_(id, "Reprovada"),
      cancelVisitRequest: () => changeRequestStatus_(id, "Cancelada"),
      registerCheckin: () => registerCheckin(input.requestId, input.token),
      registerCheckout: () => registerCheckout(input.requestId, input.token),
      createVisitorQuestion: () => createVisitorQuestion(data),
      listVisitorQuestions: () => listRows_(SHEETS.questions),
      updateVisitorQuestionStatus: () => updateById_(SHEETS.questions, "QuestionID", id, data),
      listSettings: () => listRows_(SHEETS.settings),
      updateSetting: () => updateSetting(data),
      repairSettings: () => repairSettings(),
    };
    if (!actions[action]) throw new Error("Acao invalida: " + action);
    return json_({ ok: true, data: actions[action]() });
  } catch (error) {
    return json_({ ok: false, error: String(error.message || error) });
  }
}

function setupHeaders() {
  const ss = spreadsheet_();
  Object.keys(HEADERS).forEach((sheetName) => {
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    const headers = HEADERS[sheetName];
    const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (current.join("|") !== headers.join("|")) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
  });
  ensureSetting_("ADMIN_EMAIL", DEFAULT_ADMIN_EMAIL, "E-mail interno para cópia das solicitações.");
  ensureSetting_("PUBLIC_APP_URL", "https://visitas.artacho.dev/checkin", "URL pública usada nos links de check-in.");
}

function seedDemoData() {
  setupHeaders();
  seedRow_(SHEETS.slots, "SlotID", {
    SlotID: "SLOT-1001",
    Date: "2026-06-15",
    Time: "09:00",
    Unit: "Terminal Portuário Santos",
    Area: "Operação de cais",
    TypeAllowed: "Visita técnica",
    CapacityTotal: 24,
    CapacityUsed: 8,
    CapacityAvailable: 16,
    Status: "Disponível",
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  });
  seedRow_(SHEETS.slots, "SlotID", {
    SlotID: "SLOT-1003",
    Date: "2026-06-22",
    Time: "10:30",
    Unit: "Base de Apoio Marítimo",
    Area: "Logística e segurança",
    TypeAllowed: "Visita acadêmica",
    CapacityTotal: 32,
    CapacityUsed: 5,
    CapacityAvailable: 27,
    Status: "Disponível",
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  });
  seedRow_(SHEETS.hosts, "HostID", {
    HostID: "HOST-001",
    Name: "Marina Costa",
    Email: "marina.costa@example.com",
    Phone: "5513988887777",
    Area: "Operação portuária",
    Active: true,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  });
  seedRow_(SHEETS.hosts, "HostID", {
    HostID: "HOST-002",
    Name: "Rafael Nogueira",
    Email: "rafael.nogueira@example.com",
    Phone: "5521977776666",
    Area: "Segurança patrimonial",
    Active: true,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  });
}

function clearOperationalData() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    "Limpar dados operacionais",
    "Isso vai apagar os registros das abas de visitas, slots, hosts, dúvidas, e-mails e check-ins. As configurações e os cabeçalhos serão mantidos. Deseja continuar?",
    ui.ButtonSet.YES_NO,
  );
  if (response !== ui.Button.YES) return;

  const ss = spreadsheet_();
  [
    SHEETS.requests,
    SHEETS.slots,
    SHEETS.hosts,
    SHEETS.questions,
    SHEETS.emails,
    SHEETS.checkins,
  ].forEach((sheetName) => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    if (lastRow > 1 && lastColumn > 0) {
      sheet.getRange(2, 1, lastRow - 1, lastColumn).clearContent();
    }
  });

  ui.alert("Pronto", "Os dados operacionais foram limpos. As configurações permaneceram intactas.", ui.ButtonSet.OK);
}

function getBootstrapData_() {
  return {
    spreadsheetId: SPREADSHEET_ID,
    now: new Date().toISOString(),
    slots: listRows_(SHEETS.slots),
    hosts: listRows_(SHEETS.hosts),
    requests: listRows_(SHEETS.requests),
    questions: listRows_(SHEETS.questions),
    settings: listRows_(SHEETS.settings),
  };
}

function createAvailabilitySlot(data) {
  const row = buildAvailabilitySlotRow_(data, {
    date: read_(data, "date", "Date"),
    time: read_(data, "time", "Time"),
  });
  if (slotExists_(row.Date, row.Time)) {
    throw new Error("Slot já existe para esta data e horário.");
  }
  appendRow_(SHEETS.slots, row);
  return row;
}

function createAvailabilitySlots(data) {
  const plan = normalizeAvailabilityPlan_(data);
  const created = [];
  const skipped = [];
  plan.dates.forEach((date) => {
    plan.times.forEach((time) => {
      if (slotExists_(date, time)) {
        skipped.push({ date: date, time: time });
        return;
      }
      const row = buildAvailabilitySlotRow_(data, { date: date, time: time });
      appendRow_(SHEETS.slots, row);
      created.push(row);
    });
  });
  return { created: created, skipped: skipped };
}

function buildAvailabilitySlotRow_(data, overrides) {
  const now = new Date().toISOString();
  const total = Number(read_(data, "capacityTotal", "CapacityTotal") || 0);
  const date = overrides && overrides.date ? overrides.date : read_(data, "date", "Date");
  const time = overrides && overrides.time ? overrides.time : read_(data, "time", "Time");
  const unit = read_(data, "unit", "Unit");
  const area = read_(data, "area", "Area");
  const typeAllowed = read_(data, "typeAllowed", "TypeAllowed") || "Visita técnica";
  if (!date || !time || total <= 0) throw new Error("Informe data, horario e capacidade.");
  return {
    SlotID: makeId_("SLOT"),
    Date: date,
    Time: time,
    Unit: unit,
    Area: area,
    TypeAllowed: typeAllowed,
    CapacityTotal: total,
    CapacityUsed: Number(read_(data, "capacityUsed", "CapacityUsed") || 0),
    CapacityAvailable: total,
    Status: read_(data, "status", "Status") || "Disponível",
    CreatedAt: now,
    UpdatedAt: now,
  };
}

function normalizeAvailabilityPlan_(data) {
  const explicitDates = normalizeDateList_(read_(data, "dates", "Dates"));
  const startDate = read_(data, "startDate", "StartDate");
  const endDate = read_(data, "endDate", "EndDate") || startDate;
  const startTime = read_(data, "startTime", "StartTime");
  const endTime = read_(data, "endTime", "EndTime") || startTime;
  const intervalMinutes = Number(read_(data, "intervalMinutes", "IntervalMinutes") || 60);
  const weekdays = normalizeWeekdays_(read_(data, "weekdays", "Weekdays"));
  const unit = read_(data, "unit", "Unit");
  const area = read_(data, "area", "Area");
  const typeAllowed = read_(data, "typeAllowed", "TypeAllowed") || "Visita técnica";

  if (!explicitDates.length && (!startDate || !endDate)) throw new Error("Informe a data inicial e final.");
  if (!startTime || !endTime) throw new Error("Informe o horário inicial e final.");
  if (intervalMinutes <= 0) throw new Error("O intervalo precisa ser maior que zero.");
  if (!unit || !area) throw new Error("Informe unidade e área.");

  const dates = explicitDates.length
    ? Array.from(new Set(explicitDates)).sort()
    : (function () {
        if (!weekdays.length) throw new Error("Selecione ao menos um dia da semana.");
        const rangeDates = [];
        const cursor = new Date(startDate + "T00:00:00");
        const finalDate = new Date(endDate + "T00:00:00");
        if (cursor > finalDate) throw new Error("A data final deve ser igual ou posterior à data inicial.");
        while (cursor <= finalDate) {
          if (weekdays.indexOf(cursor.getDay()) >= 0) {
            rangeDates.push(Utilities.formatDate(cursor, Session.getScriptTimeZone(), "yyyy-MM-dd"));
          }
          cursor.setDate(cursor.getDate() + 1);
        }
        return rangeDates;
      })();

  if (!dates.length) throw new Error("Selecione ao menos uma data para gerar a agenda.");

  if (explicitDates.length) {
    dates.forEach((date) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
        throw new Error("Selecione apenas datas válidas no calendário.");
      }
    });
  }

  const times = generateTimes_(startTime, endTime, intervalMinutes);
  if (!times.length) throw new Error("Nenhum horário válido foi gerado.");

  return {
    dates: dates,
    times: times,
    unit: unit,
    area: area,
    typeAllowed: typeAllowed,
  };
}

function normalizeDateList_(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item));
  }
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item));
}

function generateTimes_(startTime, endTime, intervalMinutes) {
  const start = timeToMinutes_(startTime);
  const end = timeToMinutes_(endTime);
  if (start > end) throw new Error("O horário final deve ser igual ou posterior ao inicial.");
  const times = [];
  for (let current = start; current <= end; current += intervalMinutes) {
    times.push(minutesToTime_(current));
  }
  return times;
}

function timeToMinutes_(time) {
  const parts = String(time || "").split(":");
  if (parts.length < 2) throw new Error("Horário inválido.");
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) throw new Error("Horário inválido.");
  return hours * 60 + minutes;
}

function minutesToTime_(minutes) {
  const normalized = Math.max(0, Number(minutes));
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return String(hours).padStart(2, "0") + ":" + String(mins).padStart(2, "0");
}

function normalizeWeekdays_(value) {
  if (Array.isArray(value)) {
    return value.map((item) => Number(item)).filter((item) => item >= 0 && item <= 6);
  }
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => item >= 0 && item <= 6);
}

function slotExists_(date, time) {
  return listRows_(SHEETS.slots).some((slot) => {
    return String(slot.Date) === String(date) &&
      normalizeSlotTime_(slot.Time) === normalizeSlotTime_(time);
  });
}

function normalizeSlotTime_(time) {
  return String(time || "").slice(0, 5);
}

function createHost(data) {
  const now = new Date().toISOString();
  const email = read_(data, "email", "Email");
  if (!isValidEmail_(email)) throw new Error("E-mail do host inválido.");
  const row = {
    HostID: makeId_("HOST"),
    Name: read_(data, "name", "Name"),
    Email: email,
    Phone: normalizePhone_(read_(data, "phone", "Phone")),
    Area: read_(data, "area", "Area"),
    Active: true,
    CreatedAt: now,
    UpdatedAt: now,
  };
  appendRow_(SHEETS.hosts, row);
  return row;
}

function createVisitRequest(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const slot = getById_(SHEETS.slots, "SlotID", read_(data, "slotId", "SlotID"));
    if (!slot) throw new Error("Slot não encontrado.");
    if (slot.Status !== "Disponivel" && slot.Status !== "Disponível") throw new Error("Slot indisponível.");

    const visitorsCount = Number(read_(data, "visitorsCount", "VisitorsCount") || 1);
    if (Number(slot.CapacityAvailable) < visitorsCount) throw new Error("Capacidade insuficiente.");

    const requestId = makeId_("REQ");
    const row = {
      RequestID: requestId,
      CreatedAt: new Date().toISOString(),
      Status: "Recebida",
      VisitorName: read_(data, "visitorName", "VisitorName"),
      VisitorEmail: read_(data, "visitorEmail", "VisitorEmail"),
      VisitorPhone: normalizePhone_(read_(data, "visitorPhone", "VisitorPhone")),
      Organization: read_(data, "organization", "Organization"),
      VisitType: read_(data, "visitType", "VisitType"),
      Mode: read_(data, "mode", "Mode"),
      VisitorsCount: visitorsCount,
      SlotID: slot.SlotID,
      Unit: slot.Unit,
      Area: slot.Area,
      HostID: read_(data, "hostId", "HostID"),
      SafetyAccepted: Boolean(read_(data, "safetyAccepted", "SafetyAccepted")),
      QuizScore: Number(read_(data, "quizScore", "QuizScore") || 0),
      QrToken: "",
      CheckinURL: "",
      EmailVisitorSent: false,
      EmailHostSent: false,
      EmailAdminSent: false,
      LastEmailAt: "",
      Notes: read_(data, "notes", "Notes"),
    };
    if (!row.VisitorName || !isValidEmail_(row.VisitorEmail)) throw new Error("Dados do visitante inválidos.");
    appendRow_(SHEETS.requests, row);
    updateSlotCapacity_(slot.SlotID, visitorsCount);
    sendRequestReceivedEmails_(row);
    return getById_(SHEETS.requests, "RequestID", requestId);
  } finally {
    lock.releaseLock();
  }
}

function approveVisitRequest(id) {
  const token = "TOK-" + Utilities.getUuid().slice(0, 8).toUpperCase();
  const checkinUrl = getWebAppBaseUrl_() + "?requestId=" + encodeURIComponent(id) + "&token=" + encodeURIComponent(token);
  const row = updateById_(SHEETS.requests, "RequestID", id, {
    Status: "Aprovada",
    QrToken: token,
    CheckinURL: checkinUrl,
    LastEmailAt: new Date().toISOString(),
  });
  sendStatusEmail_(row, "Visita aprovada");
  return row;
}

function changeRequestStatus_(id, status) {
  const current = getById_(SHEETS.requests, "RequestID", id);
  if (!current) throw new Error("Solicitação não encontrada.");
  const row = updateById_(SHEETS.requests, "RequestID", id, {
    Status: status,
    LastEmailAt: new Date().toISOString(),
  });
  if (isRequestCapacityReserved_(current.Status) && !isRequestCapacityReserved_(status)) {
    updateSlotCapacity_(current.SlotID, -Number(current.VisitorsCount || 1));
  }
  sendStatusEmail_(row, "Atualização da solicitação");
  return row;
}

function registerCheckin(requestId, token) {
  const request = validateToken_(requestId, token);
  const now = new Date().toISOString();
  appendRow_(SHEETS.checkins, {
    CheckinID: makeId_("CHK"),
    RequestID: requestId,
    QrToken: token,
    StatusBefore: request.Status,
    StatusAfter: "Check-in realizado",
    CheckinAt: now,
    CheckoutAt: "",
  });
  return updateById_(SHEETS.requests, "RequestID", requestId, { Status: "Check-in realizado", CheckinAt: now });
}

function registerCheckout(requestId, token) {
  const request = validateToken_(requestId, token);
  const now = new Date().toISOString();
  return updateById_(SHEETS.requests, "RequestID", requestId, { Status: "Check-out realizado", CheckoutAt: now });
}

function createVisitorQuestion(data) {
  const requestCode = read_(data, "requestCode", "RequestCode");
  if (!getById_(SHEETS.requests, "RequestID", requestCode)) throw new Error("Solicitação não encontrada.");
  const email = read_(data, "email", "Email");
  if (!isValidEmail_(email)) throw new Error("E-mail inválido.");
  const row = {
    QuestionID: makeId_("DUV"),
    CreatedAt: new Date().toISOString(),
    RequestCode: requestCode,
    Name: read_(data, "name", "Name"),
    Email: email,
    Phone: normalizePhone_(read_(data, "phone", "Phone")),
    Topic: read_(data, "topic", "Topic"),
    Message: read_(data, "message", "Message"),
    Status: "Nova",
    Answer: "",
    AnsweredAt: "",
  };
  appendRow_(SHEETS.questions, row);
  sendEmailSafe_(row.Email, "Dúvida recebida - " + row.RequestCode, "Recebemos sua dúvida vinculada à solicitação " + row.RequestCode + ".", "VisitorQuestion", row.QuestionID);
  return row;
}

function updateSetting(data) {
  const key = read_(data, "key", "Key");
  const value = read_(data, "value", "Value");
  const description = read_(data, "description", "Description") || "Configuração atualizada pelo Web App.";
  if (!key) throw new Error("Informe a chave da configuração.");
  const existing = getById_(SHEETS.settings, "Key", key);
  if (existing) {
    return updateById_(SHEETS.settings, "Key", key, {
      Value: value,
      Description: description,
      UpdatedAt: new Date().toISOString(),
    });
  }
  const row = { Key: key, Value: value, Description: description, UpdatedAt: new Date().toISOString() };
  appendRow_(SHEETS.settings, row);
  return row;
}

function repairSettings() {
  setupHeaders();
  updateSetting({
    key: "ADMIN_EMAIL",
    value: DEFAULT_ADMIN_EMAIL,
    description: "E-mail interno para cópia das solicitações.",
  });
  return listRows_(SHEETS.settings);
}

function validateToken_(requestId, token) {
  const request = getById_(SHEETS.requests, "RequestID", requestId);
  if (!request) throw new Error("Solicitação não encontrada.");
  if (request.QrToken !== token) throw new Error("Token inválido.");
  if (["Aprovada", "Remarcada", "Check-in realizado"].indexOf(request.Status) === -1) throw new Error("Status não permite check-in.");
  return request;
}

function updateSlotCapacity_(slotId, amount) {
  const slot = getById_(SHEETS.slots, "SlotID", slotId);
  const used = Math.max(Number(slot.CapacityUsed) + amount, 0);
  const available = Math.max(Number(slot.CapacityTotal) - used, 0);
  updateById_(SHEETS.slots, "SlotID", slotId, {
    CapacityUsed: used,
    CapacityAvailable: available,
    Status: available === 0 ? "Lotado" : "Disponível",
    UpdatedAt: new Date().toISOString(),
  });
}

function isRequestCapacityReserved_(status) {
  return [
    "Recebida",
    "Pendente de aprovação",
    "Reagendamento solicitado",
    "Remarcada",
    "Aprovada",
    "Check-in realizado",
  ].indexOf(String(status || "")) >= 0;
}

function sendRequestReceivedEmails_(request) {
  const adminEmail = getSetting_("ADMIN_EMAIL");
  const subject = "Solicitação de visita recebida - " + request.RequestID;
  const body = "Recebemos a solicitação " + request.RequestID + ". Ela será analisada pela equipe responsável.";
  const visitorSent = sendEmailSafe_(request.VisitorEmail, subject, body, "VisitRequest", request.RequestID);
  const adminSent = adminEmail ? sendEmailSafe_(adminEmail, "Nova solicitação de visita - " + request.RequestID, body, "VisitRequest", request.RequestID) : false;
  updateById_(SHEETS.requests, "RequestID", request.RequestID, {
    EmailVisitorSent: visitorSent,
    EmailHostSent: false,
    EmailAdminSent: adminSent,
    LastEmailAt: new Date().toISOString(),
  });
}

function sendStatusEmail_(request, subject) {
  const body = "Sua solicitação " + request.RequestID + " está com status: " + request.Status + ".";
  sendEmailSafe_(request.VisitorEmail, subject + " - " + request.RequestID, body, "VisitRequest", request.RequestID);
}

function sendEmailSafe_(recipient, subject, body, entityType, entityId) {
  try {
    const htmlBody = buildEmailHtml_(subject, body);
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: body + "\n\nAcompanhe sua solicitação pelo portal WS Visitas.",
      htmlBody: htmlBody,
    });
    appendEmailLog_(entityType, entityId, recipient, subject, "Enviado", "");
    return true;
  } catch (error) {
    appendEmailLog_(entityType, entityId, recipient, subject, "Erro", String(error.message || error));
    return false;
  }
}

function buildEmailHtml_(subject, body) {
  return [
    "<div style='margin:0;padding:0;background:#eef4f7;font-family:Arial,sans-serif;color:#172330'>",
    "  <div style='max-width:660px;margin:0 auto;padding:24px 12px'>",
    "    <div style='background:linear-gradient(135deg,#072d4e 0%,#0c6b7f 100%);padding:24px;border-radius:18px 18px 0 0;color:#fff'>",
    "      <div style='font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.84;margin-bottom:10px'>Wilson Sons</div>",
    "      <div style='font-size:26px;line-height:1.18;font-weight:700;margin:0'>" + escapeHtml_(subject) + "</div>",
    "      <div style='margin-top:10px;font-size:13px;opacity:.9'>Gestão de visitas corporativas</div>",
    "    </div>",
    "    <div style='background:#ffffff;border:1px solid #d5e2e8;border-top:0;border-radius:0 0 18px 18px;padding:28px'>",
    "      <div style='font-size:15px;line-height:1.7;color:#243645;margin:0 0 18px'>" + escapeHtml_(body) + "</div>",
    "      <div style='margin:20px 0 0;padding:16px 18px;background:#f7fafb;border:1px solid #dce7ec;border-radius:12px'>",
    "        <div style='font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#5f7481;margin-bottom:8px'>Próximos passos</div>",
    "        <div style='font-size:14px;line-height:1.6;color:#405466'>Acompanhe o status da solicitação pelo portal WS Visitas e siga as orientações enviadas pela equipe responsável.</div>",
    "      </div>",
    "      <div style='margin-top:18px;display:flex;flex-wrap:wrap;gap:8px'>",
    "        <span style='display:inline-block;padding:8px 10px;background:#eef4f7;border-radius:999px;font-size:12px;color:#405466'>Gestão de Visitas</span>",
    "        <span style='display:inline-block;padding:8px 10px;background:#eef4f7;border-radius:999px;font-size:12px;color:#405466'>Wilson Sons</span>",
    "      </div>",
    "      <p style='margin:18px 0 0;color:#607282;font-size:12px'>Mensagem automática. Por favor, não responda a este e-mail.</p>",
    "    </div>",
    "  </div>",
    "</div>",
  ].join("");
}

function appendEmailLog_(entityType, entityId, recipient, subject, status, error) {
  appendRow_(SHEETS.emails, {
    EmailLogID: makeId_("MAIL"),
    CreatedAt: new Date().toISOString(),
    EntityType: entityType,
    EntityID: entityId,
    Recipient: recipient,
    Subject: subject,
    Status: status,
    Error: error,
  });
}

function listRows_(sheetName) {
  const sheet = spreadsheet_().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift() || [];
  return values.filter((row) => row.join("") !== "").map((row) => rowToObject_(headers, row));
}

function getById_(sheetName, idColumn, id) {
  return listRows_(sheetName).find((row) => String(row[idColumn]) === String(id));
}

function appendRow_(sheetName, object) {
  const sheet = spreadsheet_().getSheetByName(sheetName);
  const headers = HEADERS[sheetName];
  sheet.appendRow(headers.map((header) => object[header] !== undefined ? object[header] : ""));
}

function seedRow_(sheetName, idColumn, object) {
  if (getById_(sheetName, idColumn, object[idColumn])) return;
  appendRow_(sheetName, object);
}

function updateById_(sheetName, idColumn, id, patch) {
  const sheet = spreadsheet_().getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf(idColumn);
  const normalizedPatch = normalizePatch_(patch);
  for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
    if (String(values[rowIndex][idIndex]) === String(id)) {
      Object.keys(normalizedPatch).forEach((key) => {
        const col = headers.indexOf(key);
        if (col >= 0) sheet.getRange(rowIndex + 1, col + 1).setValue(normalizedPatch[key]);
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

function normalizePatch_(patch) {
  const aliases = {
    id: "ID",
    status: "Status",
    active: "Active",
    answer: "Answer",
    answeredAt: "AnsweredAt",
    capacityUsed: "CapacityUsed",
    capacityAvailable: "CapacityAvailable",
  };
  return Object.keys(patch || {}).reduce((result, key) => {
    result[aliases[key] || key] = patch[key];
    return result;
  }, {});
}

function read_(object, camelKey, sheetKey) {
  return object && object[camelKey] !== undefined ? object[camelKey] : object ? object[sheetKey] : "";
}

function spreadsheet_() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function makeId_(prefix) {
  return prefix + "-" + Utilities.getUuid().slice(0, 8).toUpperCase();
}

function normalizePhone_(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.indexOf("55") === 0 ? digits : "55" + digits;
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function ensureSetting_(key, value, description) {
  const existing = getById_(SHEETS.settings, "Key", key);
  if (existing) {
    if (!existing.Value && value) {
      updateById_(SHEETS.settings, "Key", key, {
        Value: value,
        Description: existing.Description || description,
        UpdatedAt: new Date().toISOString(),
      });
    }
    return;
  }
  appendRow_(SHEETS.settings, { Key: key, Value: value, Description: description, UpdatedAt: new Date().toISOString() });
}

function getSetting_(key) {
  const row = getById_(SHEETS.settings, "Key", key);
  return row ? row.Value : "";
}

function getWebAppBaseUrl_() {
  return getSetting_("PUBLIC_APP_URL") || "https://visitas.artacho.dev/checkin";
}

function escapeHtml_(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function json_(object) {
  return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON);
}
