import React, { Component } from 'react';
import { gapi, loadAuth2 } from 'gapi-script' 
import queryString from 'query-string';
import Layout from "../components/Layout"
import "../pages/styles.scss"

class GoogleLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
          id: '',
          doc: { },
          newField: '',
          message: '',
          name: '',
          errors: false,
          docLoaded: false,
          success: false,
          user: null
        }

        console.log("tinycms starting state: ", this.state);
        this.handleChangeDoc = this.handleChangeDoc.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeDoc(event) {
      let data = this.state.doc;
      for (const key in data) {
        if (key === event.target.name) {
          data[key] = event.target.value;
        }
      }
      console.log("new data: ", data)
      this.setState({doc: data});
    }

    handleSubmit(event) {
      event.preventDefault();

      let path = `/drive/v3/files/${this.state.id}?fields=description`;

      let docData = this.state.doc;

      if (typeof(docData.tags) === "string") {
        docData.tags = docData.tags.split(',')
      }
      let bodyForGoogle = { 
        description: JSON.stringify(docData)
      }

      // UPDATE document metadata in gapi via PATCH request, stores data in doc description field
      gapi.client.request({'path': path, 'method': 'PATCH', 'body': JSON.stringify(bodyForGoogle)})
      .then((response) => {
        // Handle response
        console.log("success: ", response);
        this.updateMessaging({success: true, errors: false, message: "Successfully updated document data. The site is now republishing..."})
        fetch('https://api.netlify.com/build_hooks/5eaf81776d3a2da2a6e11fac', {
          method: 'post'
        }).then(function(response) {
          return response;
        }).then(function(data) {
          console.log(data);
        });
      }, (reason) => {
        // Handle error
        console.log("error: ", reason);
        this.updateMessaging({success: false, errors: true, message: `An error occured: ${reason}`})
      });
    }

    async componentDidMount() {

        let location = window.location;
        const parsed = queryString.parse(location.search);
        console.log("updating state with document id: ", parsed.id)
        this.updateDocId(parsed.id);

        let scopes = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata";
        let auth2 = await loadAuth2(process.env.GATSBY_TINY_CMS_CLIENT_ID, scopes);
        let docId = this.state.id;

        this.loadGoogleDoc(docId)

        // MANAGE oauth2 session
        if (auth2.isSignedIn.get()) {
            this.updateUser(auth2.currentUser.get())
        } else {
            this.attachSignin(document.getElementById('customBtn'), auth2);
        }

    }
    async componentDidUpdate() {
      console.log("componentDidUpdate")
      // TODO I'm not 100% sure on why or if this step is necessary
      if(!this.state.user) {
          let auth2 = await loadAuth2(process.env.GATSBY_TINY_CMS_CLIENT_ID, '')
          this.attachSignin(document.getElementById('customBtn'), auth2);
      }
    }

    // UPDATE state with document metadata
    updateDocData = (docData) => {
      console.log("tinycms updated doc data: ", docData);
      this.setState({
        doc: docData
      })
    }

    // UPDATE state with document id
    updateDocId = (docId) => {
      this.setState({
        id: docId
      })
    }

    // UPDATE state with document loaded status
    updateDocLoaded = (docLoaded) => {
      this.setState({
        docLoaded: docLoaded
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

    loadGoogleDoc(docId) {
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
            this.updateDocLoaded(true);
          })
        });
    }
    // UPDATE state with google oauth2 session user
    updateUser(currentUser) {
      let name = currentUser.getBasicProfile().getName()
      console.log("updateUser")
      this.setState({
        user: {
            name: name,
        }
      })
    }

    attachSignin(element, auth2) {
      console.log("attachSignin")
      auth2.attachClickHandler(element, {},
          (googleUser) => {
              console.log("attachSignin attached click handler for googleUser", googleUser)
              this.updateUser(googleUser);
              this.loadGoogleDoc(this.state.id);
          }, (error) => {
              console.log(JSON.stringify(error))
          });
    }

    handleFieldNameChange = idx => evt => {
      const newFields = this.state.fields.map((field, fidx) => {
        if (idx !== fidx) return field;
        return { ...field, name: evt.target.value };
      });
  
      this.setState({ fields: newFields });
    };

    handleNewFieldChange = evt => {
      console.log("handleNewFieldChange")
      this.setState({ newField: evt.target.value });
    };

    addFieldToForm = () => {
      let docData = this.state.doc;
      let field = this.state.newField;
      console.log(field);
      docData[field] = "";
      console.log(docData);
      this.updateDocData(docData);
      this.setState({newField: ''})
    }

    handleRemoveField = idx => () => {
      this.setState({
        fields: this.state.fields.filter((f, fidx) => idx !== fidx)
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
        if(this.state.user) {
          let formFields = [];
          if (this.state.docLoaded) {
            for (const key in this.state.doc) {
              formFields.push(
              <div key={`field-${key}`} className="field">
                <label className="label">{key}</label>
                <div className="control">
                  <input name={key} className="input" type="text" value={this.state.doc[key] || ''} onChange={this.handleChangeDoc} />
                </div>
              </div>
              )
            }
          }
            return (
              <div>
                <nav className="navbar" role="navigation" aria-label="main navigation">
                  <div className="navbar-brand">
                    <a className="navbar-item" href="/tinycms">
                      tinycms
                    </a>

                    <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                    </a>
                  </div>

                  <div className="navbar-menu">
                    <div className="navbar-start">
                      <a className="navbar-item" href="/tinycms">
                        Articles
                      </a>

                    </div>

                    <div className="navbar-end">
                      <div className="navbar-item">
                        <div className="buttons">
                          {this.state.user && 
                            <a id="" className="button logout" onClick={this.signOut}>
                              Log out
                            </a>
                          }
                          {!this.state.user && 
                            <a id="customBtn" className="button is-light">
                              Log in
                            </a>
                          }   
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>

              <Layout>
                  <h1 className="title is-1">metadata editor</h1>
                  <h3 className="title is-4">{this.state.name}</h3>

                  {this.state.success &&
                  <div className="message is-success">
                      <div className="message-header">
                        Success
                      </div>
                      <div className="message-body">
                        {this.state.message}
                      </div>
                  </div>}
                  {this.state.errors &&
                  <div className="message is-danger">
                      <div className="message-header">
                        Error
                      </div>
                      <div className="message-body">
                        {this.state.message}
                      </div>
                  </div>}

                { this.state.docLoaded && 
                  <section className="section">

                    <form onSubmit={this.handleSubmit}>
                      {formFields}

                      <div className="field has-addons">
                        <div className="control">
                          <input className="input" type="text" placeholder="field name" value={this.state.newField} onChange={this.handleNewFieldChange} />
                        </div>
                        <div className="control">
                          <a className="button is-info" onClick={this.addFieldToForm}>
                            Add
                          </a>
                        </div>
                      </div>

                      <div className="control">
                        <input className="button is-primary" type="submit" value="Save" />
                      </div>
                    </form>
                  </section>
                }
              </Layout>
            </div>
          );
        } else {
            return (
              <div>

                <nav className="navbar" role="navigation" aria-label="main navigation">
                  <div className="navbar-brand">
                    <a className="navbar-item" href="/tinycms">
                      tinycms
                    </a>

                    <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                      <span aria-hidden="true"></span>
                    </a>
                  </div>

                  <div className="navbar-menu">
                    <div className="navbar-start">
                      <a className="navbar-item" href="/tinycms">
                        Articles
                      </a>

                    </div>

                    <div className="navbar-end">
                      <div className="navbar-item">
                        <div className="buttons">
                          {this.state.user && 
                            <a id="" className="button logout" onClick={this.signOut}>
                              Log out
                            </a>
                          }
                          {!this.state.user && 
                            <a id="customBtn" className="button is-light">
                              Log in
                            </a>
                          }   
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>

              <Layout>
                <h1 className="title is-1">tinycms metadata editor</h1>
                <h3 className="subtitle">Please login and authorize Google Drive access to continue.</h3>

              </Layout>
              </div>
            );
        }
    }
}

export default GoogleLogin;
