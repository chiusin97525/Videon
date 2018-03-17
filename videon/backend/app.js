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
const validator = require('validator');
const app = express();

// require custom modules
const user = require('./user')

// custom messages
const ERRMSG_BAD_USERNAME = "Bad username input";
const ERRMSG_BAD_EMAIL = "Not a valid email address";


// server settings


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(session({
    secret: 'blackbird flies',
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, sameSite: true}
}));


app.use(function(req, res, next){
    //console.log(req.session.username);
    var username = (req.session.username)? req.session.username : '';
    res.setHeader('Set-Cookie', cookie.serialize('username', username, {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    next();
});

// frontend files
app.use(express.static('../frontend'));


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
        session.cookie.secure = true;
    }
}
force_https();

//----------------------------------------------------------------------------------
var checkUsername = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.username)) return res.status(400).end(ERRMSG_BAD_USERNAME);
    next();
};

var checkEmail = function(req, res, next){
     if (!validator.isEmail(req.body.email)) return res.status(400).end(ERRMSG_BAD_EMAIL);
     next();
}

var isAuthenticated = function(req, res, next) {
    console.log("IS:" + req.session.username);
    if (!req.session.username) return res.status(401).end("access denied");
    next();
};
//----------------------------------------------------------------------------------

// SIGN IN/OUT/UP

// curl -X POST -d "username=admin&password=admin&email=abc@gmail.com" http://192.168.1.107:5000/register/
app.post('/register/',checkUsername, checkEmail, function (req, res, next) {
    if (!('username' in req.body)) return res.status(400).end('username is missing');
    if (!('password' in req.body)) return res.status(400).end('password is missing');
    if (!('email' in req.body)) return res.status(400).end('email is missing');
    var userInfo = {username: req.body.username, password: req.body.password, email: req.body.email};
    MongoClient.connect(uri, function(err, client) {
        if (err){
            console.log(err);
            return res.status(500).end(err);
        }else{
            console.log("DB connection success");
            const database = client.db(dbName);
            user.register(req, res, userInfo, database, function(){
                // close the client connection to the database
                client.close();
            });
          }
    });
});

// curl -X POST -d "username=admin&password=admin" -c cookie.txt http://192.168.1.107:5000/login/

app.post('/login/',checkUsername, function (req, res, next) {
    if (!('username' in req.body)) return res.status(400).end('username is missing');
    if (!('password' in req.body)) return res.status(400).end('password is missing');
    var userInfo = {username: req.body.username, password: req.body.password};
    MongoClient.connect(uri, function(err, client) {
        if (err){
            console.log(err);
            return res.status(500).end(err);
        }else{
            console.log("DB connection success");
            const database = client.db(dbName);
            user.login(req, res, userInfo, database, function(){
                console.log(req.session.username);
                // close the client connection to the database
                client.close();
            });
          }
    });
});

// curl -b cookie.txt -c cookie.txt http://192.168.1.107:5000/logout/
app.get('/logout/', function(req, res, next){
    user.logout(req, res, cookie);
});

// GET

// curl -b cookie.txt http://192.168.1.107:5000/api/sin/creators/
app.get('/api/:username/creators/', isAuthenticated, function(req, res, next){
    MongoClient.connect(uri, function(err, client) {
        if (err){
            console.log(err);
            return res.status(500).end(err);
        }else{
            console.log("DB connection success");
            const database = client.db(dbName);
            user.getCreators(req, res, req.params.username, database, function(){
                // close the client connection to the database
                client.close();
            });
          }
    });
    
});

// curl -b cookie.txt http://192.168.1.107:5000/api/admin/subscriptions/
app.get('/api/:username/subscriptions/', isAuthenticated, function(req, res, next){
    MongoClient.connect(uri, function(err, client) {
        if (err){
            console.log(err);
            return res.status(500).end(err);
        }else{
            console.log("DB connection success");
            const database = client.db(dbName);
            user.getSubscriber(req, res, req.params.username, database, function(){
                // close the client connection to the database
                client.close();
            });
          }
    });
    
});

// READ
// UPDATE
// DELETE
