import React, { useEffect, useState } from "react"
import _ from 'lodash'
import { Link, graphql } from "gatsby"
import {getCLS, getFID, getLCP} from 'web-vitals';
import Layout from "../components/Layout"
import Footer from "../components/Footer"
import ArticleLink from "../components/ArticleLink"
import FeaturedArticleLink from "../components/FeaturedArticleLink"
import ArticleNav from "../components/ArticleNav"
import HomepageSearchPanel from "../components/HomepageSearchPanel"
import sendToGoogleAnalytics from "../utils/vitals"
import "../pages/styles.scss"

export default function HomePageAMP({ data, pageContext }) {
  const [query, setQuery] = useState('')
  useEffect(() => {
    getCLS(sendToGoogleAnalytics);
    getFID(sendToGoogleAnalytics);
    getLCP(sendToGoogleAnalytics);
  }, []);

  let sections = pageContext.sections;
  let allArticles = data.allGoogleDocs.nodes;
  let featuredArticles = allArticles.filter(node => node.document.featured);
  let unfeaturedArticles = allArticles.filter(node => !node.document.featured);

  let tags = [];
  allArticles.forEach(({document}, index) => {
    tags = tags.concat(document.tags);
  })
  tags = _.uniq(tags).sort();
  // remove any null tags
  tags = tags.filter(function (el) {
    return el != null;
  });

  const tagLinks = tags.map(tag => (
    <Link key={tag} to={`/topics/${tag}`} className="panel-block is-active">
      {_.startCase(tag)}
    </Link>
  ));


  return(
    <div>
      <ArticleNav metadata={data.site.siteMetadata} tags={tags} sections={sections} />
      <Layout title={data.site.siteMetadata.title} description={data.site.siteMetadata.description}>
        <section className="hero is-dark is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                {data.site.siteMetadata.title}
              </h1>
              <h2 className="subtitle">
                {data.site.siteMetadata.description}
              </h2>
            </div>
          </div>
        </section>
        <div className="featured-article">
          {featuredArticles.map(({ document, childMarkdownRemark }, index) => (
            <FeaturedArticleLink key={document.path} document={document} excerpt={childMarkdownRemark.excerpt} /> 
          ))}
        </div>
        <section className="section">
          <div className="columns">
            <div className="column is-four-fifths">
              {unfeaturedArticles.map(({ document, childMarkdownRemark }, index) => (
                <ArticleLink key={document.path} document={document} excerpt={childMarkdownRemark.excerpt} /> 
              ))}
            </div>
            <div className="column">
              <HomepageSearchPanel metadata={data.site.siteMetadata} query={query} setQuery={setQuery} />
              <nav className="panel">
                <p className="panel-heading">
                  {data.site.siteMetadata.labels.topics}
                </p>
                {tagLinks}
              </nav>
            </div>
          </div>
        </section>
        
      </Layout>
      <Footer post_type="home" metadata={data.site.siteMetadata} />
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

    allGoogleDocs(filter: {document: {breadcrumb: {nin: "Drafts"}}}, sort: {fields: document___author, order: DESC}) {
        nodes {
            document {
              author
              createdTime
              featured
              name
              path
              tags
              cover {
                image
              }
            }
            childMarkdownRemark {
              excerpt(truncate: true, format: PLAIN, pruneLength: 100)
            }
        }
    }
  }`