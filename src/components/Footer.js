import React from "react"
import Pico from "./Pico"

class Footer extends React.Component {

  render () {
    return (
        <footer className="footer">
          <Pico post_type={this.props.post_type} article={false} />
          <div className="content has-text-centered">
            <p>
              <strong>{this.props.metadata.footerTitle}</strong> by <a href={this.props.metadata.footerBylineLink}>{this.props.metadata.footerBylineName}</a>. 
            </p>
          </div>
        </footer>
    )
  }
}
export default Footer;