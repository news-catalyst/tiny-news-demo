import React, { Component } from 'react';
import { gapi, loadAuth2 } from 'gapi-script'
import Layout from "../components/Layout"
import "../pages/styles.scss"

class GoogleLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
          doc: {
            author: '',
            name: '',
            tags: ['']
          },
          user: null
        }
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
      console.log(data.tags)
      data.tags = event.target.value;
      this.setState({doc: data});
    }

    handleSubmit(event) {
      event.preventDefault();
      console.log('A value was submitted: ', this.state.doc);

      let path = `/drive/v3/files/1sS_XoaLa10ejaM7Y9tHL5L2Z-LNyvs-TFfgIIgw-mDA?fields=description`;

      let bodyForGoogle = { 
        description: JSON.stringify(this.state.doc)
      }

      gapi.client.request({'path': path, 'method': 'PATCH', 'body': JSON.stringify(bodyForGoogle)})
      .then(function(response) {
        // Handle response
        console.log("success: ", response);
        // setErrors(false);
        // setSuccess(true);
        // setMessage("Successfully updated metadata.")
        // refreshForm();
      }, function(reason) {
        // Handle error
          console.log("error: ", reason);
          // setErrors(true);
          // setSuccess(false);
          // setMessage(reason);
      });
    }


    async componentDidMount() {
        let scopes = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata";
        let auth2 = await loadAuth2(process.env.GATSBY_TINY_CMS_CLIENT_ID, scopes);
        gapi.load('client', () => {
          let scopes = "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata";
          gapi.client.init({
            'apiKey': process.env.GATSBY_TINY_CMS_API_KEY,
            'clientId': process.env.GATSBY_TINY_CMS_CLIENT_ID,
            'scope': scopes,
          }).then(function() {
            console.log('client initialized')
            //TODO: 
            // * get `documentId` from pageContext
            // * merge this approach with an edit form
            // * add PATCH to update the data
            let path = `/drive/v3/files/1sS_XoaLa10ejaM7Y9tHL5L2Z-LNyvs-TFfgIIgw-mDA?fields=description`;
            // // 3. Initialize and make the API request.
            return gapi.client.request({
              'path': path,
              'method': 'GET'
            })
          }).then(response => {
            let doc = JSON.parse(response.result.description)
            this.updateDocData(doc);
          })
        });
        if (auth2.isSignedIn.get()) {
          console.log("updating user from auth2.isSignedIn.get")
            this.updateUser(auth2.currentUser.get())
        } else {
            this.attachSignin(document.getElementById('customBtn'), auth2);
        }
    }
    async componentDidUpdate() {
        if(!this.state.user) {
            let auth2 = await loadAuth2(process.env.GATSBY_TINY_CMS_CLIENT_ID, '')
            this.attachSignin(document.getElementById('customBtn'), auth2);
        }
    }

    updateDoc(doc) {
        this.setState({
          doc: {
            name: doc.author,
          }
        })
    }
    updateDocData = (docData) => {
      console.log(docData)
      this.setState({
        doc: docData
      })
    }
    updateUser(currentUser) {
        let name = currentUser.getBasicProfile().getName()
        this.setState({
          doc: {
            name: "testing",
          },
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
                <h3 className="title is-4">{this.state.doc.name}</h3>

                <div className="container">
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
                  <section className="section">
                    <div id="" className="button logout" onClick={this.signOut}>
                      Logout
                    </div>
                  </section>
                </div>
              </Layout>
            );
        } else {
            return (
                <div className="container">
                  <div className="field">
                    <div id="customBtn" className="button login">
                        Login
                    </div>

                  </div>
                </div>
            );
        }
    }
}

export default GoogleLogin;
