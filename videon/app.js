/*jshint esversion: 6 */

// require and
const fs = require('fs');
const multer  = require('multer');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cookie = require('cookie');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// server settings
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static('frontend'));
//var upload = multer({ dest: path.join(__dirname, 'uploads') });


/* ignore this
const stitch = require("mongodb-stitch")
const clientPromise = stitch.StitchClientFactory.create('videon-qqrdj');
clientPromise.then(client => {
  const db = client.service('mongodb', 'mongodb-atlas').db('Videon');
  client.login().then(() =>
    db.collection('videos').updateOne({owner_id: client.authedId()}, {$set:{number:42}}, {upsert:true})
  ).then(() =>
    db.collection('videos').find({owner_id: client.authedId()}).limit(100).execute()
  ).then(docs => {
    console.log("Found docs", docs)
    console.log("[MongoDB Stitch] Connected to Stitch")
  }).catch(err => {
    console.error(err)
  });
});
*/


// connection to mLab mongodb host with 500mb
var uri = "mongodb://ds213239.mlab.com:13239/videon"

MongoClient.connect(uri, {user: "admin", pass: "admin@"}, function(err, db) {
	if (err) console.log(err);
    else{
    	//db.collection('test', {strict:true}, function(err, collection) {});
    	console.log(db);
    	console.log("success");
      	db.close();
      }
});

// CREATE
// READ
// UPDATE
// DELETE
