import React from 'react';
import {Pie} from 'react-chartjs-2';

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
                 position: "right"
            }} 
             />
      </div>
)}