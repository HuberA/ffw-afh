import * as React from "react";
import { graphql } from "gatsby";

import { LayoutComponent } from "../components/layout";
import { GatsbyImage } from "gatsby-plugin-image";
import MapComponent from "../components/map";
import Navigation from "../components/navigation";
import Seo from "../components/seo";
import { DateTime } from "luxon";

const formatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};
const formatTime = { hour: "numeric", minute: "numeric" };

const ExtLink = ({ link, name, i }) => (
  <a
    href={link}
    alt={`Presselink ${i}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {name}
  </a>
);

const Presselinks = (data) => {
  return data?.map((url) => ({
    name: url.match(
      /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/
    )[0],
    url: url,
  }));
};

const Einsatz = (props) => {
  const { data, pageContext } = props;
  const previous = pageContext.previous;
  const next = pageContext.next;
  const einsatz = data.contentfulEinsatz;
  const alarmierung = DateTime.fromISO(
    einsatz.alarmierungszeit,
    "Europe/Berlin"
  );
  const einsatzende = DateTime.fromISO(einsatz.einsatzende, "Europe/Berlin");
  const einsatzdauer = einsatzende - alarmierung;
  const einsatzdauer_min = einsatzdauer / 60 / 1000;
  const einsatzdauer_h = Math.trunc(einsatzdauer_min / 60);
  const einsatzdauer_min_rem = einsatzdauer_min - 60 * einsatzdauer_h;
  const einsatzdauer_str = einsatzdauer_h
    ? `${einsatzdauer_h} Std. und ${einsatzdauer_min_rem} Min.`
    : `${einsatzdauer_min} Minuten`;
  const alarmierte_einheiten =
    typeof einsatz.alarmierteEinheiten !== "undefined" &&
    einsatz.alarmierteEinheiten !== null &&
    einsatz.alarmierteEinheiten.length > 0
      ? einsatz.alarmierteEinheiten.map(({ name }) => name)
      : null;
  const description_short = einsatz.einsatzbericht
    ? einsatz.childContentfulEinsatzEinsatzberichtTextNode.childMarkdownRemark
        .excerpt
    : einsatz.einsatzbericht_text && einsatz.einsatzbericht_text[0]
    ? einsatz.einsatzbericht_text[0].substring(0, 35)
    : null;
  const description_long = einsatz.einsatzbericht
    ? einsatz.childContentfulEinsatzEinsatzberichtTextNode.childMarkdownRemark
        .excerpt2
    : einsatz.einsatzbericht_text && einsatz.einsatzbericht_text[0]
    ? einsatz.einsatzbericht_text[0].substring(0, 65)
    : null;
  const image = einsatz.einsatzbild ? einsatz.einsatzbild.fixed.src : null;
  const presseLinks = Presselinks(einsatz.presseLinks);
  return (
    <LayoutComponent>
      <Seo
        title={`${einsatz.kurzbericht} - ${einsatz.einsatzart}`}
        description_short={description_short}
        description_long={description_long}
        image={image}
        url="http://feuerwehr-altfraunhofen.de"
      />
      <h1>{einsatz.einsatzart}</h1>
      <Navigation
        previous={data.previous}
        next={data.next}
        parent=""
        path="einsaetze"
        name="Einsatz"
      />
      {einsatz.einsatzbild && (
        <GatsbyImage
          image={einsatz.einsatzbild.gatsbyImageData}
          alt={einsatz.kurzbericht}
          backgroundColor="#A81C1C"
        />
      )}
      <h2>{einsatz.kurzbericht}</h2>
      <table>
        <tbody>
          <tr>
            <td>Einsatzort:</td>
            <td>{einsatz.einsatzort || "Unbekannt"}</td>
          </tr>
          <tr>
            <td>Alarmierung:</td>
            <td>
              {alarmierung.setLocale("de-de").toLocaleString(formatOptions)} Uhr
            </td>
          </tr>
          <tr>
            <td>Alarmierung per:</td>
            <td>{einsatz.alarmierungsart}</td>
          </tr>
          {einsatzdauer > 0 && (
            <tr>
              <td>Einsatzende:</td>
              <td>
                {einsatzende.setLocale("de-de").toLocaleString(formatTime)}
              </td>
            </tr>
          )}
          {einsatzdauer > 0 && (
            <tr>
              <td>Einsatzdauer:</td>
              <td>{einsatzdauer_str}</td>
            </tr>
          )}
          {einsatz.einsatzleiter && (
            <tr>
              <td>Einsatzleiter:</td>
              <td>{einsatz.einsatzleiter}</td>
            </tr>
          )}
          {einsatz.mannschatfsstaerke && (
            <tr>
              <td>Mannschaftsstärke:</td>
              <td>{einsatz.mannschatfsstaerke}</td>
            </tr>
          )}
          {alarmierte_einheiten && (
            <tr>
              <td>Alarmierte Einheiten:</td>
              <td>{alarmierte_einheiten[0]}</td>
            </tr>
          )}
          {alarmierte_einheiten &&
            alarmierte_einheiten.slice(1).map((name, index) => (
              <tr key={index}>
                <td></td>
                <td>{name}</td>
              </tr>
            ))}
          {presseLinks && (
            <tr>
              <td>Presselink</td>
              <td>
                " "
                <ExtLink
                  link={presseLinks[0].url}
                  name={presseLinks[0].name}
                  i={0}
                />
              </td>
            </tr>
          )}
          {presseLinks && presseLinks.length > 1 &&
            presseLinks.slice(1).map(({ name, url }) => (
              <tr>
                <td></td>
                <td>
                  {" "}
                  <ExtLink link={url} name={name} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {einsatz.einsatzbericht && (
        <div
          dangerouslySetInnerHTML={{
            __html:
              einsatz.childContentfulEinsatzEinsatzberichtTextNode
                .childMarkdownRemark.html,
          }}
        />
      )}
      {einsatz.einsatzbericht_text && (
        <div>
          {einsatz.einsatzbericht_text.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      )}

      {einsatz.einsatzortGeo && (
        <MapComponent
          lat={einsatz.einsatzortGeo.lat}
          lng={einsatz.einsatzortGeo.lon}
        />
      )}
      <Navigation
        previous={previous}
        next={next}
        parent=""
        path="einsaetze"
        name="Einsatz"
      />
      <p>
        {" "}
        <b>Wichtiger Hinweis:</b> Auf unserer Internetseite berichten wir
        ausführlich (also auch mit Bildmaterial) über unser Einsatzgeschehen.
        Bilder werden erst gemacht, wenn das Einsatzgeschehen dies zulässt! Es
        werden keine Bilder von Verletzten oder Toten gemacht oder hier
        veröffentlicht! Sollten Sie Einwände gegen die hier veröffentlichen
        Fotos oder Berichte haben, wenden Sie sich bitte vertrauensvoll an
        unseren Webmaster.
      </p>
    </LayoutComponent>
  );
};

export default Einsatz;

export const pageQuery = graphql`
  query ($id: String!) {
    contentfulEinsatz(id: { eq: $id }) {
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
      einsatzbild {
        gatsbyImageData(layout: CONSTRAINED, width: 1000, height: 800)
        fixed: gatsbyImageData(layout: FIXED, width: 600)
      }
      mannschatfsstaerke
      einsatzortGeo {
        lon
        lat
      }
      einsatzbericht {
        id
      }
      childContentfulEinsatzEinsatzberichtTextNode {
        id
        childMarkdownRemark {
          html
          excerpt(pruneLength: 155)
          excerpt2: excerpt(pruneLength: 65)
        }
      }
      presselink
      alarmierteEinheiten {
        id
        name
      }
    }
  }
`;
