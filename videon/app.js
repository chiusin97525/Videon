/*jshint esversion: 6 */

// require and
const multer  = require('multer');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cookie = require('cookie');
const session = require('express-session');
var forceSsl = require('force-ssl-heroku');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// server settings
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// force https when it is in production environment
var force_https = function(){
    if(process.env.NODE_ENV === "production"){
        app.use(forceSsl);
    }
}

force_https();

app.use(express.static('frontend'));



// connection to mLab mongodb host
var uri = "mongodb://ds213239.mlab.com:13239/videon"

MongoClient.connect(uri, {user: "admin", pass: "admin@"}, function(err, db) {
	if (err) console.log(err);
    else{
    	//db.collection('test', {strict:true}, function(err, collection) {});
    	//console.log(db);
    	console.log("DB connection success");
      	db.close();
      }
});

// CREATE
// READ
// UPDATE
// DELETE
