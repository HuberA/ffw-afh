import React from 'react';
import {Pie, Line, Scatter} from 'react-chartjs-2';

const colors= {}
/*    "Technische Hilfeleistung": "#621ca8", //#1ca8a8",
    "Sonstige Tätigkeiten": "#1ca862",
    "Brandeinsatz": "#A81C1C",

}*/
const other_colors=["#a81c1c",  "#62a81c",  "#1ca8a8",  "#621ca8", "#1F77B4", "#FF7F0E"]
  
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

function cumsum(values){
  let count = 0
  let out = []
  for(let i=0, n=values.length; i< n; i++){
    count += values[i]
    out.push(count)
  }
  return out
}

const data = (labels, values) => ({
	labels: labels,
	datasets: [{
		data: values,
		backgroundColor: labels.map(getColor),
        hoverBackgroundColor: labels.map(getColor),
	}]
});

export default ({labels, values, name, toggleVisible}) => {
    return(
      <div>
        <h3>{name}</h3>
        <Pie data={data(labels, values)} 
             legend={{
                 onClick: (e, item) => toggleVisible(item.text),
                 position: "right",
            }} 
             />
      </div>
)}

const lineData = (values) =>{
  let sortable = [];
  for(let val in values){
    sortable.push([val, values[val]])
  }
  sortable.sort((a, b)=> a[0]-b[0])
  const labels = sortable.map(v => v[0])
  const vals = sortable.map(v => v[1])
return {
  labels: labels,
  datasets: [
    {
      borderColor: "#a81c1c",
      backgroundColor: 'rgba(168, 28, 28, 0.4)',
      label: "Zeit",
      fill: false,
      data: vals
    }
  ]
}
}

export const LineChart = ({values, name}) => (
  <div>
    <h3>{name}</h3>
    <Line data={lineData(values)} />
  </div>
)

const arrayLineData = (values, x, labels) => {
  let sortable = values.map((v, i)=>[x[i], v])
  sortable.sort((a,b)=> a[0]-b[0])

  let count =0
  const vals = sortable.map( v =>{count+=v[1];return{x:v[0].getTime()/60/60/1000/24/365.25 + 1970 , y:count}})
  return{
    labels: ['Scatter'],
    datasets: [
      {
        pointBorderColor: "#a81c1c",
        borderColor: "rgba(168, 28, 28, 0.5)",
        backgroundColor: "rgba(168, 28, 28, 1)",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointRadius:1,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        label: "Werte",
        fill: false,
        showLine: true,
        data: vals
      }
    ]
  }
}

export const ArrayLineChart = ({values, name, x}) => (
  <div>
    <h3>{name}</h3>
    <Scatter data={arrayLineData(values, x)} />
  </div>
)