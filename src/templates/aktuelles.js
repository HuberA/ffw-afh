import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"


export default ({ data }) => {
    console.log('got data:', data)
    const post = data.markdownRemark
    return (
    <Layout>
        <div>
            <h1>{post.frontmatter.title}</h1>
            {post.frontmatter.image && <img src={post.frontmatter.image}
                       alt={post.frontmatter.title}
                       width="100%" />}
            <div dangerouslySetInnerHTML={{ __html: post.html}} />
        </div>
    </Layout>
    )
}

export const query = graphql`
query($slug: String!){
    markdownRemark(fields: {slug: {eq: $slug}}) {
          frontmatter{
            title
          }
          fields {
            slug
          }
          html
        }
  }
`