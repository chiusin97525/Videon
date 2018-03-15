/*jshint esversion: 6 */

// require npm modules
const multer  = require('multer');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cookie = require('cookie');
const session = require('express-session');
const forceSsl = require('force-ssl-heroku');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// require custom modules
const user = require('./user')


// server settings
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// frontend files
app.use(express.static('frontend'));


var uri;
var dbUsername = "admin";
var dbPassword = "admin@";
var select_database = function(){
    if(process.env.NODE_ENV === "production"){
        // mlab mongodb server
        uri = "mongodb://ds213239.mlab.com:13239/videon";
    }else{
        // Altas mongodb server for testing
        uri = "mongodb+srv://videon0-rs9ub.mongodb.net/test";
    }
}
select_database();

// force https when it is in production environment
var force_https = function(){
    if(process.env.NODE_ENV === "production"){
        app.use(forceSsl);
    }
}
force_https();


// connection to mLab mongodb host


MongoClient.connect(uri, {user: dbUsername, pass: dbPassword}, function(err, db) {
	if (err) console.log(err);
    else{
    	console.log("DB connection success");
        user.signIn("sin", "pass", db);
      	db.close();
      }
});

// CREATE
// READ
// UPDATE
// DELETE
