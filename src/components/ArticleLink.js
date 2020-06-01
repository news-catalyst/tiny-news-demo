import React from "react"
import _ from 'lodash'
import { Link } from "gatsby"

export default function ArticleLink(props) {
  return (
    <article className="media">
      {props.document.cover &&
        <figure className="media-left">
          <p className="image is-128x128">
            <img src={props.document.cover.image} />
          </p>
        </figure>
      }
      <div className="media-content">
        <div className="content">
          <h1 className="title"><Link to={props.document.path}>{props.document.name}</Link></h1>
          <p>{props.excerpt}</p>
        </div>
        <nav className="level is-mobile">
          <div className="level-left">
            <a className="level-item">
              <span className="icon is-small"><i className="fas fa-reply"></i></span>
            </a>
            <a className="level-item">
              <span className="icon is-small"><i className="fas fa-retweet"></i></span>
            </a>
            <a className="level-item">
              <span className="icon is-small"><i className="fas fa-heart"></i></span>
            </a>
          </div>
        </nav>
      </div>
    </article>
  )
}