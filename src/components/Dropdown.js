import React from "react"
import { Link } from "gatsby";
import styles from "./dropdown.module.css";
export const Dropdown = props => (
<div className={styles.dropdown}>
    <button className={styles.dropbtn}>{props.selected}  &darr;</button>
    <div className={styles.dropdownContent} style={{minWidth:props.minWidth}}>
        {(props.onClick)?
          props.options.map((value, index) => (<button key={index} className={styles.dropdownLink} onClick={() => props.onClick(value)}>{value}</button>)):
          props.options.map((year, index) => (<Link key={year} className={styles.dropdownLink} to={`/einsaetze/${year}/`}>{year}</Link>))
        }
    </div>
</div>);