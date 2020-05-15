/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    shortName: `tinynewsco`,
    title: `the tiny news collective`,
    siteUrl: `http://www.tinynewsco.org`,
    description: `a local news initiative`,
  },

  /* Your site config here */
  plugins: 
    [
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `markdown-pages`,
          path: `${__dirname}/src/markdown-pages`,
        },
      },
      {
        resolve: `gatsby-transformer-remark`,
        options: {
          plugins: [
            {
              resolve: `gatsby-remark-images`,
              options: {
                // It's important to specify the maxWidth (in pixels) of
                // the content container as this plugin uses this as the
                // base for generating different widths of each image.
                maxWidth: 650,
                wrapperStyle: "margin-top: 10px; margin-bottom: 10px;"
              },
            },
          ],
        },
      },
      {
        resolve: "gatsby-source-google-docs",
        options: {
            //---
            // All the following options are OPTIONAL
            //---
            //
            // To fetch only documents to specific folders
            // folders Ids can be found in Google Drive URLs
            // https://drive.google.com/drive/folders/FOLDER_ID
            folders: ["1lcfhd58_0D6-uP0Dwb0a_-Yri2L0h-6K"],
            // You could need to fetch additional documents fields to your nodes
            // All available options: https://developers.google.com/drive/api/v3/reference/files#resource
            // fields: ["ownedByMe", "shared"],
            // To rename fields
            // Be carrefull, some documentation instructions could be different
            // fieldsMapper: {createdTime: "date", name: "title"},
            // To add default fields values
            // fieldsDefault: {draft: false},
            // For a better stack trace and more information
            // Usefull when you open a issue to report a bug
            debug: true,
        }
      },
      `gatsby-plugin-sharp`,
      `gatsby-plugin-sass`,

      {
        resolve: `gatsby-plugin-amp`,
        options: {
          analytics: {
            type: 'gtag',
            dataCredentials: 'include',
            config: {
              vars: {
                gtag_id: "UA-166777432-1",
                config: {
                  "UA-166777432-1": {
                    page_location: '{{pathname}}'
                  },
                },
              },
            },
          },
          canonicalBaseUrl: 'http://tinynewsco.org/',
          components: ['amp-form'],
          excludedPaths: ['/404*', '/'],
          pathIdentifier: '/amp/',
          relAmpHtmlPattern: '{{canonicalBaseUrl}}{{pathname}}{{pathIdentifier}}',
          useAmpClientIdApi: true,
        },
      },

    ]
}
