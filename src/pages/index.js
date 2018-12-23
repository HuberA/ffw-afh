import React from "react"
import Layout from "../components/layout"
import img_fwhaus from "../images/fwhaus.jpg"
import { css } from "react-emotion"
import { graphql, Link } from "gatsby"
import { color as textColor } from "../utils/typography"
import AktuellesList from "../components/aktuelles_list"
import Divider from "../utils/divider"
import Img from "gatsby-image"
import Seo from "../components/seo"

const headingImageFormat = align => css`
border-radius: 4px;
float: ${align};
width: 50%;
height: 20rem;
object-fit: cover;
`;
const redButton = css`
background-color: #A81C1C;
color: #fff;
padding: 0.6em;
border-radius: 0.3em;
text-decoration: none;
margin-bottom: 1rem;
display: inline-block;
`;



const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const description = "Offizielle Website der Freiwilligen Feuerwehr Altfrauhofen"
export default ( {data}) => {
    const nodes =  data.einsatz.edges
    const berichte = data.berichte.edges
   return (<Layout>
      <Seo title={`Freiwillige Feuerwehr Altfraunhofen e.V.`} 
                 description_short={description}
                 description_long={description}
                 image={img_fwhaus}
                 url="http://feuerwehr-altfraunhofen.de/neu"/>
    
    <div className={css`
        overflow: auto;
    `}>
    <Img fluid={data.fwhaus.childImageSharp.fluid} alt="Feuerwehr-Gerätehaus"></Img>
    </div>
    
    <Divider/>
    <div className={css`
        overflow: auto;
    `}>
        <h3>Letzte Einsätze</h3>
         {nodes.map( ({node}) => {
             const image = node.einsatzbild || data.einsatz_img.childImageSharp;
             return(
                <Link to={`/einsaetze/${node.id}`} key={node.id} className={css`
                text-decoration:none;
                color: ${textColor};
                `}>
                <div  className={css`
                float: left;
                text-align: center;
                width: 31%;
                margin: 0 1%;
                overflow: hidden;

                @media (max-width: 800px){
                    float: none;
                    width: 99%;
                }
                
                `}>
                    <Img className={css`
                        margin: 0 auto;
                        border-radius: 50%;
                        height: 150px;
                        width: 150px;
                        object-fit: cover;
                    `} fixed={image.fixed} alt={node.Kurzbericht}></Img>
                    <h3 className={css`margin-bottom: 0;`} >{node.kurzbericht}</h3>
                    <p className={css`color:gray;`}>
                       
                        {new Date(node.alarmierungszeit).toLocaleString("de-DE", formatOptions)}
                    </p>
                    <p>{node.einsatzbericht.childMarkdownRemark.excerpt}</p>
                    <div className={redButton}>Mehr Details &raquo;</div>
                    <p/>
                </div>
                </Link>
             )
            }
         )}

    </div>
    <Divider/>
    <h3>Aktuelles</h3>
    <AktuellesList aktuelles={berichte} divider={Divider}/> 
    <Divider/>

    </Layout>)
}
export const query = graphql`
query {
    einsatz: allContentfulEinsatz(sort: {fields: [alarmierungszeit], order: DESC}, limit: 3) {
        edges {
          node {
            id
            alarmierungszeit
            einsatzart
            kurzbericht
            einsatzort
            einsatzbericht {
                childMarkdownRemark {
                  excerpt
                }
              }
            einsatzbild {
              id
              fixed(width: 150, height: 150) {
                ...GatsbyContentfulFixed_tracedSVG
              }
            }
          }
        }
      }
     berichte:
     allContentfulArtikel(
        sort: {fields: [datum] order: DESC}
        limit: 3
      ) {
        edges {
          node {
            id
            datum
            titel
            unteruberschrift
            titelbild {
              id
              fixed(height: 150, width: 150) {
                ...GatsbyContentfulFixed_tracedSVG
              }
              fluid(maxWidth: 400, background: "red" ){
                ...GatsbyContentfulFluid_tracedSVG
            }
            }
            slug
          }
        }
      }
      
      einsatz_img:file(relativePath: {eq: "einsatz.jpg"}) {
          childImageSharp {
            fixed(width: 150, height: 150, traceSVG: {
              color: "#A81C1C"
              turnPolicy: TURNPOLICY_MINORITY
              blackOnWhite: true
            }) {
                ...GatsbyImageSharpFixed_tracedSVG
            }
          }
        }
        fwhaus:file(relativePath: {eq: "fwhaus.jpg"}) {
          childImageSharp {
            fluid(maxWidth: 1000, traceSVG: {
              color: "#A81C1C"
              turnPolicy: TURNPOLICY_MINORITY
              blackOnWhite: true
            }) {
                ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
        lf16:file(relativePath: {eq: "lf16.jpg"}) {
          childImageSharp {
            fluid(maxWidth: 500, traceSVG: {
              color: "#A81C1C"
              turnPolicy: TURNPOLICY_MINORITY
              blackOnWhite: true
            }) {
                ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
        mzf:file(relativePath: {eq: "mzf.jpg"}) {
          childImageSharp {
            fluid(maxWidth: 500, traceSVG: {
              color: "#A81C1C"
              turnPolicy: TURNPOLICY_MINORITY
              blackOnWhite: true
            }) {
                ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
      
      
      
      
   
 }
`

