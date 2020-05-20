import React from "react"
import _ from 'lodash'
import { Link, graphql } from "gatsby"
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import SearchPanel from "../components/SearchPanel"
import Layout from "../components/Layout"
import "./styles.scss"

export default function HomePage({ data }) {
  let tags = [];
  data.allGoogleDocs.nodes.forEach(({document}, index) => {
    tags = tags.concat(document.tags);
  })
  tags = _.uniq(tags).sort();
  const tagLinks = tags.map(tag => (
    <Link key={tag} to={`/topics/${tag}`} className="panel-block is-active">
      {_.startCase(tag)}
    </Link>
  ));


  return(
    <div>
      <ArticleNav metadata={data.site.siteMetadata} />
      <Layout title={data.site.siteMetadata.title} description={data.site.siteMetadata.description}>
        <section className="hero is-primary is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                {data.site.siteMetadata.title}
              </h1>
              <h2 className="subtitle">
                {data.site.siteMetadata.description}
              </h2>
            </div>
          </div>
        </section>


        <section className="section">
          <div className="columns">
            <div className="column is-four-fifths">
              <aside className="menu">
                <p className="menu-label">
                  {data.site.siteMetadata.labels.latest_news}
                </p>
                <ul className="menu-list">
                  {data.allGoogleDocs.nodes.map(({ document }, index) => (
                    <li key={index}><a href={document.path}>{document.name}</a></li>
                  ))}
                </ul>
              </aside>
            </div>
            <div className="column">
              <nav className="panel">
                <p className="panel-heading">
                  {data.site.siteMetadata.labels.topics}
                </p>
                {tagLinks}
              </nav>
              <SearchPanel metadata={data.site.siteMetadata} />
            </div>
          </div>
        </section>

        <div>
        </div>
      </Layout>
      <ArticleFooter metadata={data.site.siteMetadata} />
    </div>
  )
}

export const query = graphql`
  query {
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

    allGoogleDocs(filter: {document: {breadcrumb: {nin: "Drafts"}}}, sort: {fields: document___name}) {
        nodes {
            document {
              name
              path
              tags
            }
        }
    }
  }`