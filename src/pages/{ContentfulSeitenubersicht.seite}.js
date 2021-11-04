import React from "react";
import { LayoutComponent } from "../components/layout";
import { graphql } from "gatsby";
import Seo from "../components/seo";
import ThumbnailSlideshow from "../components/thumbnail_slideshow";
import { GatsbyImage } from "gatsby-plugin-image";
import { feuerwehrRot, hintergrundFarbe } from "../components/layout";
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
// styles

const containerStyles = css`
  display: flex;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  @media screen and (max-width: 500px) {
    display: block;
  }
`;

const imageStyles = css`
  width: 30%;
  position: left;
  display: block;
  margin-left: 5%;
  margin-right: 5%;
  @media screen and (max-width: 500px) {
    margin: auto;
    margin-top: 1rem;
    max-width: 250px;
    width: 100%;
  }
`;

const portraitStyles = css`
  position: right;
  display: block;
  margin-bottom: 0;
  margin-top: 1.5rem;
  @media screen and (max-width: 500px) {
    margin: auto;
    max-width: 250px;
    width: 100%;
  }
`;

// markdown

const Portrait = (props) => (
  <div key={props.id} css={containerStyles}>
    <div css={imageStyles}>
      <GatsbyImage
        image={
          props.data.bild
            ? props.data.bild.gatsbyImageData
            : props.ersatzbild.gatsbyImageData
        }
        alt={props.data.name}
        backgroundColor={feuerwehrRot}
      />
    </div>
    <div css={portraitStyles}>
      <h4 style={{ marginBottom: "0" }}>{props.data.name}</h4>
      <p>{props.data.funktion}</p>
      {props.data.adresse && (
        <div>
          {props.data.adresse.adresse.split("\n").map((val, n) => (
            <p key={n} style={{ margin: "0" }}>
              {val}
            </p>
          ))}
        </div>
      )}
      {props.data.telefon && <h5 style={{ marginBottom: "0" }}>Telefon:</h5>}
      {props.data.telefon && (
        <p style={{ marginBottom: "0" }}>{props.data.telefon}</p>
      )}
      {props.data.email && <h5 style={{ marginBottom: "0" }}>E-Mail:</h5>}
      {props.data.email && <p>{props.data.email}</p>}
    </div>
  </div>
);

const Uebersicht = (all_data) => {
  const { data } = all_data;
  const seite = data.contentfulSeitenubersicht;
  return (
    <LayoutComponent>
      <Seo
        title={`${seite.seitentitel} - Feuerwehr Altfraunhofen`}
        url="http://feuerwehr-altfraunhofen.de"
      />
      <h1>{data.contentfulSeitenubersicht.seitentitel}</h1>
      {data.contentfulSeitenubersicht.seiteneintrag.map((eintrag, index) => {
        switch (eintrag.__typename) {
          case "ContentfulSeitengalerie":
            return (
              <div key={eintrag.id}>
                <h2>{eintrag.titel}</h2>
                <ThumbnailSlideshow images={eintrag.galerie} height="500px" />
              </div>
            );
          case "ContentfulSeiteneintrag":
            return (
              <div key={eintrag.id}>
                <h2>{eintrag.titel}</h2>
                {eintrag.childContentfulSeiteneintragEintragTextNode && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        eintrag.childContentfulSeiteneintragEintragTextNode
                          .childMarkdownRemark.html,
                    }}
                  />
                )}
              </div>
            );
          case "ContentfulPortrait":
            return (
              <Portrait
                data={eintrag}
                ersatzbild={data.ersatzbild.childImageSharp}
                key={eintrag.id}
              />
            );
          default:
            return null;
        }
      })}
    </LayoutComponent>
  );
};

export default Uebersicht;
export const query = graphql`
  query ($seite: String!) {
    contentfulSeitenubersicht(seite: { eq: $seite }) {
      seite
      seitentitel
      seiteneintrag {
        __typename
        ... on ContentfulSeiteneintrag {
          id
          titel
          childContentfulSeiteneintragEintragTextNode {
            childMarkdownRemark {
              id
              html
            }
          }
        }
        ... on ContentfulPortrait {
          id
          name
          funktion
          telefon
          email
          adresse {
            adresse
          }
          bild {
            gatsbyImageData(layout: CONSTRAINED, width: 300)
          }
          name
        }
        ... on ContentfulSeitengalerie {
          id
          titel
          galerie {
            title
            description
            thumb: gatsbyImageData(
              layout: CONSTRAINED
              width: 170
              height: 100
              resizingBehavior: PAD
              backgroundColor: "#F3F7F4"
            )
            gatsbyImageData(
              layout: CONSTRAINED
              width: 700
              height: 500
              backgroundColor: "#F3F7F4"
              resizingBehavior: PAD
            )
          }
        }
      }
    }
    ersatzbild: file(relativePath: { eq: "noch_kein_bild_verfgbar.jpg" }) {
      childImageSharp {
        gatsbyImageData(
          layout: CONSTRAINED
          width: 500
          height: 500
          transformOptions: { fit: CONTAIN }
        )
      }
    }
  }
`;
