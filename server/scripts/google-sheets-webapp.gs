/**
 * Codex Nova — Google Apps Script for Enroll / Talk to a Mentor forms.
 *
 * Setup:
 * 1. Open the Google Sheet.
 * 2. Extensions → Apps Script.
 * 3. Paste this file and save.
 * 4. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the web app URL into server env: GOOGLE_SHEETS_WEBAPP_URL
 *
 * Do not put this URL in frontend code.
 */

const SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const sheet = getOrCreateSheet_();
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.type || '',
      data.fullName || data.name || '',
      data.email || '',
      data.phone || '',
      data.city || '',
      data.college || '',
      data.degree || '',
      data.branch || '',
      data.year || '',
      data.course || '',
      data.preferredMode || '',
      data.subject || '',
      data.message || '',
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(error) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp',
      'Type',
      'Full Name',
      'Email',
      'Phone',
      'City',
      'College',
      'Degree',
      'Branch',
      'Year',
      'Course',
      'Preferred Mode',
      'Subject',
      'Message',
    ]);
  }
  return sheet;
}
