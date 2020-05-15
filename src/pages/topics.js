import React from "react"
import _ from 'lodash'
import { Link, graphql } from "gatsby"
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import "./styles.scss"

export default function HomePage({ data }) {
  let tags = [];
  data.allGoogleDocs.edges.forEach(({node}, index) => {
    tags = tags.concat(node.document.tags);
  })
  tags = _.uniq(tags).sort();
  const tagLinks = tags.map( (tag, index) => (
    <li key={index}><Link to={`/topics/${tag}`}>{_.startCase(tag)}</Link></li>
  ));


  return(
    <div>
      <ArticleNav metadata={data.site.siteMetadata} />
      <Layout>
        <section className="section">
          <h3 className="title is-size-4 is-bold-light">Topics</h3>
          <aside className="menu">
            <ul className="menu-list">
              {tagLinks}
            </ul>
          </aside>
        </section>
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
    allGoogleDocs {
      edges {
        node {
          document {
            tags
          }
        }
      }
    }
  }`