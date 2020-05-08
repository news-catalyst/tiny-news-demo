import React from "react"
import { Link, graphql } from "gatsby"
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import "../pages/styles.scss"

class Tag extends React.Component {
  render() {
    let data = this.props.data;
    console.log(data);
    let tagHeader = "Articles tagged: " + this.props.pageContext.tag;
    let articles = data.allGoogleDocs.edges;
    const articleLinks = articles.map(article => (
      <li key={article.node.document.path}>
        <Link to={article.node.document.path}>
          {article.node.document.name}
        </Link>
      </li>
    ))

    return (
      <div>
        <ArticleNav />

        <Layout>
          <section className="section">
            <h3 className="title is-size-4 is-bold-light">{tagHeader}</h3>
            <ul className="taglist">{articleLinks}</ul>
          </section>
        </Layout>

        <ArticleFooter />
        </div>
    )
  }
}

export default Tag;

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
    allGoogleDocs(filter: {document: {tags: {in: [$tag]}}}) {
      edges {
        node {
          document {
            id
            name
            path
            createdTime
            author
          }
        }
      }
    }
  }
`