import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import { css } from "react-emotion"
import Seo from "../components/seo"
import Table from "../components/table"
import moment from 'moment';
import 'moment-timezone';

const dayFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
const timeFormatOptions = {hour: '2-digit', minute: '2-digit'};

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

export default ({ data}) => {
    const termin = data.contentfulTermin
    const datum = moment.tz(termin.datum, 'Europe/Berlin').toDate()
    return (
    <Layout>
      <Seo title={termin.beschreibung} 
           description_short={termin.beschreibung}
                 description_long={termin.beschreibung}
                 url={`http://feuerwehr-altfraunhofen.de/termine/${termin.id}`}/>
        <div>
        <h1>{termin.beschreibung}</h1>
        <Table 
        header={['', '']}
        data={[{
          id: 'datum',
          data: [<div>Datum</div>, <div>
          {(
          <>
          <p className={css`margin-bottom: 0`}>{datum.toLocaleString("de-DE", dayFormatOptions)}</p>  
          <p className={css`margin-bottom: 0`}>{datum.toLocaleString("de-DE", timeFormatOptions) + ' Uhr'}</p>
          </>
          )
          }
          </div>]
        },{
          id: 'gruppe',
          data: [
            <div>Gruppe</div>,
            <div>
                {termin.gruppe? termin.gruppe.map((gruppe, index) => (
                    <p className={css`margin-bottom: 0`} key={gruppe}>{gruppe}</p>
                )):'Alle'}
            </div>
          ]
        },{
          id: 'beschreibung',
          data: [
            <div>Beschreibung</div>,
            <div>{termin.beschreibung}</div>
          ]
        },{
          id: 'ort',
          data: [
            <div>Ort</div>,
            <div>{termin.veranstaltungsort}</div>
          ]
        },{
          id: 'kategorie',
          data: [
            <div>Kategorie</div>,
            <div>{termin.kategorie}</div>
          ]
        }]}
        />
        </div>
        {termin.anmerkungen &&
        <div dangerouslySetInnerHTML={{ __html: termin.anmerkungen.childMarkdownRemark.html}} />}
        <Link className={redButton} to={`/kalender`}>Zurück</Link>
    </Layout>
    )
}

export const query = graphql`
query($id: String!){
    contentfulTermin(id: {eq: $id}) {
      id
      datum
      beschreibung
      kategorie
      veranstaltungsort
      gruppe
      anmerkungen {
        childMarkdownRemark {
          html
        }
        
      }
    }
  }
`