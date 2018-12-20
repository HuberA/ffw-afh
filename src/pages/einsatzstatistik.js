import React from 'react';
import Plot from 'react-plotly.js';
import Pie, {LineChart, ArrayLineChart} from "../components/pie_chart";
import Layout from "../components/layout";
import { graphql } from "gatsby";
import Map from "../components/map";
import Seo from "../components/seo";
import Range from 'rc-slider/lib/Range';

import 'rc-slider/assets/index.css';

const description = "Statistik der Einsätze der Feuerwehr Altfraunhofen"

function Counter(array) {
  array.forEach(val => this[val] = (this[val]||0) + 1);
}

function countWeighted(values, weights) {
  let obj = {}
  values.forEach((v, i) => obj[v] = (obj[v]|0)+weights[i] )
  return obj
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

function sum(values){
  let count = 0
  for(let i=0, n=values.length; i < n; i++){
    count += values[i]
  }
  return count
}

function cumsum(values){
  let count = 0
  let out = []
  for(let i=0, n=values.length; i< n; i++){
    count += values[i]
    out.push(count)
  }
  return out
}

class Einsatzstatistik extends React.Component{
  constructor(props){
      super(props);
      const old_nodes = this.props.data.old_data.edges.map(({node}) => ({
        id:node.id,
        alarmierungszeit: node.Alarmierung.zeitpunkt.slice(0, -3),
        kurzbericht: node.Kurzbericht,
        alarmierungsart: node.Alarmierung.art,
        einsatzart: node.Einsatzart,
        mannschatfsstaerke: node.Mannschaftsst_rke,
        einsatzende: (node.Einsatzende)?node.Alarmierung.zeitpunkt.slice(0, 11)+node.Einsatzende.slice(0, -3):null,
        einsatzortGeo: (node.Position)?{lat: node.Position.lat, lon: node.Position.lng}: null
      } ));
      const new_nodes = this.props.data.new_data.edges.map(({node}) => node)
      this.all_nodes = old_nodes.concat(new_nodes)
      this.mannschaft = this.all_nodes.map(node => parseInt(node.mannschatfsstaerke, 10)).map(n => (n < 40)?n:1)
      this.einsatzart = this.all_nodes.map(node => node.einsatzart)
      this.allEinsatzarten = new Set(this.einsatzart.filter(e => e !== null))
      this.startTimes = this.all_nodes.map(node => new Date(node.alarmierungszeit))
      this.endTimes = this.all_nodes.map(node => new Date(node.einsatzende))
      this.durations = this.startTimes.map((s, i) => (this.endTimes[i] - s)/60/60/1000)
      this.durations = this.durations.map(d => (d<0)?d+24:d)
      this.durations = this.durations.map(d => (d<0)?0:d)
      this.minTime = Math.min( ...this.startTimes )
      this.maxTime = Math.max( ...this.endTimes )
      this.ids = this.all_nodes.map(node => node.id)
      this.einsatzstunden = this.durations.map((dur, i) => dur * this.mannschaft[i])
      this.state = {
          hiddenNodes : this.all_nodes.map(() => false),
          timeRange: [0, (new Date(2100, 0)).getTime()],
          auswertung: "zahl"
      };

  }
  toggleHideEinsatzart(einsatzart){
    const toggleHide = this.einsatzart.map(e => e === einsatzart)
    this.setState(state =>({
      hiddenNodes: state.hiddenNodes.map((value, i) => toggleHide[i] !== value)
    }));
  }
  setRange(range){
    this.setState({
      timeRange: range
    })
  }
  
  render(){ 
    const firstYear = (new Date(this.minTime)).getFullYear()
    const lastYear = (new Date(this.maxTime)).getFullYear()+1
    const years = {}
    for(let i = firstYear; i <= lastYear; i++){
      years[(new Date(i, 0)).getTime()] = i
    }
    const validTimes = this.startTimes.map(t => this.state.timeRange[0] <= t.getTime()  && t.getTime() <= this.state.timeRange[1])
    const validValues = this.state.hiddenNodes.map((h, i) => !h && validTimes[i] )
    const einsatzstunden = this.einsatzstunden.filter((_, i) => validValues[i])
    const einsatzart = this.einsatzart.filter((_, i) => validValues[i])
    const counter = (this.state.auswertung == "zahl")? new Counter(einsatzart): countWeighted(einsatzart, einsatzstunden)
    delete counter['null']
    this.allEinsatzarten.forEach(e => {
      if (counter[e] === undefined){
        counter[e]=NaN
      }
    })
    const einsatzValues = (this.state.auswertung == "zahl")?einsatzart.map(e => 1):einsatzstunden
    const startTimes = this.startTimes.filter((_, i) => validValues[i] )
    const minutesOfDay = this.startTimes.filter((_, i) => validValues[i]).map(t => t.getHours()*60 + t.getMinutes())
    const minutesInBuckets = minutesOfDay.map(minute => Math.floor(minute/60))
    const hourBuckets = new Counter(minutesInBuckets)
    const auswertungName = (this.state.auswertung=="zahl")?"Anzahl Einsätze":"Einsatzstunden"
    for (let i = 0; i < 24; i++){
      if (hourBuckets[i] === undefined){
        hourBuckets[i] = 0
      }
    }
    return(
      <Layout>
          <Seo title={`Einsatzstatistik - Feuerwehr Altfraunhofen`} 
                  description_short={description}
                  description_long={description} 
                  url="http://feuerwehr-altfrauhofen.de"/>
          <h1>Einsatzstatistik</h1>
          {/*(typeof window !== `undefined`) && <Plot
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
          layout={ {height: 400, title: 'Einsatzarten',plot_bgcolor:'rgba(0,0,0,0)'} }
          config={{displayModeBar: false}}
        />*/}
         <h4>{`Es werden aktuell ${einsatzart.length} von ${validTimes.length} Einsätzen der Feuerwehr Altfraunhofen angezeigt,
          ${sum(einsatzstunden).toFixed(0)} von ${sum(this.einsatzstunden).toFixed(0)} Einsatzstunden.`}</h4>
        <div style={{marginBottom:"30px"}}>
          <Range min={this.minTime} max={this.maxTime} marks={years} defaultValue={[this.minTime, this.maxTime]} 
                 onAfterChange={e => this.setRange(e)} 
                 onChange={e => this.setRange(e)}/>
          </div>
          <select style={{padding: "16px 20px",
                          borderRadius: "4px",
                          backgroundColor: "#a81c1c",
                          color: "white"}} onChange={event=>this.setState({auswertung:event.target.value})}>
            <option value="zahl">Anzahl Alarmierungen</option>
            <option value="stunden">Einsatzstunden</option>
          </select>
          <Pie labels={Object.keys(counter)} 
               values={Array.from(Object.keys(counter), k=>counter[k])} 
               name={`${auswertungName} nach Einsatzart`}
               toggleVisible={e => this.toggleHideEinsatzart(e)}
               />
          <ArrayLineChart values={einsatzValues} x={startTimes} name={`${auswertungName} aufsummiert`}/>
          <LineChart values={hourBuckets}
                    name="Tageszeit Alarmierung"
                    />
          <Map einsatzgebiet={true}></Map>
      </Layout>
    )}
}

export default Einsatzstatistik;

export const query = graphql`{
  old_data: allData1Json(sort: {fields: [Alarmierung___zeitpunkt], order: DESC}, filter: {Alarmierung: {zeitpunkt: {ne: null}}}) {
    edges {
      node {
        id
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
        id
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