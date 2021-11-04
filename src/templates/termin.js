import React from "react";
import { graphql, Link } from "gatsby";
import { LayoutComponent } from "../components/layout";
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import Seo from "../components/seo";
import Table from "../components/table";
import { DateTime } from "luxon";
import { redButton } from "../components/navigation";

//styles

const dayFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
const timeFormatOptions = { hour: "2-digit", minute: "2-digit" };

const noBottomMargin = css`
  margin-bottom: 0;
`;

//markup

const terminView = ({ data }) => {
  const termin = data.contentfulTermin;
  const datum = DateTime.fromISO(termin.datum)
    .setZone("Europe/Berlin")
    .setLocale("de");
  return (
    <LayoutComponent>
      <Seo
        title={termin.beschreibung}
        description_short={termin.beschreibung}
        description_long={termin.beschreibung}
        url={`http://feuerwehr-altfraunhofen.de/termine/${termin.id}`}
      />
      <div>
        <h1>{termin.beschreibung}</h1>
        <Table
          header={["", ""]}
          data={[
            {
              id: "datum",
              data: [
                <div>Datum</div>,
                <div>
                  <p css={noBottomMargin}>
                    {datum.toLocaleString(dayFormatOptions)}
                  </p>
                  <p css={noBottomMargin}>
                    {datum.toLocaleString(timeFormatOptions) + " Uhr"}
                  </p>
                </div>,
              ],
            },
            {
              id: "gruppe",
              data: [
                <div>Gruppe</div>,
                <div>
                  {termin.gruppe
                    ? termin.gruppe.map((gruppe, index) => (
                        <p css={noBottomMargin} key={gruppe}>
                          {gruppe}
                        </p>
                      ))
                    : "Alle"}
                </div>,
              ],
            },
            {
              id: "beschreibung",
              data: [<div>Beschreibung</div>, <div>{termin.beschreibung}</div>],
            },
            {
              id: "ort",
              data: [<div>Ort</div>, <div>{termin.veranstaltungsort}</div>],
            },
            {
              id: "kategorie",
              data: [<div>Kategorie</div>, <div>{termin.kategorie}</div>],
            },
          ]}
        />
      </div>
      {termin.anmerkungen && (
        <div
          dangerouslySetInnerHTML={{
            __html: termin.anmerkungen.childMarkdownRemark.html,
          }}
        />
      )}
      <Link css={redButton} to={`/kalender`}>
        Zurück
      </Link>
    </LayoutComponent>
  );
};

export default terminView;

export const query = graphql`
  query ($id: String!) {
    contentfulTermin(id: { eq: $id }) {
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
`;
