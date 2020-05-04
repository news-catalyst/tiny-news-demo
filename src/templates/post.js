import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import { parseISO, formatRelative } from 'date-fns'
import "../styles.scss"


export default function Post({ data }) {
  console.log(data);
  //2020-05-03T22:22:14.981Z
  var parsedDate = parseISO(data.googleDocs.document.createdTime)

  return (
    <Layout>
      <h1 className="title is-1">{data.googleDocs.document.name}</h1>
      <p>
        Published {formatRelative(parsedDate, new Date())}
      </p>

      <section className="section">
        <div
          dangerouslySetInnerHTML={{__html: data.googleDocs.childMarkdownRemark.html}}
        />
    </section>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    googleDocs(document: {path: {eq: $path}}) {
        document {
            name
            createdTime
        }
        childMarkdownRemark {
            html
        }
    }
  }
`
