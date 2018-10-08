import React from "react"
import Layout from "../components/layout"
import Img from "gatsby-image"
import Map from "../components/map"
import Navigation from "../components/navigation"

const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
const formatTime = {hour: 'numeric', minute: 'numeric'}

export default ({data}) => {
    const einsatz = data.einsatz;
    const feuerwehren = data.feuerwehren && data.feuerwehren.edges;
    const alarmierung = new Date(einsatz.alarmierungszeit);
    const einsatzende = new Date(einsatz.einsatzende);
    const einsatzdauer = einsatzende - alarmierung;
    const einsatzdauer_min = einsatzdauer / 60 /1000;
    const einsatzdauer_h = Math.trunc(einsatzdauer_min / 60);
    const einsatzdauer_min_rem = einsatzdauer_min - 60 * einsatzdauer_h;
    const einsatzdauer_str = (einsatzdauer_h)?`${einsatzdauer_h} Std. und ${einsatzdauer_min_rem} Min.`:`${einsatzdauer_min} Minuten`
    const alarmierte_einheiten = (feuerwehren)?<>
        <tr>
            <td>Alarmierte Einheiten:</td><td>{feuerwehren[0].node.name}</td>
        </tr>
        {
            feuerwehren.slice(1).map(({node}, index) =>{ console.log(node); return (
                <tr key={node.id}>
                    <td></td><td>{node.name}</td>
                </tr>
            );})
        }
    </>:((typeof einsatz.alarmierte_einheiten !== 'undefined' && einsatz.alarmierte_einheiten.length > 0)?<>
        <tr>
            <td>Alarmierte Einheiten:</td><td>{einsatz.alarmierte_einheiten[0].text}</td>
        </tr>
        {
            einsatz.alarmierte_einheiten.slice(1).map(({text}, index) =>{ console.log(text); return (
                <tr key={index}>
                    <td></td><td>{text}</td>
                </tr>
            )})
        }
    </>:"");
    return (
        <Layout>
             <h1>{einsatz.einsatzart}</h1>
            <Navigation previous={data.previous} next={data.next} parent="" path="einsaetze"/>
            {einsatz.einsatzbild &&
                <Img fluid={einsatz.einsatzbild.fluid} alt={einsatz.kurzbericht} backgroundColor="#A81C1C"/>}
            <h2>{einsatz.kurzbericht}</h2>
            <table>
               <tbody>
                    <tr>
                        <td>Einsatzort:</td><td>{einsatz.einsatzort || 'Unbekannt'}</td>
                    </tr>
                    <tr>
                        <td>Alarmierung:</td><td>{alarmierung.toLocaleString("de-DE", formatOptions)} Uhr</td>
                    </tr>
                    <tr>
                        <td>Alarmierung per:</td><td>{einsatz.alarmierungsart}</td>
                    </tr>
                    {einsatzdauer > 0 && <>
                    <tr>
                        <td>Einsatzende:</td><td>{einsatzende.toLocaleString("de-DE", formatTime)}</td>
                    </tr>
                    <tr>
                        <td>Einsatzdauer:</td><td>{einsatzdauer_str}</td>
                    </tr>
                    </>
                    }
                    {einsatz.einsatzleiter &&
                    <tr>
                        <td>Einsatzleiter:</td><td>{einsatz.einsatzleiter}</td>
                    </tr>
                    }
                    {einsatz.mannschatfsstaerke &&
                    <tr>
                        <td>Mannschaftsstärke:</td><td>{einsatz.mannschatfsstaerke}</td>
                    </tr>
                    }
                    {alarmierte_einheiten}
                </tbody>
            </table>
                       
            {einsatz.einsatzbericht && <div dangerouslySetInnerHTML={
                { __html: einsatz.childContentfulEinsatzEinsatzberichtTextNode.childMarkdownRemark.html}} />}
            {einsatz.einsatzbericht_text && <div>{einsatz.einsatzbericht_text.map((text, index)=>(
                <p key={index}>{text}</p>
            ))}</div>}

            {einsatz.einsatzortGeo && 
                <Map lat={einsatz.einsatzortGeo.lat} lng={einsatz.einsatzortGeo.lon} />
            }
            <Navigation previous={data.previous} next={data.next} parent="" path="einsaetze"/>
        </Layout>
    )
}