import React from "react"
import _ from 'lodash'
import { Link } from "gatsby"

export default function TinyCmsNav(props) {

return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/tinycms">
          tinycms
        </a>

        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" href="/tinycms">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item" href="/tinycms">
            Articles
          </a>

          <a className="navbar-item" href="/tinycms/images">
            Images
          </a>

          <a className="navbar-item" href="/tinycms/settings">
            Settings
          </a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {props.user && 
                <button id="" className="button logout" onClick={props.signOut}>
                  Log out
                </button>
              }
              {!props.user && 
                <button id="customBtn" className="button is-light">
                  Log in
                </button>
              }   
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}