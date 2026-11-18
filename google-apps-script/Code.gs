/**
 * ============================================================================
 * OAU YORÙBÁ AI THESIS QUESTIONNAIRE — ALL-IN-ONE GOOGLE APPS SCRIPT
 * ============================================================================
 * Everything needed for Google Sheets ("Google Excel") storage, strictly-Yorùbá
 * normalization, live Yorùbá statistical reporting, CSV export, and Google Doc
 * report generation lives in this single script.
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet (https://sheets.new).
 * 2. Open Extensions -> Apps Script.
 * 3. Delete any starter code in Code.gs and paste this entire file.
 * 4. Click Save, then select `setupYorubaSpreadsheet` at the top and click Run.
 *    (Approve permissions when prompted.)
 * 5. Click Deploy -> New deployment -> Type: Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL ("https://script.google.com/macros/s/.../exec")
 *    and paste it into `assets/js/config.js` -> `APPS_SCRIPT_URL`.
 * ============================================================================
 */

const CONFIG = {
  RAW_SHEET_NAME: "Ìdáhùn_Ìwádìí",
  NUMERIC_SHEET_NAME: "Àbájáde_Onínọ́mbà",
  REPORT_SHEET_NAME: "Àkójọpọ̀_Àbájáde",
  TIMEZONE: "Africa/Lagos",
  DECISION_THRESHOLD: 2.5,
  // Optional: set a passcode string (e.g. "OAU2026") to protect ?action=report
  REPORT_PASSCODE: ""
};

const LIKERT_ITEMS = {
  B: {
    title: "ÌPÍN B: ÀWỌN IRINṢẸ́ ÒYE-ÀTỌWỌ́DÁ TÍ A LÈ LÒ FÚN KÍKỌ́ ÈDÈ YORÙBÁ",
    items: [
      { id: "B1", text: "ChatGPT jẹ́ irinṣẹ́ tí a lè lò fún kíkọ́ èdè Yorùbá." },
      { id: "B2", text: "YorubaGPT jẹ́ irinṣẹ́ tó wúlò fún kíkọ́ èdè Yorùbá." },
      { id: "B3", text: "Duolingo (Yoruba) ṣeé lò fún ìkọ́ni ìró àti ọ̀rọ̀ Yorùbá." },
      { id: "B4", text: "Google Translate ṣeé lò fún ìtumọ̀ sí èdè Yorùbá." },
      { id: "B5", text: "Ẹ̀rọ Ayélujára Òye-Àtọwọ́dá (AI) fún ṣíṣe ohun èlò ìdánimọ̀ ohùn (speech recognition tools) ṣeé lò fún ìkọ́ni ní ìró ohùn." },
      { id: "B6", text: "Àwọn chatbot Yorùbá ṣeé lò fún ìdánilẹ́kọ̀ọ́ ẹni-kọ̀ọ̀kan." },
      { id: "B7", text: "Àwọn irinṣẹ́/ohun èlò ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI tools) lè ṣe ìrànwọ́ fún ṣíṣe iṣẹ́ ẹ̀kọ́ Yorùbá." }
    ]
  },
  C: {
    title: "ÌPÍN C: ÌHÀ ÀWỌN OLÙKỌ́ ÀTI AKẸ́KỌ̀Ọ́ SÍ LÍLO Ẹ̀RỌ ÒYE-ÀTỌWỌ́DÁ",
    items: [
      { id: "C1", text: "Mo kọ ìhà rere sí lílo Ẹ̀rọ Ayélujára Òye-Àtọwọ́dá (AI) fún kíkọ́ èdè Yorùbá." },
      { id: "C2", text: "Mo gbà pé ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) lè ṣe ìrànwọ́ fún kíkọ́ èdè Yorùbá." },
      { id: "C3", text: "Mo fẹ́ lo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) fún ìkọ́ni gírámà àti ìró Yorùbá." },
      { id: "C4", text: "Mo ní ìgboyà láti lo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) nínú ẹ̀kọ́ èdè Yorùbá." },
      { id: "C5", text: "Mo gbà pé ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) kò ní pa ipa àwọn olùkọ́ run láàárín àwùjọ." },
      { id: "C6", text: "Mo ní ìtara sí lílo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) fún kíkọ́ èdè Yorùbá." },
      { id: "C7", text: "Mo ní ìbẹ̀rù pé ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) lè mú kí n gbẹ́kẹ̀lé ẹ̀rọ ju àwọn olùkọ́ lọ." },
      { id: "C8", text: "Mo ní ìmọ̀ tó pọ̀ nípa bí a ṣe lè lo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) dáadáa." }
    ]
  },
  D: {
    title: "ÌPÍN D: ÀǸFÀÀNÍ ÀTI ÌPÈNÍJÀ LÍLO Ẹ̀RỌ ÒYE-ÀTỌWỌ́DÁ",
    items: [
      { id: "D1", text: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń mú kí ìmọ̀ mi nínú èdè Yorùbá jinlẹ̀ sí i." },
      { id: "D2", text: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń ṣe ìrànwọ́ fún ìdánilẹ́kọ̀ọ́ ẹni-kọ̀ọ̀kan." },
      { id: "D3", text: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń pèsè ìdáhùn fún àwọn akẹ́kọ̀ọ́ àti olùkọ́ lẹ́sẹ̀kẹsẹ̀." },
      { id: "D4", text: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń ṣe ìrànwọ́ fún ìkọ́ni ìró ohùn àti gírámà." },
      { id: "D5", text: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń mú kí kíkọ́ èdè Yorùbá rọrùn láti kọ́." },
      { id: "D6", text: "Ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń ṣe ìrànwọ́ fún ìpamọ́ òwe àti àṣà Yorùbá láàárín àwùjọ." },
      { id: "D7", text: "Àìtó àwọn ẹ̀rọ bíi (fóònù/kọ̀ǹpútà) ń dí mi lọ́wọ́ láti lo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI)." },
      { id: "D8", text: "Àwọn ìdáhùn ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) kì í sábà bá àṣà Yorùbá mu." },
      { id: "D9", text: "Àìní ìmọ̀ nípa bí a ṣe lè lo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) ń jẹ́ ìdíwọ́ fún lílò rẹ̀." }
    ]
  },
  E: {
    title: "ÌPÍN E: Ọ̀NÀ TÍ A LÈ GBÀ MÚ KÍ LÍLO Ẹ̀RỌ AYÉLUJÁRA ÒYE-ÀTỌWỌ́DÁ (AI) RỌRÙN",
    items: [
      { id: "E1", text: "Ó yẹ kí a pèsè ẹ̀rọ (ICT) tó dára nínú yàrá ìkẹ́kọ̀ọ́." },
      { id: "E2", text: "Ó yẹ kí a ṣe ìdánilẹ́kọ̀ọ́ fún àwọn olùkọ́ àti akẹ́kọ̀ọ́ nípa lílo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI)." },
      { id: "E3", text: "Ó yẹ kí a ṣe àwọn irinṣẹ́ ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) tí ó bá àṣà Yorùbá mu." },
      { id: "E4", text: "Ó yẹ kí a fi ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) kún kọ̀ríkúlọ̀ọ̀mù èdè Yorùbá." },
      { id: "E5", text: "Ó yẹ kí a pèsè ìsopọ̀ ayélujára (internet) tó dára." },
      { id: "E6", text: "Ó yẹ kí a ṣe àwọn chatbot àti app tí ó ní òwe àti àṣà Yorùbá." },
      { id: "E7", text: "Ó yẹ kí ìjọba àti yunifásítì ṣe ìrànwọ́ fún ìmúgbòòrò lílo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI)." }
    ]
  }
};

const FIELDS = (function () {
  const list = [
    { key: "id", header: "Nọ́ńbà_Ìdáhùn" },
    { key: "timestamp", header: "Àkókò_Ìdáhùn" },
    { key: "A1", header: "A1: Ẹ̀ka" },
    { key: "A2", header: "A2: Ẹ̀ka Ẹ̀kọ́" },
    { key: "A3", header: "A3: Iṣẹ́ Rẹ (Ipò)" },
    { key: "A4", header: "A4: Ìpele Ẹ̀kọ́" },
    { key: "A5", header: "A5: Ọjọ́ Orí" },
    { key: "A6", header: "A6: Akọ / Abo" },
    { key: "A7", header: "A7: Ìrírí Lílo AI Tẹ́lẹ̀" }
  ];

  ["B", "C", "D", "E"].forEach(function (secKey) {
    LIKERT_ITEMS[secKey].items.forEach(function (item) {
      list.push({ key: item.id, header: item.id + ": " + item.text });
    });
  });

  list.push({
    key: "F1",
    header: "F1: Kí ni àwọn ìṣòro mìíràn tí o ń dojú kọ nínú lílo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) fún kíkọ́ èdè Yorùbá?"
  });
  list.push({
    key: "F2",
    header: "F2: Kí ni o dábàá láti mú kí lílo ẹ̀rọ ayélujára Òye-Àtọwọ́dá (AI) dára sí i fún kíkọ́ èdè Yorùbá ní Yunifásítì Ọbáfẹ́mi Awólọ́wọ̀?"
  });
  return list;
})();

const LIKERT_SCORE = {
  "Mo Gbà Dáadáa": 4,
  "Mo Gbà": 3,
  "N Kò Gbà": 2,
  "N Kò Gbà Rárá": 1
};

// ============================================================================
// CUSTOM GOOGLE SHEETS MENU
// ============================================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Ìwé Ìbéèrè Yorùbá")
    .addItem("Ṣètò Àwọn Téébù (Setup / Repair Sheets)", "setupYorubaSpreadsheet")
    .addItem("Tún Ìròyìn Àtúpalẹ̀ Ṣe (Rebuild Yorùbá Report)", "rebuildReportMenuAction")
    .addItem("Ṣẹ̀dá Ìròyìn Google Doc (Yorùbá Doc Report)", "generateYorubaDocReport")
    .addToUi();
}

function rebuildReportMenuAction() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  buildYorubaReportSheet(ss);
  SpreadsheetApp.getUi().alert("A ti tún téébù Àkójọpọ̀_Àbájáde ṣe ní èdè Yorùbá!");
}

// ============================================================================
// ONE-CLICK SPREADSHEET SETUP
// ============================================================================
function setupYorubaSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(CONFIG.TIMEZONE);

  const headers = FIELDS.map(function (f) { return f.header; });

  const rawSheet = getOrCreateSheet(ss, CONFIG.RAW_SHEET_NAME);
  ensureHeaders(rawSheet, headers, "#13294B");
  rawSheet.getRange("B2:B").setNumberFormat("@");
  rawSheet.getRange("F2:F").setNumberFormat("@");

  const numSheet = getOrCreateSheet(ss, CONFIG.NUMERIC_SHEET_NAME);
  ensureHeaders(numSheet, headers, "#1F3D6E");
  numSheet.getRange("B2:B").setNumberFormat("@");
  numSheet.getRange("F2:F").setNumberFormat("@");

  buildYorubaReportSheet(ss);

  // Move report tab first or keep raw responses accessible
  ss.setActiveSheet(rawSheet);
}

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function ensureHeaders(sheet, headers, headerBg) {
  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setValues([headers]);
  range
    .setBackground(headerBg)
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setWrap(true)
    .setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 48);

  for (let c = 1; c <= headers.length; c++) {
    if (c <= 2) {
      sheet.setColumnWidth(c, 150);
    } else if (c <= 9) {
      sheet.setColumnWidth(c, 175);
    } else if (c >= headers.length - 1) {
      sheet.setColumnWidth(c, 320);
    } else {
      sheet.setColumnWidth(c, 210);
    }
  }
}

function colIndexToLetter(zeroBasedIdx) {
  let n = zeroBasedIdx + 1;
  let out = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

function getColLetterByKey(key) {
  for (let i = 0; i < FIELDS.length; i++) {
    if (FIELDS[i].key === key) {
      return colIndexToLetter(i);
    }
  }
  throw new Error("Unknown field key: " + key);
}

// ============================================================================
// STRICTLY-YORÙBÁ LIVE REPORT SHEET BUILDER
// ============================================================================
function buildYorubaReportSheet(ss) {
  const report = getOrCreateSheet(ss, CONFIG.REPORT_SHEET_NAME);
  report.clear();

  const rawRef = "'" + CONFIG.RAW_SHEET_NAME + "'!";
  const idCol = getColLetterByKey("id");
  const totalFormula = "COUNTA(" + rawRef + idCol + "2:" + idCol + ")";

  let row = 1;

  // Title Banner
  report.getRange(row, 1, 1, 9).merge()
    .setValue("YUNIFÁSÍTÌ ỌBÁFẸ́MI AWÓLỌ́WỌ̀, ILÉ-IFẸ̀ — ÌRÒYÌN ÀBÁJÁDE ÌWÁDÌÍ (YORÙBÁ NÌKAN)")
    .setBackground("#13294B")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(12)
    .setHorizontalAlignment("center");
  report.setRowHeight(row, 34);
  row += 1;

  report.getRange(row, 1, 1, 9).merge()
    .setValue("ÌWÉ ÌBÉÈRÈ LÓRÍ ÀGBÉYẸ̀WÒ ÌLÒ Ẹ̀RỌ AYÉLUJÁRA ÒYE-ÀTỌWỌ́DÁ (AI) LÁÀÁRÍN ÀWỌN AKẸ́KỌ̀Ọ́")
    .setBackground("#F5ECD6")
    .setFontColor("#13294B")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
  report.setRowHeight(row, 26);
  row += 2;

  // Overall Count
  report.getRange(row, 1).setValue("Àpapọ̀ Olùdáhùn:").setFontWeight("bold");
  report.getRange(row, 2).setFormula("=" + totalFormula).setFontWeight("bold").setFontSize(12);
  row += 2;

  // Section A: Demographics
  report.getRange(row, 1, 1, 4).merge()
    .setValue("ÌPÍN A: ÀTÒJỌ FÁYẸ̀WÒ NÍPA ARA ẸNI")
    .setBackground("#13294B")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
  row += 1;

  report.getRange(row, 1, 1, 4)
    .setValues([["Ìbéèrè", "Ìsọ̀rí", "Iye", "Ìdá (%)"]])
    .setBackground("#EEF2F8")
    .setFontWeight("bold");
  row += 1;

  const demoSpecs = [
    { key: "A1", label: "A1: Ẹ̀ka", cats: ["Ẹ̀ka Iṣẹ́-Ọ̀nà", "Ẹ̀ka Ìmọ̀ Ẹ̀kọ́"] },
    {
      key: "A2",
      label: "A2: Ẹ̀ka Ẹ̀kọ́",
      cats: [
        "Ẹ̀ka Ẹ̀kọ́ Ìmọ̀ Èdè àti Àwọn Èdè Ilẹ̀ Adúláwọ̀",
        "Ẹ̀ka Ẹ̀kọ́ Iṣẹ́-Ọ̀nà àti Ìmọ̀ Ẹ̀kọ́ Àwùjọ"
      ]
    },
    { key: "A3", label: "A3: Iṣẹ́ Rẹ (Ipò)", cats: ["Akẹ́kọ̀ọ́", "Olùkọ́"] },
    { key: "A4", label: "A4: Ìpele Ẹ̀kọ́", cats: ["100", "200", "300", "400", "Kò Kàn Mí (Olùkọ́)"] },
    { key: "A5", label: "A5: Ọjọ́ Orí", cats: ["16 – 20", "21 – 25", "26 – 30", "31+"] },
    { key: "A6", label: "A6: Akọ / Abo", cats: ["Akọ", "Abo"] },
    { key: "A7", label: "A7: Ìrírí Lílo AI Tẹ́lẹ̀", cats: ["Bẹ́ẹ̀ni", "Bẹ́ẹ̀kọ́"] }
  ];

  demoSpecs.forEach(function (spec) {
    const colL = getColLetterByKey(spec.key);
    spec.cats.forEach(function (cat) {
      report.getRange(row, 1).setValue(spec.label);
      report.getRange(row, 2).setValue(cat);
      report.getRange(row, 3).setFormula(
        '=COUNTIF(' + rawRef + colL + '$2:' + colL + ', "' + cat + '")'
      );
      report.getRange(row, 4).setFormula(
        '=IF(' + totalFormula + '=0, 0, ROUND((C' + row + '/' + totalFormula + ')*100, 1))'
      );
      row += 1;
    });
  });

  row += 1;

  // Sections B, C, D, E
  ["B", "C", "D", "E"].forEach(function (secKey) {
    const sec = LIKERT_ITEMS[secKey];
    report.getRange(row, 1, 1, 9).merge()
      .setValue(sec.title)
      .setBackground("#13294B")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold");
    row += 1;

    report.getRange(row, 1, 1, 9)
      .setValues([[
        "S/N",
        "Àkóónú Ìbéèrè",
        "MGD (4)",
        "MG (3)",
        "NKG (2)",
        "NKGR (1)",
        "Àpapọ̀ (N)",
        "Ìpíndọ́gba",
        "Ìpinnu (≥2.50)"
      ]])
      .setBackground("#EEF2F8")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    report.getRange(row, 2).setHorizontalAlignment("left");
    row += 1;

    const startRow = row;
    sec.items.forEach(function (item, idx) {
      const colL = getColLetterByKey(item.id);
      const colRange = rawRef + colL + "$2:" + colL;

      report.getRange(row, 1).setValue(idx + 1).setHorizontalAlignment("center");
      report.getRange(row, 2).setValue(item.text).setWrap(true);
      report.getRange(row, 3).setFormula('=COUNTIF(' + colRange + ', "Mo Gbà Dáadáa")').setHorizontalAlignment("center");
      report.getRange(row, 4).setFormula('=COUNTIF(' + colRange + ', "Mo Gbà")').setHorizontalAlignment("center");
      report.getRange(row, 5).setFormula('=COUNTIF(' + colRange + ', "N Kò Gbà")').setHorizontalAlignment("center");
      report.getRange(row, 6).setFormula('=COUNTIF(' + colRange + ', "N Kò Gbà Rárá")').setHorizontalAlignment("center");
      report.getRange(row, 7).setFormula("=SUM(C" + row + ":F" + row + ")").setHorizontalAlignment("center");
      report.getRange(row, 8).setFormula(
        "=IF(G" + row + "=0, 0, ROUND((4*C" + row + "+3*D" + row + "+2*E" + row + "+1*F" + row + ")/G" + row + ", 2))"
      ).setNumberFormat("0.00").setHorizontalAlignment("center").setFontWeight("bold");
      report.getRange(row, 9).setFormula(
        '=IF(G' + row + '=0, "Kò sí ìdáhùn síbẹ̀", IF(H' + row + '>=' + CONFIG.DECISION_THRESHOLD + ', "Gbà", "Kò Gbà"))'
      ).setHorizontalAlignment("center");

      row += 1;
    });

    const endRow = row - 1;
    report.getRange(row, 1, 1, 7).merge()
      .setValue("Ìpíndọ́gba Àpapọ̀ Ìpín " + secKey)
      .setHorizontalAlignment("right")
      .setFontWeight("bold")
      .setBackground("#F7F5EE");
    report.getRange(row, 8)
      .setFormula("=IF(SUM(G" + startRow + ":G" + endRow + ")=0, 0, ROUND(AVERAGE(H" + startRow + ":H" + endRow + "), 2))")
      .setNumberFormat("0.00")
      .setHorizontalAlignment("center")
      .setFontWeight("bold")
      .setBackground("#F7F5EE");
    report.getRange(row, 9)
      .setFormula('=IF(SUM(G' + startRow + ':G' + endRow + ')=0, "Kò sí ìdáhùn síbẹ̀", IF(H' + row + '>=' + CONFIG.DECISION_THRESHOLD + ', "Gbà", "Kò Gbà"))')
      .setHorizontalAlignment("center")
      .setFontWeight("bold")
      .setBackground("#F7F5EE");
    row += 2;
  });

  // Section F Open-ended live table via FILTER
  const a3Col = getColLetterByKey("A3");
  const a2Col = getColLetterByKey("A2");
  const f1Col = getColLetterByKey("F1");
  const f2Col = getColLetterByKey("F2");

  report.getRange(row, 1, 1, 9).merge()
    .setValue("ÌPÍN F: ÀKÓJỌPỌ̀ ÌDÁHÙN ÌBÉÈRÈ ṢÍṢÍ")
    .setBackground("#13294B")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold");
  row += 1;

  report.getRange(row, 1, 1, 5)
    .setValues([["Nọ́ńbà_Ìdáhùn", "Ipò", "Ẹ̀ka Ẹ̀kọ́", "F1: Ìṣòro Mìíràn", "F2: Àbá Ìmúdára"]])
    .setBackground("#EEF2F8")
    .setFontWeight("bold");
  row += 1;

  report.getRange(row, 1).setFormula(
    '=IFERROR(FILTER({' +
      rawRef + idCol + "2:" + idCol + ", " +
      rawRef + a3Col + "2:" + a3Col + ", " +
      rawRef + a2Col + "2:" + a2Col + ", " +
      rawRef + f1Col + "2:" + f1Col + ", " +
      rawRef + f2Col + "2:" + f2Col +
      '}, (' + rawRef + f1Col + "2:" + f1Col + '<>"")+(' + rawRef + f2Col + "2:" + f2Col + '<>"")), "Kò sí ìdáhùn ṣíṣí síbẹ̀")'
  );

  // Column widths
  report.setColumnWidth(1, 150);
  report.setColumnWidth(2, 420);
  for (let c = 3; c <= 9; c++) {
    report.setColumnWidth(c, 115);
  }
}

// ============================================================================
// STRICTLY-YORÙBÁ NORMALIZATION HELPERS
// ============================================================================
function normalizeRole(val) {
  const s = String(val || "").trim().toLowerCase();
  if (s === "akẹ́kọ̀ọ́" || s === "akekoo" || s === "student") return "Akẹ́kọ̀ọ́";
  if (s === "olùkọ́" || s === "oluko" || s === "lecturer" || s === "teacher") return "Olùkọ́";
  return String(val || "").trim();
}

function normalizeLevel(val, roleYo) {
  if (roleYo === "Olùkọ́") return "Kò Kàn Mí (Olùkọ́)";
  const s = String(val || "").trim();
  const match = s.match(/(100|200|300|400)/);
  return match ? match[1] : s;
}

function normalizeAge(val) {
  const s = String(val || "").trim();
  if (s.indexOf("16") !== -1) return "16 – 20";
  if (s.indexOf("21") !== -1) return "21 – 25";
  if (s.indexOf("26") !== -1) return "26 – 30";
  if (s.indexOf("31") !== -1) return "31+";
  return s;
}

function normalizeGender(val) {
  const s = String(val || "").trim().toLowerCase();
  if (s === "akọ" || s === "àkọ" || s === "ako" || s === "male") return "Akọ";
  if (s === "abo" || s === "àbo" || s === "female") return "Abo";
  return String(val || "").trim();
}

function normalizePriorAi(val) {
  const s = String(val || "").trim().toLowerCase();
  if (s === "bẹ́ẹ̀ni" || s === "beeni" || s === "yes") return "Bẹ́ẹ̀ni";
  if (s === "bẹ́ẹ̀kọ́" || s === "beeko" || s === "no") return "Bẹ́ẹ̀kọ́";
  return String(val || "").trim();
}

function normalizeLikert(val) {
  const s = String(val || "").trim().toLowerCase();
  if (
    s === "mo gbà dáadáa" ||
    s === "mgd" ||
    s === "mfg" ||
    s === "strongly agree" ||
    s === "sa" ||
    s === "4"
  ) {
    return "Mo Gbà Dáadáa";
  }
  if (s === "mo gbà" || s === "mg" || s === "mf" || s === "agree" || s === "a" || s === "3") {
    return "Mo Gbà";
  }
  if (s === "n kò gbà" || s === "nkg" || s === "nkf" || s === "disagree" || s === "d" || s === "2") {
    return "N Kò Gbà";
  }
  if (
    s === "n kò gbà rárá" ||
    s === "nkgr" ||
    s === "nkfr" ||
    s === "strongly disagree" ||
    s === "sd" ||
    s === "1"
  ) {
    return "N Kò Gbà Rárá";
  }
  return String(val || "").trim();
}

function normalizeFaculty(val) {
  const s = String(val || "").trim().toLowerCase();
  if (s === "arts" || s === "faculty of arts" || s === "ẹ̀ka iṣẹ́-ọ̀nà") {
    return "Ẹ̀ka Iṣẹ́-Ọ̀nà";
  }
  if (s === "education" || s === "faculty of education" || s === "ẹ̀ka ìmọ̀ ẹ̀kọ́") {
    return "Ẹ̀ka Ìmọ̀ Ẹ̀kọ́";
  }
  return String(val || "").trim();
}

function normalizeDepartment(val) {
  const s = String(val || "").trim().toLowerCase();
  if (
    s === "linguistics and african languages" ||
    s === "department of linguistics and african languages" ||
    s === "ẹ̀ka ẹ̀kọ́ ìmọ̀ èdè àti àwọn èdè ilẹ̀ adúláwọ̀"
  ) {
    return "Ẹ̀ka Ẹ̀kọ́ Ìmọ̀ Èdè àti Àwọn Èdè Ilẹ̀ Adúláwọ̀";
  }
  if (
    s === "arts and social sciences education" ||
    s === "department of arts and social sciences education" ||
    s === "ẹ̀ka ẹ̀kọ́ iṣẹ́-ọ̀nà àti ìmọ̀ ẹ̀kọ́ àwùjọ"
  ) {
    return "Ẹ̀ka Ẹ̀kọ́ Iṣẹ́-Ọ̀nà àti Ìmọ̀ Ẹ̀kọ́ Àwùjọ";
  }
  return String(val || "").trim();
}

function sanitizeRowPayload(payload) {
  const roleYo = normalizeRole(payload.A3);
  const clean = {
    A1: normalizeFaculty(payload.A1),
    A2: normalizeDepartment(payload.A2),
    A3: roleYo,
    A4: normalizeLevel(payload.A4, roleYo),
    A5: normalizeAge(payload.A5),
    A6: normalizeGender(payload.A6),
    A7: normalizePriorAi(payload.A7),
    F1: String(payload.F1 || "").trim(),
    F2: String(payload.F2 || "").trim()
  };

  ["B", "C", "D", "E"].forEach(function (secKey) {
    LIKERT_ITEMS[secKey].items.forEach(function (item) {
      clean[item.id] = normalizeLikert(payload[item.id]);
    });
  });

  return clean;
}

// ============================================================================
// WEB APP ENDPOINTS: doPost (Receive) & doGet (Report / Ping / CSV)
// ============================================================================
function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : "";
    const payload = rawBody ? JSON.parse(rawBody) : (e && e.parameter ? e.parameter : {});

    const clean = sanitizeRowPayload(payload);
    if (!clean.A1 || !clean.A2 || !clean.A3) {
      return jsonOutput({
        ok: false,
        error: "Àwọn àlàyé pàtàkì (Ìpín A) kò pé."
      });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let rawSheet = ss.getSheetByName(CONFIG.RAW_SHEET_NAME);
    let numSheet = ss.getSheetByName(CONFIG.NUMERIC_SHEET_NAME);
    if (!rawSheet || !numSheet) {
      setupYorubaSpreadsheet();
      rawSheet = ss.getSheetByName(CONFIG.RAW_SHEET_NAME);
      numSheet = ss.getSheetByName(CONFIG.NUMERIC_SHEET_NAME);
    }

    const nextNum = Math.max(1, rawSheet.getLastRow());
    const submissionId = "OAU-" + String(nextNum).padStart(4, "0");
    const timestampStr = Utilities.formatDate(
      new Date(),
      CONFIG.TIMEZONE,
      "yyyy-MM-dd HH:mm:ss"
    );

    clean.id = submissionId;
    clean.timestamp = timestampStr;

    const rawRow = FIELDS.map(function (f) {
      return clean[f.key] !== undefined ? clean[f.key] : "";
    });

    const numRow = FIELDS.map(function (f) {
      const val = clean[f.key] !== undefined ? clean[f.key] : "";
      return Object.prototype.hasOwnProperty.call(LIKERT_SCORE, val)
        ? LIKERT_SCORE[val]
        : val;
    });

    rawSheet.appendRow(rawRow);
    numSheet.appendRow(numRow);

    return jsonOutput({
      ok: true,
      id: submissionId,
      timestamp: timestampStr,
      message: "A ti gba ìdáhùn rẹ ní èdè Yorùbá! Ẹ ṣeun púpọ̀."
    });
  } catch (err) {
    return jsonOutput({
      ok: false,
      error: err.message || String(err)
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {}
  }
}

function doGet(e) {
  const params = (e && e.parameter) || {};
  const action = params.action || "ping";

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG.RAW_SHEET_NAME);

  if (action === "ping") {
    return jsonOutput({
      ok: true,
      service: "OAU Yorùbá AI Thesis Questionnaire",
      totalResponses: rawSheet ? Math.max(0, rawSheet.getLastRow() - 1) : 0
    });
  }

  if (CONFIG.REPORT_PASSCODE) {
    const provided = String(params.passcode || "");
    if (provided !== CONFIG.REPORT_PASSCODE) {
      return jsonOutput({
        ok: false,
        requiresPasscode: true,
        error: "Kọ́kọ́rọ́ àṣírí kò tọ́."
      });
    }
  }

  function toCsvCell(cell) {
    let s;
    if (cell instanceof Date) {
      s = Utilities.formatDate(cell, CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
    } else {
      s = cell === null || cell === undefined ? "" : String(cell);
    }
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  if (!rawSheet || rawSheet.getLastRow() <= 1) {
    if (action === "export_csv") {
      const headerLine = FIELDS.map(function (f) { return toCsvCell(f.header); }).join(",");
      return ContentService.createTextOutput("\uFEFF" + headerLine)
        .setMimeType(ContentService.MimeType.CSV)
        .downloadAsFile("Idahun_Iwadi_AI_Yoruba.csv");
    }
    return jsonOutput({ ok: true, rows: [] });
  }

  const values = rawSheet.getDataRange().getValues();
  const dataRows = values.slice(1);

  if (action === "export_csv") {
    const csvLines = values.map(function (row) {
      return row.map(toCsvCell).join(",");
    });
    return ContentService.createTextOutput("\uFEFF" + csvLines.join("\r\n"))
      .setMimeType(ContentService.MimeType.CSV)
      .downloadAsFile("Idahun_Iwadi_AI_Yoruba.csv");
  }

  // action === "report"
  const rows = dataRows.map(function (r) {
    const obj = {};
    FIELDS.forEach(function (f, idx) {
      const rawVal = r[idx];
      if (f.key === "timestamp" && rawVal instanceof Date) {
        obj[f.key] = Utilities.formatDate(rawVal, CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
      } else {
        obj[f.key] = rawVal === null || rawVal === undefined ? "" : String(rawVal);
      }
    });
    return obj;
  });

  return jsonOutput({
    ok: true,
    total: rows.length,
    rows: rows
  });
}

// ============================================================================
// GOOGLE DOC STRICTLY-YORÙBÁ REPORT EXPORTER (FROM SHEET MENU)
// ============================================================================
function generateYorubaDocReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG.RAW_SHEET_NAME);
  if (!rawSheet || rawSheet.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert("Kò sí ìdáhùn kankan nínú '" + CONFIG.RAW_SHEET_NAME + "' síbẹ̀.");
    return;
  }

  const values = rawSheet.getDataRange().getValues().slice(1);
  const rows = values.map(function (r) {
    const obj = {};
    FIELDS.forEach(function (f, idx) {
      obj[f.key] = r[idx] === null || r[idx] === undefined ? "" : String(r[idx]);
    });
    return obj;
  });

  const dateStamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd");
  const doc = DocumentApp.create("Ìròyìn_Ìwádìí_AI_Yorùbá_" + dateStamp);
  const body = doc.getBody();

  body.appendParagraph("YUNIFÁSÍTÌ ỌBÁFẸ́MI AWÓLỌ́WỌ̀, ILÉ-IFẸ̀")
    .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph("ÌRÒYÌN ÀBÁJÁDE ÌWÁDÌÍ LÓRÍ ÀGBÉYẸ̀WÒ ÌLÒ Ẹ̀RỌ AYÉLUJÁRA ÒYE-ÀTỌWỌ́DÁ (AI) LÁÀÁRÍN ÀWỌN AKẸ́KỌ̀Ọ́")
    .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph("Àpapọ̀ Olùdáhùn: " + rows.length + "   |   Ọjọ́ Ìròyìn: " + dateStamp);

  // Demographic Summary
  body.appendParagraph("ÌPÍN A: ÀTÒJỌ FÁYẸ̀WÒ NÍPA ARA ẸNI")
    .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  const demoGroups = [
    { key: "A1", title: "Ẹ̀ka", cats: ["Ẹ̀ka Iṣẹ́-Ọ̀nà", "Ẹ̀ka Ìmọ̀ Ẹ̀kọ́"] },
    {
      key: "A2",
      title: "Ẹ̀ka Ẹ̀kọ́",
      cats: [
        "Ẹ̀ka Ẹ̀kọ́ Ìmọ̀ Èdè àti Àwọn Èdè Ilẹ̀ Adúláwọ̀",
        "Ẹ̀ka Ẹ̀kọ́ Iṣẹ́-Ọ̀nà àti Ìmọ̀ Ẹ̀kọ́ Àwùjọ"
      ]
    },
    { key: "A3", title: "Iṣẹ́ Rẹ (Ipò)", cats: ["Akẹ́kọ̀ọ́", "Olùkọ́"] },
    { key: "A4", title: "Ìpele Ẹ̀kọ́", cats: ["100", "200", "300", "400", "Kò Kàn Mí (Olùkọ́)"] },
    { key: "A5", title: "Ọjọ́ Orí", cats: ["16 – 20", "21 – 25", "26 – 30", "31+"] },
    { key: "A6", title: "Akọ / Abo", cats: ["Akọ", "Abo"] },
    { key: "A7", title: "Ìrírí Lílo AI Tẹ́lẹ̀", cats: ["Bẹ́ẹ̀ni", "Bẹ́ẹ̀kọ́"] }
  ];

  const demoTable = [["Ìbéèrè", "Ìsọ̀rí", "Iye", "Ìdá (%)"]];
  demoGroups.forEach(function (g) {
    g.cats.forEach(function (cat) {
      const cnt = rows.filter(function (r) { return r[g.key] === cat; }).length;
      const pct = rows.length ? ((cnt / rows.length) * 100).toFixed(1) + "%" : "0.0%";
      demoTable.push([g.title, cat, String(cnt), pct]);
    });
  });
  body.appendTable(demoTable);

  // Likert Sections B-E
  ["B", "C", "D", "E"].forEach(function (secKey) {
    const sec = LIKERT_ITEMS[secKey];
    body.appendParagraph(sec.title).setHeading(DocumentApp.ParagraphHeading.HEADING2);
    const tbl = [["S/N", "Àkóónú Ìbéèrè", "MGD", "MG", "NKG", "NKGR", "Ìpíndọ́gba", "Ìpinnu"]];

    sec.items.forEach(function (item, idx) {
      let c4 = 0, c3 = 0, c2 = 0, c1 = 0;
      rows.forEach(function (r) {
        if (r[item.id] === "Mo Gbà Dáadáa") c4++;
        else if (r[item.id] === "Mo Gbà") c3++;
        else if (r[item.id] === "N Kò Gbà") c2++;
        else if (r[item.id] === "N Kò Gbà Rárá") c1++;
      });
      const n = c4 + c3 + c2 + c1;
      const mean = n ? ((4 * c4 + 3 * c3 + 2 * c2 + c1) / n).toFixed(2) : "0.00";
      const dec = n === 0 ? "—" : (Number(mean) >= CONFIG.DECISION_THRESHOLD ? "Gbà" : "Kò Gbà");
      tbl.push([String(idx + 1), item.text, String(c4), String(c3), String(c2), String(c1), mean, dec]);
    });
    body.appendTable(tbl);
  });

  // Section F Open-ended
  body.appendParagraph("ÌPÍN F: ÀKÓJỌPỌ̀ ÌDÁHÙN ÌBÉÈRÈ ṢÍṢÍ")
    .setHeading(DocumentApp.ParagraphHeading.HEADING2);
  rows.forEach(function (r) {
    if (r.F1 || r.F2) {
      body.appendParagraph(r.id + " (" + r.A3 + " — " + r.A2 + ")").setBold(true);
      if (r.F1) body.appendParagraph("F1: " + r.F1);
      if (r.F2) body.appendParagraph("F2: " + r.F2);
    }
  });

  doc.saveAndClose();
  SpreadsheetApp.getUi().alert(
    "A ti ṣẹ̀dá Ìròyìn Google Doc ní èdè Yorùbá!\n\nÀdírẹ́sì Google Doc:\n" + doc.getUrl()
  );
}
