/*jshint esversion: 6 */

// require npm modules
const multer  = require('multer');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
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
var database;
var select_database = function(){
    if(process.env.NODE_ENV === "production"){
        // mlab mongodb server
        uri = "mongodb://admin:adminkernel@ds213239.mlab.com:13239/videon";
        dbName = "videon";
    }else{
        // Altas mongodb server for testing
        uri = "mongodb+srv://admin:adminkernel@videon0-rs9ub.mongodb.net/test";
        dbName = "test";
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


// SIGN IN/OUT/UP
app.post('/signup/', function (req, res, next) {
    if (!('username' in req.body)) return res.status(400).end('username is missing');
    if (!('password' in req.body)) return res.status(400).end('password is missing');
    var username = req.body.username;
    var password = req.body.password;
    MongoClient.connect(uri, function(err, client) {
        if (err){
            console.log(err);
            return res.status(500).end(err);
        }else{
            console.log("DB connection success");
            const database = client.db(dbName);
            user.signUp(res, username, password, database, function(){
                // close the client connection to the database
                client.close();
            });
          }
    });
});

// CREATE
// READ
// UPDATE
// DELETE
