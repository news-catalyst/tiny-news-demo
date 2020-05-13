
import React from "react"

export default function ArticleFooter(props) {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>
          <strong>{props.metadata.footerTitle}</strong> by <a href={props.metadata.footerBylineLink}>{props.metadata.footerBylineName}</a>. 
        </p>
      </div>
    </footer>
  )
}