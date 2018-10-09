import React from "react"
import { Link} from "gatsby"
import { color as textColor } from "../utils/typography"
import { css } from "react-emotion"
import Img from "gatsby-image"

const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export default ( props ) => {
    return(
        <div className={css`
            overflow: auto;
        `}>
        {Array.from(props.aktuelles.entries()).map( obj => {
            const [number, node] = obj;
            const aktuelles = node.node
            const posText = (number % 2 === 0)?'left': 'right';
            const posImage= (number % 2 !== 0)?'left': 'right';
            return(
                <Link key={aktuelles.id} to={`/berichte/${aktuelles.slug}/`} className={css`
                text-decoration:none;
                `}>
                <div  className={css`
                    overflow: auto;
                    color: ${textColor};
                `}>
                {number !== 0 && <props.divider/>}
                <div className={css`
                    float: ${posText};
                    width: 58%;
                    margin: 2rem 1%;

                    @media (max-width: 800px){
                        float: none;
                        width: 99%;
                    }
                `}>
                 <p className={css`color:gray;`}>
                    {new Date(aktuelles.datum).toLocaleString("de-DE", formatOptions)}
                </p>
                <h3>{aktuelles.titel}</h3>
                <h4>{aktuelles.unteruberschrift}</h4>
                </div>
                {aktuelles.titelbild &&
                <Img className={css`
                    float: ${posImage};
                    width: 38%;
                    margin: 2rem 1%;

                    @media (max-width: 800px){
                        float: none;
                        width: 99%;
                    }
                `} 
                
                fluid={aktuelles.titelbild.fluid}/>}
                </div>
                </Link>
            )
        })}
        
        </div>
    )
}