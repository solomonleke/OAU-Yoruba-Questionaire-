/**
 * OAU Yorùbá AI Thesis Questionnaire — Configuration
 *
 * 1. Deploy google-apps-script/Code.gs as a Web App inside your Google Sheet.
 * 2. Paste the deployed Web App URL ("https://script.google.com/macros/s/.../exec")
 *    into APPS_SCRIPT_URL below.
 * 3. (Optional) If you set REPORT_PASSCODE inside Code.gs, set
 *    REQUIRE_REPORT_PASSCODE to true here so report.html asks for it before loading data.
 */
window.QUESTIONNAIRE_CONFIG = {
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyyJ2abKVoRyxBZsqp4hgGwX7AJa1j-xvCBS1tblLjA_yjLsMAfv2P_2ly_aUn50sAJ1A/exec",
  DEFAULT_LANGUAGE: "yo", // "yo" (Yorùbá default) | "bi" (Bilingual) | "en" (English)
  REQUIRE_REPORT_PASSCODE: false,
  STORAGE_KEY: "oau_yoruba_ai_thesis_draft_v1",
  SUBMISSION_TIMEOUT_MS: 20000
};

