export const APPS_SCRIPT_WEB_APP_URL =
  import.meta.env.VITE_APPS_SCRIPT_WEB_APP_URL ??
  "https://script.google.com/macros/s/COLE_AQUI_A_URL_DO_APPS_SCRIPT/exec";

export const isAppsScriptConfigured =
  APPS_SCRIPT_WEB_APP_URL.includes("script.google.com/macros/s/") &&
  APPS_SCRIPT_WEB_APP_URL.endsWith("/exec") &&
  !APPS_SCRIPT_WEB_APP_URL.includes("COLE_AQUI") &&
  !APPS_SCRIPT_WEB_APP_URL.includes("SEU_DEPLOYMENT_ID");
