import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import { color as textColor } from "../utils/typography";
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { GatsbyImage } from "gatsby-plugin-image";
import { DateTime } from "luxon";

const formatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

//styles
const berichtContainer = css`
  overflow: auto;
`;

const berichtLink = css`
  text-decoration: none;
`;

const berichtLinkContainer = (alignment) => css`
  overflow: auto;
  color: ${textColor};
  .content {
    float: ${alignment};
    width: 58%;
    margin: 2rem 1%;

    @media (max-width: 800px) {
      float: none;
      width: 99%;
    }
    p {
      color: gray;
    }
  }
  .image {
    float: ${alignment};
    width: 38%;
    margin: 2rem 1%;

    @media (max-width: 800px) {
      float: none;
      width: 99%;
    }
  }
`;

// markup

const AktuellesList = (props) => {
    const data = useStaticQuery(graphql`
    {
      berichte: allContentfulArtikel(sort: { fields: [datum], order: DESC }) {
        edges {
          node {
            id
            datum
            titel
            unteruberschrift
            titelbild {
              gatsbyImageData(
                layout: CONSTRAINED
                width: 400
                backgroundColor: "red"
              )
            }
            slug
          }
        }
      }
    }
  `);
  return (
    <div css={berichtContainer}>
      {Array.from(data.berichte.edges.entries()).slice(0, props.limit || 999).map((obj) => {
        const [number, node] = obj;
        const aktuelles = node.node;
        const alignment = number % 2 === 0 ? "left" : "right";
        return (
          <Link
            key={aktuelles.id}
            to={`/berichte/${aktuelles.slug}/`}
            css={berichtLink}
          >
            <div css={berichtLinkContainer(alignment)}>
              {number !== 0 && <props.divider />}
              <div className={"content"}>
                <p>
                  {DateTime.fromISO(aktuelles.datum, "Europe/Berlin")
                    .setLocale("de")
                    .toLocaleString(formatOptions)}
                </p>
                <h3>{aktuelles.titel}</h3>
                <h4>{aktuelles.unteruberschrift}</h4>
              </div>
              {aktuelles.titelbild && (
                <GatsbyImage
                  className={"image"}
                  image={aktuelles.titelbild.gatsbyImageData}
                />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default AktuellesList;
