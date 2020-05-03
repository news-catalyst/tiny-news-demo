import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"

export default function Post({ data }) {
  console.log(data);
  return (
    <Layout>
        <h1>{data.googleDocs.document.name}</h1>
        <p>{data.googleDocs.document.createdTime}</p>
        <div
            dangerouslySetInnerHTML={{__html: data.googleDocs.childMarkdownRemark.html}}
        />

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
