import React from "react";
import { graphql, Link } from "gatsby";
import Table from "../components/table";
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { color as textColor } from "../utils/typography";
import { GatsbyImage } from "gatsby-plugin-image";
import Seo from "../components/seo";
import Dropdown from "../components/dropdown";
import { LayoutComponent } from "../components/layout";
import { DateTime } from "luxon";

// styles

const noMarginBottomStyle = css`
  margin-bottom: 0;
`;

const EinsatzLink = (props) => (
  <Link
    to={`/einsaetze/${props.id}`}
    css={css`
      text-decoration: none;
      color: ${textColor};
      margin-bottom: 0;
    `}
  >
    {props.children}
  </Link>
);

const EinsatzTable = ({ einsaetze }) => (
  <div key={einsaetze[0].id}>
    <h3>
      Einsätze im{" "}
      {einsaetze[0].alarmierungszeit.setLocale("de-de").toLocaleString({
        month: "long",
        year: "numeric",
      })}
    </h3>
    <Table
      header={[
        { title: "Alarmierung", width: "100px" },
        { title: "Einsatzbeschreibung" },
        { title: "Einsatzort" },
        { title: "Bild", width: "70px" },
      ]}
      data={einsaetze.map((node, index) => ({
        id: node.id,
        data: [
          <EinsatzLink id={node.id}>
            {node.alarmierungszeit && (
              <p css={noMarginBottomStyle}>
                {node.alarmierungszeit
                  .setLocale("de-DE")
                  .toLocaleString(dayFormatOptions)}
              </p>
            )}
            {node.alarmierungszeit && (
              <p css={noMarginBottomStyle}>
                {node.alarmierungszeit
                  .setLocale("de-de")
                  .toLocaleString(timeFormatOptions) + " Uhr"}
              </p>
            )}
          </EinsatzLink>,
          <EinsatzLink id={node.id}>
            <h4 css={noMarginBottomStyle}>{node.einsatzart}</h4>
            <p css={noMarginBottomStyle}>{node.kurzbericht}</p>
          </EinsatzLink>,
          <EinsatzLink id={node.id}>{node.einsatzort}</EinsatzLink>,
          <EinsatzLink id={node.id}>
            {node.einsatzbild && (
              <GatsbyImage
                image={node.einsatzbild.gatsbyImageData}
                alt={node.einsatzbeschreibung}
                css={noMarginBottomStyle}
              />
            )}
          </EinsatzLink>,
        ],
      }))}
      columnsFilter={(width) =>
        width > 600 ? [0, 1, 2, 3] : width > 410 ? [0, 1, 2] : [0, 1]
      }
    />
  </div>
);

const dayFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
const timeFormatOptions = { hour: "2-digit", minute: "2-digit" };

const View = ({ data, pageContext }) => {
  const all_data = data.allContentfulEinsatz.edges.map(({ node }, index) => ({
        id: node.id,
        kurzbericht: node.kurzbericht,
        alarmierungszeit: DateTime.fromISO(
          node.alarmierungszeit,
          "Europe/Berlin"
        ),
        einsatzort: node.einsatzort,
        einsatzart: node.einsatzart,
        einsatzbild: node.einsatzbild,
      }));

  // group by month
  const grouped = all_data.reduce((map, einsatz) => {
    const { alarmierungszeit: date } = einsatz;
    const key = date.year * 12 + date.month;

    const prev = map.get(key);
    if (prev) {
      prev.push(einsatz);
    } else {
      map.set(key, [einsatz]);
    }
    return map;
  }, new Map());
  let table_list = [];
  const yearsSet = new Set();
  for (let [_, einsaetze] of grouped) {
    table_list.push(
      <EinsatzTable einsaetze={einsaetze} key={einsaetze[0].id} />
    );
    yearsSet.add(einsaetze[0].alarmierungszeit.year);
  }
  const year = yearsSet.values().next().value;
  const description = `Einsätze im Jahr ${year}`;
  return (
    <LayoutComponent>
      <Seo
        title={`Einsätze ${year} - Feuerwehr Altfraunhofen`}
        description_short={description}
        description_long={description}
        url="http://feuerwehr-altfraunhofen.de"
      />
      <h1>Einsätze</h1>
      <Dropdown options={pageContext.allYears} selected={pageContext.year} />
      {table_list}
    </LayoutComponent>
  );
};

export default View;

export const query = graphql`
  query ($startYear: Date!, $endYear: Date!) {
    allContentfulEinsatz(
      sort: { fields: [alarmierungszeit], order: DESC }
      filter: { alarmierungszeit: { gte: $startYear, lte: $endYear } }
    ) {
      edges {
        node {
          id
          kurzbericht
          alarmierungszeit
          einsatzort
          einsatzart
          einsatzbild {
            gatsbyImageData(layout: FIXED, width: 50)
          }
        }
      }
    }
  }
`;
