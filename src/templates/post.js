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
    <div>
                <nav className="navbar" role="navigation" aria-label="main navigation">
                  <div className="navbar-brand">
                    <a className="navbar-item" href="/">
                      tinynewsco
                    </a>

                    <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                    </a>
                  </div>

                  <div className="navbar-menu">
                    <div className="navbar-start">
                      <a className="navbar-item" href="/">
                        Articles
                      </a>

                      <a className="navbar-item" href="/topics">
                        Topics
                      </a>
                    </div>

                    <div className="navbar-end">
                      <div className="navbar-item">
                        <div className="buttons">
                            <a className="button logout" href="/tinycms">
                              tinycms
                            </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>

      <Layout>
        <h1 className="title is-1">{doc.name}</h1>
        <h3 className="subtitle">By {doc.author}</h3>
        <h4 className="subtitle is-4">Published {formatRelative(parsedDate, new Date())}</h4>

        <div
          dangerouslySetInnerHTML={{__html: articleHtml}}
        />

        <section className="section">
          <div className="container">
            <div className="tags">
              {doc.tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </section>

      </Layout>
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>tinynewsco.org</strong> by <a href="https://newscatalyst.org">News Catalyst</a>. 
          </p>
        </div>
      </footer>
    </div>
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
