import React, { useState, useEffect } from "react"
import { graphql } from 'gatsby'
import Layout from "../components/Layout"
import "../pages/styles.scss"

export default function EditMetadata({ pageContext, data }) {
  console.log(data);
  let doc = data.googleDocs.document;
  let path = `/drive/v3/files/${pageContext.id}?fields=description`;

  const [values, setValues] = useState({author: '', tags: ''})

  useEffect(() => {
    refreshForm();
  }, [])

  const handleInputChange = e => {
    const {name, value} = e.target;
    console.log("handling input change for name -> value: ", name, value);
    setValues({...values, [name]: value})
}

  function refreshForm() {
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

      }, function(reason) {
        console.log("error from GET doc: ", reason);
      })
  }

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
      refreshForm();
     }, function(reason) {
       // Handle error
       console.log("error: ", reason);
     });
  }

  return(
    <Layout>
      <h1 className="title is-1">Edit Metadata</h1>
      <h3 className="title is-3">{doc.name}</h3>

      <button id="authorize_button">Authorize</button>
      <button id="signout_button">Signout</button>

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