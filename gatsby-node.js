const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const DEPLOY_DIR = `public`;
const fs = require("fs");
const ical = require("ical-generator");
const { DateTime } = require("luxon");

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    if (node.fileAbsolutePath) {
      const path = node.fileAbsolutePath.match(/src\/pages/)
        ? ""
        : "/aktuelles";
      const slug = createFilePath({ node, getNode, basePath: `src${path}` });
      createNodeField({
        node,
        name: `slug`,
        value: `${path}${slug}`,
      });
    }
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allContentfulEinsatz(sort: { fields: [alarmierungszeit], order: DESC }) {
        edges {
          node {
            id
            alarmierungszeit
          }
          previous {
            id
          }
          next {
            id
          }
        }
      }
      allContentfulArtikel(sort: { fields: [datum], order: DESC }) {
        edges {
          node {
            id
            slug
          }
          next {
            slug
          }
          previous {
            slug
          }
        }
      }
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
            type
            sourceInstanceName
            dtstamp
          }
        }
      }
    }
  `);
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query for Einsatz`);
    return;
  }

  const berichtTemplate = path.resolve(`./src/templates/bericht.js`);
  const einsatzTemplate = path.resolve(`./src/templates/einsatz.js`);
  const einsaetzeTemplate = path.resolve(`./src/templates/einsaetze.js`);

  result.data.allContentfulEinsatz.edges.forEach(({ node, previous, next }) => {
    const path = `/einsaetze/${node.id}`;
    createPage({
      path,
      component: einsatzTemplate,
      context: {
        id: node.id,
        previous: previous && previous.id,
        next: next && next.id,
      },
    });
  });
  const einsatz = result.data.allContentfulEinsatz.edges[0];
  createPage({
    path: "/einsaetze/latest",
    component: einsatzTemplate,
    context: {
      id: einsatz.node.id,
      previous: einsatz.previous && einsatz.previous.id,
      next: einsatz.next && einsatz.next.id,
    },
  });
  const allYears = result.data.allContentfulEinsatz.edges.map(
    ({ node, index }) => node.alarmierungszeit.substring(0, 4)
  );
  const yearsSet = new Set(allYears);
  const years = Array.from(yearsSet.values());
  createPage({
    path: `/einsaetze/`,
    component: einsaetzeTemplate,
    context: {
      year: years[0],
      startYear: `${years[0]}-01-01`,
      endYear: `${years[0]}-12-31`,
      allYears: years,
    },
  });
  for (let year of yearsSet) {
    createPage({
      path: `/einsaetze/${year}/`,
      component: einsaetzeTemplate,
      context: {
        year: year,
        startYear: `${year}-01-01`,
        endYear: `${year}-12-31`,
        allYears: years,
      },
    });
  }
  result.data.allContentfulArtikel.edges.forEach(({ node, next, previous }) => {
    createPage({
      path: `/berichte/${node.slug}/`,
      component: berichtTemplate,
      context: {
        id: node.id,
        next: next ? next.slug : null,
        previous: previous ? previous.slug : null,
      },
    });
  });

  result.data.allIcal.edges.forEach(({ node }) => {
    createPage({
      path: `/termine/${node.id}/`,
      component: path.resolve(`./src/templates/termin.js`),
      context: {
        id: node.id,
      },
    });
  });
  const response = await fetch("https://app.divera247.com/api/v2/events/ics?accesskey=FDl5vwsCIjNLwodFXKMQ-biWDZppdeyRLMIoF5TSEo1Ww2hyU0NIm2BQZBJffllS&ucr=628582")
  const response_text = await response.text()
  const matches = [...response_text.matchAll(/LAST-MODIFIED:(\d{4})([01]\d)([0-3]\d)T([0-2]\d)([0-5]\d)([0-5]\d)Z/g)];
  const date = new Date(Math.max(...matches.map(match => Date.parse(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}`))));
  console.log('Latest calendar change:', date.toISOString())

  calendarHashPath = path.posix.join(process.cwd(), DEPLOY_DIR, '/latest_change.txt')
  fs.writeFile(calendarHashPath, date.toISOString(), function (err) {
    if (err) {
      return console.log(err);
    }
  })

};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /scriptjs/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
