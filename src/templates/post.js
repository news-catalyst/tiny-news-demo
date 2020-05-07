import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import { parseISO, formatRelative } from 'date-fns'
import "../pages/styles.scss"


export default function Post({ data }) {
  console.log(data);
  let doc = data.googleDocs.document;
  let articleHtml = data.googleDocs.childMarkdownRemark.html;
  //2020-05-03T22:22:14.981Z
  let parsedDate = parseISO(doc.createdTime)

  return (
    <Layout>
      <h1 className="title is-1">{doc.name}</h1>
      <h3 className="subtitle">By {doc.author}</h3>
      <h4 className="subtitle is-4">Published {formatRelative(parsedDate, new Date())}</h4>

      <div
        dangerouslySetInnerHTML={{__html: articleHtml}}
      />

      <footer className="footer">
        <div className="content has-text-centered">
          {doc.tags.map((tag, index) => (
            <span key={`${tag}-${index}`} className="tag">{tag}</span>
          ))}
        </div>
      </footer>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    googleDocs(document: {path: {eq: $path}}) {
        document {
          author
          createdTime
          name
          tags
        }
        childMarkdownRemark {
            html
        }
    }
  }
`
