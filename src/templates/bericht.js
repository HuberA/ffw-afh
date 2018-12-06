import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { css } from "react-emotion"
import Navigation from "../components/navigation"
import Seo from "../components/seo"
import ThumbnailSlideshow from "../components/thumbnail_slideshow"

const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export default ({ data, pageContext }) => {
    const post = data.contentfulArtikel
    const titelbild = post.titelbild
    const previous = pageContext.previous;
    const next = pageContext.next;
    const id = pageContext.id;
    const image = (titelbild)?titelbild.fixed.src:null
    const images = (post.bilder)?post.bilder.slice():[]
    if (images){
    images.unshift(titelbild)
    }
    return (
    <Layout>
      <Seo title={post.titel} 
           description_short={post.unteruberschrift}
                 description_long={post.unteruberschrift}
                 image={image} 
                 url={`http://feuerwehr-altfrauhofen.de/berichte/${id}`}/>
        <div>
        <Navigation path="berichte" next={next} previous={previous} parent="" name="Bericht"/>
            <p className={css`color:gray;`}>
                    {new Date(post.datum).toLocaleString("de-DE", formatOptions)}
            </p>
            <h1>{post.titel}</h1>
            <ThumbnailSlideshow images={images}/>:
            <h2 className={css`margin-top: 1em`}>{post.unteruberschrift}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.fliesstext.childMarkdownRemark.html}} />
            <Navigation path="berichte" next={next} previous={previous} parent="" name="Bericht"/>
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
          excerpt(pruneLength: 155)
          excerpt2: excerpt(pruneLength: 65)
        }
    }
    titelbild {
            fluid(maxWidth: 1000){
              ...GatsbyContentfulFluid_tracedSVG
            }
            thumb:fluid(maxWidth: 170){
              ...GatsbyContentfulFluid_tracedSVG
            }
            fixed(width: 600){
              src
            }
          }
    bilder{
      title
      description
      thumb:fluid(maxWidth: 170, maxHeight: 100,resizingBehavior:PAD, background:"white"){
        ...GatsbyContentfulFluid_tracedSVG
      }
      fluid(maxWidth: 1000, maxHeight: 700){
        ...GatsbyContentfulFluid_tracedSVG
      }
    }
  }
}
`