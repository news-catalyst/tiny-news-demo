import React from "react"
import { graphql, Link } from "gatsby"
import { parseISO, formatRelative } from 'date-fns'
import Embed from 'react-embed';
import {getCLS, getFID, getLCP} from 'web-vitals';
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import sendToGoogleAnalytics from "../utils/vitals"
import "../pages/styles.scss"

let embedRegex = /\[embed src=\s*(.*?)\]/i;

const htmlParser = new Parser(React);
const processNodeDefinitions = new ProcessNodeDefinitions(React);
function isValidNode(){
    return true;
}
const processingInstructions = [
  // first case: when [embed src=http://twitter.com/tweet1234] and the url is linked
  // this comes through as a node with 3 children:
  //    * "[embed src "
  //    * { attribs: { href: "http://twitter.com/tweet1234" } }
  //    * "]"
  // look for this case in the PARENT node and replace its children with an <Embed> component
  //    using the url found in the second child.
  {
    replaceChildren: true,
    shouldProcessNode: (node) => {
      return (node.children !== undefined && node.children.length === 3 && (/\[embed src=\s/).test(node.children[0].data));
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
        } else {
          // matched an entire url
          return <Embed width={560} url={node.data} />
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
    getCLS(sendToGoogleAnalytics);
    getFID(sendToGoogleAnalytics);
    getLCP(sendToGoogleAnalytics);
  }

  render () {
    let data = this.props.data;
    let doc = data.googleDocs.document;
    let parsedDate = parseISO(doc.createdTime)
    let tagLinks;
    if (doc.tags) {
      tagLinks = doc.tags.map((tag, index) => (
        <Link to={`/topics/${tag}`} key={`${tag}-${index}`} className="is-link tag">{tag}</Link>
      ))
    }
    return (
      <div id="article-container">
        <ArticleNav metadata={data.site.siteMetadata} />
        <Layout title={doc.name} description={data.googleDocs.childMarkdownRemark.excerpt} {...doc}>
          <article>
            <section className="hero is-bold">
              <div className="hero-body">
                <div className={doc.cover ? "container head-margin" : "container"}>
                  <h1 className="title is-size-1">
                    {doc.name}
                  </h1>
                  <h2 className="subtitle">
                    By {doc.author} | Published {formatRelative(parsedDate, new Date())}
                  </h2>
                </div>
              </div>
            </section>
            {doc.cover &&
              <img src={doc.cover.image} alt={doc.cover.title} className="image" />
            }
            <section className="section">
              <div className="content">
                {this.state.articleHtml}
              </div>
            </section>
          </article>
          <aside>
            <section className="section">
              <div className="align-content">
                {tagLinks &&
                  <p className="subtitle">Tags</p>
                }
                <div className="tags">
                  {tagLinks}
                </div>
              </div>
            </section>
          </aside>
        </Layout>
        <ArticleFooter metadata={data.site.siteMetadata} />
      </div>
    )
  }
}

export const pageQuery = graphql`
  query($slug: String!) {
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
    googleDocs(document: {path: {eq: $slug}}) {
        document {
          author
          createdTime
          name
          tags
          og_locale
          og_title
          og_description
          og_image_url
          og_image_alt
          og_site_name
          og_url
          tw_handle
          tw_site
          tw_cardType
          cover {
            image
            alt
            title
          }
        }
        childMarkdownRemark {
          excerpt
          html
        }
    }
  }
`
