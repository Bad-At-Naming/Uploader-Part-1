/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console


const API_KEY = 'AIzaSyDDPteJBk2EpMwln1boGOoprfO7X2_rsi4';
const CLIENT_ID = '579246448609-v2c24avhet7h0ng6c421bo2962jdjpb4.apps.googleusercontent.com';
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const KEYS = ["Time","Event","Location","X","XI","FY","SY","Frere","Napier","Papworth","Streeton","Academics","Sports","Society Events", "Misc"]
var TIMETABLE = {
  "Monday": [],
  "Tuesday": [],
  "Wednesday": [],
  "Thursday": [],
  "Friday": [],
  "Saturday": [],
  "Sunday": []
}

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', intializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function intializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
throw (resp);
    }
    await listMajors();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
}

/**
 *  Sign out the user upon button click.
 */

/**
 * Print the names and majors of students in a sample spreadsheet:
 * 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * 1ltEaV9K1f6b4ovGJ-Eon0tmtElYvwqMI70-vcxTblaY/edit
 */


async function listMajors() {
  for (var day in DAYS) {
let response;
try {
  // Fetch first 10 files
  response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1ltEaV9K1f6b4ovGJ-Eon0tmtElYvwqMI70-vcxTblaY', 
    range: `${DAYS[day]}!A3:O`,
  });
} catch (err) {
  document.getElementById('content').innerText = err.message;
  return;
}
const range = response.result.values
for (row in range) {
    var neo = [range[row][0], range[row][1], range[row][2]]
    neo.push([])
    for (var i = 3; i < 15; i++) {
  if (range[row][i] == "TRUE") {
neo[3].push(KEYS[i])
  }
} 
TIMETABLE[DAYS[day]].push(neo)
}

  }
TIMETABLE = JSON.stringify(TIMETABLE)
  const token = gapi.client.getToken();

  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
  }

// Octokit.js
// https://github.com/octokit/core.js#readme

console.log(TIMETABLE) 

// Need to take this object, and give it to part 2, b
// But to add this code, I need to add the import and this becomes a module
// And so the onload functions and onclick functions just stop working
// Even with fixes like window.function = function 
// or adding the listeners in a separate module after exporting from here
// They just don't come as defined and I don't know why
// If they are called sequentially from the command line it works perfectly fine tho
// so I just ened to get this to call those three functions,
// even when this is a module, but how?????

/* Sort of hacky solution where it takes you to the github page, downloads the json and you need to upload it

var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(TIMETABLE);
var dlAnchorElem = document.getElementById('downloadAnchorElem');
dlAnchorElem.setAttribute("href",     dataStr     );
dlAnchorElem.setAttribute("download", "timetable.json");
dlAnchorElem.click();
var dlAnchorElem = document.getElementById('linker');
dlAnchorElem.click();

*/ 



}
