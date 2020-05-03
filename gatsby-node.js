const path = require(`path`)

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  graphql(
    `
        {
            allGoogleDocs {
                nodes {
                    document {
                        path
                    }
                }
            }
        }
    `
  ).then(result => {
      result.data.allGoogleDocs.nodes.forEach(({document}, index) => {
        console.log("creating page for google doc at ", document.path)
          actions.createPage({
              path: document.path,
              component: path.resolve(`./src/templates/post.js`),
          })
      })
  })

  // const blogPostTemplate = path.resolve(`src/templates/blogTemplate.js`)

  // const result = await graphql(`
  //   {
  //     allMarkdownRemark(
  //       sort: { order: DESC, fields: [frontmatter___date] }
  //       limit: 1000
  //     ) {
  //       edges {
  //         node {
  //           frontmatter {
  //             path
  //           }
  //         }
  //       }
  //     }
  //   }
  // `)

  // // Handle errors
  // if (result.errors) {
  //   reporter.panicOnBuild(`Error while running GraphQL query.`)
  //   return
  // }

  // result.data.allMarkdownRemark.edges.forEach(({ node }) => {
  //   createPage({
  //     path: node.frontmatter.path,
  //     component: blogPostTemplate,
  //     context: {}, // additional data can be passed via context
  //   })
  // })
}