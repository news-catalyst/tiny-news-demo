<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<p align="center">
  <a href="https://www.gatsbyjs.org">
    <img alt="Gatsby" src="https://www.gatsbyjs.org/monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  tiny news demo
</h1>

A demo of integrating Gatsby with Netlify CMS and Google Docs.

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

## ❓What else?

    Public-facing pages (like `http://localhost:8000`, `http://localhost:8000/articles/your-title-here`) are served by gatsby based on data in graphQL.

    This data is imported into graphQL from Google Drive.

    The tinycms loads and updates data directly in Google Drive via Google APIs. If you make changes either in Google Drive or in tinycms and are wondering why you can't see them in the web pages, you probably need to restart the server (`gatsby develop`).