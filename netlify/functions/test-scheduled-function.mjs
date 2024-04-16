const { createHash } = await import('node:crypto');
const https = require('https');
import { createReadStream } from 'node:fs';


async function fetchCalendar(url) {
    const response = await fetch(url);
    const result = await response.text();
    const matches = [...result.matchAll(/(SUMMARY:|DESCRIPTION:|DTSTART|DTEND).*/g)];
    const modifiedMatches = [...result.matchAll(/LAST-MODIFIED:(\d{4})([01]\d)([0-3]\d)T([0-2]\d)([0-5]\d)([0-5]\d)Z/g)];
    const changeDate = new Date(Math.max(...modifiedMatches.map(match => Date.parse(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`))));
    console.log('change date:', changeDate)
    return [matches.map(match => match[0]).join('\n'), changeDate];
}


export default async (req) => {
    const { next_run } = await req.json();
    const [linesDivera, changeDivera] = await fetchCalendar("https://app.divera247.com/api/v2/events/ics?accesskey=FDl5vwsCIjNLwodFXKMQ-biWDZppdeyRLMIoF5TSEo1Ww2hyU0NIm2BQZBJffllS&ucr=628582");
    const websiteUrl = `${Netlify.env.get("URL")}/calendar.ics`;
    const [linesWebsite, changeWebsite] = await fetchCalendar(websiteUrl);

    const websiteAndDiveraChanged = linesDivera !== linesWebsite;
    const diveraTimeChanged = changeDivera > changeWebsite;
    console.log('website and divera unequal:', websiteAndDiveraChanged, "time changed divera:", diveraTimeChanged);

    if (websiteAndDiveraChanged && diveraTimeChanged) {
        console.log('wait some time and check again');
        await new Promise(resolve => setTimeout(resolve, 5000));
        const [linesWebsite, changeWebsite] = await fetchCalendar(websiteUrl);
        const websiteAndDiveraChanged = linesDivera !== linesWebsite;
        const diveraTimeChanged = changeDivera > changeWebsite;
        if (websiteAndDiveraChanged && diveraTimeChanged) {
            console.log('trigger rebuild!!');
            await fetch("https://api.netlify.com/build_hooks/660dc8d88d457f4a6eba3454", { method: "POST" });
        } else {
            console.log("website was updated in the meantime!!");
        }
    } else {
        console.log('Calendar already known.')
    }


    console.log("Received event! Next invocation at:", next_run);
}

export const config = {
    schedule: "0,5,10,15,20,25,30,35,40,45,55 * * * *"
}
