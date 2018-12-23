import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import Seo from "../components/seo"
import ThumbnailSlideshow from "../components/thumbnail_slideshow"
import Img from "gatsby-image"
import styles from "./portrait.module.css"

const Portrait = props => (
    <div key={props.id} className={styles.container} >
        <div className={styles.image} >
            <Img fluid={(props.data.bild)?props.data.bild.fluid: props.ersatzbild.fluid}
             alt={props.data.name} backgroundColor="#A81C1C"/>
        </div>
        <div className={styles.text} >
            <h4 style={{marginBottom:'0'}}>{props.data.name}</h4>
            <p>{props.data.funktion}</p>
            {props.data.adresse &&
            <div>{props.data.adresse.adresse.split('\n').map((val,n) => (<p key={n} style={{margin:"0"}}>{val}</p>))}</div>}
            {props.data.telefon &&
            <><h5 style={{marginBottom:"0"}} >Telefon:</h5>
            <p>{props.data.telefon}</p></>}
        </div>
    </div>
)

export default ( all_data ) =>{
    const { data } = all_data;
    const seite = data.contentfulSeitenubersicht;
    return(
    <Layout>
        <Seo title={`${seite.seitentitel} - Feuerwehr Altfraunhofen`} 
                 url="http://feuerwehr-altfraunhofen.de/neu"/>
        <h1>{data.contentfulSeitenubersicht.seitentitel}</h1>
        {data.contentfulSeitenubersicht.seiteneintrag.map((eintrag, index) => {
            switch(eintrag.__typename){
                case "ContentfulSeitengalerie":
                return(
                <div key={eintrag.id}>
                    <h2>{eintrag.titel}</h2>
                    <ThumbnailSlideshow images={eintrag.galerie} height="500px"/>
                </div>
                );
                case "ContentfulSeiteneintrag":
                return(
                <div key={eintrag.id}>
                    <h2>{eintrag.titel}</h2>
                    {eintrag.childContentfulSeiteneintragEintragTextNode &&
                    <div dangerouslySetInnerHTML={{ __html: eintrag.childContentfulSeiteneintragEintragTextNode.childMarkdownRemark.html}} />}
                </div>
                );
                case "ContentfulPortrait":
                return(
                    <Portrait data={eintrag} ersatzbild={data.ersatzbild.childImageSharp} key={eintrag.id}/>
                );
                default:
                return null;
            }
        })}
    </Layout>
)}

export const query = graphql`
query ($seite: String!) {
    contentfulSeitenubersicht(seite: {eq: $seite}) {
      seite
      seitentitel
      seiteneintrag {
        __typename
        ... on ContentfulSeiteneintrag {
          id
          titel
          childContentfulSeiteneintragEintragTextNode {
            childMarkdownRemark {
              id
              html
            }
          }
        }
        ... on ContentfulPortrait {
          id
          name
          funktion
          telefon
          adresse {
            adresse
          }
          bild {
            fluid(maxWidth: 300) {
                ...GatsbyContentfulFluid_tracedSVG
            }
          }
          name
        }
        ... on ContentfulSeitengalerie {
          id
          titel
          galerie {
            title
            description
            thumb: fluid(maxWidth: 170, maxHeight: 100, resizingBehavior: PAD, background: "white") {
                ...GatsbyContentfulFluid_tracedSVG
            }
            fluid(maxWidth: 1000, maxHeight: 700, background: "white") {
                ...GatsbyContentfulFluid_tracedSVG
            }
          }
        }
      }
    }
    ersatzbild: file(relativePath: {eq: "noch_kein_bild_verfgbar.jpg"}) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid_tracedSVG
          }
        }
      }
  }
`