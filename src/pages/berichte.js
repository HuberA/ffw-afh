import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import AktuellesList from "../components/aktuelles_list"
import Divider from "../utils/divider"

export default ( {data}) => {
    const berichte = data.berichte.edges
   return (<Layout>
    <h2>Berichte</h2>
    <AktuellesList aktuelles={berichte} divider={Divider}/> 
    <Divider/>

    </Layout>)
}
export const query = graphql`
query {
  berichte:
  allContentfulArtikel(
     sort: {fields: [datum] order: DESC}
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
           fluid(maxWidth: 400){
            ...GatsbyContentfulFluid
        }
         }
         slug
       }
     }
   }
   
 }
`