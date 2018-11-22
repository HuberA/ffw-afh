import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import Seo from "../components/seo"
import ThumbnailSlideshow from "../components/thumbnail_slideshow"

export default ( all_data ) =>{
    const { data } = all_data;
    const seite = data.contentfulSeitenubersicht;
    return(
    <Layout>
        <Seo title={`${seite.seitentitel} - Feuerwehr Altfraunhofen`} 
                 url="http://feuerwehr-altfrauhofen.de"/>
        <h1>{data.contentfulSeitenubersicht.seitentitel}</h1>
        {data.contentfulSeitenubersicht.seiteneintrag.map((eintrag, index) => (
            <div key={eintrag.id}>
                <h2>{eintrag.titel}</h2>
                {eintrag.childContentfulSeiteneintragEintragTextNode &&
                 <div dangerouslySetInnerHTML={{ __html: eintrag.childContentfulSeiteneintragEintragTextNode.childMarkdownRemark.html}} />}
                {eintrag.galerie &&
                <ThumbnailSlideshow images={eintrag.galerie} height="500px"/>}

            </div>
        ))}
    </Layout>
)}

export const query = graphql`
query($seite: String!){
    contentfulSeitenubersicht(seite: {eq: $seite}) {
      seite
      seitentitel
      seiteneintrag {
        id
        titel
        galerie {
            title
            description
            thumb: fluid(maxWidth: 170, maxHeight: 100,resizingBehavior:PAD, background:"white"){
                ...GatsbyContentfulFluid_tracedSVG
            }
            fluid(maxWidth: 1000, maxHeight: 700, background:"white") {
                ...GatsbyContentfulFluid_tracedSVG
            }
        }
        childContentfulSeiteneintragEintragTextNode {
          childMarkdownRemark {
            id
            html
          }
        }
      }
    }
}
`