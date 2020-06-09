
import React from "react"

class ArticleFooter extends React.Component {
  componentDidMount () {
    console.log(this.props);
    var pageInfo = {
        article: true,
        post_id: this.props.document.id,
        post_type: "article",
        taxonomies: { tags: this.props.document.tags },
        url: window.location.href
    };
    if(typeof window.pico !== 'undefined' && typeof pageInfo === 'object') {
      console.log(pageInfo);
      window.pico('visit', pageInfo);
    }
  }

  render () {
    return (
        <footer className="footer">
          <div className="content has-text-centered">
            <p>
              <strong>{this.props.metadata.footerTitle}</strong> by <a href={this.props.metadata.footerBylineLink}>{this.props.metadata.footerBylineName}</a>. 
            </p>
            <button className="PicoRule">Open Pico (Test)</button>
          </div>
        </footer>
    )
  }
}
export default ArticleFooter;