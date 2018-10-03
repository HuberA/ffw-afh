import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Img from "gatsby-image"
import { css } from "react-emotion"


export default ({ data }) => {
    console.log('got data:', data)
    const post = data.contentfulArtikel
    const titelbild = post.titelbild
    console.log('image:', titelbild)
    return (
    <Layout>
        <div>
            <h1>{post.titel}</h1>
            <Img fluid={titelbild.fluid}
             backgroundColor="#A81C1C"/>
             <h2 className={css`margin-top: 1em`}>{post.unteruberschrift}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.fliesstext.childMarkdownRemark.html}} />
        </div>
    </Layout>
    )
}

export const query = graphql`
query($id: String!){
    contentfulArtikel(id: {eq: $id}) {
      id
      datum
      titel
      unteruberschrift
      fliesstext {
        id
        childMarkdownRemark {
          id
          html
        }
    }
    titelbild {
            fluid(maxWidth: 1000){
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
    
    }
  }
`