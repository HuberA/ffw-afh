import React from "react"
import { Link } from "gatsby"
/** @jsx jsx */
import { jsx, css } from "@emotion/react";

const textAlignStyles = css`
  text-align: center
`;

const redButton = (direction) => css`
    background-color: #A81C1C;
    color: #fff;
    padding: 0.6em;
    border-radius: 0.3em;
    text-decoration: none;
    margin-bottom: 1rem;
    display: inline-block;
    transition: 0.1s
    :hover {
          background-color: #c02020
    }
    ${direction && "float: " + direction}
`;

const Navigation = (props) => (
    <div css={textAlignStyles}>
      {props.next &&
      <Link css={redButton("left")} to={`/${props.path}/${props.next}`}> &laquo;Vorheriger {props.name}</Link>}
      {props.previous &&
      <Link css={redButton("right")} to={`/${props.path}/${props.previous}`}> Nächster {props.name} &raquo;</Link>}
  
      <Link css={redButton()} to={`/${props.path}/${props.parent}`}>Übersicht </Link>
    </div>
  );

export {redButton};
export default Navigation;