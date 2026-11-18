(function () {
  "use strict";

  const DATA = window.QUESTIONNAIRE_DATA;
  const CONFIG = window.QUESTIONNAIRE_CONFIG || {};

  let currentLang = CONFIG.DEFAULT_LANGUAGE || "yo";
  let answers = {};
  let isSubmitting = false;

  const dom = {};

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderText(yoText, enText, allowSubLine) {
    if (currentLang === "yo") return escapeHtml(yoText);
    if (currentLang === "en") return escapeHtml(enText);
    if (allowSubLine) {
      return (
        escapeHtml(yoText) +
        '<span class="bilingual-sub">' +
        escapeHtml(enText) +
        "</span>"
      );
    }
    return escapeHtml(yoText) + " (" + escapeHtml(enText) + ")";
  }

  function uiText(obj) {
    if (currentLang === "en") return obj.en;
    if (currentLang === "bi") return obj.yo + " / " + obj.en;
    return obj.yo;
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY || "oau_yoruba_draft");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        answers = parsed.answers || {};
        if (parsed.lang && ["yo", "bi", "en"].includes(parsed.lang)) {
          currentLang = parsed.lang;
        }
      }
    } catch (_) {
      answers = {};
    }
  }

  function saveDraft() {
    try {
      localStorage.setItem(
        CONFIG.STORAGE_KEY || "oau_yoruba_draft",
        JSON.stringify({ lang: currentLang, answers: answers })
      );
    } catch (_) {
      // Ignore storage quota issues
    }
  }

  function cacheDom() {
    dom.brandText = document.getElementById("brandText");
    dom.progressPill = document.getElementById("progressPill");
    dom.progressFill = document.getElementById("progressFill");
    dom.langButtons = document.querySelectorAll(".lang-btn");
    dom.configNotice = document.getElementById("configNotice");
    dom.heroCard = document.getElementById("heroCard");
    dom.scaleKeyCard = document.getElementById("scaleKeyCard");
    dom.form = document.getElementById("questionnaireForm");
    dom.demographicsContainer = document.getElementById("demographicsContainer");
    dom.likertContainer = document.getElementById("likertContainer");
    dom.openEndedContainer = document.getElementById("openEndedContainer");
    dom.errorSummary = document.getElementById("errorSummary");
    dom.submitBtn = document.getElementById("submitBtn");
    dom.clearBtn = document.getElementById("clearBtn");
    dom.successPanel = document.getElementById("successPanel");
    dom.footerConfidential = document.getElementById("footerConfidential");
    dom.reportLink = document.getElementById("reportLink");
  }

  function renderTopBar() {
    dom.brandText.innerHTML =
      currentLang === "en"
        ? "OAU Research Questionnaire"
        : currentLang === "bi"
        ? "Ìwé Ìbéèrè OAU • Research Questionnaire"
        : "Ìwé Ìbéèrè OAU";

    dom.langButtons.forEach((btn) => {
      const lang = btn.getAttribute("data-lang");
      btn.classList.toggle("active", lang === currentLang);
      btn.textContent = DATA.ui.langButtons[lang];
    });

    updateProgress();
  }

  function renderConfigNotice() {
    const hasUrl = Boolean((CONFIG.APPS_SCRIPT_URL || "").trim());
    if (hasUrl) {
      dom.configNotice.style.display = "none";
      return;
    }
    dom.configNotice.style.display = "block";
    dom.configNotice.innerHTML =
      "<strong>" +
      renderText(DATA.ui.notConfiguredTitle.yo, DATA.ui.notConfiguredTitle.en, false) +
      "</strong><br>" +
      renderText(DATA.ui.notConfiguredHint.yo, DATA.ui.notConfiguredHint.en, true);
  }

  function renderHeroAndScale() {
    const m = DATA.meta;
    dom.heroCard.innerHTML =
      '<p class="hero-inst">' +
      renderText(m.institution.yo, m.institution.en, true) +
      "</p>" +
      '<p class="hero-faculty">' +
      renderText(m.faculty.yo, m.faculty.en, true) +
      "</p>" +
      '<p class="hero-dept">' +
      renderText(m.department.yo, m.department.en, true) +
      "</p>" +
      '<h1 class="hero-title">' +
      renderText(m.title.yo, m.title.en, true) +
      "</h1>" +
      '<div class="intro-box">' +
      "<p><strong>" +
      renderText(m.salutation.yo, m.salutation.en, false) +
      "</strong></p>" +
      "<p>" +
      renderText(m.intro.yo, m.intro.en, true) +
      "</p>" +
      '<div class="instruction-line"><strong>' +
      renderText(m.instructionLabel.yo, m.instructionLabel.en, false) +
      "</strong> " +
      renderText(m.instruction.yo, m.instruction.en, true) +
      "</div>" +
      "</div>";

    const scaleItemsHtml = DATA.likertScale
      .map((s) => {
        const code =
          currentLang === "en"
            ? s.shortEn
            : currentLang === "bi"
            ? s.codeYo + " / " + s.shortEn
            : s.codeYo;
        const label =
          currentLang === "en"
            ? s.labelEn
            : currentLang === "bi"
            ? s.labelYo + " (" + s.labelEn + ")"
            : s.labelYo;
        return (
          '<div class="scale-key-item">' +
          '<span class="scale-key-code">' +
          escapeHtml(code) +
          "</span>" +
          '<span class="scale-key-label">' +
          escapeHtml(label) +
          "</span>" +
          "</div>"
        );
      })
      .join("");

    dom.scaleKeyCard.innerHTML =
      '<h2 class="scale-key-title">' +
      renderText(DATA.ratingKeyTitle.yo, DATA.ratingKeyTitle.en, false) +
      "</h2>" +
      '<div class="scale-key-grid">' +
      scaleItemsHtml +
      "</div>";
  }

  function renderDemographics() {
    const sec = DATA.demographicsSection;
    const isLecturer = answers.A3 === "Olùkọ́";
    if (isLecturer) {
      answers.A4 = "Kò Kàn Mí (Olùkọ́)";
    } else if (answers.A4 === "Kò Kàn Mí (Olùkọ́)") {
      delete answers.A4;
    }

    const itemsHtml = sec.items
      .map((item) => {
        const isNA =
          item.conditionalNotApplicableOn &&
          answers[item.conditionalNotApplicableOn.field] ===
            item.conditionalNotApplicableOn.equals;

        let inputHtml = "";
        if (item.type === "text") {
          const val = answers[item.id] || "";
          const placeholder =
            currentLang === "en"
              ? item.placeholder.en
              : currentLang === "bi"
              ? item.placeholder.yo + " / " + item.placeholder.en
              : item.placeholder.yo;
          inputHtml =
            '<input type="text" class="text-input" id="field_' +
            item.id +
            '" data-qid="' +
            item.id +
            '" value="' +
            escapeHtml(val) +
            '" placeholder="' +
            escapeHtml(placeholder) +
            '" autocomplete="off">';
        } else if (item.type === "radio") {
          const pills = item.options
            .map((opt) => {
              const checked = !isNA && answers[item.id] === opt.value;
              const optLabel =
                currentLang === "en"
                  ? opt.labelEn
                  : currentLang === "bi"
                  ? opt.labelYo === opt.labelEn
                    ? opt.labelYo
                    : opt.labelYo + " (" + opt.labelEn + ")"
                  : opt.labelYo;
              return (
                '<label class="radio-pill ' +
                (checked ? "selected" : "") +
                '">' +
                '<input type="radio" name="' +
                item.id +
                '" value="' +
                escapeHtml(opt.value) +
                '" ' +
                (checked ? "checked" : "") +
                " " +
                (isNA ? "disabled" : "") +
                ">" +
                "<span>" +
                escapeHtml(optLabel) +
                "</span>" +
                "</label>"
              );
            })
            .join("");

          inputHtml = '<div class="radio-group">' + pills + "</div>";
          if (isNA && item.notApplicableHint) {
            inputHtml +=
              '<div class="na-hint">' +
              renderText(
                item.notApplicableHint.yo,
                item.notApplicableHint.en,
                false
              ) +
              "</div>";
          }
        }

        return (
          '<div class="question-block ' +
          (isNA ? "disabled-block" : "") +
          '" id="wrap_' +
          item.id +
          '">' +
          '<div class="q-label">' +
          '<div><span class="q-num">' +
          item.number +
          ".</span> " +
          renderText(item.label.yo, item.label.en, true) +
          "</div>" +
          '<span class="q-badge">' +
          escapeHtml(uiText(DATA.ui.requiredBadge)) +
          "</span>" +
          "</div>" +
          inputHtml +
          "</div>"
        );
      })
      .join("");

    dom.demographicsContainer.innerHTML =
      '<section class="card">' +
      '<div class="section-header"><h2>' +
      renderText(sec.title.yo, sec.title.en, true) +
      "</h2></div>" +
      '<div class="demo-list">' +
      itemsHtml +
      "</div>" +
      "</section>";
  }

  function renderLikertSections() {
    const scaleHeaders = DATA.likertScale
      .map((s) => {
        const text =
          currentLang === "en"
            ? s.shortEn + "<br><small>" + escapeHtml(s.labelEn) + "</small>"
            : currentLang === "bi"
            ? s.shortYo +
              " / " +
              s.shortEn +
              "<br><small>" +
              escapeHtml(s.labelYo) +
              " (" +
              escapeHtml(s.labelEn) +
              ")</small>"
            : s.shortYo + "<br><small>" + escapeHtml(s.labelYo) + "</small>";
        return '<th class="col-choice">' + text + "</th>";
      })
      .join("");

    const sectionsHtml = DATA.likertSections
      .map((sec) => {
        const rowsHtml = sec.items
          .map((item) => {
            const selectedVal = answers[item.id] || "";
            const cellsHtml = DATA.likertScale
              .map((s) => {
                const isChecked = selectedVal === s.value;
                const mobileLabel =
                  currentLang === "en"
                    ? s.shortEn + " — " + s.labelEn
                    : currentLang === "bi"
                    ? s.shortYo + " — " + s.labelYo + " (" + s.labelEn + ")"
                    : s.shortYo + " — " + s.labelYo;
                return (
                  '<td class="likert-cell">' +
                  '<label class="likert-radio-label ' +
                  (isChecked ? "selected" : "") +
                  '">' +
                  '<input type="radio" name="' +
                  item.id +
                  '" value="' +
                  escapeHtml(s.value) +
                  '" ' +
                  (isChecked ? "checked" : "") +
                  ">" +
                  '<span class="likert-mobile-text">' +
                  escapeHtml(mobileLabel) +
                  "</span>" +
                  "</label>" +
                  "</td>"
                );
              })
              .join("");

            return (
              '<tr class="likert-row" id="wrap_' +
              item.id +
              '">' +
              '<td class="likert-sn">' +
              item.number +
              "</td>" +
              '<td class="likert-statement">' +
              renderText(item.yo, item.en, true) +
              "</td>" +
              cellsHtml +
              "</tr>"
            );
          })
          .join("");

        return (
          '<section class="card">' +
          '<div class="section-header"><h2>' +
          renderText(sec.title.yo, sec.title.en, true) +
          "</h2></div>" +
          '<table class="likert-table">' +
          "<thead><tr>" +
          '<th class="col-sn">S/N</th>' +
          '<th class="col-item">' +
          renderText(DATA.ui.statementHeader.yo, DATA.ui.statementHeader.en, false) +
          "</th>" +
          scaleHeaders +
          "</tr></thead>" +
          "<tbody>" +
          rowsHtml +
          "</tbody>" +
          "</table>" +
          "</section>"
        );
      })
      .join("");

    dom.likertContainer.innerHTML = sectionsHtml;
  }

  function renderOpenEndedSection() {
    const sec = DATA.openEndedSection;
    const itemsHtml = sec.items
      .map((item) => {
        const val = answers[item.id] || "";
        const placeholder =
          currentLang === "en"
            ? item.placeholder.en
            : currentLang === "bi"
            ? item.placeholder.yo + " / " + item.placeholder.en
            : item.placeholder.yo;
        return (
          '<div class="question-block" id="wrap_' +
          item.id +
          '">' +
          '<div class="q-label">' +
          '<div><span class="q-num">' +
          item.number +
          ".</span> " +
          renderText(item.yo, item.en, true) +
          "</div>" +
          '<span class="q-badge">' +
          escapeHtml(uiText(DATA.ui.optionalBadge)) +
          "</span>" +
          "</div>" +
          '<textarea class="textarea-input" id="field_' +
          item.id +
          '" data-qid="' +
          item.id +
          '" placeholder="' +
          escapeHtml(placeholder) +
          '">' +
          escapeHtml(val) +
          "</textarea>" +
          "</div>"
        );
      })
      .join("");

    dom.openEndedContainer.innerHTML =
      '<section class="card">' +
      '<div class="section-header"><h2>' +
      renderText(sec.title.yo, sec.title.en, true) +
      "</h2></div>" +
      '<p style="margin-top:0;color:var(--text-muted);font-size:0.9rem;">' +
      renderText(sec.note.yo, sec.note.en, true) +
      "</p>" +
      '<div class="demo-list">' +
      itemsHtml +
      "</div>" +
      "</section>";
  }

  function renderButtonsAndFooter() {
    dom.submitBtn.textContent = isSubmitting
      ? uiText(DATA.ui.submittingButton)
      : uiText(DATA.ui.submitButton);
    dom.clearBtn.textContent = uiText(DATA.ui.clearButton);
    dom.footerConfidential.innerHTML = renderText(
      DATA.meta.closingThanks.yo + " • " + DATA.meta.confidentiality.yo,
      DATA.meta.closingThanks.en + " • " + DATA.meta.confidentiality.en,
      true
    );
    dom.reportLink.textContent = uiText(DATA.ui.reportLink);
  }

  function getRequiredItemIds() {
    const ids = [];
    DATA.demographicsSection.items.forEach((item) => {
      if (item.required) ids.push(item.id);
    });
    DATA.likertSections.forEach((sec) => {
      sec.items.forEach((item) => ids.push(item.id));
    });
    return ids;
  }

  function countAnsweredRequired() {
    const required = getRequiredItemIds();
    let answered = 0;
    required.forEach((id) => {
      const val = (answers[id] || "").trim();
      if (val.length > 0) answered += 1;
    });
    return { answered: answered, total: required.length };
  }

  function updateProgress() {
    const stats = countAnsweredRequired();
    const pct = stats.total ? Math.round((stats.answered / stats.total) * 100) : 0;
    dom.progressPill.textContent =
      uiText(DATA.ui.progressLabel) + " " + stats.answered + " / " + stats.total;
    dom.progressFill.style.width = pct + "%";
  }

  function renderAll() {
    renderTopBar();
    renderConfigNotice();
    renderHeroAndScale();
    renderDemographics();
    renderLikertSections();
    renderOpenEndedSection();
    renderButtonsAndFooter();
    updateProgress();
  }

  function handleFormInput(e) {
    const target = e.target;
    if (!target) return;

    if (target.matches("input[type='text'], textarea")) {
      const qid = target.getAttribute("data-qid");
      if (qid) {
        answers[qid] = target.value;
        const wrap = document.getElementById("wrap_" + qid);
        if (wrap) wrap.classList.remove("invalid");
        saveDraft();
        updateProgress();
      }
      return;
    }

    if (target.matches("input[type='radio']")) {
      const name = target.name;
      answers[name] = target.value;
      const wrap = document.getElementById("wrap_" + name);
      if (wrap) wrap.classList.remove("invalid");

      // Re-render demographics when A3 changes so Q4 toggles conditional N/A state
      if (name === "A3") {
        renderDemographics();
      } else if (wrap) {
        wrap.querySelectorAll(".radio-pill, .likert-radio-label").forEach((lbl) => {
          const radio = lbl.querySelector("input[type='radio']");
          lbl.classList.toggle("selected", Boolean(radio && radio.checked));
        });
      }

      saveDraft();
      updateProgress();
    }
  }

  function validateForm() {
    document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));

    const missing = [];
    DATA.demographicsSection.items.forEach((item) => {
      if (!item.required) return;
      const val = (answers[item.id] || "").trim();
      if (!val) {
        missing.push({
          id: item.id,
          label:
            "A" +
            item.number +
            ": " +
            (currentLang === "en" ? item.label.en : item.label.yo)
        });
      }
    });

    DATA.likertSections.forEach((sec) => {
      sec.items.forEach((item) => {
        if (!answers[item.id]) {
          missing.push({
            id: item.id,
            label:
              item.id +
              ": " +
              (currentLang === "en" ? item.en : item.yo).slice(0, 65) +
              "..."
          });
        }
      });
    });

    if (missing.length === 0) {
      dom.errorSummary.classList.remove("visible");
      dom.errorSummary.innerHTML = "";
      return true;
    }

    missing.forEach((m) => {
      const wrap = document.getElementById("wrap_" + m.id);
      if (wrap) wrap.classList.add("invalid");
    });

    const listHtml = missing
      .slice(0, 8)
      .map((m) => "<li>" + escapeHtml(m.label) + "</li>")
      .join("");
    const extraCount =
      missing.length > 8
        ? "<li>... (+" + (missing.length - 8) + ")</li>"
        : "";

    dom.errorSummary.innerHTML =
      "<strong>" +
      escapeHtml(uiText(DATA.ui.missingErrorPrefix)) +
      " (" +
      missing.length +
      ")</strong><ul>" +
      listHtml +
      extraCount +
      "</ul>";
    dom.errorSummary.classList.add("visible");

    const firstEl = document.getElementById("wrap_" + missing[0].id);
    if (firstEl) {
      firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return false;
  }

  function buildCanonicalYorubaPayload() {
    const payload = {};
    DATA.demographicsSection.items.forEach((item) => {
      payload[item.id] = (answers[item.id] || "").trim();
    });
    if (payload.A3 === "Olùkọ́") {
      payload.A4 = "Kò Kàn Mí (Olùkọ́)";
    }
    DATA.likertSections.forEach((sec) => {
      sec.items.forEach((item) => {
        payload[item.id] = answers[item.id] || "";
      });
    });
    DATA.openEndedSection.items.forEach((item) => {
      payload[item.id] = (answers[item.id] || "").trim();
    });
    return payload;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    const url = (CONFIG.APPS_SCRIPT_URL || "").trim();
    const payload = buildCanonicalYorubaPayload();

    if (!url) {
      dom.errorSummary.innerHTML =
        "<strong>" +
        escapeHtml(uiText(DATA.ui.notConfiguredTitle)) +
        "</strong><p style='margin:8px 0 0'>" +
        escapeHtml(uiText(DATA.ui.notConfiguredHint)) +
        "</p><details style='margin-top:8px'><summary>Canonical Yorùbá Payload Preview</summary><pre style='white-space:pre-wrap;font-size:0.78rem;background:#fff;padding:10px;border-radius:6px;'>" +
        escapeHtml(JSON.stringify(payload, null, 2)) +
        "</pre></details>";
      dom.errorSummary.classList.add("visible");
      dom.errorSummary.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    isSubmitting = true;
    dom.submitBtn.disabled = true;
    dom.submitBtn.textContent = uiText(DATA.ui.submittingButton);

    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      CONFIG.SUBMISSION_TIMEOUT_MS || 20000
    );

    try {
      // text/plain avoids CORS preflight OPTIONS requests on Google Apps Script Web Apps
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        redirect: "follow",
        signal: controller.signal
      });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const resultText = await response.text();
      let result = null;
      try {
        result = JSON.parse(resultText);
      } catch (_) {
        result = { ok: true };
      }

      if (result && result.ok === false) {
        throw new Error(result.error || "Apps Script returned an error");
      }

      answers = {};
      try {
        localStorage.removeItem(CONFIG.STORAGE_KEY || "oau_yoruba_draft");
      } catch (_) {}

      dom.form.style.display = "none";
      dom.errorSummary.classList.remove("visible");
      dom.successPanel.innerHTML =
        '<div class="success-icon">✓</div>' +
        "<h2>" +
        renderText(DATA.ui.successTitle.yo, DATA.ui.successTitle.en, true) +
        "</h2>" +
        '<p style="color:var(--text-muted);max-width:540px;margin:0 auto 20px;">' +
        renderText(DATA.ui.successBody.yo, DATA.ui.successBody.en, true) +
        "</p>" +
        '<button type="button" class="btn btn-primary" id="anotherBtn">' +
        escapeHtml(uiText(DATA.ui.submitAnother)) +
        "</button>";
      dom.successPanel.classList.add("visible");
      dom.successPanel.scrollIntoView({ behavior: "smooth", block: "center" });

      document.getElementById("anotherBtn").addEventListener("click", () => {
        dom.successPanel.classList.remove("visible");
        dom.form.style.display = "block";
        renderAll();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    } catch (err) {
      clearTimeout(timer);
      dom.errorSummary.innerHTML =
        "<strong>" +
        escapeHtml(uiText(DATA.ui.networkError)) +
        "</strong><div style='margin-top:6px;font-size:0.82rem'>" +
        escapeHtml(err.message || String(err)) +
        "</div>";
      dom.errorSummary.classList.add("visible");
      dom.errorSummary.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      isSubmitting = false;
      dom.submitBtn.disabled = false;
      dom.submitBtn.textContent = uiText(DATA.ui.submitButton);
    }
  }

  function handleClear() {
    if (!window.confirm(uiText(DATA.ui.clearConfirm))) return;
    answers = {};
    saveDraft();
    renderAll();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindEvents() {
    dom.langButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang && lang !== currentLang) {
          currentLang = lang;
          saveDraft();
          renderAll();
        }
      });
    });

    dom.form.addEventListener("input", handleFormInput);
    dom.form.addEventListener("change", handleFormInput);
    dom.form.addEventListener("submit", handleSubmit);
    dom.clearBtn.addEventListener("click", handleClear);
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheDom();
    loadDraft();
    bindEvents();
    renderAll();
  });
})();

