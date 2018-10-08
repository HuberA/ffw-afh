import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import Table from "../components/table"
import Popup from "../components/popup"
import { css } from "react-emotion"


const dayFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
const timeFormatOptions = {hour: '2-digit', minute: '2-digit'};

export default ({ data }) =>(
    <Layout>
        <h1>Kalender</h1>
        <Table 
        header={[{title:'Datum', width:'100px',},
                {title: 'Gruppe', width: '101px'},
                {title: 'Beschreibung', },
                {title: 'Veranstaltungsort'},
                {title:'Kategorie'}
            ]}
        data={data.allContentfulTermin.edges.map(({node}, index) =>{
            const datum = new Date(node.datum)
            const next_day = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate()+1)
            if (next_day < new Date()) return null
            return {
            id: node.id,
            data:
            [ 
                <div>
                {(
                <>
                <p className={css`margin-bottom: 0`}>{datum.toLocaleString("de-DE", dayFormatOptions)}</p>  
                <p className={css`margin-bottom: 0`}>{datum.toLocaleString("de-DE", timeFormatOptions) + ' Uhr'}</p>
                </>
                )
                }
                </div>
            ,
                <div>
                {node.gruppe? node.gruppe.map((gruppe, index) => (
                    <p className={css`margin-bottom: 0`} key={gruppe}>{gruppe}</p>
                )):'Alle'}
                </div>
            ,
                <div>
                   {node.beschreibung}
                </div>
            , 
                <div>{node.veranstaltungsort}</div>
            ,
                <div>{node.kategorie}</div>
            ]    

        }})}/>
        <Popup/>
    </Layout>
)

export const query = graphql`
  {
    allContentfulTermin(sort: {fields: [datum], order: ASC}) {
      edges {
        node {
          id
          datum
          beschreibung
          kategorie
          beschreibung
          veranstaltungsort
          gruppe
        }
      }
    }
  }
`
  