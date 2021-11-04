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
      allMarkdownRemark(filter: { fileAbsolutePath: { ne: null } }) {
        edges {
          node {
            fields {
              slug
            }
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
      allContentfulTermin {
        edges {
          node {
            id
            beschreibung
            datum
            createdAt
            veranstaltungsort
            kategorie
            gruppe
            anmerkungen {
              anmerkungen
            }
            ende
            feuerwehrhausHeizen
          }
        }
      }
    }
  `);
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query for Einsatz`);
    return;
  }

  const aktuellesTemplate = path.resolve(`./src/templates/aktuelles.js`);
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
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: aktuellesTemplate,
      context: {
        slug: node.fields.slug,
      },
    });
  });
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
  const cal_path = path.posix.join(process.cwd(), DEPLOY_DIR, "ffw.ics");
  const cal = ical({
    domain: "feuerwehr-altfraunhofen.de",
    prodId: {
      company: "Feuerwehr Altfraunhofen",
      product: "fw ical-generator",
    },
    name: "Feuerwehr Terminkalender",
    timezone: "Europe/Berlin",
  });
  const calFwhaus = ical(cal.toJSON());
  const allUsedGroups = [].concat.apply(
    [],
    result.data.allContentfulTermin.edges.map(({ node }, index) => node.gruppe)
  );
  const uniqueGroups = Array.from(new Set(allUsedGroups).values());
  const relevantGroups = uniqueGroups.filter((value) =>
    /(Gruppe (\w)|Jugend)/.test(value)
  );
  const cals = relevantGroups.map((group) => [
    group,
    ical({
      domain: "feuerwehr-altfraunhofen.de",
      prodId: {
        company: "Feuerwehr Altfraunhofen",
        product: "fw ical-generator",
      },
      name: `Feuerwehr Terminkalender ${group}`,
      timezone: "Europe/Berlin",
    }),
  ]);
  const calMap = new Map(cals);

  result.data.allContentfulTermin.edges.forEach(({ node }) => {
    const anmerkung = node.anmerkungen ? node.anmerkungen.anmerkungen : "";
    const gruppe_str_lang = node.gruppe
      ? (node.gruppe.length == 1 ? "Gruppe: " : "Gruppen: ") +
        node.gruppe.join(", ")
      : "";
    const gruppe_str = node.gruppe
      ? node.gruppe
          .map((gruppe, index) =>
            gruppe.replace(/Gruppe (\w)/, "$1").replace("Jugend", "J")
          )
          .join(", ") + ": "
      : "";
    const start = DateTime.fromISO(node.datum, {
      zone: "Europe/Berlin",
    }).setZone("Europe/Berlin");
    const end = node.ende
      ? DateTime.fromISO(node.ende, { zone: "Europe/Berlin" }).toJSDate()
      : DateTime.fromISO(node.datum, { zone: "Europe/Berlin" })
          .plus({ hours: 1 })
          .toJSDate();
    const event = cal.createEvent({
      start: start,
      end: end,
      timestamp: node.createdAt,
      location: node.veranstaltungsort,
      summary: `${gruppe_str}${node.beschreibung}`,
      timezone: "Europe/Berlin",
      description: `${anmerkung}\n${gruppe_str_lang}`,
    });

    event.createAlarm({
      type: "display",
      trigger: 3600, // 1h before event
    });
    event.createCategory({ name: node.kategorie });
    const relevanteGruppen = node.gruppe
      ? node.gruppe.filter((value) => /(Gruppe (\w)|Jugend)/.test(value))
      : relevantGroups;
    relevanteGruppen.forEach((group) => {
      const cale = calMap.get(group);
      cale.createEvent(event.toJSON());
    });
    if (node.feuerwehrhausHeizen) {
      calFwhaus.createEvent(event.toJSON());
    }
  });
  fs.writeFile(cal_path, cal.toString(), function (err) {
    if (err) {
      return console.error(err);
    }
  });
  calMap.forEach((cal, name) => {
    const cName = name
      .replace(/Gruppe (\w)/, "$1")
      .replace("Jugend", "J")
      .toLowerCase();
    const calpath = path.posix.join(
      process.cwd(),
      DEPLOY_DIR,
      `ffw${cName}.ics`
    );
    fs.writeFile(calpath, cal.toString(), function (err) {
      if (err) {
        return console.error(err);
      }
    });
  });
  calFWhausPath = path.posix.join(process.cwd(), DEPLOY_DIR, "fwhaus.ics");
  fs.writeFile(calFWhausPath, calFwhaus.toString(), function (err) {
    if (err) {
      return console.err(err);
    }
  });

  result.data.allContentfulTermin.edges.forEach(({ node }) => {
    createPage({
      path: `/termine/${node.id}/`,
      component: path.resolve(`./src/templates/termin.js`),
      context: {
        id: node.id,
      },
    });
  });
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
