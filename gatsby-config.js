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
    subscribe: {
      title: `Subscribe`,
      subtitle: `Get the latest news about the tiny news collective in your inbox.`,
    },
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
      topics: `All Topics`,
      cms: `tinycms`
    }
  },

  /* Your site config here */
  plugins: 
    [
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
                maxWidth: 1290,
                wrapperStyle: "margin-top: 10px; margin-bottom: 10px;"
              },
            },
          ],
        },
      },
      {
        resolve: "gatsby-source-google-docs",
        options: {
            folders: ["1lcfhd58_0D6-uP0Dwb0a_-Yri2L0h-6K"],
            debug: true,
        }
      },
      `gatsby-plugin-sharp`,
      `gatsby-plugin-sass`,
      {
        resolve: 'gatsby-plugin-next-seo',
        options: {
          canonical: 'https://tinynewsco.org/',
          titleTemplate: 'tiny news co | %s',
          openGraph: {
            type: 'website',
            locale: 'en_US',
            url: 'https://tinynewsco.org/',
            site_name: 'tiny news co',
          },
          twitter: {
            handle: '@tinynewsco',
            site: '@newscatalyst',
            cardType: 'summary_large_image',
          },
        },
      },
      {
        resolve: 'gatsby-plugin-mailchimp',
        options: {
            endpoint: 'https://tinynewsco.us18.list-manage.com/subscribe/post?u=a91c8e3b29e153f11e34be272&amp;id=417b45b221', // add your MC list endpoint here; see instructions below
        },
      },
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
      // You can have multiple instances of this plugin to create indexes with
      // different names or engines. For example, multi-lingual sites could create
      // an index for each language.
      {
        resolve: 'gatsby-plugin-local-search',
        options: {
          // A unique name for the search index. This should be descriptive of
          // what the index contains. This is required.
          name: 'articles',

          // Set the search engine to create the index. This is required.
          // The following engines are supported: flexsearch, lunr
          engine: 'flexsearch',

          // Provide options to the engine. This is optional and only recommended
          // for advanced users.
          //
          // Note: Only the flexsearch engine supports options.
          engineOptions: 'speed',

          // GraphQL query used to fetch all data for the search index. This is
          // required.
          query: `
            {
              allGoogleDocs(filter: {document: {breadcrumb: {nin: "Drafts"}}}) {
                nodes {
                  id
                  document {
                    author
                    name
                    path
                  }
                  childMarkdownRemark {
                    html
                  }
                }
              }
            }
          `,

          // Field used as the reference value for each document.
          // Default: 'id'.
          ref: 'id',

          // List of keys to index. The values of the keys are taken from the
          // normalizer function below.
          // Default: all fields
          index: ['name', 'body'],

          // List of keys to store and make available in your UI. The values of
          // the keys are taken from the normalizer function below.
          // Default: all fields
          store: ['id', 'path', 'name'],

          // Function used to map the result from the GraphQL query. This should
          // return an array of items to index in the form of flat objects
          // containing properties to index. The objects must contain the `ref`
          // field above (default: 'id'). This is required.
          normalizer: ({ data }) =>
            data.allGoogleDocs.nodes.map(node => ({
              id: node.id,
              path: node.document.path,
              name: node.document.name,
              body: node.childMarkdownRemark.html,
            })),
        },
      },
    ]
}
