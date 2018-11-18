import { css } from "react-emotion"
import React from "react"
import { Link } from "gatsby"

const redButton = css(
    {
    ':hover': {
        'background-color': '#c02020'
        }, 
    },
    css`
    background-color: #A81C1C;
    color: #fff;
    padding: 0.6em;
    border-radius: 0.3em;
    text-decoration: none;
    margin-bottom: 1rem;
    display: inline-block;
    transition: 0.1s
    `);

export default (props) => (
    <div className={css`text-align: center;`}>
      {props.next &&
      <Link className={`${css`float: left;`} ${redButton}`} to={`/${props.path}/${props.next}`}> &laquo;Vorheriger {props.name}</Link>}
      {props.previous &&
      <Link className={`${css`float: right`} ${redButton}`} to={`/${props.path}/${props.previous}`}> Nächster {props.name} &raquo;</Link>}
  
      <Link className={redButton} to={`/${props.path}/${props.parent}`}>Übersicht </Link>
    </div>
  )