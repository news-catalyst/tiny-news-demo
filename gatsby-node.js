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

}