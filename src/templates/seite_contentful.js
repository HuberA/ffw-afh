import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

export default ( all_data ) =>{
    const { data, pageContext } = all_data;
    return(
    <Layout>
        <h1>{data.contentfulSeitenubersicht.seitentitel}</h1>
        {data.contentfulSeitenubersicht.seiteneintrag.map((eintrag, index) => (
            <div key={eintrag.id}>
                <h2>{eintrag.titel}</h2>
                <div dangerouslySetInnerHTML={{ __html: eintrag.childContentfulSeiteneintragEintragTextNode.childMarkdownRemark.html}} />
            </div>
        ))}
    </Layout>
)}

export const query = graphql`
query($seite: String!){
    contentfulSeitenubersicht(seite: {eq: $seite}) {
      seite
      seiteneintrag {
        id
        titel
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