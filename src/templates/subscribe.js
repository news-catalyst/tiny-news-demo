import React from "react"
import { graphql } from 'gatsby'
import ArticleNav from "../components/ArticleNav"
import SignUp from "../components/SignUp"
import Layout from "../components/Layout"
import Footer from "../components/Footer"
import "../pages/styles.scss"

export default class Subscribe extends React.Component {
  render() {
    let data = this.props.data;
    return(
      <div>
        <ArticleNav metadata={data.site.siteMetadata} />
        <Layout title={data.site.siteMetadata.subscribe.title} description={data.site.siteMetadata.subscribe.subtitle}>
          <section className="hero is-primary is-bold">
            <div className="hero-body">
              <div className="container">
                <h1 className="title">
                  {data.site.siteMetadata.subscribe.title}
                </h1>
                <h2 className="subtitle">
                  {data.site.siteMetadata.subscribe.subtitle}
                </h2>
              </div>
            </div>
          </section>
          <section className="section">
            <SignUp/> 
          </section>
          
        </Layout>
        <Footer post_type="page" metadata={data.site.siteMetadata} />
      </div>
    );
  }
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
        subscribe {
          title
          subtitle
        }
      }
    }
}`
