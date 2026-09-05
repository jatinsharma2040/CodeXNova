import { env } from '../config/env.js';

type LeadRow = Record<string, string | number | undefined | null>;

export async function saveLeadToGoogleSheet(row: LeadRow) {
  const url = env.GOOGLE_SHEETS_WEBAPP_URL.trim();
  if (!url) {
    console.warn('[google-sheets] GOOGLE_SHEETS_WEBAPP_URL is not set. Lead saved to MongoDB only.');
    return;
  }

  const payload = {
    ...row,
    timestamp: new Date().toISOString(),
    sheetId: env.GOOGLE_SHEET_ID,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  });

  const text = await response.text();
  if (!response.ok || /<!doctype html/i.test(text) || /<html/i.test(text)) {
    throw new Error('Saved locally, but Google Sheet update failed. Please try again.');
  }

  if (text) {
    try {
      const parsed = JSON.parse(text) as { ok?: boolean; success?: boolean };
      if (parsed.ok === false || parsed.success === false) {
        throw new Error('Saved locally, but Google Sheet update failed. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Saved locally')) throw error;
    }
  }
}
