import React, { useState } from "react"
import { graphql } from "gatsby"
import { useFlexSearch } from 'react-use-flexsearch'
import { Formik, Form, Field } from 'formik'
import SearchResults from "../components/SearchResults"
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"

import "./styles.scss"

export default function SearchPage({ data }) {
  const index = data.localSearchArticles.index;
  const store = data.localSearchArticles.store;

  const [query, setQuery] = useState(null)
  const results = useFlexSearch(query, index, JSON.parse(store))

  return(
    <div>
      <ArticleNav metadata={data.site.siteMetadata} />
      <Layout title={data.site.siteMetadata.title} description={data.site.siteMetadata.description}>
        <nav className="panel">
          <p className="panel-heading">
            {data.site.siteMetadata.labels.search}
          </p>
          <div className="panel-block">
            <Formik
              initialValues={{ query: '' }}
              onSubmit={(values, { setSubmitting }) => {
                setQuery(values.query)
                setSubmitting(false)
              }}
            >
              <Form>
                <Field name="query" className="input" />
              </Form>
            </Formik>
          </div>
        </nav>
        <SearchResults results={results} />
      </Layout>
      <ArticleFooter metadata={data.site.siteMetadata} />
    </div>
  )
}

export const query = graphql`
  query {
    localSearchArticles {
      index
      store
    }
    site {
      siteMetadata {
        title
        shortName
        description
        siteUrl
        footerTitle
        footerBylineName
        footerBylineLink
        labels {
          latestNews
          search
          topics
        }
        nav {
          articles
          topics
          cms
        }
      }
    }
  }`