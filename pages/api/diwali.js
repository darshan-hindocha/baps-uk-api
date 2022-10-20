import {connectGoogleSheet} from "../../lib/connectGoogleSheets";
import Cors from 'cors'

import cacheData from "memory-cache";

const cors = Cors({
    methods: ['GET'],
    origin: true,
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
    req,
    res,
    fn
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

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
                addressTwo: row?.addressTwo ? row.addressTwo : "",
                eventThreeDate: row?.eventThreeDate ? row.eventThreeDate : "",
                eventThreeDetails: row?.eventThreeDetails ? row.eventThreeDetails : "",
            };
            if (!data[centerFirstLetter]) {
                data[centerFirstLetter] = [];
            }
            data[centerFirstLetter].push(rowItems);
            data[centerFirstLetter].sort((a, b) => {
                return a.centreName.localeCompare(b.centreName);
            });
        });
        const minutes = 1;
        cacheData.put(key, data, 1000 * 60 * minutes);
        return data;
    }
}

export default async function handler(req, res) {
    await runMiddleware(req, res, cors)
    const data = await fetchWithCache("diwali");
    res.status(200).json(data);
}

