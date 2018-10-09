import React from "react"
import {Helmet} from "react-helmet"
import favicon from "../images/logo-ffw.svg"



export default props => {
    const title = (props.title.length > 35)? props.title.substring(0, 35): props.title
    const title_long = (props.title.length > 65)? props.title.substring(0,65): props.title
    return(
        <Helmet
            htmlAttributes={{
                lang: "de-DE",
                prefix: "og: http://ogp.me/ns#"
            }}
        >
            <title>{title_long}</title>
            {props.description_long && 
            <meta name="description" content={props.description_long} />}
            {props.favicon &&
            <link rel="shortcut icon" href={favicon} />}
            
            <meta property="og:url" content={props.url} />
            <meta property="og:title" content={title} />
            {props.description_short &&
            <meta property="og:description" content={props.description_short} />}
            {props.image &&
             <meta property="og:image" content={props.image} />}
            <meta property="og:type" content="article" />
            <meta property="og:locale" content="de_DE" />

            <meta name="twitter:card" content="summary" />
            {props.image &&
            <meta name="twitter:image" content={props.image} />}
            <meta name="twitter:description" content={props.description_long} />
        </Helmet>
)}