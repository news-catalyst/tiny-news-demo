import React from 'react';
import { graphql, Link } from "gatsby"

import { parseISO, formatRelative } from 'date-fns'
// import { TwitterTweetEmbed } from 'react-twitter-embed';
import Embed from 'react-embed';
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import "../pages/styles.scss"

let tweetRegex = /\[tweet id=(.*?)\]/i;
let urlRegex = /(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/i; 

const htmlParser = new Parser(React);
const processNodeDefinitions = new ProcessNodeDefinitions(React);
function isValidNode(){
    return true;
}
const processingInstructions = [
  // Create instruction for custom elements
  {
      shouldProcessNode: (node) => {
          // Process the node if it matches a tweet shortcode or url
          let foundMatch = (node.data && (tweetRegex.test(node.data) || urlRegex.test(node.data)));
          if (foundMatch) {
            console.log("found match: ", node.data);
          }
          return foundMatch;
      },
      processNode: (node) => {
        let result = tweetRegex.exec(node.data);
        if (result && result[1]) {
          let tweetId = result[1];
          return <div></div>
          // return <Embed width={560} url={`https://twitter.com/${tweetId}`} />
        } else {
          // matched an entire url
          return <Embed width={560} url={node.data} />
          // return <div></div>
        }
        
      }
  },
  // Default processing
  {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode
  }
];

export default class Posttest extends React.Component {
  state = {
    articleHtml: null,
  }
  componentDidMount() {
    let updatedHtml = htmlParser.parseWithInstructions(this.props.data.googleDocs.childMarkdownRemark.html, isValidNode, processingInstructions);
    this.setState({
      articleHtml: updatedHtml,
    })
  }

  render () {
    let data = this.props.data;
    let doc = data.googleDocs.document;
    let parsedDate = parseISO(doc.createdTime)
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
          <section className="section">
            <div className="content">
              {this.state.articleHtml}
            </div>
          </section>
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