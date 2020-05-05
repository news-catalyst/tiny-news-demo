import React, { useState } from "react"
import { graphql } from 'gatsby'
import Layout from "../components/Layout"
import "../pages/styles.scss"

export default function EditMetadata({ data }) {
  console.log(data);
  let doc = data.googleDocs.document;

  const [values, setValues] = useState({author: doc.author, tags: doc.tags.join(', ')})

  const handleInputChange = e => {
    const {name, value} = e.target
    setValues({...values, [name]: value})
}


  function updateGoogleDoc(e) {
    e.preventDefault();
    console.log(values)
    let splitTags = values.tags.split(', ')
    let newData = {}
    newData.author = values.author;
    newData.tags = splitTags;
    console.log(newData);
    console.log(JSON.stringify(newData));
  }

  return(
    <Layout>
      <h1 className="title is-1">Edit Metadata</h1>
      <h3 className="title is-3">{doc.name}</h3>

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