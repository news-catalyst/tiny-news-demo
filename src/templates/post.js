import React from 'react';
import { graphql, Link } from "gatsby"
import { parseISO, formatRelative } from 'date-fns'
import Embed from 'react-embed';
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import "../pages/styles.scss"

let embedRegex = /\[embed src=\s*(.*?)\]/i;

const htmlParser = new Parser(React);
const processNodeDefinitions = new ProcessNodeDefinitions(React);
function isValidNode(){
    return true;
}
const processingInstructions = [
  {
    replaceChildren: true,
    shouldProcessNode: (node) => {
      console.log("replace children shouldProcessNode: ", node);
      return (node.children !== undefined && node.children.length == 3 && (/\[embed src=\s/).test(node.children[0].data));
    },
    processNode: (node, children, index) => {
      let embedUrl = node.children[1].attribs.href;
      return <Embed width={560} url={embedUrl} />
    }
  },
  // second case: when the embed code is NOT automagically hyperlinked from google
  // it comes through as a single plaintext node :)
  {
      shouldProcessNode: (node) => {
        let foundMatch = (node.data && embedRegex.test(node.data));
        return foundMatch;
      },

      processNode: (node) => {
        let result = embedRegex.exec(node.data);
        if (result && result[1]) {
          let embedUrl = result[1];
          return <Embed width={560} url={embedUrl} />
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
        <Layout title={doc.name} description={data.googleDocs.childMarkdownRemark.excerpt}>
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
          excerpt
          html
        }
    }
  }
`