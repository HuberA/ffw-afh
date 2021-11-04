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
      allContentfulTermin(sort: { fields: [datum], order: ASC }) {
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
      <Popup>
        <PopupItem name="Alle" value="ffw.ics" />
        <PopupItem name="Gruppe A" value="ffwa.ics" />
        <PopupItem name="Gruppe B" value="ffwb.ics" />
        <PopupItem name="Gruppe C" value="ffwc.ics" />
        {/*<PopupItem name="Gruppe D" value="ffwd.ics"/>*/}
        <PopupItem name="Jugend" value="ffwj.ics" />
        <PopupItem name="Feuerwehrhaus" value="fwhaus.ics" />
      </Popup>
      <Table
        header={[
          { title: "Datum", width: "100px" },
          { title: "Gruppe" },
          { title: "Beschreibung" },
          { title: "Veranstaltungsort" },
          { title: "Kategorie" },
          { title: "Beschreibung" },
        ]}
        data={data.allContentfulTermin.edges.map(({ node }, index) => {
          const datum = DateTime.fromISO(node.datum)
            .setZone("Europe/Berlin")
            .setLocale("de");
          const next_day = datum.plus({ days: 1 });
          if (next_day < new Date()) return null;
          const groupText = node.gruppe ? node.gruppe.join(", ") + ": " : "";
          return {
            id: node.id,
            data: [
              <TerminLink id={node.id}>
                <p css={noBottomMarginStyle}>
                  {datum.toLocaleString(dayFormatOptions)}
                </p>
                <p css={noBottomMarginStyle}>
                  {datum.toLocaleString(timeFormatOptions) + " Uhr"}
                </p>
              </TerminLink>,
              <TerminLink id={node.id}>
                {node.gruppe
                  ? node.gruppe.map((gruppe, index) => (
                      <p css={noBottomMarginStyle} key={gruppe}>
                        {gruppe}
                      </p>
                    ))
                  : "Alle"}
              </TerminLink>,
              <TerminLink id={node.id}>{node.beschreibung}</TerminLink>,
              <TerminLink id={node.id}>{node.veranstaltungsort}</TerminLink>,
              <TerminLink id={node.id}>{node.kategorie}</TerminLink>,
              <TerminLink id={node.id}>
                {groupText + node.beschreibung}
              </TerminLink>,
            ],
          };
        })}
        columnsFilter={(width) =>
          width > 720
            ? [0, 1, 2, 3, 4]
            : width > 620
            ? [0, 1, 2, 3]
            : width > 420
            ? [0, 1, 2]
            : [0, 5]
        }
      />
    </LayoutComponent>
  );
};

export default Calender;
