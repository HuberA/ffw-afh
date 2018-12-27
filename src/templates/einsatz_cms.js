import React from "react"
import { graphql } from "gatsby"
import Einsatz from "../components/einsatz"



export default ( all_data ) => {
    const { data, pageContext } = all_data;
    const previous = pageContext.previous;
    const next = pageContext.next;
    data.previous = previous;
    data.next = next;
    const einsatz = data.contentfulEinsatz;
    const new_data = {
      previous: previous,
      next: next,
      einsatz: einsatz
    }
    return (
        <Einsatz data={new_data}/>
    )
}

export const query = graphql`
query ($id: String!) {
    contentfulEinsatz(id: {eq: $id}) {
      id
      einsatzart
      alarmierungsart
      kurzbericht
      einsatzort
      alarmierungszeit
      einsatzende
      einsatzleiter
      parent {
        id
      }
      einsatzbild{
        fluid(maxWidth: 1000, maxHeight: 800){
          ...GatsbyContentfulFluid_tracedSVG
        }
        fixed(width: 600){
          src
        }
      }
      mannschatfsstaerke
      einsatzortGeo {
        lon
        lat
      }
      einsatzbericht{
          id
      }
      childContentfulEinsatzEinsatzberichtTextNode {
        id
        childMarkdownRemark {
          html
          excerpt(pruneLength: 155)
          excerpt2: excerpt(pruneLength: 65)
        }
      }
      presselink
      alarmierteEinheiten{
        id
        name
      }
    }
  }
`