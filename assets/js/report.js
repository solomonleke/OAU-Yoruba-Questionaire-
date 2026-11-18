/**
 * Strictly-Yorùbá Researcher Report & Excel/CSV Export Controller.
 * No English labels are displayed or exported in reports/spreadsheets.
 */
(function () {
  "use strict";

  const DATA = window.QUESTIONNAIRE_DATA;
  const CONFIG = window.QUESTIONNAIRE_CONFIG || {};
  const SCORE_MAP = {
    "Mo Gbà Dáadáa": 4,
    "Mo Gbà": 3,
    "N Kò Gbà": 2,
    "N Kò Gbà Rárá": 1
  };
  const LIKERT_VALUES = [
    "Mo Gbà Dáadáa",
    "Mo Gbà",
    "N Kò Gbà",
    "N Kò Gbà Rárá"
  ];

  let allRows = [];
  let isSampleData = false;
  let activeRoleFilter = "ALL";
  let currentPasscode = "";

  const dom = {};

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function cacheDom() {
    dom.statusBanner = document.getElementById("reportStatusBanner");
    dom.passcodeBox = document.getElementById("passcodeBox");
    dom.passcodeInput = document.getElementById("passcodeInput");
    dom.passcodeBtn = document.getElementById("passcodeBtn");
    dom.roleFilter = document.getElementById("roleFilter");
    dom.refreshBtn = document.getElementById("refreshBtn");
    dom.sampleBtn = document.getElementById("sampleBtn");
    dom.exportXlsxBtn = document.getElementById("exportXlsxBtn");
    dom.exportCsvBtn = document.getElementById("exportCsvBtn");
    dom.printBtn = document.getElementById("printBtn");
    dom.reportContent = document.getElementById("reportContent");
    dom.reportDate = document.getElementById("reportDate");
  }

  function setStatus(html, isWarn) {
    if (!html) {
      dom.statusBanner.style.display = "none";
      dom.statusBanner.innerHTML = "";
      return;
    }
    dom.statusBanner.style.display = "block";
    dom.statusBanner.style.borderColor = isWarn ? "#f59e0b" : "#13294b";
    dom.statusBanner.style.background = isWarn ? "#fffbeb" : "#eef3fb";
    dom.statusBanner.style.color = isWarn ? "#78350f" : "#13294b";
    dom.statusBanner.innerHTML = html;
  }

  function getFilteredRows() {
    if (activeRoleFilter === "ALL") return allRows;
    return allRows.filter((r) => r.A3 === activeRoleFilter);
  }

  function computeDemographicBreakdown(rows, fieldId, categories) {
    const counts = {};
    categories.forEach((c) => {
      counts[c] = 0;
    });
    rows.forEach((r) => {
      const val = (r[fieldId] || "").trim();
      if (!val) return;
      counts[val] = (counts[val] || 0) + 1;
    });

    const total = rows.length || 0;
    return Object.keys(counts).map((key) => ({
      label: key,
      count: counts[key],
      pct: total ? ((counts[key] / total) * 100).toFixed(1) : "0.0"
    }));
  }

  function computeLikertStats(rows, itemId) {
    const counts = {
      "Mo Gbà Dáadáa": 0,
      "Mo Gbà": 0,
      "N Kò Gbà": 0,
      "N Kò Gbà Rárá": 0
    };
    const scores = [];

    rows.forEach((r) => {
      const v = r[itemId];
      if (Object.prototype.hasOwnProperty.call(counts, v)) {
        counts[v] += 1;
        scores.push(SCORE_MAP[v]);
      }
    });

    const n = scores.length;
    const mean = n ? scores.reduce((a, b) => a + b, 0) / n : 0;
    const variance =
      n > 1
        ? scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / (n - 1)
        : 0;
    const sd = Math.sqrt(variance);

    return {
      counts: counts,
      n: n,
      mean: mean,
      sd: sd,
      decision: n === 0 ? "—" : mean >= 2.5 ? "Gbà" : "Kò Gbà"
    };
  }

  function pctText(part, total) {
    if (!total) return "0.0%";
    return ((part / total) * 100).toFixed(1) + "%";
  }

  function renderReport() {
    const rows = getFilteredRows();
    const total = rows.length;
    const students = rows.filter((r) => r.A3 === "Akẹ́kọ̀ọ́").length;
    const lecturers = rows.filter((r) => r.A3 === "Olùkọ́").length;
    const aiExperienced = rows.filter((r) => r.A7 === "Bẹ́ẹ̀ni").length;

    dom.reportDate.textContent =
      "Ọjọ́ Ìròyìn: " +
      new Date().toLocaleDateString("yo-NG", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

    if (total === 0) {
      dom.reportContent.innerHTML =
        '<div class="card"><p style="margin:0;font-weight:700;">Kò sí ìdáhùn kankan fún àṣàyàn yìí síbẹ̀.</p></div>';
      return;
    }

    const kpiHtml =
      '<div class="kpi-grid">' +
      '<div class="kpi-card"><div class="kpi-label">Àpapọ̀ Olùdáhùn</div><div class="kpi-value">' +
      total +
      "</div></div>" +
      '<div class="kpi-card"><div class="kpi-label">Àwọn Akẹ́kọ̀ọ́</div><div class="kpi-value">' +
      students +
      ' <small style="font-size:0.85rem;color:var(--text-muted)">(' +
      pctText(students, total) +
      ")</small></div></div>" +
      '<div class="kpi-card"><div class="kpi-label">Àwọn Olùkọ́</div><div class="kpi-value">' +
      lecturers +
      ' <small style="font-size:0.85rem;color:var(--text-muted)">(' +
      pctText(lecturers, total) +
      ")</small></div></div>" +
      '<div class="kpi-card"><div class="kpi-label">Àwọn Tó Ti Lo AI Tẹ́lẹ̀</div><div class="kpi-value">' +
      aiExperienced +
      ' <small style="font-size:0.85rem;color:var(--text-muted)">(' +
      pctText(aiExperienced, total) +
      ")</small></div></div>" +
      "</div>";

    const demoConfigs = [
      {
        title: "A1: Ẹ̀ka",
        id: "A1",
        cats: ["Ẹ̀ka Iṣẹ́-Ọ̀nà", "Ẹ̀ka Ìmọ̀ Ẹ̀kọ́"]
      },
      {
        title: "A2: Ẹ̀ka Ẹ̀kọ́",
        id: "A2",
        cats: [
          "Ẹ̀ka Ẹ̀kọ́ Ìmọ̀ Èdè àti Àwọn Èdè Ilẹ̀ Adúláwọ̀",
          "Ẹ̀ka Ẹ̀kọ́ Iṣẹ́-Ọ̀nà àti Ìmọ̀ Ẹ̀kọ́ Àwùjọ"
        ]
      },
      { title: "A3: Iṣẹ́ Rẹ (Ipò)", id: "A3", cats: ["Akẹ́kọ̀ọ́", "Olùkọ́"] },
      {
        title: "A4: Ìpele Ẹ̀kọ́",
        id: "A4",
        cats: ["100", "200", "300", "400", "Kò Kàn Mí (Olùkọ́)"]
      },
      {
        title: "A5: Ọjọ́ Orí",
        id: "A5",
        cats: ["16 – 20", "21 – 25", "26 – 30", "31+"]
      },
      { title: "A6: Akọ / Abo", id: "A6", cats: ["Akọ", "Abo"] },
      {
        title: "A7: Ìrírí Lílo AI Tẹ́lẹ̀",
        id: "A7",
        cats: ["Bẹ́ẹ̀ni", "Bẹ́ẹ̀kọ́"]
      }
    ];

    const demoCardsHtml = demoConfigs
      .map((cfg) => {
        const items = computeDemographicBreakdown(rows, cfg.id, cfg.cats);
        const bars = items
          .map(
            (it) =>
              '<div class="bar-row">' +
              '<div class="bar-label">' +
              escapeHtml(it.label) +
              "</div>" +
              '<div class="bar-track"><div class="bar-fill" style="width:' +
              it.pct +
              '%"></div></div>' +
              '<div class="bar-value">' +
              it.count +
              " (" +
              it.pct +
              "%)</div>" +
              "</div>"
          )
          .join("");
        return (
          '<div style="margin-bottom:18px;">' +
          '<h3 style="margin:0 0 10px;font-size:0.95rem;color:var(--oau-navy-dark);">' +
          escapeHtml(cfg.title) +
          "</h3>" +
          bars +
          "</div>"
        );
      })
      .join("");

    const demoSectionHtml =
      '<section class="card">' +
      '<div class="section-header"><h2>ÌPÍN A: ÀTÚPALẸ̀ ÀTÒJỌ NÍPA ARA ẸNI</h2></div>' +
      demoCardsHtml +
      "</section>";

    const likertSectionsHtml = DATA.likertSections
      .map((sec) => {
        let sumMeans = 0;
        let itemCountWithData = 0;

        const bodyRows = sec.items
          .map((item) => {
            const st = computeLikertStats(rows, item.id);
            if (st.n > 0) {
              sumMeans += st.mean;
              itemCountWithData += 1;
            }
            const pillClass =
              st.decision === "Gbà" ? "decision-agree" : "decision-disagree";

            const subgroupTag =
              sec.id === "D"
                ? item.group === "challenge"
                  ? '<br><small style="color:#991b1b;font-weight:700;">[Ìpèníjà]</small>'
                  : '<br><small style="color:#166534;font-weight:700;">[Àǹfààní]</small>'
                : "";

            return (
              "<tr>" +
              '<td class="num">' +
              item.number +
              "</td>" +
              "<td>" +
              escapeHtml(item.yo) +
              subgroupTag +
              "</td>" +
              '<td class="num">' +
              st.counts["Mo Gbà Dáadáa"] +
              "<br><small>(" +
              pctText(st.counts["Mo Gbà Dáadáa"], st.n) +
              ")</small></td>" +
              '<td class="num">' +
              st.counts["Mo Gbà"] +
              "<br><small>(" +
              pctText(st.counts["Mo Gbà"], st.n) +
              ")</small></td>" +
              '<td class="num">' +
              st.counts["N Kò Gbà"] +
              "<br><small>(" +
              pctText(st.counts["N Kò Gbà"], st.n) +
              ")</small></td>" +
              '<td class="num">' +
              st.counts["N Kò Gbà Rárá"] +
              "<br><small>(" +
              pctText(st.counts["N Kò Gbà Rárá"], st.n) +
              ")</small></td>" +
              '<td class="num">' +
              st.n +
              "</td>" +
              '<td class="num"><strong>' +
              st.mean.toFixed(2) +
              "</strong></td>" +
              '<td class="num">' +
              st.sd.toFixed(2) +
              "</td>" +
              '<td class="num"><span class="decision-pill ' +
              pillClass +
              '">' +
              escapeHtml(st.decision) +
              "</span></td>" +
              "</tr>"
            );
          })
          .join("");

        const sectionMean = itemCountWithData
          ? (sumMeans / itemCountWithData).toFixed(2)
          : "0.00";

        return (
          '<section class="card">' +
          '<div class="section-header"><h2>' +
          escapeHtml(sec.title.yo) +
          "</h2></div>" +
          '<div class="report-table-wrap">' +
          '<table class="report-table">' +
          "<thead><tr>" +
          '<th class="num">S/N</th>' +
          "<th>Àkóónú Ìbéèrè</th>" +
          '<th class="num">MGD (4)</th>' +
          '<th class="num">MG (3)</th>' +
          '<th class="num">NKG (2)</th>' +
          '<th class="num">NKGR (1)</th>' +
          '<th class="num">Àpapọ̀ (N)</th>' +
          '<th class="num">Ìpíndọ́gba</th>' +
          '<th class="num">SD</th>' +
          '<th class="num">Ìpinnu (≥2.50)</th>' +
          "</tr></thead>" +
          "<tbody>" +
          bodyRows +
          "</tbody>" +
          "<tfoot><tr>" +
          '<td colspan="7" style="text-align:right;font-weight:800;">Ìpíndọ́gba Àpapọ̀ Ìpín ' +
          sec.id +
          ":</td>" +
          '<td class="num"><strong>' +
          sectionMean +
          "</strong></td>" +
          '<td colspan="2" class="num"><span class="decision-pill ' +
          (Number(sectionMean) >= 2.5 ? "decision-agree" : "decision-disagree") +
          '">' +
          (Number(sectionMean) >= 2.5 ? "Gbà" : "Kò Gbà") +
          "</span></td>" +
          "</tr></tfoot>" +
          "</table>" +
          "</div>" +
          "</section>"
        );
      })
      .join("");

    const openEndedHtml = DATA.openEndedSection.items
      .map((item) => {
        const entries = rows
          .filter((r) => (r[item.id] || "").trim().length > 0)
          .map(
            (r, idx) =>
              '<div class="open-response-item">' +
              '<div class="open-response-meta">#' +
              (idx + 1) +
              " • " +
              escapeHtml(r.A3 || "") +
              (r.A2 ? " — " + escapeHtml(r.A2) : "") +
              "</div>" +
              "<div>" +
              escapeHtml(r[item.id]) +
              "</div>" +
              "</div>"
          )
          .join("");

        return (
          '<div style="margin-bottom:18px;">' +
          '<h3 style="margin:0 0 10px;font-size:0.95rem;color:var(--oau-navy-dark);">' +
          item.number +
          ". " +
          escapeHtml(item.yo) +
          "</h3>" +
          (entries ||
            '<p style="color:var(--text-muted);font-style:italic;">Kò sí ìdáhùn ṣíṣí fún ìbéèrè yìí síbẹ̀.</p>') +
          "</div>"
        );
      })
      .join("");

    const sectionFHtml =
      '<section class="card">' +
      '<div class="section-header"><h2>ÌPÍN F: ÀKÓJỌPỌ̀ ÌDÁHÙN ÌBÉÈRÈ ṢÍṢÍ</h2></div>' +
      openEndedHtml +
      "</section>";

    dom.reportContent.innerHTML =
      kpiHtml + demoSectionHtml + likertSectionsHtml + sectionFHtml;
  }

  function buildRawYorubaTableRows(rows) {
    const headers = [
      "Nọ́ńbà_Ìdáhùn",
      "Àkókò_Ìdáhùn",
      "A1: Ẹ̀ka",
      "A2: Ẹ̀ka Ẹ̀kọ́",
      "A3: Iṣẹ́ Rẹ (Ipò)",
      "A4: Ìpele Ẹ̀kọ́",
      "A5: Ọjọ́ Orí",
      "A6: Akọ / Abo",
      "A7: Ìrírí Lílo AI Tẹ́lẹ̀"
    ];

    DATA.likertSections.forEach((sec) => {
      sec.items.forEach((item) => {
        headers.push(item.id + ": " + item.yo);
      });
    });

    DATA.openEndedSection.items.forEach((item) => {
      headers.push(item.id + ": " + item.yo);
    });

    const body = rows.map((r, i) => {
      const line = [
        r.id || "OAU-" + String(i + 1).padStart(4, "0"),
        r.timestamp || "",
        r.A1 || "",
        r.A2 || "",
        r.A3 || "",
        r.A4 || "",
        r.A5 || "",
        r.A6 || "",
        r.A7 || ""
      ];
      DATA.likertSections.forEach((sec) => {
        sec.items.forEach((item) => line.push(r[item.id] || ""));
      });
      DATA.openEndedSection.items.forEach((item) => line.push(r[item.id] || ""));
      return line;
    });

    return [headers].concat(body);
  }

  function buildSummarySheetRows(rows) {
    const out = [
      ["ÀKÓJỌPỌ̀ ÀBÁJÁDE ÌWÁDÌÍ — ÌLÒ Ẹ̀RỌ AYÉLUJÁRA ÒYE-ÀTỌWỌ́DÁ (AI)", "", "", "", "", "", "", "", "", ""],
      ["Àpapọ̀ Olùdáhùn", rows.length, "", "", "", "", "", "", "", ""],
      []
    ];

    out.push(["ÌPÍN A: ÀTÒJỌ FÁYẸ̀WÒ NÍPA ARA ẸNI", "Ìsọ̀rí", "Iye", "Ìdá (%)"]);
    const demoFields = [
      {
        label: "Ẹ̀ka",
        id: "A1",
        cats: ["Ẹ̀ka Iṣẹ́-Ọ̀nà", "Ẹ̀ka Ìmọ̀ Ẹ̀kọ́"]
      },
      {
        label: "Ẹ̀ka Ẹ̀kọ́",
        id: "A2",
        cats: [
          "Ẹ̀ka Ẹ̀kọ́ Ìmọ̀ Èdè àti Àwọn Èdè Ilẹ̀ Adúláwọ̀",
          "Ẹ̀ka Ẹ̀kọ́ Iṣẹ́-Ọ̀nà àti Ìmọ̀ Ẹ̀kọ́ Àwùjọ"
        ]
      },
      { label: "Iṣẹ́ Rẹ (Ipò)", id: "A3", cats: ["Akẹ́kọ̀ọ́", "Olùkọ́"] },
      {
        label: "Ìpele Ẹ̀kọ́",
        id: "A4",
        cats: ["100", "200", "300", "400", "Kò Kàn Mí (Olùkọ́)"]
      },
      {
        label: "Ọjọ́ Orí",
        id: "A5",
        cats: ["16 – 20", "21 – 25", "26 – 30", "31+"]
      },
      { label: "Akọ / Abo", id: "A6", cats: ["Akọ", "Abo"] },
      { label: "Ìrírí Lílo AI Tẹ́lẹ̀", id: "A7", cats: ["Bẹ́ẹ̀ni", "Bẹ́ẹ̀kọ́"] }
    ];

    demoFields.forEach((df) => {
      const breakdown = computeDemographicBreakdown(rows, df.id, df.cats);
      breakdown.forEach((b) => {
        out.push([df.label, b.label, b.count, Number(b.pct)]);
      });
    });

    out.push([]);

    DATA.likertSections.forEach((sec) => {
      out.push([
        sec.title.yo,
        "MGD (4)",
        "MG (3)",
        "NKG (2)",
        "NKGR (1)",
        "Àpapọ̀ (N)",
        "Ìpíndọ́gba",
        "SD",
        "Ìpinnu (≥2.50)"
      ]);

      sec.items.forEach((item) => {
        const st = computeLikertStats(rows, item.id);
        out.push([
          item.id + ". " + item.yo,
          st.counts["Mo Gbà Dáadáa"],
          st.counts["Mo Gbà"],
          st.counts["N Kò Gbà"],
          st.counts["N Kò Gbà Rárá"],
          st.n,
          Number(st.mean.toFixed(2)),
          Number(st.sd.toFixed(2)),
          st.decision
        ]);
      });

      out.push([]);
    });

    return out;
  }

  function buildOpenEndedSheetRows(rows) {
    const out = [["Nọ́ńbà_Ìdáhùn", "Ipò", "Ẹ̀ka_Ẹ̀kọ́", "F1: Ìṣòro Mìíràn", "F2: Àbá Ìmúdára"]];
    rows.forEach((r, idx) => {
      if ((r.F1 || "").trim() || (r.F2 || "").trim()) {
        out.push([
          r.id || "OAU-" + String(idx + 1).padStart(4, "0"),
          r.A3 || "",
          r.A2 || "",
          r.F1 || "",
          r.F2 || ""
        ]);
      }
    });
    return out;
  }

  function exportXlsx() {
    const rows = getFilteredRows();
    if (!rows.length) {
      window.alert("Kò sí ìdáhùn láti gba jáde sí Excel.");
      return;
    }
    window.YorubaExcelExport.downloadXlsx("Abajade_Iwadi_AI_Yoruba.xlsx", [
      { name: "Àkójọpọ̀_Àbájáde", rows: buildSummarySheetRows(rows), boldFirstRow: true },
      { name: "Ìdáhùn_Ìwádìí", rows: buildRawYorubaTableRows(rows), boldFirstRow: true },
      { name: "Ìbéèrè_Ṣíṣí_F", rows: buildOpenEndedSheetRows(rows), boldFirstRow: true }
    ]);
  }

  function exportCsv() {
    const rows = getFilteredRows();
    if (!rows.length) {
      window.alert("Kò sí ìdáhùn láti gba jáde sí CSV.");
      return;
    }
    window.YorubaExcelExport.downloadCsv(
      "Idahun_Iwadi_AI_Yoruba.csv",
      buildRawYorubaTableRows(rows)
    );
  }

  function generateSampleRows() {
    const roles = ["Akẹ́kọ̀ọ́", "Akẹ́kọ̀ọ́", "Akẹ́kọ̀ọ́", "Olùkọ́"];
    const levels = ["100", "200", "300", "400"];
    const ages = ["16 – 20", "21 – 25", "26 – 30", "31+"];
    const genders = ["Akọ", "Abo"];
    const faculties = ["Ẹ̀ka Iṣẹ́-Ọ̀nà", "Ẹ̀ka Ìmọ̀ Ẹ̀kọ́"];
    const depts = [
      "Ẹ̀ka Ẹ̀kọ́ Ìmọ̀ Èdè àti Àwọn Èdè Ilẹ̀ Adúláwọ̀",
      "Ẹ̀ka Ẹ̀kọ́ Iṣẹ́-Ọ̀nà àti Ìmọ̀ Ẹ̀kọ́ Àwùjọ"
    ];

    const sample = [];
    for (let i = 0; i < 12; i++) {
      const role = roles[i % roles.length];
      const pairIdx = i % 2;
      const row = {
        id: "ÀPẸẸRẸ-" + String(i + 1).padStart(3, "0"),
        timestamp: "2026-11-18 14:" + String(10 + i).padStart(2, "0") + ":00",
        A1: faculties[pairIdx],
        A2: depts[pairIdx],
        A3: role,
        A4: role === "Olùkọ́" ? "Kò Kàn Mí (Olùkọ́)" : levels[i % levels.length],
        A5: role === "Olùkọ́" ? "31+" : ages[i % 3],
        A6: genders[i % genders.length],
        A7: i % 5 === 0 ? "Bẹ́ẹ̀kọ́" : "Bẹ́ẹ̀ni",
        F1:
          i % 3 === 0
            ? "Àìtó ìsopọ̀ ayélujára àti àìsí àmì ohùn tó péye lórí ChatGPT."
            : "",
        F2:
          i % 2 === 0
            ? "Kí Yunifásítì Ọbáfẹ́mi Awólọ́wọ̀ ṣe ìdánilẹ́kọ̀ọ́ lórí bí a ṣe lè lo AI fún èdè Yorùbá."
            : ""
      };

      DATA.likertSections.forEach((sec) => {
        sec.items.forEach((item, idx) => {
          const pick =
            item.id === "D8"
              ? LIKERT_VALUES[(i + idx) % 2]
              : LIKERT_VALUES[(i + idx) % 3 === 2 ? 2 : (i + idx) % 2];
          row[item.id] = pick;
        });
      });
      sample.push(row);
    }
    return sample;
  }

  async function fetchLiveReport() {
    const baseUrl = (CONFIG.APPS_SCRIPT_URL || "").trim();
    if (!baseUrl) {
      isSampleData = false;
      allRows = [];
      setStatus(
        "<strong>Àkíyèsì:</strong> Àdírẹ́sì Google Apps Script kò tíì sí nínú <code>assets/js/config.js</code>. Fi URL Web App rẹ síbẹ̀ láti rí ìdáhùn gidi, tàbí tẹ <strong>\"Ṣe Àyẹ̀wò Àpẹẹrẹ\"</strong> láti wo bí ìròyìn Yorùbá ṣe rí.",
        true
      );
      renderReport();
      return;
    }

    if (CONFIG.REQUIRE_REPORT_PASSCODE && !currentPasscode) {
      dom.passcodeBox.style.display = "flex";
      setStatus("Jọ̀wọ́ tẹ kọ́kọ́rọ́ àṣírí olùwádìí láti wo ìròyìn àbájáde.", false);
      return;
    }

    setStatus("Ń gba àbájáde láti Google Sheet...", false);
    const sep = baseUrl.includes("?") ? "&" : "?";
    const fullUrl =
      baseUrl +
      sep +
      "action=report" +
      (currentPasscode ? "&passcode=" + encodeURIComponent(currentPasscode) : "");

    try {
      const resp = await fetch(fullUrl, { redirect: "follow" });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const data = await resp.json();
      if (!data.ok) {
        if (data.requiresPasscode) {
          dom.passcodeBox.style.display = "flex";
        }
        throw new Error(data.error || "Àṣìṣe láti Apps Script");
      }
      dom.passcodeBox.style.display = "none";
      isSampleData = false;
      allRows = Array.isArray(data.rows) ? data.rows : [];
      setStatus("", false);
      renderReport();
    } catch (err) {
      setStatus(
        "<strong>Kò ṣeé gba ìròyìn:</strong> " + escapeHtml(err.message || String(err)),
        true
      );
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheDom();

    dom.roleFilter.addEventListener("change", (e) => {
      activeRoleFilter = e.target.value;
      renderReport();
    });

    dom.refreshBtn.addEventListener("click", fetchLiveReport);

    dom.sampleBtn.addEventListener("click", () => {
      isSampleData = true;
      allRows = generateSampleRows();
      setStatus(
        "<strong>ÀPẸẸRẸ ÀYẸ̀WÒ NI ÈYÍ:</strong> Àwọn nọ́ńbà ìsàlẹ̀ yìí jẹ́ àpẹẹrẹ fún àyẹ̀wò ìtẹ̀jáde nìkan, kì í ṣe ìdáhùn gidi láti Google Sheet.",
        true
      );
      renderReport();
    });

    dom.passcodeBtn.addEventListener("click", () => {
      currentPasscode = dom.passcodeInput.value.trim();
      fetchLiveReport();
    });

    dom.exportXlsxBtn.addEventListener("click", exportXlsx);
    dom.exportCsvBtn.addEventListener("click", exportCsv);
    dom.printBtn.addEventListener("click", () => window.print());

    fetchLiveReport();
  });
})();

