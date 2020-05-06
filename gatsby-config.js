/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: 
    [
      `gatsby-plugin-netlify-cms`,
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
                maxWidth: 590,
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
        resolve: `gatsby-plugin-google-gapi`,
        options: {
          apiKey: process.env.GATSBY_TINY_CMS_API_KEY,
          clientId: process.env.GATSBY_TINY_CMS_CLIENT_ID,
          discoveryURLs: [
            // These are the discovery docs for various Google APIs.
            // This can be empty.
            // Find more here: https://developers.google.com/discovery
            // This one is for the Google Drive v3 api.
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          ],
          // The permission scopes your app needs.
          // For auth only, this can be empty.
          // Find more here: https://developers.google.com/identity/protocols/oauth2/scopes
          // scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.metadata",],
        },
      },

    ]
}
