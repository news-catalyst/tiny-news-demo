import React, {Component} from 'react';
let GoogleLib;
export default class TinyGoogleLogin extends Component {
    constructor () {
        super();
        this.state = { isSignedIn: false, showLoginButton: false, showLogoutButton: false, name: null, accessToken: null };
    }
    componentDidMount() {
        GoogleLib = require('react-google-login');
        this.setState({ showLoginButton: true, showLogoutButton: false });
    }

    // responseGoogleSuccess = (response) => {
    //   this.setState({ isSignedIn: true, showLoginButton: false, showLogoutButton: true, name: response.profileObj.name, accessToken: response.accessToken })
    //   console.log("responseGoogleSuccess: ", response);
    // }

    responseGoogle = (response) => {
      console.log("responseGoogle: ", response);
    }

    logout = (response) => {
      this.setState({ isSignedIn: false, showLoginButton: true, showLogoutButton: false, name: null, accessToken: null })
      console.log("logout: ", response);
    }

    render() {
        return (
          <div>
            <h1 className="title">testing google login</h1>
            {this.state.name ?
            <h1 className="subtitle">You are logged in as: {this.state.name}</h1>
            : null}
            {this.state.showLoginButton ?
                <GoogleLib.GoogleLogin
                    clientId={process.env.GATSBY_TINY_CMS_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={this.props.successCb}
                    onFailure={this.responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                    scope="https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.metadata"
                /> : null
            }
            {this.state.showLogoutButton ?
              <GoogleLib.GoogleLogout
                clientId={process.env.GATSBY_TINY_CMS_CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={this.logout}
              />
              : null
            }
          </div>
        );
    }
}
