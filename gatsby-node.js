const _ = require('lodash')
const path = require(`path`)

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Document implements Node {
      name: String!
      author: String
      featured: Boolean
      createdTime: Date
      tags: [String]
      og_locale: String
      og_title: String
      og_description: String
      og_image_url: String
      og_image_alt: String
      og_site_name: String
      og_url: String
      tw_handle: String
      tw_site: String
      tw_cardType: String
    }
  `
  createTypes(typeDefs)
}

let sections = [];
exports.createPages = async ({ actions, graphql, reporter }) => {
  graphql(
    `{
      allGoogleDocs(filter: {document: {name: {eq: "settings"}}}) {
        nodes {
          childMarkdownRemark {
            rawMarkdownBody
          }
        }
      }
    }`
  ).then(result => {
    let settingsJson = result.data.allGoogleDocs.nodes[0].childMarkdownRemark.rawMarkdownBody;
    let settings = JSON.parse(settingsJson);
    sections = settings.sections;
  });

  graphql(
    `
        {
            allGoogleDocs(filter: {document: {breadcrumb: {nin: "Drafts"}}}) {
                nodes {
                    document {
                        path
                        tags
                    }
                }
            }
        }
    `
  ).then(result => {
      let tags = []
      result.data.allGoogleDocs.nodes.forEach(({document}, index) => {
        tags = tags.concat(document.tags);
        console.log("creating page for article at ", document.path)
        actions.createPage({
            path: document.path,
            component: path.resolve(`./src/templates/article.js`),
            context: {
              slug: document.path,
              sections: sections,
            }
        })

        console.log("creating AMP page for article at ", `${document.path}/amp/`)
        actions.createPage({
          path: `${document.path}/amp/`,
          component: path.resolve('./src/templates/article.amp.js'),
          context: {
            slug: document.path,
<<<<<<< HEAD
            amp: true,
=======
            sections: sections,
>>>>>>> develop
          }
        })
      })


      // remove any null tags
      tags = tags.filter(function (el) {
        return el != null;
      });

      tags = _.uniq(tags)

      console.log("Making", tags.length, "tag pages...")
      tags.forEach(tag => {
        const tagPath = `/topics/${_.kebabCase(tag)}/`
  
        actions.createPage({
          path: tagPath,
          component: path.resolve(`./src/templates/tag.js`),
          context: {
            tag,
            sections,
          },
        })
        console.log("creating tag page at ", tagPath)

        actions.createPage({
          path: tagPath,
          path: `${tagPath}amp/`,
          component: path.resolve(`./src/templates/tag.amp.js`),
          context: {
            tag,
          },
        })
        console.log("creating tag page for AMP at ", `${tagPath}amp/`)
      })

      // create topics index page
      actions.createPage({
        path: "/topics/",
        component: path.resolve(`./src/templates/topics.js`),
      })
      console.log("creating topics index page at /topics/")

      // create topics index page - AMP
      actions.createPage({
        path: "/topics/amp/",
        component: path.resolve(`./src/templates/topics.amp.js`),
      })
      console.log("creating topics index page for AMP at /topics/amp/")

      // create subscribe page
      actions.createPage({
        path: "/subscribe/",
        component: path.resolve(`./src/templates/subscribe.js`),
      })
      console.log("creating newsletter subscribe page at /subscribe/")

      // create subscribe page - AMP
      actions.createPage({
        path: "/subscribe/amp/",
        component: path.resolve(`./src/templates/subscribe.amp.js`),
      })
      console.log("creating newsletter subscribe page for AMP at /subscribe/amp/")
  })

}
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === "build-html") {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /gapi-script/,
              use: loaders.null(),
            },
          ],
        },
      })
    }
  }
