import React from "react"
import { Link, graphql } from "gatsby"
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import { parseISO, formatRelative } from 'date-fns'
import "../pages/styles.scss"


export default function PostAMP({ data }) {
  let doc = data.googleDocs.document;
  let articleHtml = data.googleDocs.childMarkdownRemark.html;
  let parsedDate = parseISO(doc.createdTime)
  let tagLinks;
  if (doc.tags) {
    tagLinks = doc.tags.map((tag, index) => (
      <Link to={`/topics/${tag}`} key={`${tag}-${index}`} className="is-link tag">{tag}</Link>
    ))
  } 


  return (
    <div>
      <ArticleNav metadata={data.site.siteMetadata} />

      <Layout title={doc.name} description={data.googleDocs.childMarkdownRemark.excerpt}>
        <section className="hero is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                {doc.name}
              </h1>
              <h2 className="subtitle">
                By {doc.author} | Published {formatRelative(parsedDate, new Date())}
              </h2>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="content">

              <div
                dangerouslySetInnerHTML={{__html: articleHtml}}
              />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="tags">
              {tagLinks}
            </div>
          </div>
        </section>

      </Layout>
      <ArticleFooter metadata={data.site.siteMetadata} />
    </div>
  )
}

export const pageQuery = graphql`
  query AmpArticleBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        shortName
        description
        siteUrl
        footerTitle
        footerBylineName
        footerBylineLink
        labels {
          latestNews
          search
          topics
        }
        nav {
          articles
          topics
          cms
        }
      }
    }
    googleDocs(document: {path: {eq: $slug}}) {
        document {
          author
          createdTime
          name
          tags
        }
        childMarkdownRemark {
          excerpt
          html
        }
    }
  }
`
