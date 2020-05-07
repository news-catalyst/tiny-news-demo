import React, { Component } from 'react';
import { gapi, loadAuth2 } from 'gapi-script'
import queryString from 'query-string';
import Layout from "../components/Layout"
import "../pages/styles.scss"

class GoogleLogin extends Component {
    constructor(props) {
        super(props);

        const parsed = queryString.parse(document.location.search);

        this.state = {
          id: parsed.id,
          doc: {
            author: '',
            tags: ['']
          },
          message: '',
          name: '',
          errors: false,
          success: false,
          user: null
        }

        console.log(this.state);
        this.handleChangeAuthor = this.handleChangeAuthor.bind(this);
        this.handleChangeTags = this.handleChangeTags.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeAuthor(event) {
      let data = this.state.doc;
      data.author = event.target.value;
      this.setState({doc: data});
    }
    handleChangeTags(event) {
      let data = this.state.doc;
      data.tags = event.target.value;
      this.setState({doc: data});
    }

    handleSubmit(event) {
      event.preventDefault();

      let path = `/drive/v3/files/${this.state.id}?fields=description`;

      let bodyForGoogle = { 
        description: JSON.stringify(this.state.doc)
      }

      // UPDATE document metadata in gapi via PATCH request, stores data in doc description field
      gapi.client.request({'path': path, 'method': 'PATCH', 'body': JSON.stringify(bodyForGoogle)})
      .then((response) => {
        // Handle response
        console.log("success: ", response);
        this.updateMessaging({success: true, errors: false, message: "Successfully updated document data."})
      }, (reason) => {
        // Handle error
        console.log("error: ", reason);
        this.updateMessaging({success: false, errors: true, message: `An error occured: ${reason}`})
      });
    }

    async componentDidMount() {
        let scopes = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata";
        let auth2 = await loadAuth2(process.env.GATSBY_TINY_CMS_CLIENT_ID, scopes);
        let docId = this.state.id;

        // LOAD Google Drive API client libraries
        gapi.load('client', () => {
          let scopes = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata";

          // INITIALISE Google Drive API Client
          gapi.client.init({
            'apiKey': process.env.GATSBY_TINY_CMS_API_KEY,
            'clientId': process.env.GATSBY_TINY_CMS_CLIENT_ID,
            'scope': scopes,
          }).then(function() {
            console.log('client initialized')

            // BUILD path to document data endpoint for gapi requests
            let path = `/drive/v3/files/${docId}?fields=description,name`;

            // GET document metadata from Google Drive
            return gapi.client.request({
              'path': path,
              'method': 'GET'
            })
          }).then(response => {
            // PARSE description JSON for document metadata
            let docName = response.result.name;
            let doc = JSON.parse(response.result.description);
            // STORE doc metadata in react state
            this.updateDocData(doc);
            // STORE doc name at top-level react state
            // I'm doing this to avoid potentially storing it unnecessarily in the doc description
            this.updateDocName(docName);
          })
        });

        // MANAGE oauth2 session
        if (auth2.isSignedIn.get()) {
            this.updateUser(auth2.currentUser.get())
        } else {
            this.attachSignin(document.getElementById('customBtn'), auth2);
        }
    }
    async componentDidUpdate() {
      // TODO I'm not 100% sure on why or if this step is necessary
      if(!this.state.user) {
          let auth2 = await loadAuth2(process.env.GATSBY_TINY_CMS_CLIENT_ID, '')
          this.attachSignin(document.getElementById('customBtn'), auth2);
      }
    }

    // UPDATE state with document metadata
    updateDocData = (docData) => {
      this.setState({
        doc: docData
      })
    }

    // UPDATE state with document name/title
    updateDocName = (docName) => {
      this.setState({
        name: docName
      })
    }

    // UPDATE state with user-facing messaging
    updateMessaging = (params) => {
      this.setState({
        errors: params.errors,
        message: params.message,
        success: params.success,
      })
    }

    // UPDATE state with google oauth2 session user
    updateUser(currentUser) {
      let name = currentUser.getBasicProfile().getName()
      this.setState({
        user: {
            name: name,
        }
      })
    }

    attachSignin(element, auth2) {
      auth2.attachClickHandler(element, {},
          (googleUser) => {
              this.updateUser(googleUser);
          }, (error) => {
              console.log(JSON.stringify(error))
          });
    }

    // LOGOUT of google drive oauth2 session
    signOut = () => {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(() => {
            this.setState({ user: null })
            console.log('User signed out.');
        });
    }

    render() {
        if(this.state.doc) {
            return (
              <Layout>
                <h1 className="title is-1">tinycms metadata editor</h1>
                <h3 className="title is-4">{this.state.name}</h3>

                  {this.state.success &&
                  <div className="message is-success">
                      <div class="message-header">
                        Success
                      </div>
                      <div class="message-body">
                        {this.state.message}
                      </div>
                  </div>}
                  {this.state.errors &&
                  <div className="message is-danger">
                      <div class="message-header">
                        Error
                      </div>
                      <div class="message-body">
                        {this.state.message}
                      </div>
                  </div>}

                <section className="section">

                  <form onSubmit={this.handleSubmit}>
                    <div className="field">
                      <label className="label">Author</label>
                      <div className="control">
                        <input name="author" className="input" type="text" value={this.state.doc.author || ''} onChange={this.handleChangeAuthor} />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Tags</label>
                      <div className="control">
                        <input name="tags" className="input" type="text" value={this.state.doc.tags || ''} onChange={this.handleChangeTags} />
                      </div>
                    </div>
                    <div className="control">
                      <input className="button is-primary" type="submit" value="Save" />
                    </div>
                  </form>
                </section>

                <section className="section">
                  <div id="" className="button logout" onClick={this.signOut}>
                    Logout
                  </div>
                </section>
              </Layout>
            );
        } else {
            return (
              <Layout>
                <h1 className="title is-1">tinycms metadata editor</h1>
                <h3 className="subtitle">Please login and authorize Google Drive access to continue.</h3>

                <div className="container">
                  <div className="field">
                    <div id="customBtn" className="button login">
                        Login
                    </div>
                  </div>
                </div>
              </Layout>
            );
        }
    }
}

export default GoogleLogin;
