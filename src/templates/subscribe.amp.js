import React from "react"
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import ArticleNav from "../components/ArticleNav"
import SignUp from "../components/SignUp"
import Layout from "../components/Layout"
import Footer from "../components/Footer"
import "../pages/styles.scss"

let canonicalUrl;
export default class SubscribeAMP extends React.Component {
  componentDidMount() {
    canonicalUrl = window.location.href.replace("/amp/", "");
  }
  render() {
    let data = this.props.data;
    return(
      <div>
        <Helmet
          htmlAttributes={{ amp: true, lang: 'en' }}
        >
          <meta charset="utf-8" />
          <script async src="https://cdn.ampproject.org/v0.js"></script>
          <link rel="canonical" href={canonicalUrl} /> // ⚡ Add canonical
        </Helmet>
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
