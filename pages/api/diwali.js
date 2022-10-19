import { connectGoogleSheet } from "../../lib/connectGoogleSheets";

import cacheData from "memory-cache";

async function fetchWithCache(key) {
    const value = cacheData.get(key);
    if (value) {
        return value;
    } else {
        const doc = await connectGoogleSheet();
        const sheet = await doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        let data = {}
        rows.forEach((row) => {
            const centerFirstLetter = row.centreName[0].toUpperCase();
                const rowItems = {
                  centreName: row?.centreName ? row.centreName : "",
                  address: row?.address ? row.address : "",
                  eventOneDate: row?.eventOneDate ? row.eventOneDate : "",
                  eventOneDetails: row?.eventOneDetails ? row.eventOneDetails : "",
                  eventTwoDate: row?.eventTwoDate ? row.eventTwoDate : "",
                  eventTwoDetails: row?.eventTwoDetails ? row.eventTwoDetails : "",
                };
            if (!data[centerFirstLetter]) {
                data[centerFirstLetter] = [];
            }
            data[centerFirstLetter].push(rowItems);
        });
        const minutes = 1;
        cacheData.put(key, data, 1000 * 60 * minutes);
        return data;
    }
}

export default async function handler(req, res) {

    const data = await fetchWithCache("diwali");
    res.status(200).json(data);
}

