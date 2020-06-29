
import React from "react"
import { Helmet } from 'react-helmet'
import _ from 'lodash'
import { graphql, Link } from "gatsby"
import { parseISO, formatRelative } from 'date-fns'
import Embed from 'react-embed';
import {getCLS, getFID, getLCP} from 'web-vitals';
import { Parser, ProcessNodeDefinitions } from "html-to-react";
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"
import SignUp from "../components/SignUp"
import sendToGoogleAnalytics from "../utils/vitals"
import ImageWithTextAd from "../components/ImageWithTextAd"
import "../pages/styles.scss"

// Look for URLs in the article copy for embedding social media
let urlRegex = /(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/i;

const MATCH_URL_DAILY_MOTION = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?$/;
const canEmbedDailyMotion = (url) => MATCH_URL_DAILY_MOTION.test(url);

const MATCH_URL_FACEBOOK = /facebook\.com\/.+/;
const canEmbedFacebook = (url) => MATCH_URL_FACEBOOK.test(url);

const MATCH_URL_GOOGLE = /google\.com\/.+/;
const canEmbedGoogle = (url) => MATCH_URL_GOOGLE.test(url);

const MATCH_URL_INSTAGRAM = /instagram\.com\/.+/;
const canEmbedInstagram = (url) => MATCH_URL_INSTAGRAM.test(url);

const MATCH_URL_IMGUR = /imgur\.com\/.+/;
const canEmbedImgur = (url) => MATCH_URL_IMGUR.test(url);

const MATCH_URL_MIXCLOUD = /mixcloud\.com\/([^/]+\/[^/]+)/;
const canEmbedMixcloud = (url) => MATCH_URL_MIXCLOUD.test(url);

const MATCH_VIDEO_URL_TWITCH = /(?:www\.|go\.)?twitch\.tv\/videos\/(\d+)($|\?)/;
const MATCH_CHANNEL_URL_TWITCH = /(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/;
const canEmbedTwitch = (url) => MATCH_VIDEO_URL_TWITCH.test(url) || MATCH_CHANNEL_URL_TWITCH.test(url);

const MATCH_URL_TWITTER = /twitter\.com\/.+/;
const canEmbedTwitter = (url) => MATCH_URL_TWITTER.test(url);

const MATCH_URL_YOUTUBE = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=/
const canEmbedYoutube = url => MATCH_URL_YOUTUBE.test(url);

const MATCH_URL_VIMEO = /vimeo\.com\/.+/;
const MATCH_FILE_URL_VIMEO = /vimeo\.com\/external\/.+\.mp4/;
const canEmbedVimeo = (url) => {
  if (MATCH_FILE_URL_VIMEO.test(url)) {
    return false;
  }
  return MATCH_URL_VIMEO.test(url);
};

const MATCH_URL_SOUNDCLOUD = /(soundcloud\.com|snd\.sc)\/.+$/;
const canEmbedSoundcloud = url => MATCH_URL_SOUNDCLOUD.test(url);

const MATCH_URL_STREAMABLE = /streamable\.com\/([a-z0-9]+)$/;
const canEmbedStreamable = (url) => MATCH_URL_STREAMABLE.test(url);

function isValidUrl(url) {
  let validUrl = urlRegex.test(url);
  if (!validUrl) {
    return false; // don't bother processing further
  }
  let supportedPlatform = (
    canEmbedDailyMotion(url) ||
    canEmbedFacebook(url) ||
    canEmbedGoogle(url) ||
    canEmbedImgur(url) ||
    canEmbedInstagram(url) ||
    canEmbedMixcloud(url) ||
    canEmbedSoundcloud(url) ||
    canEmbedStreamable(url) ||
    canEmbedTwitch(url) ||
    canEmbedTwitter(url) ||
    canEmbedYoutube(url) ||
    canEmbedVimeo(url) );

  return validUrl && supportedPlatform;
}

const htmlParser = new Parser(React);
const processNodeDefinitions = new ProcessNodeDefinitions(React);
function isValidNode(){
    return true;
}
const processingInstructions = [
  // Ad insertion processing
  {
    shouldProcessNode: (node) => {
      if (node.name && node.name === 'p' && node.nodeType === Node.ELEMENT_NODE){
        return node;
      }
    },
    processNode: function (node, children, index) {
      if (index == 6) {
        return (
          <>
            <p>
              {children}
            </p>
            <ImageWithTextAd ad={{
              brand: "test",
              image: {
                url: "https://placehold.it/300x300",
                alt: "Alt text"
              },
              header: "test header",
              body: "This is the body text of an advertisement.",
              call: "Call to action",
              url: "https://www.w3schools.com/"
            }} />
          </>
        )
      }
      else {
        return (
          <>
            <p>
              {children}
            </p>
          </>
        )
      }
    }
  },
  // first, should this block become an embed? try matching against URL regex
  {
      shouldProcessNode: (node) => {
        let foundMatch = (node.data && isValidUrl(node.data));
        return foundMatch;
  },
  // processNode gets executed if shouldProcessNode returns true
  // this replaces the URL with an embed
      processNode: (node) => {
        let embedUrl = node.data;
        return <Embed width={560} url={embedUrl} />
      }
  },
  // Default processing
  {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode
  }
];

export default class Article extends React.Component {

    state = {
      articleHtml: null,
      canonical: ''
    }

  componentDidMount() {
    let canonical = window.location.href; // this must be set correctly for Coral to load, also for SEO

    let updatedHtml = htmlParser.parseWithInstructions(this.props.data.googleDocs.childMarkdownRemark.html, isValidNode, processingInstructions);
    this.setState({
      articleHtml: updatedHtml,
      canonical: canonical
    })
    getCLS(sendToGoogleAnalytics);
    getFID(sendToGoogleAnalytics);
    getLCP(sendToGoogleAnalytics);
  }

  render () {
    let sections = this.props.pageContext.sections;
    let data = this.props.data;
    let doc = data.googleDocs.document;
    let parsedDate = parseISO(doc.createdTime)

    let tagLinks;
    if (doc.tags) {
      tagLinks = doc.tags.map((tag, index) => (
        <Link to={`/topics/${_.kebabCase(tag)}`} key={`${tag}-${index}`} className="is-link tag">{tag}</Link>
      ))
    }
    return (
      <div id="article-container">
        <ArticleNav metadata={data.site.siteMetadata} sections={sections} />
        <Layout title={doc.name} description={data.googleDocs.childMarkdownRemark.excerpt} canonical={this.state.canonical} {...doc}>
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
              <div id="articleText" className="content">
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
          <section className="section">
            <div className="align-content medium-margin-top">
              <h1 className="title media-left">{data.site.siteMetadata.subscribe.subtitle}</h1>
              <SignUp/>
            </div>
          </section>
        </Layout>
        <ArticleFooter metadata={data.site.siteMetadata} document={doc} canonical={this.state.canonical} />
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
        subscribe {
          title
          subtitle
        }
      }
    }
    googleDocs(document: {path: {eq: $slug}}) {
        document {
          author
          createdTime
          id
          name
          path
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
