
import React from "react"
import { graphql } from 'gatsby'
import Layout from "../../components/Layout"
import TinyImage from "../../components/TinyImage"

const TinyImages = ({data}) => {
  const images = data.allGoogleDocs.edges.map((edge) => {
    return edge.node.document.content.map((content) => {
      if (content.img === null) {
        return null
      }
      return (
        <TinyImage key={`${edge.node.id}-${content.img.source}`} document={edge.node.document} image={content.img} />
      )
    })
  })

  return (
    <div>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/tinycms">
            tinycms
          </a>

          <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
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
          </div>
        </div>
      </nav>
    <Layout>
      <h1 className="title is-1">tinycms images list</h1>
      <div className="tile is-ancestor">
        {images}
      </div>
    </Layout>
    </div>
  )
}

export default TinyImages

export const query = graphql`
  query {
    allGoogleDocs {
      edges {
        node {
          id
          document {
            content {
              img {
                source
                title
                alt
              }
            }
            name
            path
          }
        }
      }
    }
  }`
    // allFile(filter: {name: {glob: "google-docs-image-**"}}) {
    //   edges {
    //     node {
    //       id
    //       publicURL
    //       parent {
    //         id
    //         ... on MarkdownRemark {
    //           id
    //           excerpt
    //           frontmatter {
    //             name
    //             path
    //           }
    //         }
    //       }
    //     }
    //   }
    // }