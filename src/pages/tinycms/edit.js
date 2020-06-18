
import React from "react"
import Layout from "../../components/Layout"
import GoogleEdit from "../../components/GoogleEdit"

const TinyEdit = ({data}) => {
  let settingsJson = data.allGoogleDocs.nodes[0].childMarkdownRemark.rawMarkdownBody;
  let settings = JSON.parse(settingsJson);

  return (
    <Layout>
      <GoogleEdit settingsData={settings} />
    </Layout>
  )
}

export default TinyEdit

export const settingsQuery = graphql`
  query {
      allGoogleDocs(filter: {document: {name: {eq: "settings"}}}) {
        nodes {
          childMarkdownRemark {
            rawMarkdownBody
          }
        }
      }
    }`