const _ = require('lodash')
const path = require(`path`)

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Document implements Node {
      name: String!
      author: String
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

exports.createPages = async ({ actions, graphql, reporter }) => {
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
        console.log("creating page for google doc at ", document.path)
        actions.createPage({
            path: document.path,
            component: path.resolve(`./src/templates/post.js`),
        })
      })

      tags = tags.filter(function (el) {
        return el != null;
      });
      tags = _.uniq(tags)
      console.log(tags);
      console.log("Making", tags.length, "tag pages...")
      tags.forEach(tag => {
        const tagPath = `/topics/${_.kebabCase(tag)}/`
  
        actions.createPage({
          path: tagPath,
          component: path.resolve(`./src/templates/tag.js`),
          context: {
            tag,
          },
        })
        console.log(" - created ", tagPath)
      })
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
