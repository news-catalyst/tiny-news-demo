import React from "react"
import _ from 'lodash'
import { Link } from "gatsby"
import { parseISO, formatRelative } from 'date-fns'

export default function ArticleLink(props) {
  let parsedDate = parseISO(props.document.createdTime)
  return (
    <article>
      {props.document.cover &&
        <div className="media">
          <p className="image featured-img">
            <img src={props.document.cover.image} />
          </p>
        </div>
      }
        <div className="media-left">
          <h1 className="title"><Link className="featured" to={props.document.path}>{props.document.name}</Link></h1>
          <p className="featured">{props.excerpt}</p>
          <p className="byline featured">{props.document.author} | {formatRelative(parsedDate, new Date())}</p>
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
    </article>
  )
}