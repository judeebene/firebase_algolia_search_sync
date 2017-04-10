'use strict';

const functions = require('firebase-functions');

const admin = require('firebase-admin');



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// initialiase the admin
admin.initializeApp(functions.config().firebase);


// Authenticate to Algolia Database.
// TODO: Make sure you configure the `algolia.app_id` and `algolia.api_key` Google Cloud environment variables.
const algoliasearch = require('algoliasearch');
const client = algoliasearch(functions.config().algolia.app_id, functions.config().algolia.api_key);


// Name for the algolia indexes for all categories in Nammi.
const ALGOLIA_PLUMBERS_INDEX_NAME = 'plumbers';

// Updates the search index when new blog entries are created or updated.

exports.indexentry = functions.database.ref('/plumbers/').onWrite(event => {
	//set the index, remember index is like table in algolia

  const index = client.initIndex(ALGOLIA_PLUMBERS_INDEX_NAME);
 
var firebaseObject = event.data.val();
  // Specify Algolia's objectID using the Firebase object key
  firebaseObject.objectID = event.data.key;
  return index.saveObject(firebaseObject).then(
      () => event.data.adminRef.parent.child('last_updated').set(
          Date.parse(event.timestamp)));
});
