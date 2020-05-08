import React from "react"
import _ from 'lodash'
import { Link, graphql } from "gatsby"
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import SearchPanel from "../components/SearchPanel"
import Layout from "../components/Layout"
import "./styles.scss"

export default function HomePage({ data }) {
  console.log(data)

  let tags = [];
  data.allGoogleDocs.nodes.forEach(({document}, index) => {
    tags = tags.concat(document.tags);
  })
  tags = _.uniq(tags).sort();
  const tagLinks = tags.map(tag => (
    <Link to={`/topics/${tag}`} className="panel-block is-active">
      {_.startCase(tag)}
    </Link>
  ));


  return(
    <div>
      <ArticleNav />
      <Layout>
        <section className="hero is-primary is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                the tiny news collective
              </h1>
              <h2 className="subtitle">
                a local news initiative
              </h2>
            </div>
          </div>
        </section>


        <section className="section">
          <div className="columns">
            <div className="column is-four-fifths">
              <aside className="menu">
                <p className="menu-label">
                  Latest News
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
                  Topics
                </p>
                {tagLinks}
              </nav>
              <SearchPanel />
            </div>
          </div>
        </section>

        <div>
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
              tags
            }
        }
    }
  }`