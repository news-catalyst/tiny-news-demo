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
    ]
}
