import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Table from "../components/table"
import { css } from "react-emotion"
import { color as textColor } from "../utils/typography"
import Img from "gatsby-image"
import Seo from "../components/seo"
import Dropdown from "../components/dropdown";
import moment from 'moment';
import 'moment-timezone';

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
    <div key={einsaetze[0].id} >
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

        }))}
        columnsFilter={width => (width > 600)? [0, 1, 2, 3]: 
            (width > 410)? [0, 1, 2]:
            [0, 1]}
        />
    </div>
)

const dayFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
const timeFormatOptions = {hour: '2-digit', minute: '2-digit'};

export default ({ data, pageContext }) =>  {
    const mappedNew = (data.new_data)?data.new_data.edges.map(({node}, index) => (
        {
            id: node.id,
            kurzbericht: node.kurzbericht,
            alarmierungszeit: moment.tz(node.alarmierungszeit, "Europe/Berlin").toDate(),
            einsatzort: node.einsatzort,
            einsatzart: node.einsatzart,
            einsatzbild: node.einsatzbild
        }
    )):[];
    const mappedOld =(data.old_data)?data.old_data.edges.map(({node}, index) => {
        var image = null;
        if (node.Bilder.length > 0){
            const bild = node.Bilder[0]
            const images = data.old_images.edges.filter(({node}) => node.relativePath === `images/${bild}`)
            if (images.length > 0){
                image = images[0].node.childImageSharp
                }
        }
        
    return({
        id: node.id,
        kurzbericht: node.Kurzbericht,
        alarmierungszeit: moment.tz(node.Alarmierung.zeitpunkt, "Europe/Berlin").toDate(),
        einsatzort: node.Einsatzort,
        einsatzart: node.Einsatzart,
        einsatzbild: image
    })}):[];

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
        table_list.push(<EinsatzTable einsaetze={einsaetze} key={einsaetze[0].id}/>)
        yearsSet.add(einsaetze[0].alarmierungszeit.getFullYear())
    }
    const year = yearsSet.values().next().value;
    const description = `Einsätze im Jahr ${year}`
    return (
        <Layout> 
            <Seo title={`Einsätze ${year} - Feuerwehr Altfraunhofen`} 
                 description_short={description}
                 description_long={description} 
                 url="http://feuerwehr-altfraunhofen.de"/>
            <h1>Einsätze</h1>
            <Dropdown options={pageContext.allYears} selected={pageContext.year} />
            {table_list}
           
        </Layout>
    );
    }


export const query= graphql`
query ($startYear: Date!, $endYear: Date!) {
  old_data: allData1Json(
    sort: {fields: [Alarmierung___zeitpunkt], order: DESC},
    filter: {Alarmierung: {zeitpunkt: {gte: $startYear, lte: $endYear}}}
  ) {
      edges {
        node {
          id
          Kurzbericht
          Alarmierung {
            zeitpunkt
          }
          Einsatzort
          Einsatzart
          Bilder
        }
        next {
          id
        }
        previous {
          id
        }
      }
    }
    old_images: 
        allFile(filter: {sourceInstanceName: {eq: "data"} relativePath: {regex: "/images\//"}}) {
          edges {
            node {
              id
              sourceInstanceName
              relativePath
              childImageSharp {
                fixed(width: 50) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      new_data: allContentfulEinsatz(
        sort: {fields: [alarmierungszeit], order: DESC},
        filter: {alarmierungszeit: {gte: $startYear, lte: $endYear}}
      ) {
      edges {
        node {
          id
          kurzbericht
          alarmierungszeit
          einsatzort
          einsatzart
          einsatzbild {
            fixed(width: 50) {
                ...GatsbyContentfulFixed
            }
          }
        }
      }
    }
  }
`