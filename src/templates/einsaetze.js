import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Table from "../components/table"
import { css } from "react-emotion"
import { color as textColor } from "../utils/typography"
import Img from "gatsby-image"
import styles from "./dropdown.module.css"

const EinsatzLink = props => (
    <Link to={`/einsaetze/${props.id}`} className={css`
        text-decoration:none;
        color: ${textColor};
        margin-bottom: 0;
    `}>
        {props.children}
    </Link>
);

const EinsatzTable = ({einsaetze}) => (
    <div>
        <h3>Einsätze im {einsaetze[0].alarmierungszeit.toLocaleString("de-DE",  { month: 'long', year: 'numeric' })}</h3>
        <Table 
        header={[{title:'Alarmierung', width:'100px',},
                {title: 'Einsatzbeschreibung', },
                {title: 'Einsatzort'},
                {title: 'Bild', width: '70px'}]}
        data={einsaetze.map((node, index) => ({
            id: node.id,
            data:
            [ 
                <EinsatzLink id={node.id}>
                {node.alarmierungszeit && (
                <>
                <p className={css`margin-bottom: 0`}>{node.alarmierungszeit.toLocaleString("de-DE", dayFormatOptions)}</p>  
                <p className={css`margin-bottom: 0`}>{node.alarmierungszeit.toLocaleString("de-DE", timeFormatOptions) + ' Uhr'}</p>
                </>
                )
                }
                </EinsatzLink>
            ,
                <EinsatzLink id={node.id}>
                    <h4 className={css`margin-bottom: 0`}>{node.einsatzart}</h4>
                    <p className={css`margin-bottom: 0`}>{node.kurzbericht}</p>
                </EinsatzLink>
            , 
                <EinsatzLink id={node.id}>{node.einsatzort}</EinsatzLink>
            ,
                <EinsatzLink id={node.id}>
                    {node.einsatzbild && 
                    (<Img fixed={node.einsatzbild.fixed} 
                        alt={node.einsatzbeschreibung}
                        className={css`margin-bottom: 0`}/>)}
                </EinsatzLink>
            ]    

        }))}/>
    </div>
)

const Dropdown = props => (
    <div className={styles.dropdown}>
        <button className={styles.dropbtn}>{props.selected}  &darr;</button>
        <div className={styles.dropdownContent}>
            {props.options.map((year, index) => (
            <Link key={year} className={styles.dropdownLink} to={`/einsaetze/${year}/`}>{year}</Link>
            ))}
        </div>
    </div>
)

const dayFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
const timeFormatOptions = {hour: '2-digit', minute: '2-digit'};

export default ({ data, pageContext }) =>  {
    // all_data = data.new_data.edges.slice()
    const mappedNew = (data.new_data)?data.new_data.edges.map(({node}, index) => (
        {
            id: node.id,
            kurzbericht: node.kurzbericht,
            alarmierungszeit: new Date(node.alarmierungszeit),
            einsatzort: node.einsatzort,
            einsatzart: node.einsatzart,
            einsatzbild: node.einsatzbild
        }
    )):[];
    const mappedOld =(data.old_data)?data.old_data.edges.map(({node}, index) => 
    ({
        id: node.id,
        kurzbericht: node.Kurzbericht,
        alarmierungszeit: new Date(node.Alarmierung.zeitpunkt),
        einsatzort: node.Einsatzort,
        einsatzart: node.Einsatzart,
    })):[];

    const all_data = mappedNew.concat(mappedOld) 
    // group by month
    const grouped = all_data.reduce(
        (map, einsatz) => {
            const { alarmierungszeit: date} = einsatz;
            const key = date.getFullYear() * 12 + date.getMonth();
          
            const prev = map.get(key);
            if(prev) {
                prev.push(einsatz);
            }else{
                map.set(key, [einsatz])
            }
            return map
        }, 
        new Map()
    )
    let table_list = []
    const yearsSet = new Set()
    for(let [_, einsaetze] of grouped){ 
        table_list.push(<EinsatzTable einsaetze={einsaetze}/>)
        yearsSet.add(einsaetze[0].alarmierungszeit.getFullYear())
    }
    return (
        <Layout> 
            <h1>Einsätze</h1>
            <Dropdown options={pageContext.allYears} selected={pageContext.year} />
            {table_list}
           
        </Layout>
    );
    }


export const query= graphql`
query ($yearExp: String!) {
    old_data: allData1Json(sort: {fields: [Alarmierung___zeitpunkt], order: DESC},
         filter: {Alarmierung: {zeitpunkt: {regex: $yearExp}}}) {
      edges {
        node {
          id
          Kurzbericht
          Alarmierung {
            zeitpunkt
          }
          Einsatzort
          Einsatzart
          Bilder {
            image
          }
        }
        next {
          id
        }
        previous {
          id
        }
      }
    }
    new_data: allContentfulEinsatz(sort: {fields: [alarmierungszeit], order: DESC}, 
        filter: {alarmierungszeit: {regex: $yearExp}}) {
      edges {
        node {
          id
          kurzbericht
          alarmierungszeit
          einsatzort
          einsatzart
          einsatzbild {
            fixed(width: 50) {
                ...GatsbyContentfulFixed_tracedSVG
            }
          }
        }
      }
    }
  }
`