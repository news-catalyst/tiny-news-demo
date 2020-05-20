import React from "react"
import { graphql } from 'gatsby'
import addToMailchimp from 'gatsby-plugin-mailchimp'
import ArticleFooter from "../components/ArticleFooter"
import ArticleNav from "../components/ArticleNav"
import Layout from "../components/Layout"

export default class Subscribe extends React.Component {
  state = {
    email: null,
  }

  _handleChange = (e) => {
    console.log({
        [`${e.target.name}`]: e.target.value,
    });
    this.setState({
      [`${e.target.name}`]: e.target.value,
    });
  }

  _handleSubmit = e => {
    e.preventDefault();
    addToMailchimp(this.state.email)
    .then(({ msg, result }) => {
      console.log('msg', `${result}: ${msg}`);

      if (result !== 'success') {
          throw msg;
      }
      alert(msg);
    })
    .catch((err) => {
        console.log('err', err);
        alert(err);
    });
  }

  render() {
    let data = this.props.data;
    return(
      <div>
        <ArticleNav metadata={data.site.siteMetadata} />
        <Layout title={data.site.siteMetadata.subscribe.title} description={data.site.siteMetadata.subscribe.subtitle}>
          <section className="hero is-primary is-bold">
            <div className="hero-body">
              <div className="container">
                <h1 className="title">
                  {data.site.siteMetadata.subscribe.title}
                </h1>
                <h2 className="subtitle">
                  {data.site.siteMetadata.subscribe.subtitle}
                </h2>
              </div>
            </div>
          </section>


          <section className="section">
            <form onSubmit={this._handleSubmit}>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input name="email" className="input" type="email" placeholder="hello@example.com" onChange={this._handleChange} />
                </div>
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <button className="button is-link">Submit</button>
                </div>
                <div className="control">
                  <button className="button is-link is-light">Cancel</button>
                </div>
              </div>
            </form>
          </section>
        </Layout>
        <ArticleFooter metadata={data.site.siteMetadata} />
      </div>
    );
  }
}

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
        subscribe {
          title
          subtitle
        }
      }
    }
}`
