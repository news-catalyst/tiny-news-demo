import React from "react"

class Footer extends React.Component {
  componentDidMount () {
    var pageInfo = {
        article: false,
        post_type: "home",
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
          </div>
        </footer>
    )
  }
}
export default Footer;