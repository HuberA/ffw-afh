import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Img from "gatsby-image"
import { css } from "react-emotion"
import Map from "../components/map"

const redButton = css(
    {
    ':hover': {
        'background-color': '#c02020'
        }, 
    },
    css`
    background-color: #A81C1C;
    color: #fff;
    padding: 0.6em;
    border-radius: 0.3em;
    text-decoration: none;
    margin-bottom: 1rem;
    display: inline-block;
    transition: 0.1s
    `);

const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
const formatTime = {hour: 'numeric', minute: 'numeric'}

const Navigation = (props) => (
  <div className={css`text-align: center;`}>
    {props.next &&
    <Link className={`${css`float: left;`} ${redButton}`}to={`/einsaetze/${props.next}`}> &laquo;Vorheriger Einsatz</Link>}
    {props.previous &&
    <Link className={`${css`float: right`} ${redButton}`} to={`/einsaetze/${props.previous}`}> Nächster Einsatz &raquo;</Link>}

    <Link className={redButton} to={`/einsaetze/${props.parent}`}>Übersicht </Link>
  </div>
)

export default ( all_data ) => {
    console.log('data', all_data)
    const { data, pageContext } = all_data;
    const previous = pageContext.previous;
    const next = pageContext.next;
    const einsatz = data.contentfulEinsatz;
    const feuerwehren = data.feuerwehren && data.feuerwehren.edges;
    const alarmierung = new Date(einsatz.alarmierungszeit);
    const einsatzende = new Date(einsatz.einsatzende);
    const einsatzdauer = einsatzende - alarmierung;
    const einsatzdauer_min = einsatzdauer / 60 /1000;
    const einsatzdauer_h = Math.trunc(einsatzdauer_min / 60);
    const einsatzdauer_min_rem = einsatzdauer_min - 60 * einsatzdauer_h;
    const einsatzdauer_str = (einsatzdauer_h)?`${einsatzdauer_h} Std. und ${einsatzdauer_min_rem} Min.`:`${einsatzdauer_min} Minuten`
    const alarmierte_einheiten = (feuerwehren)?<>
        <tr>
            <td>Alarmierte Einheiten:</td><td>{feuerwehren[0].node.name}</td>
        </tr>
        {
            feuerwehren.slice(1).map(({node}, index) =>{ console.log(node); return (
                <tr key={node.id}>
                    <td></td><td>{node.name}</td>
                </tr>
            );})
        }
    </>:"";
    console.log('einsatzleiter:', einsatz.einsatzleiter)
    return (
        <Layout>
             <h1>{einsatz.einsatzart}</h1>
            <Navigation previous={previous} next={next} parent=""/>
            {einsatz.einsatzbild &&
                <Img fluid={einsatz.einsatzbild.fluid} alt={einsatz.kurzbericht} backgroundColor="#A81C1C"/>}
            <h2>{einsatz.kurzbericht}</h2>
            <table>
               <tbody>
                    <tr>
                        <td>Einsatzort:</td><td>{einsatz.einsatzort || 'Unbekannt'}</td>
                    </tr>
                    <tr>
                        <td>Alarmierung:</td><td>{alarmierung.toLocaleString("de-DE", formatOptions)} Uhr</td>
                    </tr>
                    <tr>
                        <td>Alarmierung per:</td><td>{einsatz.alarmierungsart}</td>
                    </tr>
                    {einsatzdauer > 0 && <>
                    <tr>
                        <td>Einsatzende:</td><td>{einsatzende.toLocaleString("de-DE", formatTime)}</td>
                    </tr>
                    <tr>
                        <td>Einsatzdauer:</td><td>{einsatzdauer_str}</td>
                    </tr>
                    </>
                    }
                    {einsatz.einsatzleiter &&
                    <tr>
                        <td>Einsatzleiter:</td><td>{einsatz.einsatzleiter}</td>
                    </tr>
                    }
                    {einsatz.mannschatfsstaerke &&
                    <tr>
                        <td>Mannschaftsstärke:</td><td>{einsatz.mannschatfsstaerke}</td>
                    </tr>
                    }
                    {alarmierte_einheiten}
                </tbody>
            </table>
                       
            {einsatz.einsatzbericht && <div dangerouslySetInnerHTML={
                { __html: einsatz.childContentfulEinsatzEinsatzberichtTextNode.childMarkdownRemark.html}} />}

            {einsatz.einsatzortGeo && 
                <Map lat={einsatz.einsatzortGeo.lat} lng={einsatz.einsatzortGeo.lon} />
            }
            <Navigation previous={previous} next={next} parent=""/>
        </Layout>
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
        fluid(maxWidth: 1000){
          ...GatsbyContentfulFluid_tracedSVG
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
        }
      }
      presselink
    }
    feuerwehren: allContentfulFeuerwehren(filter: {einsatz: {id: {eq: $id}}}) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`