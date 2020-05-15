/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    shortName: `tinynewsco`,
    title: `the tiny news collective`,
    siteUrl: `https://tinynewsco.org/`,
    description: `a local news initiative`,
    footerTitle: `tinynewsco.org`,
    footerBylineName: `News Catalyst`,
    footerBylineLink: `https://newscatalyst.org`,
    labels: {
      latestNews: `Latest News`,
      search: `Search`,
      topics: `Topics`,
    },
    nav: {
      articles: `Articles`,
      topics: `Topics`,
      cms: `tinycms`
    }
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
        resolve: `gatsby-plugin-google-analytics`,
        options: {
          // The property ID; the tracking code won't be generated without it
          trackingId: "UA-166777432-1",
          // Defines where to place the tracking script - `true` in the head and `false` in the body
          head: true,
          // Setting this parameter is optional
          anonymize: true,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          exclude: ["/preview/**", "/do-not-track/me/too/"],
          // Delays sending pageview hits on route update (in milliseconds)
          pageTransitionDelay: 0,
          // Enables Google Optimize using your container Id
          // optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
          // Enables Google Optimize Experiment ID
          // experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
          // Set Variation ID. 0 for original 1,2,3....
          // variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
          // Defers execution of google analytics script after page load
          defer: false,
          // Any additional optional fields
          // sampleRate: 5,
          // siteSpeedSampleRate: 10,
          // cookieDomain: "example.com",
        },
      },

    ]
}
