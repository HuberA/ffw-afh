import React from "react"
import { graphql } from "gatsby"
import Einsatz from "../components/einsatz"


export default ( all_data ) => {
    const { data, pageContext } = all_data;
    const previous = pageContext.previous;
    const next = pageContext.next;
    const einsatz = data.data1Json
    let e_ende = ''
    if (einsatz.Alarmierung && einsatz.Alarmierung.zeitpunkt && einsatz.Einsatzende){
        e_ende = einsatz.Alarmierung.zeitpunkt.split('T')[0] + 'T' + einsatz.Einsatzende
    }
    const new_einsatz = {
        id: einsatz.id,
        einsatzart: einsatz.Einsatzart,
        alarmierungsart: (einsatz.Alarmierung)?einsatz.Alarmierung.art:'',
        kurzbericht: einsatz.Kurzbericht,
        einsatzort: einsatz.Einsatzort,
        alarmierungszeit: (einsatz.Alarmierung)?einsatz.Alarmierung.zeitpunkt:'',
        einsatzende: e_ende,
        einsatzleiter: einsatz.Einsatzleiter,
        mannschatfsstaerke: einsatz.Mannschaftsst_rke,
        einsatzbericht_text: einsatz.Einsatzbericht, 
        alarmierte_einheiten: einsatz.alarmierte_Einheiten || '',  
    }
    if (einsatz.Position){
        new_einsatz.einsatzortGeo= {
            lon: einsatz.Position.lng,
            lat: einsatz.Position.lat
        }
    }
    if (data.image){
        new_einsatz.einsatzbild = data.image.childImageSharp
    }
    const new_data = {
        next: next,
        previous: previous,
        einsatz: new_einsatz
    }
    console.log("bilder:", einsatz.Bilder)
    //const image = (einsatz.Bilder && einsatz.Bilder.length > 0)?einsatz.Bilder[0]:null;
    return (
        <Einsatz data={new_data} />
    )
}

export const query = graphql`
query ($id: String!, $bild: String!) {
    image: file(sourceInstanceName: {eq: "data"}, relativePath: {eq: $bild}) {
      childImageSharp {
        fluid(maxWidth: 1000){
          ...GatsbyImageSharpFluid_tracedSVG
        }
      }
    }
    data1Json(id: {eq: $id}) {
      id
      Einsatzart
      Kurzbericht
      Einsatzort
      Alarmierung {
        zeitpunkt
        art
      }
      Einsatzende
      Einsatzdauer
      Einsatzleiter
      Mannschaftsst_rke
      Fahrzeuge_am_Einsatzort {
        text
      }
      alarmierte_Einheiten {
        text
      }
      Einsatzbericht
      Bilder
      Position {
        lat
        lng
      }
    }
  }
`
