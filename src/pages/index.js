import React from "react"
import { graphql } from "gatsby"
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import "./styles.scss"

export default function HomePage({ data }) {
  console.log(data)

  return(
    <div>
      <ArticleNav />
      <Layout>
        <h1 className="title is-1">Homepage for tiny news co</h1>
        <p>here are the latest articles:</p>

        <div>
          <ul>
          {data.allGoogleDocs.nodes.map(({ document }, index) => (
            <li key={index}><a href={document.path}>{document.name}</a></li>
          ))}
          </ul>
        </div>
      </Layout>
      <ArticleFooter />
    </div>
  )
}

export const query = graphql`
  query {
    allGoogleDocs(filter: {document: {breadcrumb: {nin: "Drafts"}}}) {
        nodes {
            document {
              name
              path
            }
        }
    }
  }`