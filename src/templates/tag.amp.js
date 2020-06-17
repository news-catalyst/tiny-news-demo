import React from "react"
import { Helmet } from 'react-helmet'
import { graphql } from "gatsby"
import ArticleNav from "../components/ArticleNav"
import ArticleLink from "../components/ArticleLink"
import Layout from "../components/Layout"
import Footer from "../components/Footer"
import "../pages/styles.scss"

let canonicalUrl;
class TagAMP extends React.Component {
  componentDidMount() {
    canonicalUrl = window.location.href.replace("/amp/", "");
  }
  render() {
    let data = this.props.data;
    let tagHeader = "Articles tagged: " + this.props.pageContext.tag;
    
    return (
      <div>
        <Helmet
          htmlAttributes={{ amp: true, lang: 'en' }}
        >
          <meta charset="utf-8" />
          <script async src="https://cdn.ampproject.org/v0.js"></script>
          <link rel="canonical" href={canonicalUrl} /> // ⚡ Add canonical
        </Helmet>
        <ArticleNav metadata={data.site.siteMetadata} />
        <Layout>
          <section className="section">
            <h3 className="title is-size-4 is-bold-light">{tagHeader}</h3>
            {data.allGoogleDocs.nodes.map(({ document, childMarkdownRemark }, index) => (
              <ArticleLink key={document.path} document={document} excerpt={childMarkdownRemark.excerpt} /> 
            ))}
          </section>
        </Layout>
        <Footer post_type="tag" metadata={data.site.siteMetadata} />
      </div>
    )
  }
}

export default TagAMP;

export const tagPageQuery = graphql`
  query TagAMPPage($tag: String) {
    site {
      siteMetadata {
        title
        shortName
        description
        siteUrl
        footerTitle
        footerBylineName
        footerBylineLink
        nav {
          articles
          topics
          cms
        }
      }
    }
    allGoogleDocs(filter: {document: {tags: {in: [$tag]}}}) {
      nodes {
        document {
          id
          name
          path
          createdTime
          author
        }
        childMarkdownRemark {
          excerpt(truncate: true, format: PLAIN, pruneLength: 100)
        }
      }
    }
  }
`