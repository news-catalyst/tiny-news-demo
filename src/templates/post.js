import React from "react"
import { Link, graphql } from "gatsby"
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import { parseISO, formatRelative } from 'date-fns'
import "../pages/styles.scss"


export default function Post({ data }) {
  let doc = data.googleDocs.document;
  let articleHtml = data.googleDocs.childMarkdownRemark.html;
  //2020-05-03T22:22:14.981Z
  let parsedDate = parseISO(doc.createdTime)

  console.log(data.site.siteMetadata);
  return (
    <div>
      <ArticleNav metadata={data.site.siteMetadata} />

      <Layout>
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
              {doc.tags.map((tag, index) => (
                <Link to={`/topics/${tag}`} key={`${tag}-${index}`} className="is-link tag">{tag}</Link>
              ))}
            </div>
          </div>
        </section>

      </Layout>
      <ArticleFooter metadata={data.site.siteMetadata} />
    </div>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
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
