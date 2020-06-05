import React, {useEffect, useState} from "react"
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
  const [query, setQuery] = useState('')

  let searchIndex = data.localSearchArticles.index;
  let searchStore = JSON.parse(data.localSearchArticles.store);

  useEffect(
    () => {
      let parsed = queryString.parse(window.location.search);
      setQuery(parsed.query);
    }, []);


  let results = useFlexSearch(query, searchIndex, searchStore);

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