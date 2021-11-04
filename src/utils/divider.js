import React from "react"
import { jsx, css } from '@emotion/react'

const Divider = () => (
    <hr css={css`
        display: block;
        height: 0.5px;
        border: 0;
        border-top: 1px solid #ccc;
        margin: 1em 0;
        padding: 0
    `}/>
);

export default Divider;