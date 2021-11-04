import React from "react"
import { graphql } from "gatsby"
import {LayoutComponent} from "../components/layout"
import Seo from "../components/seo"


const Aktuelles = ({ data }) => {
    const post = data.markdownRemark
    return (
    <LayoutComponent>
        <Seo title={`${post.frontmatter.title} - Feuerwehr Altfraunhofen`} 
                 description_short={post.excerpt}
                 description_long={post.excerpt} 
                 url="http://feuerwehr-altfraunhofen.de"/>
        <div>
            <h1>{post.frontmatter.title}</h1>
            {post.frontmatter.image && <img src={post.frontmatter.image}
                       alt={post.frontmatter.title}
                       width="100%" />}
            <div dangerouslySetInnerHTML={{ __html: post.html}} />
        </div>
    </LayoutComponent>
    )
};
export default Aktuelles;

export const query = graphql`
query ($slug: String!) {
  markdownRemark(fields: {slug: {eq: $slug}}) {
    frontmatter {
      title
    }
    fields {
      slug
    }
    html
    excerpt(pruneLength: 155)
  }
}
`