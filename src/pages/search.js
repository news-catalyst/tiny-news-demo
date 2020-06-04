import React, {useState} from "react"
import { graphql } from "gatsby"
import queryString from 'query-string';
import { useFlexSearch } from 'react-use-flexsearch'
import SearchPanel from "../components/SearchPanel"
import SearchResults from "../components/SearchResults"
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"

import "./styles.scss"

export default function SearchPage({ data }) {
  const index = data.localSearchArticles.index;
  const store = data.localSearchArticles.store;
  let location = window.location;
  const parsed = queryString.parse(location.search);

  const [query, setQuery] = useState(parsed.query)

  const results = useFlexSearch(query, index, JSON.parse(store))

  return(
    <div>
      <ArticleNav metadata={data.site.siteMetadata} />
      <Layout title={data.site.siteMetadata.title} description={data.site.siteMetadata.description}>
        <SearchPanel metadata={data.site.siteMetadata} query={query} setQuery={setQuery} />
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