import React from "react"
import { Link, graphql } from 'gatsby'
import Layout from "../../components/Layout"
import "../styles.scss"

export default function Publish({ data }) {
  return(
    <div>

      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/tinycms">
            tinycms
          </a>

          <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" href="/tinycms">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className="navbar-menu">
          <div className="navbar-start">
            <a className="navbar-item" href="/tinycms">
              Articles
            </a>
            <a className="navbar-item" href="/tinycms/images">
              Images
            </a>
          </div>
        </div>
      </nav>
    <Layout>
      <h1 className="title is-1">tinycms articles list</h1>
      <p className="content">
        To feature an article, click to edit and check the box next to <code>featured</code>. To un-feature an article, simply uncheck the box.
      </p>
      <div>
        <ul>
          {data.allGoogleDocs.nodes.map(({ document, childMarkdownRemark }, index) => (
            <li className="article-list-margin" key={index}>
                {document.featured &&
                  <span className="tag">Featured</span>
                }
              <Link to={`/tinycms/edit?id=${document.id}`}>{document.name}</Link>
              <ul>
                <li>{childMarkdownRemark.excerpt}</li>
                <li>Author: {document.author}</li>
                {document.createdTime &&
                  <li>Status: Published</li>
                }
                {!document.createdTime &&
                  <li>Status: Pending Publish</li>
                }
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
    </div>
  )
}

export const query = graphql`
  query {
    allGoogleDocs(sort: {fields: document___name}) {
      nodes {
        document {
          author
          createdTime
          featured
          id
          name
          path
        }
        childMarkdownRemark {
          excerpt(truncate: true, format: PLAIN, pruneLength: 100)
        }
      }
    }
  }`