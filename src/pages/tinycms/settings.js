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

  const handleSubmit = event => {
    event.preventDefault();
    console.log("handleSubmit sections: ", sections);
    let docData = { "sections": sections };
    let docContentString = JSON.stringify(docData);
    console.log("new doc contents: ", docContentString);

    gapi.client.drive.files.update({'fileId': settingsDocID, 'method': 'PATCH', 'body': docContentString})
    .then((response) => {
      // Handle response
      console.log("update google doc response: ", response);
    }, (reason) => {
      // Handle error
      console.log("update google doc error: ", reason);
    });
  }

  const verticalItems = sections.map( (vertical, index) => {
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
          'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        }).then(function() {
          return gapi.client.drive.files.export({fileId: settingsDocID, mimeType: 'text/plain'})
        }).then(function(resp) {
          let contents = resp.body;
          contents = contents.replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f")
               .replace(/\s+/, '');
          // contents = contents.replace(/[\u0000-\u0019]+/g,""); 
          contents = contents.replace(/[\u0000-\u001F]+/g,"")
          let data = JSON.parse(`${contents}`);
          setSections(data.sections);
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