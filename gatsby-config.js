require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
  })
module.exports = {
    siteMetadata: {
        title: `Freiwillige Feuerwehr Altfraunhofen`,
        siteUrl: 'https://wonderful-morse-21b81f.netlify.com'
    },
    plugins: [
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: "Website der Freiwilligen Feuerwehr Altfraunhofen",
                short_name: "FFW Altfrauhofen",
                start_ur: "/",
                background_color: "#A81C1C",
                theme_color: "#A81C1C",
                display: "minimal-ui",
                icon: "src/images/logo-ffw.svg"
            }
        },
        'gatsby-plugin-offline',
        'gatsby-plugin-react-helmet',
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `data`,
                path: `${__dirname}/src/data/`
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `ìmages`,
                path: `${__dirname}/src/images/`,
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name:`pages`,
                path: `${__dirname}/src/pages/`
            }
        },
        `gatsby-plugin-emotion`,
        {

            resolve: `gatsby-plugin-typography`,
            options: {
                pathToConfigModule: `src/utils/typography`,
            },
        },
        {
            resolve: `gatsby-source-contentful`,
            options: {
                spaceId: process.env.SPACE_ID,
                accessToken: process.env.ACCESS_TOKEN,

            }
        },
        `gatsby-transformer-json`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 1000,
                        }
                    },
                    {
                        resolve: `gatsby-remark-images-contentful`,
                        options: {
                            maxWidth: 1000,
                        }
                    }
                ]
            }
        },
        {
            resolve: `gatsby-plugin-robots-txt`,
            options: {
                policy: [{userAgent: '*', disallow: ['/']}]
            }
        }
    ]
}