import React from "react"
import { graphql } from "gatsby"
import {LayoutComponent} from "../components/layout"
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Navigation from "../components/navigation"
import Seo from "../components/seo"
import ThumbnailSlideshow from "../components/thumbnail_slideshow"
const { DateTime } = require("luxon");

const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const berichtView = ({ data, pageContext }) => {
    const post = data.contentfulArtikel
    const titelbild = post.titelbild
    const previous = pageContext.previous;
    const next = pageContext.next;
    const image = (titelbild)?titelbild.fixed.src:null
    const imageSize = (titelbild)?[titelbild.fixed.height, titelbild.fixed.width]:null
    const images = (post.bilder)?post.bilder.slice():[]
    if (images){
    images.unshift(titelbild)
    }
    return (
    <LayoutComponent>
      <Seo title={post.titel} 
           description_short={post.unteruberschrift}
                 description_long={post.unteruberschrift}
                 image={image} 
                 imageSize={imageSize}
                 url={`http://feuerwehr-altfraunhofen.de/berichte/${post.slug}`}/>
        <div>
        <Navigation path="berichte" next={next} previous={previous} parent="" name="Bericht"/>
            <p css={css`color:gray;`}>
              {DateTime.fromISO(post.datum)
                    .setZone("Europe/Berlin")
                    .setLocale("de")
                    .toLocaleString(formatOptions)}
               </p>
            <h1>{post.titel}</h1>
            <ThumbnailSlideshow images={images}/>:
            <h2 css={css`margin-top: 1em`}>{post.unteruberschrift}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.fliesstext.childMarkdownRemark.html}} />
            <Navigation path="berichte" next={next} previous={previous} parent="" name="Bericht"/>
        </div>
    </LayoutComponent>
    )
}
export default berichtView;
export const query = graphql`
query ($id: String!) {
  contentfulArtikel(id: {eq: $id}) {
    id
    slug
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
      fixed: gatsbyImageData(layout: FIXED, width: 1200)
      thumb: gatsbyImageData(
        layout: CONSTRAINED
        width: 170
        height: 100
        resizingBehavior: PAD
        backgroundColor: "#F3F7F4"
      )
      gatsbyImageData(
        layout: CONSTRAINED
        width: 800
        height: 500
        backgroundColor: "#F3F7F4"
        resizingBehavior: PAD
      )
    }
    bilder {
      title
      description
      thumb: gatsbyImageData(
        layout: CONSTRAINED
        width: 170
        height: 100
        resizingBehavior: PAD
        backgroundColor: "#F3F7F4"
      )
      gatsbyImageData(
        layout: CONSTRAINED
        width: 800
        height: 500
        backgroundColor: "#F3F7F4"
        resizingBehavior: PAD
      )
    }
  }
}
`