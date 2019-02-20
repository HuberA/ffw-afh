import React from "react"
import Layout from "../components/layout"
import Img from "gatsby-image"
import Map from "../components/map"
import Navigation from "../components/navigation"
import Seo from "../components/seo"
import moment from 'moment';
import 'moment-timezone';

const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
const formatTime = {hour: 'numeric', minute: 'numeric'}

const ExtLink = ( {link, name, i}) => (
    <a href={link} alt={`Presselink ${i}`} target="_blank" rel="noopener noreferrer">{name}</a>
)

const Presselinks = ({data}) => {
    const linkNames = data.map(url => url.match(/[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/)[0])
    return(
        <>
        <tr>
            <td>Presselink</td><td> <ExtLink link={data[0]} name={linkNames[0]} i={0}/></td>
        </tr>
        { data.length > 1 &&
            data.slice(1).map((link, i) => (
            <tr key={i+1}>
                <td></td><td> <ExtLink link={link} name={linkNames[i+1]} i={i+1}/></td>
            </tr>
        ))
        }
        </>
    )
}

export default ({data}) => {
    const einsatz = data.einsatz;
    const alarmierung = moment.tz(einsatz.alarmierungszeit, "Europe/Berlin").toDate();
    const einsatzende = moment.tz(einsatz.einsatzende, "Europe/Berlin").toDate();
    const einsatzdauer = einsatzende - alarmierung;
    const einsatzdauer_min = einsatzdauer / 60 /1000;
    const einsatzdauer_h = Math.trunc(einsatzdauer_min / 60);
    const einsatzdauer_min_rem = einsatzdauer_min - 60 * einsatzdauer_h;
    const einsatzdauer_str = (einsatzdauer_h)?`${einsatzdauer_h} Std. und ${einsatzdauer_min_rem} Min.`:`${einsatzdauer_min} Minuten`
    const alarmierte_einheiten = (typeof einsatz.alarmierteEinheiten !== 'undefined' 
                                  && einsatz.alarmierteEinheiten !== null 
                                  && einsatz.alarmierteEinheiten.length > 0)?<>
        <tr>
            <td>Alarmierte Einheiten:</td><td>{einsatz.alarmierteEinheiten[0].name}</td>
        </tr>
        {
            einsatz.alarmierteEinheiten.slice(1).map(({name}, index) =>{ return (
                <tr key={index}>
                    <td></td><td>{name}</td>
                </tr>
            )})
        }
    </>:null;
    const description_short = (einsatz.einsatzbericht)?einsatz.childContentfulEinsatzEinsatzberichtTextNode.childMarkdownRemark.excerpt:
        (einsatz.einsatzbericht_text && einsatz.einsatzbericht_text[0])?einsatz.einsatzbericht_text[0].substring(0, 35):null
    const description_long = (einsatz.einsatzbericht)?einsatz.childContentfulEinsatzEinsatzberichtTextNode.childMarkdownRemark.excerpt2:
    (einsatz.einsatzbericht_text && einsatz.einsatzbericht_text[0])?einsatz.einsatzbericht_text[0].substring(0, 65):null
    const image = (einsatz.einsatzbild)?einsatz.einsatzbild.fixed.src:null
    return (
        <Layout>
            <Seo title={`${einsatz.kurzbericht} - ${einsatz.einsatzart}`} 
                 description_short={description_short}
                 description_long={description_long}
                 image={image} 
                 url="http://feuerwehr-altfraunhofen.de"/>
             <h1>{einsatz.einsatzart}</h1>
            <Navigation previous={data.previous} next={data.next} parent="" path="einsaetze" name="Einsatz"/>
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
                    {einsatz.presselink && 
                    <Presselinks data={einsatz.presselink}/>
                    }
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
            <Navigation previous={data.previous} next={data.next} parent="" path="einsaetze" name="Einsatz"/>
            <p> <b>Wichtiger Hinweis:</b> Auf unserer Internetseite berichten wir ausführlich (also auch mit Bildmaterial) über unser Einsatzgeschehen. 
                Bilder werden erst gemacht, wenn das Einsatzgeschehen dies zulässt! Es werden keine Bilder von Verletzten oder Toten gemacht oder hier veröffentlicht!
                Sollten Sie Einwände gegen die hier veröffentlichen Fotos oder Berichte haben, wenden Sie sich bitte vertrauensvoll an unseren Webmaster.</p>
        </Layout>
    )
}