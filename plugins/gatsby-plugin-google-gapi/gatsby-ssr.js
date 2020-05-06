"use strict;"

import React from "react"

export const onRenderBody = (
  { setHeadComponents, setPostBodyComponents },
  { apiKey, clientId, discoveryURLs, scopes }
) => {
  setHeadComponents(
    <script
      key="plugin-google-gapi"
      dangerouslySetInnerHTML={{
        __html: `
          var __plugin_google_gapi_initialized = new Proxy(
            {},
            {
              get: (obj, prop) => {
                return obj.hasOwnProperty(prop) ? obj[prop] : false
              }
            }
          )
        `,
      }}
    />
  )

  setPostBodyComponents(
    <>
      <script
        key="plugin-google-gapi"
        dangerouslySetInnerHTML={{
          __html: `
            function __plugin_google_gapi_init() {
              function handleAuthClick(event) {
                console.log("auth clicked, signing in...");
                gapi.auth2.getAuthInstance().signIn();
              }
              function updateSigninStatus(isSignedIn) {
                var authorizeButton = document.getElementById('authorize_button');
                var signoutButton = document.getElementById('signout_button');

                if (isSignedIn) {
                  authorizeButton.style.display = 'none';
                  signoutButton.style.display = 'block';
                  console.log("you are signed in, phew");
                } else {
                  authorizeButton.style.display = 'block';
                  signoutButton.style.display = 'none';
                }
              }
              function __plugin_google_gapi_auth_initClient() {
                let discoveryURLs = [
                  '${discoveryURLs.join(",\n                ")}'
                ]

                let requestedScopes = [
                  'openid',
                  'profile',
                  'email',
                  'https://www.googleapis.com/auth/drive',
                  'https://www.googleapis.com/auth/drive.appdata',
                  'https://www.googleapis.com/auth/drive.file',
                  'https://www.googleapis.com/auth/drive.scripts',
                  'https://www.googleapis.com/auth/drive.metadata',
                ]

                console.debug("Initializing CUSTOM GAPI client...")
                gapi.client.init({
                  apiKey: '${apiKey}',
                  discoveryDocs: discoveryURLs,
                  clientId: '${clientId}',
                  scope: requestedScopes.join(' '),
                }).then(() => {
                  console.log('Client initialized...')
                  __plugin_google_gapi_initialized.client = true
                  __plugin_google_gapi_initialized.auth2 = true
                  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                  let signedInStatus = gapi.auth2.getAuthInstance().isSignedIn.get();
                  console.log("signed in status: ", signedInStatus);
                  updateSigninStatus(signedInStatus);
                  var authorizeButton = document.getElementById('authorize_button');
                  authorizeButton.onclick = handleAuthClick;
                }).catch((error) => {
                  console.log(error)
                })
              }

              console.debug("Initializing CUSTOM GAPI lib...")
              gapi.load('auth2:client', {
                callback: __plugin_google_gapi_auth_initClient,
                onerror: () => {console.error("gapi.load failed")},
              })
              __plugin_google_gapi_init = undefined
            }
          `,
        }}
      />
      <script
        key="plugin-google-gapi"
        src="https://apis.google.com/js/api.js?onload=__plugin_google_gapi_init"
        async
        defer
      />
    </>
  )
}
