import React, { useState } from "react"
import { Link, graphql } from 'gatsby'

import Layout from "../components/Layout"
import "../pages/styles.scss"

export default function EditMetadata({ data, pageContext }) {
  let doc = data.googleDocs.document;
  let path = `/drive/v3/files/${pageContext.id}?fields=description`;

  const [values, setValues] = useState({author: '', tags: ''})
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(false);

  const handleInputChange = e => {
    const {name, value} = e.target;
    setValues({...values, [name]: value})
  }

  // calls google drive API to GET document metadata (description)
  // I'm having trouble making this happen after the google api is loaded :(
  // which is why I've resorted to adding an onClick to a button for now
  const refreshForm = () => {
    window.gapi.client.request({'path': path, 'method': 'GET'})
      .then(function(response) {
        console.log("output from GET doc: ", response);
        let desc = JSON.parse(response.result.description);
        console.log(desc);

        let author = values.author;
        let tagsStr = values.tags;
        if (desc.author) {
          author = desc.author;
        }
        if (desc.tags) {
          tagsStr = desc.tags.join(', ');
        }
        let newValues = {
          author: author,
          tags: tagsStr
        }
        setValues(newValues);
        setErrors(false);
        setSuccess(true);
        setMessage("Successfully loaded metadata from Google Docs")

      }, function(reason) {
        console.log("error from GET doc: ", reason);
        setErrors(true);
        setSuccess(false);
        setMessage(reason);
      })
  }

  // Makes a PATCH request to google drive files API that sets the description field
  // currently includes author and tags, but this could be expanded to a bigger set 
  // or possibly allow for arbitrary fields
  function updateGoogleDoc(e) {
    e.preventDefault();
    let splitTags = values.tags.split(', ')
    let newData = {}
    newData.author = values.author;
    newData.tags = splitTags;

    let bodyForGoogle = { 
      description: JSON.stringify(newData)
    }
    window.gapi.client.request({'path': path, 'method': 'PATCH', 'body': JSON.stringify(bodyForGoogle)})
     .then(function(response) {
       // Handle response
      console.log("success: ", response);
      setErrors(false);
      setSuccess(true);
      setMessage("Successfully updated metadata.")
      // refreshForm();
     }, function(reason) {
       // Handle error
        console.log("error: ", reason);
        setErrors(true);
        setSuccess(false);
        setMessage(reason);
     });
  }

  return(
    <Layout>
      <h1 className="title is-1">tinycms metadata editor</h1>

      <section className="section">
        <div className="columns">
          <div className="column">
            <button className="button is-primary" id="refresh" onClick={refreshForm}>Refresh</button>
          </div>
          <div className="column">
            <button className="button" id="authorize_button">Authorize</button>
          </div>
          <div className="column">
            <button className="button" id="signout_button">Signout</button>
          </div>
        </div>
      </section>

      <h3 className="title is-4">{doc.name}</h3>
      {success &&
      <div className="message is-success">
          <div class="message-header">
            Success
          </div>
          <div class="message-body">
            {message}
          </div>
      </div>}
      {errors &&
      <div className="message is-danger">
          <div class="message-header">
            Error
          </div>
          <div class="message-body">
            {message}
          </div>
      </div>}
      <form onSubmit={updateGoogleDoc}>
        <div className="field">
          <label className="label">Author</label>
          <div className="control">
            <input name="author" className="input" type="text" onChange={handleInputChange} value={values.author} />
          </div>
        </div>
        <div className="field">
          <label className="label">Tags</label>
          <div className="control">
            <input name="tags" className="input" type="text" onChange={handleInputChange} value={values.tags} />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <input className="button" type="submit" value="Update" />
          </div>
        </div>
      </form>
      <section className="section">
        <Link to="/cms/publish">Back to list</Link>
      </section>
    </Layout>
  )
}

export const query = graphql`
  query($id: String!) {
    googleDocs(document: {id: {eq: $id}}) {
        document {
            author
            name
            tags
        }
        childMarkdownRemark {
            html
        }
    }
  }`
