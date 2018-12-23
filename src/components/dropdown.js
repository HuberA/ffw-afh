import React from "react"
import { Link} from "gatsby"
import styles from "./dropdown.module.css"
import { FaCaretDown } from 'react-icons/fa';


const Dropdown = props => (
    <div className={styles.dropdown} style={{minWidth:props.minWidth}}>
        <button className={styles.dropbtn}>{props.selected}  {<FaCaretDown/>}</button>
        <div className={styles.dropdownContent} style={{minWidth:props.minWidth}}>
            {props.options.map((value, index) => (
                !props.onClick?
                <Link key={value} className={styles.dropdownLink} to={`/einsaetze/${value}/`}>{value}</Link>:
                <button key={index} className={styles.dropdownLink} onClick={() => props.onClick(value)}>
                    {value}
                </button>
            ))}
        </div>
    </div>
);

export default Dropdown;