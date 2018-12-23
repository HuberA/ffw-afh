import React from "react"
import { css } from "react-emotion"

export default () => (
    <hr className={css`
        display: block;
        height: 0.5px;
        border: 0;
        border-top: 1px solid #ccc;
        margin: 1em 0;
        padding: 0
    `}/>
)