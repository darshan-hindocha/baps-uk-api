import { GoogleSpreadsheet } from "google-spreadsheet";

export async function connectGoogleSheet() {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_DOC_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
      ? process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
      : "",
    // @ts-ignore
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });
  await doc.loadInfo();
  return doc;
}

export const doc = connectGoogleSheet();
