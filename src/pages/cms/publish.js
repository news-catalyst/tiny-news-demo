import React, { useState } from "react"
import Layout from "../../components/Layout"
import "../styles.scss"

export default function Publish({ data }) {
  const [message, setMessage] = useState('');
  const [published, setPublished] = useState(false);

  function handlePublish(e) {
    e.preventDefault();
    fetch('https://api.netlify.com/build_hooks/5eaf81776d3a2da2a6e11fac', {
      method: 'post'
    }).then(function(response) {
      return response;
    }).then(function(data) {
      console.log(data);
      setPublished(true);
      setMessage("The site is being republished");
    });
  }

  return(
    <Layout>
      <h1 className="title is-1">CMS</h1>
      {published &&
        <div className="message">{message}</div>
      }
      <div>
        <a className="button" href="#" onClick={handlePublish}>Publish</a>
      </div>
    </Layout>
  )
}
