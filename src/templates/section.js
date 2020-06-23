import React from "react"
import { graphql } from "gatsby"
import ArticleNav from "../components/ArticleNav"
import ArticleLink from "../components/ArticleLink"
import Layout from "../components/Layout"
import Footer from "../components/Footer"
import "../pages/styles.scss"

class Section extends React.Component {
  render() {
    let data = this.props.data;
    let sections = this.props.pageContext.sections;
    let sectionHeader = this.props.pageContext.section.label + " Articles";
    
    return (
      <div>
        <ArticleNav metadata={data.site.siteMetadata} sections={sections} />
        <Layout>
          <section className="section">
            <h3 className="title is-size-4 is-bold-light">{sectionHeader}</h3>
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

export default Section;

export const sectionPageQuery = graphql`
  query SectionPage($category: String) {
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
    allGoogleDocs(filter: {document: {category: {eq: $category}}}) {
      nodes {
        document {
          id
          author
          category
          createdTime
          name
          path
        }
        childMarkdownRemark {
          excerpt(truncate: true, format: PLAIN, pruneLength: 100)
        }
      }
    }
  }
`