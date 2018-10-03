import React from "react"
import Layout from "../components/layout"
import img_lf16 from "../images/lf16.jpg"
import img_mfz from "../images/mzf.jpg"
import img_fwhaus from "../images/fwhaus.jpg"
import img_einsatz from "../images/einsatz.jpg"
import { css } from "react-emotion"
import { graphql, Link } from "gatsby"
import { color as textColor } from "../utils/typography"
import AktuellesList from "../components/aktuelles_list"
import Divider from "../utils/divider"

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

export default ( {data}) => {
    const nodes =  data.einsatz.edges
    const berichte = data.berichte.edges
   return (<Layout>
    <div className={css`
    text-align: center
    `}>
    <img src={img_fwhaus} width="100%" alt="Feuerwehr-Gerätehaus"></img>
    <h2>Herzlich willkommen auf der Website der</h2>
    <h1>Freiwilligen Feuerwehr Altfraunhofen</h1>
    <div className={css`
        overflow: auto;
    `}>
    <div style={{position: 'relative'}}>
        <div>
    <img src={img_lf16} alt="LF16/12 der Feuerwehr Altfraunhofen" className={headingImageFormat('left')}/>
        </div>
    </div>
    <img src={img_mfz} alt="MZF der Freiwilligen Feuerwehr Altfraunhofen" className={headingImageFormat('right')}/>
    </div>
    </div>
    <Divider/>
    <div className={css`
        overflow: auto;
    `}>
        <h3>Letzte Einsätze</h3>
         {nodes.map( node => {
             const n = node.node
             const image = (n.Bilder.length > 0)?n.Bilder[0].image:img_einsatz;
             return(
                <Link to={`/einsaetze/${n.id}`} key={n.id} className={css`
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
                    {image && <img className={css`
                        margin: 0 auto;
                        border-radius: 50%;
                        height: 150px;
                        width: 150px;
                        object-fit: cover;
                    `} src={image} alt={n.Kurzbericht}></img>}
                    <h3 className={css`margin-bottom: 0;`} >{n.Kurzbericht}</h3>
                    <p className={css`color:gray;`}>
                       
                        {new Date(n.Alarmierung.zeitpunkt).toLocaleString("de-DE", formatOptions)}
                    </p>
                    <p>{n.Einsatzbericht[0]}</p>
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
    einsatz: 
     allData1Json(sort: {fields: [Alarmierung___zeitpunkt],  order: DESC}
   filter: {Alarmierung: {zeitpunkt: {ne: null}} }
   limit: 3
   ) {
       edges {
         node {
           id
         Alarmierung{
           zeitpunkt
         }
         Einsatzart 
         Kurzbericht
         Einsatzort
         Einsatzbericht
         Bilder{
             image
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
   
 }
`

