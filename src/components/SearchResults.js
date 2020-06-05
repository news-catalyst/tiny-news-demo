import React from "react"
import { Link } from "gatsby"

export default function SearchResults(props) {

  return (
    <section className="section">
      <h1 className="title">Results</h1>

      <ul>
        {props.results.map(result => (
          <li key={result.id}><Link to={result.path}>{result.name}</Link></li>
        ))}
      </ul>
    </section>
  )
}