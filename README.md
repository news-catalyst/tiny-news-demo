<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<p align="center">
  <a href="http://tinynewsco.org">
    <img alt="Gatsby" src="/static/tiny_news_64.png" width="60" />
  </a>
</p>
<h1 align="center">
  tiny news demo
</h1>

A tiny news co demo built with Gatsby, React, Google Docs, and a lot off integrations.

## 🚀 Quick start

1.  **Clone this repo**

    ```shell
    git clone git@github.com:news-catalyst/tiny-news-demo.git
    ```

1.  **Install the things.**

    Navigate into your new site’s directory and run:

    ```shell
    cd tiny-news-demo/
    npm install
    ```

1.  **Start up on localhost.**

    ```shell
    gatsby develop
    ```

1. **View the site and admin.**

    Your site is now running at `http://localhost:8000`!

    _Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql)._

    There is also a tinycms at `http://localhost:8000/tinycms`!

## Overview

Public-facing pages (like `http://localhost:8000`, `http://localhost:8000/articles/your-title-here`) are served by gatsby based on data in graphQL.

This data is mainly imported into graphQL from Google Drive. Other data, like text labels and navigation, comes from `gatsby-config.js`.

Metadata on articles, including social media settings and tags, is managed via the tinycms. This is really just a simple web form that loads and updates data directly in Google Drive via Google APIs. If you make changes either in Google Drive or in tinycms and are wondering why you can't see them in the web pages, you probably need to restart the server (`gatsby develop`) or republish the site (`gatsby build`). _More troubleshooting should probably be written about this aspect at a later date_.

## Configuration & Integration 

How we actually create, configure and publish each tinynewsco site is TBD - and will probably be the result of an interactive scripted setup process. However, there are several integration and configuration points regardless of setup implementation. This section describes how to create a custom tinynewsco site.

### Setup Google Docs Integration

Google Docs is the main source of content for a tinynewsco. This requires a top-level folder created in Docs in which any document can be published live to the site. That is, if you'd like to write drafts in Google Docs, you need ot make sure to do that in a different folder, then move the document when it's ready for publication.

We recommend the following setup in Google Docs:

<img src="/static/docs/google-docs-top-level.png" />

Use separate folders for publication-ready content and in-progress drafts. Here we're using "Ready" and "Drafts" but you can call these whatever you like. How you organize your drafts is also entirely up to you, as the tinynewsco publisyhing platform ignores anything outside your version of a "Ready" folder.

<img src="/static/docs/google-docs-ready.png" />

Things start to get interesting within the "Ready" folder. The folder structure you setup here will translate directly into a URL or site structure for your tinynewsco. In the above example, there are three folders and a document. These will be published as:

* articles: `/articles/`
* opinion: `/opinion/`
* blog: `/blog`
* Top Article: `/top-article/`

In other words, any folder becomes a directory in the URL, any document becomes a page. You can nest folders as much as you like, for example, `articles` can include topic-level subfolders. 

More on this later, though. Now that you've created a `Ready` (or whatever you'd like to name this) folder in Google, make note of its folder ID:

<img src="/static/docs/google-docs-folder-id.png" />

Click into your `Ready` folder and copy the last bit of the URL for the folder ID, as shown in the above screenshot.

Now open `gatsby-config.js` in the top-level of this repo and find the configuration section for `gatsby-source-google-docs`. Update the `folders` array so your folder ID is included, like below:

```
     {
        resolve: "gatsby-source-google-docs",
        options: {
            folders: ["1lcfhd58_0D6-uP0Dwb0a_-Yri2L0h-6K"],
            debug: true,
        }
      },
```

We'll get into creating an article later in the docs.

### Sitewide Text Setup

For now, we define general text used across the site in a special configuration file for Gatsby located in the root of this repo: `gatsby-config.js`, the same file we used to configure Google Docs integration.

The section you'll want to edit is towards the top of the file:

```
module.exports = {
  siteMetadata: {
    shortName: `tinynewsco`,
    title: `the tiny news collective`,
    siteUrl: `https://tinynewsco.org/`,
    description: `a local news initiative`,
    subscribe: {
      title: `Subscribe`,
      subtitle: `Get the latest news about the tiny news collective in your inbox.`,
    },
    footerTitle: `tinynewsco.org`,
    footerBylineName: `News Catalyst`,
    footerBylineLink: `https://newscatalyst.org`,
    labels: {
      latestNews: `Latest News`,
      search: `Search`,
      topics: `Topics`,
    },
    nav: {
      articles: `Articles`,
      topics: `All Topics`,
      cms: `tinycms`
    }
  },
```

Everything in `siteMetadata` can be customised to work with your particular tinynewsco's language. 

The various site templates make use of these snippets of text by first requesting them in a `graphql` query, as seen in this example pulled from the homepage code at `src/pages/index.js`:

```javascript
export const query = graphql`
  query {
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
```

Once requested, the text is then available in the template:

```javascript
  <section className="hero is-dark is-bold">
    <div className="hero-body">
      <div className="container">
        <h1 className="title">
          {data.site.siteMetadata.title}
        </h1>
        <h2 className="subtitle">
          {data.site.siteMetadata.description}
        </h2>
      </div>
    </div>
  </section>
```

To-do: internationalization of text, which will probably require a different solution than `gatsby-config.js`.


### Google Analytic and AMP Setup

To configure your site's Google Analytics and AMP, open `gatsby-config.js` again and edit the following sections.

For AMP, specify your Google Analytics ID in two places, set the base URL, specify any AMP add-ons (we use `amp-form` by default) and finally set the `pathIdentifier` that identifies AMP versions of a page:

```json
     {
        resolve: `gatsby-plugin-amp`,
        options: {
          analytics: {
            type: 'gtag',
            dataCredentials: 'include',
            config: {
              vars: {
                gtag_id: "UA-166777432-1",
                config: {
                  "UA-166777432-1": {
                    page_location: '{{pathname}}'
                  },
                },
              },
            },
          },
          canonicalBaseUrl: 'http://tinynewsco.org/',
          components: ['amp-form'],
          excludedPaths: ['/404*', '/'],
          pathIdentifier: '/amp/',
          relAmpHtmlPattern: '{{canonicalBaseUrl}}{{pathname}}{{pathIdentifier}}',
          useAmpClientIdApi: true,
        },
      },
```

The default URL for AMP appends `/amp/` to a page URL, so `/articles/article-with-embeds/` becomes `/articles/article-with-embeds/amp/` and so on.

For Google Analytics, depending on your preferences, you may merely need to edit this section by specifying your tracking ID:

```
     {
        resolve: `gatsby-plugin-google-analytics`,
        options: {
          // The property ID; the tracking code won't be generated without it
          trackingId: "UA-166777432-1",
          // Defines where to place the tracking script - `true` in the head and `false` in the body
          head: true,
          // Setting this parameter is optional
          anonymize: true,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          exclude: ["/preview/**", "/do-not-track/me/too/"],
          // Delays sending pageview hits on route update (in milliseconds)
          pageTransitionDelay: 0,
          // Enables Google Optimize using your container Id
          // optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
          // Enables Google Optimize Experiment ID
          // experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
          // Set Variation ID. 0 for original 1,2,3....
          // variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
          // Defers execution of google analytics script after page load
          defer: false,
          // Any additional optional fields
          // sampleRate: 5,
          // siteSpeedSampleRate: 10,
          // cookieDomain: "example.com",
        },
      },
```

* Mailchimp setup
* Creating pages outside of Google Docs
* SEO and Social settings
## Editing articles in Google Docs

* headlines / names
* images
* copy
* embeds

