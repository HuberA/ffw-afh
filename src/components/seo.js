import React from "react"
import {Helmet} from "react-helmet"
import favicon from "../images/logo-ffw.svg"



const Seo = props => {
    const title =props.title
    const title_long =props.title
    const image = props.image && (props.image.startsWith("//"))?`http:${props.image}`:`http://feuerwehr-altfraunhofen.de${props.image}`
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
             <meta property="og:image" content={image} />}
            {props.imageSize &&
                <meta property="og:image:width" content={props.imageSize[1]}/>
            }
            {props.imageSize &&
                <meta property="og:image:height" content={props.imageSize[0]}/>
            }
            <meta property="og:type" content="article" />
            <meta property="og:locale" content="de_DE" />

            <meta name="twitter:card" content="summary" />
            {props.image &&
            <meta name="twitter:image" content={image} />}
            <meta name="twitter:description" content={props.description_long} />
        </Helmet>
)};

export default Seo;