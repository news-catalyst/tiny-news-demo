const _ = require('lodash')
const path = require(`path`)

exports.createPages = async ({ actions, graphql, reporter }) => {
  graphql(
    `
        {
            allGoogleDocs(filter: {document: {breadcrumb: {nin: "Drafts"}}}) {
                nodes {
                    document {
                        id
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
        console.log("creating AMP page for google doc at ", `${document.path}/amp`)
        actions.createPage({
          path: `${document.path}/amp`,
          component: path.resolve('./src/templates/post.amp.js'),
          context: {
            slug: document.path,
          }
        })
      })

      tags = _.uniq(tags)
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
