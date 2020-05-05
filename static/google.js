var API_KEY="AIzaSyBLulKfQNbojPBr99QFNSR8nxkSdbxvcS8";
var CLIENT_ID="302576859813-jsrroc5r1uu4gteoolh4r6gam60ae1v3.apps.googleusercontent.com"

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
  console.log("handleClientLoad")
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    var authorizeButton = document.getElementById('authorize_button');
    var signoutButton = document.getElementById('signout_button');

    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    console.log(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  var authorizeButton = document.getElementById('authorize_button');
  var signoutButton = document.getElementById('signout_button');

  console.log(authorizeButton);
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listFiles();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print files.
 */
function listFiles() {
  var folderId = '1C8uaxFKTLlKZ3tLQ6uWk8aiCZzj3iZqW';
  gapi.client.drive.files.list({
    'q': `mimeType='application/vnd.google-apps.document' and '${folderId}' in parents and trashed = false`,
    'pageSize': 10,
    'fields': "nextPageToken, files(id, name, description, createdTime)"
  }).then(function(response) {
    var containerDiv = document.getElementById('container')

    var filesDiv = document.createElement('div');
    var files = response.result.files;
    if (files && files.length > 0) {
      var listEl = document.createElement('ul');
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log(file);

        var fileItemEl = document.createElement('li');
        var fileLinkEl = document.createElement('a');
        fileLinkEl.href = '/cms/edit/' + file.id;
        fileLinkEl.innerText = file.name;
        fileItemEl.appendChild(fileLinkEl);
        listEl.appendChild(fileItemEl);
      }
      filesDiv.appendChild(listEl)

    } else {
      var fileP = document.createElement('p');
      fileP.innerHTML = 'No files found.';
      filesDiv.appendChild(fileP);
    }
    containerDiv.appendChild(filesDiv);
  });
}


// function start() {
//   // Initializes the client with the API key and the Translate API.
//   //https://www.googleapis.com/drive/v3/files/fileID
//   gapi.client.init({
//     'apiKey': 'AIzaSyBLulKfQNbojPBr99QFNSR8nxkSdbxvcS8',
//   }).then(function() {
//     // Executes an API request, and returns a Promise.
//     // The method name `language.translations.list` comes from the API discovery.

//     var path = `/drive/v3/files/1sS_XoaLa10ejaM7Y9tHL5L2Z-LNyvs-TFfgIIgw-mDA`
//     var jsonBody = `{
//       "author": "Ace Reporter",
//       "category": "Coronavirus",
//       "tags": [
//         "pandemic",
//         "USA"
//       ]
//     }`
//     return gapi.client.request({'path': path, 'method': 'PATCH', 'body': JSON.stringify(jsonBody)})
//     // .then(function(response) {
//     //   // Handle response
//     //   console.log("success: ", response);
//     // }, function(reason) {
//     //   // Handle error
//     //   console.log("error: ", reason);
//     // });

//   }).then(function(response) {
//     console.log(response);
//   }, function(reason) {
//     console.log('Error: ', reason);
//   });
// };

// // Loads the JavaScript client library and invokes `start` afterwards.
// gapi.load('client', start);
