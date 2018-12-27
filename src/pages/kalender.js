import React from "react"
import Layout from "../components/layout"
import { graphql, Link } from "gatsby"
import Table from "../components/table"
import {Popup, PopupItem} from "../components/popup"
import { css } from "react-emotion"
import { color as textColor } from "../utils/typography"
import Seo from "../components/seo"


const dayFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
const timeFormatOptions = {hour: '2-digit', minute: '2-digit'};

const TerminLink = props => (
    <Link to={`/termine/${props.id}`} className={css`
        text-decoration:none;
        color: ${textColor};
        margin-bottom: 0;
    `}>
        {props.children}
    </Link>
);
const description = "Kalender der Freiwilligen Feuerwehr Altfrauhofen"
export default ({ data }) =>(
    <Layout minHeight="500px">
        <Seo title={`Feuerwehrkalender`} 
                 description_short={description}
                 description_long={description}
                 url="http://feuerwehr-altfraunhofen.de"/>
        <h1>Kalender</h1>
        <Popup>
            <PopupItem name="Alle" value="ffw.ics" /> 
            <PopupItem name="Gruppe A" value="ffwa.ics"/>
            <PopupItem name="Gruppe B" value="ffwb.ics"/>
            <PopupItem name="Gruppe C" value="ffwc.ics"/>
            {/*<PopupItem name="Gruppe D" value="ffwd.ics"/>*/}
            <PopupItem name="Jugend" value="ffwj.ics"/>
            <PopupItem name="Feuerwehrhaus" value="fwhaus.ics"/> 
        </Popup>
        <Table 
        header={[{title:'Datum', width:'100px',},
                {title: 'Gruppe' },
                {title: 'Beschreibung', },
                {title: 'Veranstaltungsort'},
                {title:'Kategorie'},
                {title: 'Beschreibung'}
            ]}
        data={data.allContentfulTermin.edges.map(({node}, index) =>{
            const datum = new Date(node.datum)
            const next_day = new Date(datum.getFullYear(), datum.getMonth(), datum.getDate()+1)
            if (next_day < new Date()) return null
            const groupText = node.gruppe? node.gruppe.join(', ') + ': ': ''
            return {
            id: node.id,
            data:
            [ 
                <TerminLink id={node.id}>
                {(
                <>
                <p className={css`margin-bottom: 0`}>{datum.toLocaleString("de-DE", dayFormatOptions)}</p>  
                <p className={css`margin-bottom: 0`}>{datum.toLocaleString("de-DE", timeFormatOptions) + ' Uhr'}</p>
                </>
                )
                }
                </TerminLink>
            ,
                <TerminLink id={node.id}>
                {node.gruppe? node.gruppe.map((gruppe, index) => (
                    <p className={css`margin-bottom: 0`} key={gruppe}>{gruppe}</p>
                )):'Alle'}
                </TerminLink>
            ,
                <TerminLink id={node.id}>
                   {node.beschreibung}
                </TerminLink>
            , 
                <TerminLink id={node.id}>{node.veranstaltungsort}</TerminLink>
            ,
                <TerminLink id={node.id}>{node.kategorie}</TerminLink>
            ,
                <TerminLink id={node.id}>{groupText + node.beschreibung}</TerminLink>
            ]    

        }})}
        columnsFilter={width => (width > 720)? [0, 1, 2, 3, 4]: 
                                (width > 620)? [0, 1, 2, 3]:
                                (width > 420)? [0, 1, 2]:
                                [0, 5]
                            }
        />
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
          veranstaltungsort
          gruppe
        }
      }
    }
  }
`
  