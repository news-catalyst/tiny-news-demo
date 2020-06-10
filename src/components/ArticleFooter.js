
import React from "react"
import Pico from "./Pico"

class ArticleFooter extends React.Component {
  render () {
  console.log(this.props);
    return (
        <footer className="footer">
          <Pico post_id={this.props.document.id} post_type="article" tags={this.props.document.tags} article={true} />
          <div className="content has-text-centered">
            <p>
              <strong>{this.props.metadata.footerTitle}</strong> by <a href={this.props.metadata.footerBylineLink}>{this.props.metadata.footerBylineName}</a>. 
            </p>
          </div>
        </footer>
    )
  }
}
export default ArticleFooter;