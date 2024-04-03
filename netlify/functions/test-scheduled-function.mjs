const { createHash } = await import('node:crypto');
const https = require('https');
import { createReadStream } from 'node:fs';




export default async (req) => {
    const { next_run } = await req.json()
    const response = await fetch("https://app.divera247.com/api/v2/events/ics?accesskey=FDl5vwsCIjNLwodFXKMQ-biWDZppdeyRLMIoF5TSEo1Ww2hyU0NIm2BQZBJffllS&ucr=628582")
    const result = await response.text()
    const matches = [...result.matchAll(/LAST-MODIFIED:(\d{4})([01]\d)([0-3]\d)T([0-2]\d)([0-5]\d)([0-5]\d)Z/g)];
    const date = new Date(Math.max(...matches.map(match => Date.parse(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}`))));
    console.log('max date:', date.toISOString())
    const website_response = await fetch(`${Netlify.env.get(URL)}/kalender/latest_change.txt`)
    const website_date = Date.parse(await website_response.text())

    if (website_date < date) {
        console.log('trigger rebuild!!');
        await fetch("https://api.netlify.com/build_hooks/660dc8d88d457f4a6eba3454", { method: "POST" });
        Netlify.env.set("CALENDAR_HASH", hashHex);
    } else {
        console.log('Calendar already known.')
    }


    console.log("Received event! Next invocation at:", next_run);
}

export const config = {
    schedule: "0,5,10,15,20,25,30,35,40,45,55 * * * *"
}