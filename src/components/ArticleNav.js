import React from "react"

export default function ArticleNav(props) {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          {props.metadata.shortName}
        </a>

        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item" href="/">
            {props.metadata.nav.articles}
          </a>

          <a className="navbar-item" href="/topics">
            {props.metadata.nav.topics}
          </a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
                <a className="button logout" href="/tinycms">
                  {props.metadata.nav.cms}
                </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}