import React from "react"
import _ from 'lodash'
import { Link, graphql } from "gatsby"
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import "./styles.scss"

export default function HomePage({ data }) {
  console.log(data)

  let tags = [];
  data.allGoogleDocs.edges.forEach(({node}, index) => {
    tags = tags.concat(node.document.tags);
  })
  console.log(tags);
  tags = _.uniq(tags).sort();
  console.log(tags);
  const tagLinks = tags.map( (tag, index) => (
    <li key={index}><Link to={`/topics/${tag}`}>{_.startCase(tag)}</Link></li>
  ));


  return(
    <div>
      <ArticleNav />
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
      <ArticleFooter />
    </div>
  )
}

export const query = graphql`
  query {
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