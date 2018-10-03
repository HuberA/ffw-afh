import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export default ( {data} ) => {
    const einsatz = data.data1Json
    console.log("einsatz", einsatz)
    const image = (einsatz.Bilder && einsatz.Bilder.length > 0)?einsatz.Bilder[0].image:null;
    return (
        <Layout>
            <h1>{einsatz.Einsatzart}</h1>
            {image && <img src={image} alt={einsatz.Kurzbericht}/>}
            <h2>{einsatz.Kurzbericht}</h2>
            {einsatz.Alarmierung !== null &&<p>Alarmierung: {new Date(einsatz.Alarmierung.zeitpunkt).toLocaleString("de-DE", formatOptions)}</p>}
            <p>Mannschaftsstärke: {einsatz.Mannschaftsst_rke}</p>
            {einsatz.Einsatzbericht && einsatz.Einsatzbericht.map(para => <p>{para}</p>)}
            
        </Layout>
    )
}

export const query = graphql`
query($id: String!) {
		data1Json(id: { eq: $id }) {
        id
        Einsatzart 
        Kurzbericht
        Einsatzort
        Alarmierung{
            zeitpunkt
        }
        Einsatzende
        Einsatzdauer
        Einsatzleiter
        Mannschaftsst_rke
        Fahrzeuge_am_Einsatzort {text}
        alarmierte_Einheiten{ text}
        Einsatzbericht
        Bilder{
            image
        }
    }
  }
`
