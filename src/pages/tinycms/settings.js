import React, {useEffect, useState} from 'react';
import { gapi, loadAuth2 } from 'gapi-script' 
import { graphql } from "gatsby"
import TinyCmsNav from '../../components/TinyCmsNav'
import VerticalField from '../../components/VerticalField'


export default function TinySettings({data}) {
  const [user, setUser] = useState({
    name: null,
    email: null
  });
  const [sections, setSections] = useState([]);

  let settingsDoc = data.allGoogleDocs.nodes[0];

  let settingsDocID = settingsDoc.document.id;
  let settingsContents = settingsDoc.childMarkdownRemark.rawMarkdownBody;
  let parsed = JSON.parse(settingsContents);
  console.log("parsed data: ", parsed);

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let newSections = [];
    for(var pair of formData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]); 
   }
   parsed.sections = formData.entries;

   console.log(parsed);
  }
  const verticalItems = parsed.sections.map( (vertical, index) => {
    return (
      <VerticalField key={`vertical-fieldset-${index}`} index={index} label={vertical.label} link={vertical.link} sections={sections} updateSections={setSections} />
    )
  });

  let scopes = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata";

  useEffect(
    () => {
      async function fetchUser() {
        let userData;
        let auth2 = await loadAuth2(process.env.GATSBY_TINY_CMS_CLIENT_ID, scopes);
        if (auth2.isSignedIn.get()) {
          userData = auth2.currentUser.get().getBasicProfile();
          setUser({name: userData.getName(), email: userData.getEmail()})
        }
      }
      fetchUser();

      // LOAD Google Drive API client libraries
      gapi.load('client', () => {

        // INITIALISE Google Drive API Client
        gapi.client.init({
          'apiKey': process.env.GATSBY_TINY_CMS_API_KEY,
          'clientId': process.env.GATSBY_TINY_CMS_CLIENT_ID,
          'scope': scopes,
        }).then(function() {
          console.log("initialized google drive api client")
          // BUILD path to document data endpoint for gapi requests
          let path = `/drive/v3/files/${settingsDocID}?fields=description,name`;

          // GET document metadata from Google Drive
          return gapi.client.request({
            'path': path,
            'method': 'GET'
          })
        }).then(response => {
          console.log("found settings document: ", response)
        });
      });
  }, []);

  function signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        this.setState({ user: null })
    });
  }
  return (
    <div>
      <TinyCmsNav user={user} signOut={signOut} />
      <h1 className="title">tinycms settings</h1>
      <p>
        Configure various aspects of the tinynewsco site here.
      </p>

      <section className="section">
        <h2 className="is-2">Verticals</h2>
        <form onSubmit={handleSubmit}>
          {verticalItems}
          <div className="field is-grouped">
            <div className="control">
              <input type="submit" className="button is-link" value="Submit" />
            </div>
            <div className="control">
              <button className="button is-link is-light">Cancel</button>
            </div>
          </div>
        </form>
      </section>
      <pre>
        {settingsContents}
      </pre>
      <p>
        You are logged in as: {user.name} ({user.email})
      </p>
    </div>
  );
}

export const query = graphql`
  query MyQuery {
    allGoogleDocs(filter: {document: {name: {eq: "settings"}}}) {
      nodes {
        document {
          id
        }
        childMarkdownRemark {
          rawMarkdownBody
        }
      }
    }
  }
`