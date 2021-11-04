import React from "react"
import { Link} from "gatsby"
/** @jsx jsx */
import { jsx, css } from '@emotion/react'
import { FaCaretDown } from 'react-icons/fa';
import { feuerwehrRot } from "./layout";

// styles

const dropdownStyles = css`
button {
    background-color: ${feuerwehrRot};
    color: white;
    padding: 12px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border-radius: 3px;
}

position: relative;
display: inline-block;


.dropdown-content {
    width: 100%;
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}

.dropdown-content a, .dropdown-content button {
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
    width: 100%;
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

.dropdown-content a:hover, .dropdown-content button:hover {background-color: #f1f1f1}
.dropdown-content a:active, .dropdown-content button:active {
    background-color: #9c1c1c;
    color: white;

}

:hover .dropdown-content {
    display: block;
}

:hover .dropbtn {
    background-color: #9c1c1c;
}
`;

const Dropdown = props => (
    <div css={dropdownStyles}>
        <button>{props.selected}  <FaCaretDown/></button>
        <div className="dropdown-content">
            {props.options.map((value, index) => (
                !props.onClick?
                <Link key={value} to={`/einsaetze/${value}/`}>{value}</Link>:
                <button key={index} onClick={() => props.onClick(value)}>
                    {value}
                </button>
            ))}
        </div>
    </div>
);

export default Dropdown;