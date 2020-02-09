import React from "react"
import Layout from "../components/layout"
import { css } from "react-emotion"
import { graphql, Link } from "gatsby"
import { color as textColor } from "../utils/typography"
import AktuellesList from "../components/aktuelles_list"
import Divider from "../utils/divider"
import Img from "gatsby-image"
import Seo from "../components/seo"
import moment from 'moment';
import 'moment-timezone';

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
    const titelbild = data.titelbild.childImageSharp.fluid
   return (<Layout>
      <Seo title={`Freiwillige Feuerwehr Altfraunhofen e.V.`} 
                 description_short={description}
                 description_long={description}
                 image={titelbild.src}
                 imageSize={[titelbild.presentationHeight, titelbild.presentationWidth]}
                 url="http://feuerwehr-altfraunhofen.de"/>
    
    <div className={css`
        overflow: auto;
    `}>
    <Img fluid={data.titelbild.childImageSharp.fluid} alt="Feuerwehr-Gerätehaus"></Img>
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
                       
                        {moment.tz(node.alarmierungszeit, "Europe/Berlin").toDate().toLocaleString("de-DE", formatOptions)}
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
                ...GatsbyContentfulFixed
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
                ...GatsbyContentfulFixed
              }
              fluid(maxWidth: 400, background: "red" ){
                ...GatsbyContentfulFluid
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
                ...GatsbyImageSharpFixed
            }
          }
        }
        titelbild:file(relativePath: {eq: "title.jpg"}) {
          childImageSharp {
            fluid(maxWidth: 1000, traceSVG: {
              color: "#A81C1C"
              turnPolicy: TURNPOLICY_MINORITY
              blackOnWhite: true
            }) {
                ...GatsbyImageSharpFluid
                presentationWidth
                presentationHeight
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
                ...GatsbyImageSharpFluid
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
                ...GatsbyImageSharpFluid
            }
          }
        }
      
      
      
      
   
 }
`

