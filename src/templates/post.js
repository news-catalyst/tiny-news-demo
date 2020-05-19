import React from 'react';
import { graphql, Link } from "gatsby"

import { parseISO, formatRelative } from 'date-fns'
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { Parser, ProcessNodeDefinitions } from "html-to-react";

import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import "../pages/styles.scss"

let tweetRegex = /\[tweet id=(.*?)\]/i;
const htmlParser = new Parser(React);
const processNodeDefinitions = new ProcessNodeDefinitions(React);
function isValidNode(){
    return true;
}
const processingInstructions = [
  // Create instruction for custom elements
  {
      shouldProcessNode: (node) => {
          // Process the node if it matches a custom element
          let foundMatch = (node.data && tweetRegex.test(node.data));
          if (foundMatch) {
            console.log(node.data);
          }
          return foundMatch;
      },
      processNode: (node) => {
        let result = tweetRegex.exec(node.data);
        let tweetId = result[1];
        return <TwitterTweetEmbed tweetId={tweetId} />;
      }
  },
  // Default processing
  {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode
  }
];

export default class Posttest extends React.Component {
  render () {
    let data = this.props.data;
    let doc = data.googleDocs.document;
    let parsedDate = parseISO(doc.createdTime)
    let articleHtml = data.googleDocs.childMarkdownRemark.html;
    let updatedHtml = htmlParser.parseWithInstructions(articleHtml, isValidNode, processingInstructions);
    return (
      <div>
        <ArticleNav metadata={data.site.siteMetadata} />
        <Layout>
          <section className="hero is-bold">
            <div className="hero-body">
              <div className="container">
                <h1 className="title">
                  {doc.name}
                </h1>
                <h2 className="subtitle">
                  By {doc.author} | Published {formatRelative(parsedDate, new Date())} 
                </h2>
              </div>
            </div>
          </section>
          {updatedHtml}
        <section className="section">
          <div className="container">
            <div className="tags">
              {doc.tags.map((tag, index) => (
                <Link to={`/topics/${tag}`} key={`${tag}-${index}`} className="is-link tag">{tag}</Link>
              ))}
            </div>
          </div>
        </section>

      </Layout>
      <ArticleFooter metadata={data.site.siteMetadata} />
    </div>
    )
  }
}

export const pageQuery = graphql`
  query($path: String!) {
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
    googleDocs(document: {path: {eq: $path}}) {
        document {
          author
          createdTime
          name
          tags
        }
        childMarkdownRemark {
            html
        }
    }
  }
`