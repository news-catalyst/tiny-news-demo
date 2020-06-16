import React from "react"
import { graphql, Link } from 'gatsby'
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import Footer from "../components/Footer"

const TinyEdit = ({data}) => {
  return (
    <div>
      <ArticleNav metadata={data.site.siteMetadata} />
      <Layout>
        <section className="section">
          <h1 className="title is-1">Page Not Found</h1>
          <p>
            Sorry, we couldn't find the page you were looking for. Perhaps you'd like to <Link to="/">go back to the homepage</Link>.
          </p>
        </section>
      </Layout>
      <Footer post_type="404" metadata={data.site.siteMetadata} />
    </div>
  )
}

export default TinyEdit

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
  }`