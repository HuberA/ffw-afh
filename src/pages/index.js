import * as React from "react";
import { DateTime } from "luxon";
import { graphql, useStaticQuery, Link } from "gatsby";
import { StaticImage, GatsbyImage } from "gatsby-plugin-image";
import { color as textColor } from "../utils/typography";
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import {
  LayoutComponent,
  feuerwehrRot,
  hintergrundFarbe,
} from "../components/layout";
import Seo from "../components/seo";
import Divider from "../utils/divider";
import AktuellesList from "../components/aktuelles_list";

// styles
const formatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const redButtonStyle = css`
  background-color: #a81c1c;
  color: #fff;
  padding: 0.6em;
  border-radius: 0.3em;
  text-decoration: none;
  margin-bottom: 1rem;
  display: inline-block;
`;

const subHeaderStyle = css`
  text-align: center
`;

const divContainerStyles = css`
  overflow: auto;
`;

const einsaetzeStyles = css`
  a {
    text-decoration: none;
    color: ${textColor};
  }
  .einsatz-container {
    float: left;
    text-align: center;
    width: 31%;
    margin: 0 1%;
    overflow: hidden;

    @media (max-width: 800px) {
      float: none;
      width: 99%;
    }
  }
  div.gatsby-image-wrapper {
    margin: 0 auto;
    border-radius: 50%;
    height: 150px;
    width: 150px;
    object-fit: cover;
  }
  h3 {
    margin-bottom: 0;
  }
  .time {
    color: gray;
  }
`;

// data

const description = "Offizielle Website der Freiwilligen Feuerwehr Altfrauhofen"

// markup
const IndexPage = () => {
  const data = useStaticQuery(graphql`
  {
    einsatz: allContentfulEinsatz(
      sort: {fields: [alarmierungszeit], order: DESC}
      limit: 3
    ) {
      edges {
        node {
          id
          alarmierungszeit
          einsatzart
          kurzbericht
          einsatzort
          einsatzbericht {
            childMarkdownRemark {
              excerpt
            }
          }
          einsatzbild {
            id
            gatsbyImageData(layout: FIXED, width: 150, height: 150)
          }
        }
      }
    }
    berichte: allContentfulArtikel(sort: {fields: [datum], order: DESC}, limit: 3) {
      edges {
        node {
          id
          datum
          titel
          unteruberschrift
          titelbild {
            id
            gatsbyImageData(layout: CONSTRAINED, width: 400, backgroundColor: "red")
          }
          slug
        }
      }
    }
    einsatz_img: file(relativePath: {eq: "einsatz2.jpg"}) {
      childImageSharp {
        gatsbyImageData(
          layout: FIXED
          width: 150
          height: 150
          tracedSVGOptions: {turnPolicy: TURNPOLICY_MINORITY, blackOnWhite: true, color: "#A81C1C"}
        )
      }
    }
    titelbild: file(relativePath: {eq: "title.jpg"}) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1000)
      }
    }
  }
  
  `);
  const einsaetze = data.einsatz.edges;
  const berichte = data.berichte.edges;
  const titelbild = data.titelbild.childImageSharp.gatsbyImageData;
  return (
    <LayoutComponent>
      <Seo
        title={`Freiwillige Feuerwehr Altfraunhofen e.V.`}
        description_short={description}
        description_long={description}
        image={titelbild.images.fallback.src}
        imageSize={[titelbild.height, titelbild.width]}
        url="http://feuerwehr-altfraunhofen.de"
      />
      <div css={divContainerStyles}>
        <StaticImage
          src="../images/title.jpg"
          alt="Feuerwehr-Gerätehaus"
          placeholder="blurred"
          layout="fullWidth"
        />
      </div>
      <Divider />
      <h2 css={subHeaderStyle}>Aktuelles</h2>
      
      <AktuellesList limit="3" divider={Divider} />
      <Divider />
      <div css={einsaetzeStyles}>
        <h2 css={subHeaderStyle}>Letzte Einsätze</h2>
        {einsaetze.map(({ node }) => {
          const einsatz = node;
          const image = (
            einsatz.einsatzbild || data.einsatz_img.childImageSharp
          ).gatsbyImageData;
          return (
            <Link to={`/einsaetze/${einsatz.id}`} key={einsatz.id}>
              <div className="einsatz-container">
                <GatsbyImage
                  image={image}
                  alt={einsatz.kurzbericht}
                ></GatsbyImage>
                <h3>{einsatz.kurzbericht}</h3>
                <p className="time">
                  {DateTime.fromISO(einsatz.alarmierungszeit)
                    .setZone("Europe/Berlin")
                    .setLocale("de")
                    .toLocaleString(formatOptions)}
                </p>
                <div css={redButtonStyle}>Mehr Details &raquo;</div>
                <p />
              </div>
            </Link>
          );
        })}
      </div>

    </LayoutComponent>
  );
};

export default IndexPage;
