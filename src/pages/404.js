import React from "react"
import { Link } from 'gatsby'
import Layout from "../components/Layout"

const TinyEdit = () => {
  return (
    <Layout>
      <section className="section">
        <h1 className="title is-1">Page Not Found</h1>
        <p>
          Sorry, we couldn't find the page you were looking for. Perhaps you'd like to <Link to="/">go back to the homepage</Link>.
        </p>
      </section>
    </Layout>
  )
}

export default TinyEdit