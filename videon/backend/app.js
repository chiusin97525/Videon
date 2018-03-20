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
const cloudinary = require('cloudinary');

const app = express();

// require custom modules
const user = require('./user');
const video = require('./video');

// custom messages
const ERRMSG_BAD_USERNAME = "Bad username input";
const ERRMSG_BAD_EMAIL = "Not a valid email address";


// server settings
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// multer setting, storing buffer in memory
const storage = multer.memoryStorage();
const upload = multer({storage});

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

// force https when it is in production environment
var force_https = function(){
    if(process.env.NODE_ENV === "production"){
        app.use(forceSsl);
        session.cookie.secure = true;
    }
}
force_https();

// frontend files
app.use(express.static('frontend'));

// database server connection setting
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

// storage server connection setting
var select_storage_server = function(){
    if(process.env.NODE_ENV === "production"){
        cloudinary.config({ 
          cloud_name: 'hlp3qspme', 
          api_key: '561236676358831', 
          api_secret: 'VQga8h18map_-dvJMeiBbnHsj8s' 
        });
    }else{
        cloudinary.config({ 
          cloud_name: 'videonstorageserver', 
          api_key: '897296893562352', 
          api_secret: 'YuGk3JnctgsDobyJOCSM5Ws7SVY' 
        });
    }
}
select_storage_server();

//----------------------------------------------------------------------------------
var checkUsername = function(req, res, next) {
    if (!validator.isAlphanumeric(req.body.username)) return res.status(400).end(ERRMSG_BAD_USERNAME);
    req.body.username = validator.escape(req.body.username);
    next();
};

var checkEmail = function(req, res, next){
     if (!validator.isEmail(req.body.email)) return res.status(400).end(ERRMSG_BAD_EMAIL);
     next();
}

var isAuthenticated = function(req, res, next) {
    //console.log("IS:" + req.session.username);
    if (!req.session.username) return res.status(401).end("access denied");
    next();
};

var escapeInput = function(input){
    return validator.escape(input);
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
            var data = {username: escape(req.params.username)};
            user.getCreators(req, res, data, database, function(){
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
            var data = {username: escape(req.params.username)};
            user.getSubscriber(req, res, data, database, function(){
                // close the client connection to the database
                client.close();
            });
          }
    });
    
});

// UPLOAD
// curl -b cookie.txt -X POST -F "title=extella" -F "file=@extella_loop.mp4" -F "description=Loop" http://192.168.1.107:5000/api/admin/uploads/
app.post('/api/:username/uploads/', isAuthenticated, upload.single("file"), function(req, res, next){
    if (!('title' in req.body)) return res.status(400).end('title is missing');
    if (!('description' in req.body)) return res.status(400).end('description is missing');
    var username = req.session.username;
    var title = escapeInput(req.body.title);
    var description = escapeInput(req.body.description);
    MongoClient.connect(uri, function(err, client) {
        if (err) return res.status(500).end(err);        
        console.log("DB connection success");
        const database = client.db(dbName);
        user.getUser(username, database, function(err, userObj){
            if (err) {
                client.close();
                return res.status(500).end(err);
            }
            // check if the user exists and is the user a creator
            if (!userObj) {
                client.close(); 
                return res.status(404).end("user "+ username + " not found");
            }
            if (!userObj.isCreator){
                client.close(); 
                return res.status(403).end("user "+ username + " is not a creator");
            }
            stream = cloudinary.v2.uploader.upload_stream({resource_type: 'raw'}, function(err, result) {
                if (err) return res.status(500).end(err);
                videoContent = {poster: username, title: title, description: description};
                video.addVideo(res, req, result, videoContent, database, function(){
                     // close the client connection to the database
                    client.close();
                });
            });
            // upload the video
            stream.end(req.file.buffer);
        });

    });
});

// GET
app.get('/api/:videoId/', isAuthenticated, function(req, res, next){
    MongoClient.connect(uri, function(err, client){
        if (err) return res.status(500).end(err);        
        console.log("DB connection success");
        const database = client.db(dbName);
        video.getVideo(res, req, escapeInput(req.params.videoId), database, function(){
            // close the client connection to the database
            client.close();
        });
    });
});


// get all the videos object given an creator's username
app.get('/api/:creator/videos/', isAuthenticated, function(req, res, next){
    var creator = escapeInput(req.params.creator);
    MongoClient.connect(uri, function(err, client){
        if (err) return res.status(500).end(err);        
        console.log("DB connection success");
        const database = client.db(dbName);
        if(creator === req.session.username || user.isSubscribed({creator: creator, subscriber:req.session.username})){
            video.getAllVideosFromCreator(res, req, creator, database, function(){
                // close the client connection to the database
                client.close();
            });
        }else{
            return res.status(403).end("not a subscriber of creator: " + creator);
        }
    });
});

// UPDATE

// add a subscriber
// curl -X POST -b cookie.txt http://192.168.1.107:5000/api/admin/addSub/asdf/
app.post('/api/:creator/addSub/:subscriber/', isAuthenticated, function(req, res, next){
    var creator = req.session.username;
    var subscriber = escape(req.params.subscriber);
    if(creator !== escape(req.params.creator)) return res.status(403).end("username mismatched");
    var data = {creator: creator, subscriber: subscriber};
    MongoClient.connect(uri, function(err, client){
        if (err) return res.status(500).end(err); 
        const database = client.db(dbName);
        user.addSubscriber(req, res, data, database, function(){
            client.close();
        });
    });
}); 

// DELETE
