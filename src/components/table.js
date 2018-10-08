import React from "react"

import styles from "./table.module.css"

export default props => (
<table className={styles.table}>
<thead>
    <tr>
        {props.header.map(({title, width}, index) => (
            <th key={title} style={{"minWidth": width}}>{title}</th>
        ))}
    </tr>
</thead>
<tbody>
    {props.data.map((node, index) => {
        if(node){
        return (
            <tr key = {node.id}>
                {node.data.map((node, index) => (
                    <td key={index}>{node}</td>
                ))}
            </tr>
        )}
        else{
            return null
        }
    }
    )
    }
</tbody>
</table>
)