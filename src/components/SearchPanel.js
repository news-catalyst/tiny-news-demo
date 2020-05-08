import React from "react"

export default function SearchPanel() {
  return (
    <nav className="panel">
      <p className="panel-heading">
        Search
      </p>
      <div className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search"/>
          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true"></i>
          </span>
        </p>
      </div>
    </nav>
  )
}