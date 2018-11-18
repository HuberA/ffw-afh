const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const DEPLOY_DIR = `public`;
const fs = require('fs');
const ical = require('ical-generator')
const moment = require('moment')

exports.onCreateNode = ({node, getNode, actions}) => {
    const {createNodeField} = actions
    if (node.internal.type === `MarkdownRemark`){
        if(node.fileAbsolutePath){
            const path = node.fileAbsolutePath.match(/src\/pages/)?'':'/aktuelles';
            const slug = createFilePath({node, getNode, basePath: `src${path}`})
            createNodeField({
                node,
                name: `slug`,
                value: `${path}${slug}`,
            })
        }
    }
}



exports.createPages = ({ graphql, actions}) => {
    const { createPage } = actions;
    return Promise.all([new Promise((resolve, reject) => {
        graphql(`
        {
            allData1Json {
              edges {
                node {
                  id
                  Bilder
                }
                previous{
                    id
                }
                next{
                    id
                }
              }
            }
          }
        `).then( result => {
            if (result.data && result.data.allData1Json){
                result.data.allData1Json.edges.forEach(({ node, previous, next }) => {
                    const bild = (node.Bilder)?`images/${node.Bilder[0]}`:''
                    createPage({
                        path: `/einsaetze/${node.id}`,
                        component: path.resolve(`./src/templates/einsatz.js`),
                        context: {
                            id: node.id,
                            bild: bild,
                            previous: previous && previous.id,
                            next: next && next.id
                        }
                    })
                })
            }
            resolve()
        })
    }),
    new Promise((resolve, reject) =>{
        graphql(`
        {
            allContentfulEinsatz(sort: {fields: [alarmierungszeit], order: DESC}) {
              edges {
                node {
                  id
                }
                previous{
                    id
                }
                next{
                    id
                }
              }
            }
          }
        `).then( result => {
            result.data.allContentfulEinsatz.edges.forEach(({ node, previous, next }) => {
                createPage({
                    path: `/einsaetze/${node.id}`,
                    component: path.resolve(`./src/templates/einsatz_cms.js`),
                    context: {
                        id: node.id,
                        previous: previous && previous.id,
                        next: next && next.id
                    }
                })

            })
        resolve()
        })
    }),
    new Promise((resolve, reject) =>{
        graphql(`
        {
            old_data: allData1Json(sort: {fields: [Alarmierung___zeitpunkt], order: DESC}
                filter: {Alarmierung: {zeitpunkt: {ne: null}}}
            ) {
              edges {
                node {
                  Alarmierung {
                    zeitpunkt
                  }
              }
            }
            }
            new_data: allContentfulEinsatz(sort: {fields: [alarmierungszeit], order: DESC}) {
              edges {
                node {
                  alarmierungszeit
                }
                  
                }
              }
           }
        `).then(result => {
            const allYears = result.data.new_data.edges.map(({node, index}) => node.alarmierungszeit.substring(0,4)).concat(
                result.data.old_data.edges.map(({node, index}) => node.Alarmierung.zeitpunkt.substring(0, 4))
            );
            yearsSet = new Set(allYears);
            const years = Array.from(yearsSet.values())
            //const allYears = Array.from(yearsSet.values())
            createPage({
                path: `/einsaetze/`,
                component: path.resolve(`./src/templates/einsaetze.js`),
                context: {
                    year: years[0],
                    yearExp: `/^${years[0]}/`,
                    allYears: years 
                }
            })
            for(let year of yearsSet){
                createPage({
                    path: `/einsaetze/${year}/`,
                    component: path.resolve(`./src/templates/einsaetze.js`),
                    context: {
                        year: year,
                        yearExp: `/^${year}/`,
                        allYears: years
                    }
                })
            }
            resolve();
            });
            
    }),
    new Promise((resolve, reject) => {
        graphql(`
        {
            allContentfulSeitenubersicht {
              edges {
                node {
                  id
                  seite
                }
              }
            }
          }
        `).then( result => {
            result.data.allContentfulSeitenubersicht.edges.forEach(({ node }) =>{
                createPage({
                    path: `/${node.seite}`,
                    component: path.resolve(`./src/templates/seite_contentful.js`),
                    context: {
                        seite: node.seite
                    }
                })
            })
            resolve()
        })
    }),
    new Promise((resolve, reject) => {
        graphql(`
        {
            allMarkdownRemark( filter: {fileAbsolutePath: {ne: null}}) {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
        }    
        `
        ).then(result => {
            result.data.allMarkdownRemark.edges.forEach(({ node }) =>{
                createPage({
                    path: node.fields.slug,
                    component: path.resolve(`./src/templates/aktuelles.js`),
                    context: {
                        slug: node.fields.slug,

                    }
                })
                
            })
            resolve()
        })
    }),
    new Promise((resolve, reject) => {
        graphql(`
        {
            allContentfulArtikel(
                sort: {fields: [datum] order: DESC}
            ) {
                edges {
                    node {
                        id
                        slug
                    }
                    next{
                        slug
                    }
                    previous{
                        slug
                    }
    
                }
            }
        }
        `
        ).then(result => {
            result.data.allContentfulArtikel.edges.forEach(({ node, next, previous }) => {
                createPage({
                    path: `/berichte/${node.slug}/`,
                    component: path.resolve(`./src/templates/bericht.js`),
                    context: {
                        id: node.id,
                        next: (next)?next.slug:null,
                        previous: (previous)?previous.slug:null
                    }
                })
            })
            resolve()
        })
    }),
	new Promise((resolve, reject) => {
        graphql(`
        {
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
        `
        ).then(result => {
            const cal_path = path.posix.join(process.cwd(), DEPLOY_DIR, 'ffw.ics')
            const cal = ical({
                domain: 'feuerwehr-altfraunhofen.de',
                prodId: {company: 'Feuerwehr Altfraunhofen', product: 'fw ical-generator'},
                name: 'Feuerwehr Terminkalender',
                timezone: 'Europe/Berlin'
            });
            const calFwhaus = ical(cal.toJSON());
            const allUsedGroups = [].concat.apply([], result.data.allContentfulTermin.edges.map(({node}, index) => node.gruppe)); 
            const uniqueGroups = Array.from(new Set(allUsedGroups).values());
            const relevantGroups = uniqueGroups.filter( value => /(Gruppe (\w)|Jugend)/.test(value)) 
            const cals = relevantGroups.map(group => [group, ical({
                domain: 'feuerwehr-altfraunhofen.de',
                prodId: {company: 'Feuerwehr Altfraunhofen', product: 'fw ical-generator'},
                name: `Feuerwehr Terminkalender ${group}`,
                timezone: 'Europe/Berlin'
            })])
            const calMap = new Map(cals)

            result.data.allContentfulTermin.edges.forEach(({ node }) => {
                const anmerkung = node.anmerkungen ? node.anmerkungen.anmerkungen: ""
                const gruppe_str_lang = node.gruppe ? ((node.gruppe.length == 1)?'Gruppe: ':'Gruppen: ')
                                        + node.gruppe.join(', ') : ""
                const gruppe_str = node.gruppe ? node.gruppe.map((gruppe, index) => (
                    gruppe.replace(/Gruppe (\w)/, '$1').replace('Jugend', 'J')
                )).join(', ') + ': ': ''
                const start = moment.tz(node.datum, 'Europe/Berlin');
                const end = node.ende ? moment.tz(node.ende, 'Europe/Berlin'): moment.tz(node.datum, 'Europe/Berlin').add(1, 'hour');
                const event = cal.createEvent({
                    start: start,
                    end: end,
                    timestamp: node.createdAt,
                    location: node.veranstaltungsort,
                    summary: `${gruppe_str}${node.beschreibung}`,
                    timezone: 'Europe/Berlin',
                    description: `${anmerkung}\n${gruppe_str_lang}`,
                });

                event.createAlarm({
                    type: 'display',
                    trigger: 3600, // 1h before event
                });
                event.createCategory({name: node.kategorie})
                const relevanteGruppen = node.gruppe? node.gruppe.filter ( value =>  /(Gruppe (\w)|Jugend)/.test(value)): relevantGroups;
                relevanteGruppen.forEach(group => {
                    const cale = calMap.get(group);
                    cale.createEvent(event.toJSON());
                });
                if (node.feuerwehrhausHeizen){
                    calFwhaus.createEvent(event.toJSON())
                }

    
            })
            fs.writeFile(cal_path, cal.toString(), function(err) {
                if (err){
                    return console.error(err);
                }
            })
            calMap.forEach((cal, name) => {
                const cName = name.replace(/Gruppe (\w)/, '$1').replace('Jugend', 'J').toLowerCase();
                const calpath = path.posix.join(process.cwd(), DEPLOY_DIR, `ffw${cName}.ics`)
                fs.writeFile(calpath, cal.toString(), function(err) {
                    if (err){
                        return console.error(err);
                    }
                })
            })
            calFWhausPath = path.posix.join(process.cwd(), DEPLOY_DIR, 'fwhaus.ics')
            fs.writeFile(calFWhausPath, calFwhaus.toString(), function(err) {
                if (err){
                    return console.log(err);
                }
            })
            
            result.data.allContentfulTermin.edges.forEach(({ node }) => {
                createPage({
                    path: `/termine/${node.id}/`,
                    component: path.resolve(`./src/templates/termin.js`),
                    context: {
                        id: node.id
                    }
                })
            })
            resolve()
        })
    }),
])
}

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