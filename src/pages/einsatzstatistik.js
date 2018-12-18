import React from 'react';
import Plot from 'react-plotly.js';
import Layout from "../components/layout"
import { graphql } from "gatsby"
import Map from "../components/map"
import Seo from "../components/seo"

const description = "Statistik der Einsätze der Feuerwehr Altfraunhofen"

function Counter(array) {
  array.forEach(val => this[val] = (this[val]||0) + 1);
}
const colors= {}
/*    "Technische Hilfeleistung": "#621ca8", //#1ca8a8",
    "Sonstige Tätigkeiten": "#1ca862",
    "Brandeinsatz": "#A81C1C",

}*/
const other_colors=["#a81c1c",  "#62a81c",  "#1ca8a8",  "#621ca8"]
  
let used_colors = 0;
function getColor(name) {
  const color = colors[name]
  if (color === undefined){
    colors[name] = other_colors[used_colors];
    used_colors += 1; 
    return colors[name]
  }
  return color
}

export default ({data}) =>{ 
  const old_nodes = data.old_data.edges.map(({node}) => ({
    alarmierungszeit: node.Alarmierungszeit,
    kurzbericht: node.Kurzbericht,
    alarmierungsart: node.Alarmierung.art,
    einsatzart: node.Einsatzart,
    mannschatfsstaerke: node.Mannschaftsst_rke,
    einsatzende: node.Einsatzende,
    einsatzortGeo: (node.Position)?{lat: node.Position.lat, lon: node.Position.lng}: null
  } ));
  const new_nodes = data.new_data.edges.map(({node}) => node)
  const all_nodes = old_nodes.concat(new_nodes)
  const mannschaft = all_nodes.map(node => parseInt(node.mannschatfsstaerke, 10))
  const einsatzart = all_nodes.map(node => node.einsatzart)
  const counter = new Counter(einsatzart.filter(e => e !== null))
  console.log(counter)

  return(
    <Layout>
        <Seo title={`Einsatzstatistik - Feuerwehr Altfraunhofen`} 
                 description_short={description}
                 description_long={description} 
                 url="http://feuerwehr-altfrauhofen.de"/>
        <h1>Einsatzstatistik</h1>
        <Plot
        data={[
          {
            labels: Object.keys(counter),
            values: Array.from(Object.keys(counter), k=>counter[k]),
            marker: {
            colors: Array.from(Object.keys(counter), k=>getColor(k)),
            },
            type: 'pie'

          },
        ]}
        layout={ {width: 800, height: 400, title: 'Einsatzarten',plot_bgcolor:'rgba(0,0,0,0)'} }
        config={{displayModeBar: false}}
      />
        <Map einsatzgebiet={true}></Map>
    </Layout>
)}

export const query = graphql`{
  old_data: allData1Json(sort: {fields: [Alarmierung___zeitpunkt], order: DESC}, filter: {Alarmierung: {zeitpunkt: {ne: null}}}) {
    edges {
      node {
        Alarmierung {
          zeitpunkt
          art
        }
        Einsatzart
        Mannschaftsst_rke
        Einsatzende
        Position {
          lat
          lng
        }
        Kurzbericht
      }
    }
  }
  new_data: allContentfulEinsatz(sort: {fields: [alarmierungszeit], order: DESC}) {
    edges {
      node {
        kurzbericht
        alarmierungszeit
        alarmierungsart
        einsatzart
        mannschatfsstaerke
        einsatzende
        einsatzortGeo {
          lat
          lon
        }
      }
    }
  }
}`