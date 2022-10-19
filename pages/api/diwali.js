import { connectGoogleSheet } from "../../lib/connectGoogleSheets";

export default async function handler(req, res) {
    const doc = await connectGoogleSheet();
    const sheet = await doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    res.status(200).json(rows.map((row) => row._rawData));
}

