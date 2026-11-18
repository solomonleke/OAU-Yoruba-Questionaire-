/**
 * Zero-dependency OpenXML (.xlsx) & UTF-8 BOM (.csv) exporter.
 * Guarantees Yorùbá diacritics & tonal marks remain intact in Microsoft Excel.
 */
window.YorubaExcelExport = (function () {
  "use strict";

  const CRC_TABLE = (function () {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[i] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
      crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function escapeXml(val) {
    return String(val)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function colToLetter(indexZeroBased) {
    let n = indexZeroBased + 1;
    let out = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      out = String.fromCharCode(65 + rem) + out;
      n = Math.floor((n - 1) / 26);
    }
    return out;
  }

  function sanitizeSheetName(name) {
    return String(name || "Sheet")
      .replace(/[\\/?*\[\]:]/g, "_")
      .slice(0, 31);
  }

  function buildWorksheetXml(rows, boldFirstRow) {
    const safeRows = Array.isArray(rows) ? rows : [];
    const colWidths = [];

    const rowXml = safeRows
      .map((row, rIdx) => {
        const rNum = rIdx + 1;
        const cells = (row || [])
          .map((cell, cIdx) => {
            const ref = colToLetter(cIdx) + rNum;
            const styleAttr = boldFirstRow && rIdx === 0 ? ' s="1"' : "";
            const strVal = cell === null || cell === undefined ? "" : String(cell);
            colWidths[cIdx] = Math.min(
              60,
              Math.max(colWidths[cIdx] || 12, strVal.length + 3)
            );

            if (typeof cell === "number" && Number.isFinite(cell)) {
              return '<c r="' + ref + '"' + styleAttr + "><v>" + cell + "</v></c>";
            }
            return (
              '<c r="' +
              ref +
              '"' +
              styleAttr +
              ' t="inlineStr"><is><t xml:space="preserve">' +
              escapeXml(strVal) +
              "</t></is></c>"
            );
          })
          .join("");
        return '<row r="' + rNum + '">' + cells + "</row>";
      })
      .join("");

    const colsXml = colWidths.length
      ? "<cols>" +
        colWidths
          .map(
            (w, idx) =>
              '<col min="' +
              (idx + 1) +
              '" max="' +
              (idx + 1) +
              '" width="' +
              w +
              '" customWidth="1"/>'
          )
          .join("") +
        "</cols>"
      : "";

    return (
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      colsXml +
      "<sheetData>" +
      rowXml +
      "</sheetData>" +
      "</worksheet>"
    );
  }

  function buildZip(files) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    files.forEach((f) => {
      const nameBytes = encoder.encode(f.name);
      const dataBytes =
        f.content instanceof Uint8Array ? f.content : encoder.encode(f.content);
      const crc = crc32(dataBytes);

      const localHeader = new Uint8Array(30 + nameBytes.length);
      const lv = new DataView(localHeader.buffer);
      lv.setUint32(0, 0x04034b50, true);
      lv.setUint16(4, 20, true);
      lv.setUint16(6, 0x0800, true);
      lv.setUint16(8, 0, true);
      lv.setUint16(10, 0, true);
      lv.setUint16(12, 0x5421, true);
      lv.setUint32(14, crc, true);
      lv.setUint32(18, dataBytes.length, true);
      lv.setUint32(22, dataBytes.length, true);
      lv.setUint16(26, nameBytes.length, true);
      lv.setUint16(28, 0, true);
      localHeader.set(nameBytes, 30);

      localParts.push(localHeader, dataBytes);

      const central = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(central.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, 0, true);
      cv.setUint16(14, 0x5421, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, dataBytes.length, true);
      cv.setUint32(24, dataBytes.length, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      central.set(nameBytes, 46);

      centralParts.push(central);
      offset += localHeader.length + dataBytes.length;
    });

    const cdSize = centralParts.reduce((sum, p) => sum + p.length, 0);
    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, offset, true);
    ev.setUint16(20, 0, true);

    const totalLen = offset + cdSize + eocd.length;
    const out = new Uint8Array(totalLen);
    let ptr = 0;
    localParts.forEach((p) => {
      out.set(p, ptr);
      ptr += p.length;
    });
    centralParts.forEach((p) => {
      out.set(p, ptr);
      ptr += p.length;
    });
    out.set(eocd, ptr);
    return out;
  }

  function buildWorkbookBytes(sheets) {
    const safeSheets = sheets.map((s, i) => ({
      name: sanitizeSheetName(s.name || "Téébù_" + (i + 1)),
      rows: s.rows || [],
      boldFirstRow: s.boldFirstRow !== false
    }));

    const sheetOverrides = safeSheets
      .map(
        (_, i) =>
          '<Override PartName="/xl/worksheets/sheet' +
          (i + 1) +
          '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
      )
      .join("");

    const contentTypes =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      sheetOverrides +
      "</Types>";

    const rootRels =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
      "</Relationships>";

    const workbookXml =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      "<sheets>" +
      safeSheets
        .map(
          (s, i) =>
            '<sheet name="' +
            escapeXml(s.name) +
            '" sheetId="' +
            (i + 1) +
            '" r:id="rId' +
            (i + 1) +
            '"/>'
        )
        .join("") +
      "</sheets>" +
      "</workbook>";

    const workbookRels =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      safeSheets
        .map(
          (_, i) =>
            '<Relationship Id="rId' +
            (i + 1) +
            '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' +
            (i + 1) +
            '.xml"/>'
        )
        .join("") +
      '<Relationship Id="rId' +
      (safeSheets.length + 1) +
      '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      "</Relationships>";

    const stylesXml =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<fonts count="2">' +
      '<font><sz val="11"/><name val="Noto Sans"/></font>' +
      '<font><b/><sz val="11"/><color rgb="FF13294B"/><name val="Noto Sans"/></font>' +
      "</fonts>" +
      '<fills count="3">' +
      '<fill><patternFill patternType="none"/></fill>' +
      '<fill><patternFill patternType="gray125"/></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFEEF2F8"/></patternFill></fill>' +
      "</fills>" +
      '<borders count="2">' +
      "<border><left/><right/><top/><bottom/><diagonal/></border>" +
      '<border><left style="thin"><color rgb="FFCCCCCC"/></left><right style="thin"><color rgb="FFCCCCCC"/></right><top style="thin"><color rgb="FFCCCCCC"/></top><bottom style="thin"><color rgb="FFCCCCCC"/></bottom></border>' +
      "</borders>" +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      '<cellXfs count="2">' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
      '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>' +
      "</cellXfs>" +
      "</styleSheet>";

    const zipEntries = [
      { name: "[Content_Types].xml", content: contentTypes },
      { name: "_rels/.rels", content: rootRels },
      { name: "xl/workbook.xml", content: workbookXml },
      { name: "xl/_rels/workbook.xml.rels", content: workbookRels },
      { name: "xl/styles.xml", content: stylesXml }
    ];

    safeSheets.forEach((s, i) => {
      zipEntries.push({
        name: "xl/worksheets/sheet" + (i + 1) + ".xml",
        content: buildWorksheetXml(s.rows, s.boldFirstRow)
      });
    });

    return buildZip(zipEntries);
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 250);
  }

  function downloadXlsx(filename, sheets) {
    const bytes = buildWorkbookBytes(sheets);
    const blob = new Blob([bytes], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    triggerDownload(blob, filename);
  }

  function downloadCsv(filename, rows) {
    const csvBody = (rows || [])
      .map((row) =>
        (row || [])
          .map((cell) => {
            const s = cell === null || cell === undefined ? "" : String(cell);
            return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
          })
          .join(",")
      )
      .join("\r\n");

    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const textBytes = new TextEncoder().encode(csvBody);
    const blob = new Blob([bom, textBytes], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, filename);
  }

  return {
    buildWorkbookBytes: buildWorkbookBytes,
    downloadXlsx: downloadXlsx,
    downloadCsv: downloadCsv
  };
})();

