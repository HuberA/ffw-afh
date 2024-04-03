import * as React from "react";
import { LayoutComponent } from "../components/layout";
import { graphql, Link, useStaticQuery } from "gatsby";
import Table from "../components/table";
import { Popup, PopupItem } from "../components/popup";
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { color as textColor } from "../utils/typography";
import Seo from "../components/seo";
const { DateTime } = require("luxon");

//styles

const dayFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
const timeFormatOptions = { hour: "2-digit", minute: "2-digit" };

const terminLinkStyles = css`
  text-decoration: none;
  color: ${textColor};
  margin-bottom: 0;
`;

const noBottomMarginStyle = css`
  margin-bottom: 0;
`;

// data
const description = "Kalender der Freiwilligen Feuerwehr Altfrauhofen";

// markup

const TerminLink = (props) => (
  <Link to={`/termine/${props.id}`} css={terminLinkStyles}>
    {props.children}
  </Link>
);

const Calender = () => {
  const data = useStaticQuery(graphql`
    {
        allIcal(sort: {fields: start}) {
          edges {
            node {
              start
              end
              summary
              location
              id
              uid
              description
              sourceInstanceName
            }
          }
        }      
    }
  `);
  return (
    <LayoutComponent>
      <Seo
        title={`Feuerwehrkalender`}
        description_short={description}
        description_long={description}
        url="http://feuerwehr-altfraunhofen.de"
      />
      <h1>Kalender</h1>
      <Table
        header={[
          { title: "Datum", width: "100px" },
          { title: "Beschreibung" },
          { title: "Veranstaltungsort" },
          { title: "Kategorie" },
        ]}
        data={data.allIcal.edges.map(({ node }, index) => {
          const datum = DateTime.fromISO(node.start, { zone: 'utc' })
            .setZone("Europe/Berlin")
            .setLocale("de");
          const next_day = datum.plus({ days: 1 });
          if (next_day < new Date()) return null;
          const groupText = node.gruppe ? node.gruppe.join(", ") + ": " : "";
          const showStartTime = datum.hour != 0 || datum.minute != 0;
          return {
            id: node.id,
            data: [
              <TerminLink id={node.id}>
                <p css={noBottomMarginStyle}>
                  {datum.toLocaleString(dayFormatOptions)}
                </p>
                {showStartTime && <p css={noBottomMarginStyle}>
                  {datum.toLocaleString(timeFormatOptions) + " Uhr"}
                </p>}
              </TerminLink>,
              <TerminLink id={node.id}>{node.summary}</TerminLink>,
              <TerminLink id={node.id}>{node.location}</TerminLink>,
              <TerminLink id={node.id}>{(node.sourceInstanceName == "vereins-kalender") ? "Verein" : ""}</TerminLink>,
            ],
          };
        })}
        columnsFilter={(width) =>
          width > 720
            ? [0, 1, 2, 3]
            : width > 650
              ? [0, 1, 2]
              : [0, 1]
        }
      />
    </LayoutComponent>
  );
};

export default Calender;
