import React from "react"
import Pico from "./Pico"

class Footer extends React.Component {

  render () {
    return (
        <footer className="footer">
          <Pico post_type="home" article={false} />
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
export default Footer;