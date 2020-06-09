import React from "react"

class Footer extends React.Component {
  componentDidMount () {
    var pageInfo = {
        article: false,
        post_type: "home",
        url: window.location.href
    };
    if (typeof window.pico !== 'undefined') {
      console.log(pageInfo);
      window.pico('visit', pageInfo);
    } else {
      console.log("window.pico is not defined")
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
export default Footer;