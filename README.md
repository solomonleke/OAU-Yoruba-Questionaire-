# OAU Yorùbá AI Thesis Questionnaire & Strictly-Yorùbá Google Sheets Pipeline

Bilingual web questionnaire built from `OAU_Yoruba_AI_Thesis_Questionnaire-v2.docx` for **Obafemi Awolowo University (OAU), Ilé-Ifẹ̀**.

- **Questionnaire (`index.html`)**: Defaults to **Yorùbá**, with an instant switcher for **Èdè Méjì (Bilingual)** and **English**.
- **Google Sheet / Excel & Reports (`google-apps-script/Code.gs` & `report.html`)**: **Strictly in Yorùbá** — regardless of which display language a respondent selects while filling out the form, all saved headers, choice values, statistical summary tables, exported `.xlsx`/`.csv` files, and printable/Google Doc reports remain strictly in Yorùbá.

---

## Project Structure

- `index.html` — Bilingual questionnaire interface (mobile & desktop friendly).
- `report.html` — Researcher report page strictly in Yorùbá (live tables, print/PDF, `.xlsx` & `.csv` downloads).
- `assets/js/questions.js` — Canonical Yorùbá questions + English translations for all 40 items (`Ìpín A`–`Ìpín F`).
- `assets/js/app.js` — Language switcher, conditional Q4 (`Ìpele Ẹ̀kọ́`) logic for `Olùkọ́`, validation, draft auto-save, and submission handler.
- `assets/js/report.js` & `assets/js/xlsx-export.js` — Live Yorùbá statistical analysis and native multi-sheet `.xlsx` / UTF-8 BOM `.csv` export.
- `assets/js/config.js` — Configuration file where you paste your Google Apps Script Web App URL.
- `google-apps-script/Code.gs` — All-in-one Google Apps Script (sheet setup, live Yorùbá report formulas, `doPost` receiver, `doGet` API, CSV export, and Google Doc report exporter).

---

## Step 1: Set Up Google Sheets ("Google Excel")

1. Open [Google Sheets](https://sheets.new) and create a blank spreadsheet (e.g., *Àbájáde Ìwádìí AI Yorùbá - OAU*).
2. Go to **Extensions → Apps Script**.
3. Delete any default code inside `Code.gs` and paste the entire contents of `google-apps-script/Code.gs`.
4. Click **Save** (`Ctrl+S`).
5. In the top toolbar, select **`setupYorubaSpreadsheet`** from the function dropdown and click **Run**.
6. Approve the Google authorization prompt (if you see *"Google hasn't verified this app"*, click **Advanced → Go to ... (unsafe) → Allow** — this is your own script).
7. Return to your Google Sheet. You will now see three strictly-Yorùbá tabs:
   - `Ìdáhùn_Ìwádìí` — Raw responses strictly in Yorùbá.
   - `Àbájáde_Onínọ́mbà` — Numeric coding (`MGD=4`, `MG=3`, `NKG=2`, `NKGR=1`) for statistical verification.
   - `Àkójọpọ̀_Àbájáde` — Auto-updating Yorùbá frequency, percentage, mean (`Ìpíndọ́gba`), and decision (`Gbà`/`Kò Gbà`) report sheet.
   - A custom **`Ìwé Ìbéèrè Yorùbá`** menu is also added to Google Sheets, including **Ṣẹ̀dá Ìròyìn Google Doc** to generate a formatted Yorùbá report document in Google Drive.

---

## Step 2: Deploy the Apps Script Web App

1. Inside Apps Script, click **Deploy → New deployment**.
2. Click the gear icon next to *Select type* and choose **Web app**.
3. Configure:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy** and copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).

> **Optional Report Passcode:** To protect `report.html` and `?action=report` from public viewing, set `REPORT_PASSCODE: "YOUR_CODE"` in `Code.gs` (re-deploy a new version) and set `REQUIRE_REPORT_PASSCODE: true` in `assets/js/config.js`.

---

## Step 3: Connect the Web Questionnaire

1. Open `assets/js/config.js`.
2. Paste your Web app URL into `APPS_SCRIPT_URL`:
   ```js
   APPS_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
   ```
3. Commit and push to GitHub.

---

## Step 4: Host Free on GitHub Pages

1. Go to your GitHub repository **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`, then click **Save**.
4. Share the generated GitHub Pages URL (`https://<username>.github.io/<repo>/`) with OAU students and lecturers, and view live Yorùbá reports anytime at `/report.html`.

