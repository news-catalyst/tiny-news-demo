import React from "react"
import _ from 'lodash'
import { Link, graphql } from "gatsby"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import Footer from "../components/Footer"
import "../pages/styles.scss"

export default function TopicsIndex({ data }) {
  let tags = [];
  data.allGoogleDocs.nodes.forEach(({document}, index) => {
    tags = tags.concat(document.tags);
  })
  // remove any null tags
  tags = tags.filter(function (el) {
    return el != null;
  });
  tags = _.uniq(tags).sort();
  const tagLinks = tags.map( (tag, index) => (
    <li key={index}><Link to={`/topics/${_.kebabCase(tag)}`}>{_.startCase(tag)}</Link></li>
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
      <Footer post_type="tag" metadata={data.site.siteMetadata} />
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
    allGoogleDocs(filter: {document: {breadcrumb: {nin: "Drafts"}}}) {
      nodes {
        document {
          name
          tags
        }
      }
    }
  }`