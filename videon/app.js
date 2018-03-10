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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('frontend'));
var upload = multer({ dest: path.join(__dirname, 'uploads') });


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



// using a free mongodb host with 500mb for testing
var uri = "mongodb://user:user@videon-shard-00-00-cs9ho.mongodb.net:27017,videon-shard-00-01-cs9ho.mongodb.net:27017,videon-shard-00-02-cs9ho.mongodb.net:27017/test?ssl=true&replicaSet=videon-shard-0&authSource=admin";
MongoClient.connect(uri, function(err, db) {
	if (err) console.log(err);
	//db.collection('test', {strict:true}, function(err, collection) {});
	console.log(db);
	console.log("success");
  	db.close();
});

// CREATE
// READ
// UPDATE
// DELETE


// HTTP for development
const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
