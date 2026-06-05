/* global console, fetch, process */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
const envText = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const envUrl = envText
  .split(/\r?\n/)
  .map((line) => line.trim())
  .find((line) => line.startsWith("VITE_APPS_SCRIPT_WEB_APP_URL="))
  ?.split("=")
  .slice(1)
  .join("=")
  .trim();

const endpoint = process.env.VITE_APPS_SCRIPT_WEB_APP_URL || envUrl;

if (!endpoint) {
  console.error("ERRO: VITE_APPS_SCRIPT_WEB_APP_URL nao encontrado em .env.local.");
  process.exit(1);
}

async function call(action, payload = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...payload }),
  });
  const text = await response.text();
  return { response, text };
}

function classify(response, text) {
  if (
    response.url.includes("accounts.google.com") ||
    text.includes("ServiceLogin") ||
    text.includes("Faça login") ||
    text.includes("Fazer login nas Contas do Google") ||
    response.status === 401
  ) {
    return "LOGIN";
  }

  try {
    const json = JSON.parse(text);
    return json && json.ok === true ? "JSON_OK" : "JSON_ERROR";
  } catch {
    return "HTML_OR_TEXT";
  }
}

const ping = await call("ping");
const status = classify(ping.response, ping.text);

console.log(`Endpoint: ${endpoint}`);
console.log(`HTTP: ${ping.response.status}`);
console.log(`URL final: ${ping.response.url}`);
console.log(`Resultado: ${status}`);

if (status === "LOGIN") {
  console.error("ERRO: o Web App esta exigindo login do Google. Ajuste a implantacao para 'Executar como: Eu' e 'Quem tem acesso: Qualquer pessoa'.");
  process.exit(1);
}

if (status !== "JSON_OK") {
  console.error("ERRO: o Web App nao retornou JSON valido do Apps Script.");
  console.error(ping.text.slice(0, 500));
  process.exit(1);
}

console.log("OK: Apps Script respondeu JSON no ping.");

if (process.argv.includes("--repair-settings")) {
  const repair = await call("repairSettings");
  const repairStatus = classify(repair.response, repair.text);
  console.log(`Reparo settings: ${repairStatus}`);
  console.log(repair.text.slice(0, 1000));
  if (repairStatus !== "JSON_OK") process.exit(1);
}

if (process.argv.includes("--write")) {
  const create = await call("createVisitRequest", {
    data: {
      visitorName: "Teste Codex",
      visitorEmail: "teste.codex@example.com",
      visitorPhone: "11999999999",
      organization: "Teste automatizado",
      visitType: "Visita tecnica",
      mode: "Individual",
      visitorsCount: 1,
      slotId: "SLOT-1001",
      hostId: "HOST-001",
      safetyAccepted: true,
      quizScore: 5,
      notes: "Teste automatizado de integracao",
    },
  });
  const writeStatus = classify(create.response, create.text);
  console.log(`Gravacao: ${writeStatus}`);
  console.log(create.text.slice(0, 1000));
  if (writeStatus !== "JSON_OK") process.exit(1);
  const parsed = JSON.parse(create.text);
  if (parsed?.data?.EmailAdminSent !== true) {
    console.error("ERRO: solicitacao gravada, mas EmailAdminSent nao ficou true. Verifique ADMIN_EMAIL em Settings e autorizacao do MailApp.");
    process.exit(1);
  }
}
