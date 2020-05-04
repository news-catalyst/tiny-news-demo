import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"

export default function HomePage({ data }) {
  console.log(data)

  return(
    <Layout>
      <h1 className="title is-1">tiny news co</h1>
      <p>here are the latest pages:</p>

      <div>
        <ul>
        {data.allGoogleDocs.nodes.map(({ document }, index) => (
          <li key={index}><a href={document.path}>{document.name}</a></li>
        ))}
        </ul>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allGoogleDocs {
        nodes {
            document {
              name
              path
            }
        }
    }
  }`