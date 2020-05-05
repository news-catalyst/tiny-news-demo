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
        let usablePath = document.path.replace(/\/ready/, ``)
        console.log("creating page for google doc at ", usablePath)
        actions.createPage({
            path: usablePath,
            component: path.resolve(`./src/templates/post.js`),
        })
        let cmsEditPath = `/cms/edit/${document.id}`
        console.log("creating cms edit page for google doc at ", cmsEditPath)
        actions.createPage({
            path: cmsEditPath,
            component: path.resolve(`./src/templates/edit.js`),
            context: {
                id: document.id
            }
        })
      })
  })

}