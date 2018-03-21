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

// database server connection setting
var uri;
var dbName;
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

// session store
var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore({
        uri: uri,
        databaseName: 'connect_mongodb_session',
        collection: 'sessions'
    });

// database
var database;
MongoClient.connect(uri, function(err, client) {
    if (err) return console.log(err);
    console.log("Ddatabase connection success");
    database = client.db(dbName);
});


// server settings
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'blackbird flies',
    store: store,
    resave: false,
    saveUninitialized: true,
    maxAge: 60 * 60 * 24 * 7,
    cookie: {httpOnly: true, sameSite: true}
}));

// passport settings
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(username, done) {
    done(null, JSON.stringify(username));
});

passport.deserializeUser(function(username, done) {
    done(null, JSON.parse(username));
});

// multer setting, storing buffer in memory
const storage = multer.memoryStorage();
const upload = multer({storage});

// app.use(function(req, res, next){
//     if(req.user) next();
//     else res.redirect('/login.html');
// });

app.use(function(req, res, next){
    if(!req.user) req.user = {username:""};
    var username = req.user.username;
    res.setHeader('Set-Cookie', cookie.serialize('username', username, {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7, // 1 week in number of seconds
          sameSite: true,
          secure: process.env.USE_SECURE_FLAG
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


// third party authentication settings
//const TwitterStrategy = require('passport-twitter').Strategy;
const LocalStrategy = require('passport-local').Strategy;

// passport.use(new TwitterStrategy({
//         consumerKey: process.env.TWITTER_CONSUMER_KEY,
//         consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//         callbackURL: process.env.TWITTER_CALLBACK_URL
//     }, function(token, tokenSecret, profile, callback){
        
//     }
// ));

passport.use(new LocalStrategy(
        function(username, password, done){
            user.login({username: username, password: password}, database, function(err, userObj, msg){
                if(err) return done(err);
                if(msg) return done(null, false, {message: msg});
                return done(null, userObj);
            });
        }
    ));


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
    if (!req.isAuthenticated()) return res.status(401).end("access denied");
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
    user.register(userInfo, database, function(err, userObj, info){
        if (err) return res.status(500).end(err);
        if (!userObj) return res.status(info.status).end(info.msg);
        return res.json("user " + userObj.username + " signed up");
    });
});

// curl -X POST -d "username=admin&password=admin" -c cookie.txt http://192.168.1.107:5000/login/
app.post('/login/',checkUsername, function (req, res, next) {
    if (!('username' in req.body)) return res.status(400).end('username is missing');
    if (!('password' in req.body)) return res.status(400).end('password is missing');
    // authenticate the user
    passport.authenticate('local', function(err, userObj, info){
        if(err) return res.status(500).end(err);
        if(!userObj) return res.status(403).end(info.message);
        req.logIn(userObj, function(err){
            if(err) return res.status(500).end(err);
            res.setHeader('Set-Cookie', cookie.serialize('username', userObj.username, {
              path : '/', 
              maxAge: 60 * 60 * 24 * 7,
              sameSite: true,
              secure: process.env.USE_SECURE_FLAG
            }));
            return res.json("user " + userObj.username + " signed in");
        });
    })(req, res, next);
});

// curl -b cookie.txt -c cookie.txt http://192.168.1.107:5000/logout/
app.get('/logout/', function(req, res, next){
    req.session.destroy();
    req.logout();
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7,
          sameSite: true,
          secure: process.env.USE_SECURE_FLAG
    }));
    return res.redirect("/");
});

// third party authentications


// GET

// curl -b cookie.txt http://192.168.1.107:5000/api/sin/creators/
app.get('/api/:username/creators/', isAuthenticated, function(req, res, next){
    var data = {username: escape(req.params.username)};
    user.getCreators(data, database, function(err, creatorLst, info){
        if (err) return res.status(500).end(err);
        //if (!creators) return res.status(info.status).end(info.msg);
        return res.json(creatorLst);
    });
});

// curl -b cookie.txt http://192.168.1.107:5000/api/admin/subscriptions/
app.get('/api/:username/subscriptions/', isAuthenticated, function(req, res, next){
    var data = {username: escape(req.params.username)};
    user.getSubscribers(data, database, function(err, subLst, info){
        if(err) return res.status(500).end(err);
        //if(!subLst) return res.status(info.status).end(info.msg);
        return res.json(subLst);
    });
    
});

// UPLOAD
// curl -b cookie.txt -X POST -F "title=extella" -F "file=@extella_loop.mp4" -F "description=Loop" http://192.168.1.107:5000/api/admin/uploads/
app.post('/api/:username/uploads/', isAuthenticated, upload.single("file"), function(req, res, next){
    if (!('title' in req.body)) return res.status(400).end('title is missing');
    if (!('description' in req.body)) return res.status(400).end('description is missing');
    var username = req.user.username;
    if(username !== req.params.username) return res.status(403).end('username mismatched'); 
    var title = escapeInput(req.body.title);
    var description = escapeInput(req.body.description);
    user.getUser(username, database, function(err, userObj){
        if (err) return res.status(500).end(err);
        // check if the user exists and is the user a creator
        if (!userObj) return res.status(404).end("user "+ username + " not found");
        if (!userObj.isCreator) return res.status(403).end("user "+ username + " is not a creator");
        stream = cloudinary.v2.uploader.upload_stream({resource_type: 'raw'}, function(err, result) {
            if (err) return res.status(500).end(err);
            videoContent = {poster: username, title: title, description: description};
            video.addVideo(res, req, result, videoContent, database, function(){});
        });
        // upload the video
        stream.end(req.file.buffer);
    });
});

// GET
app.get('/api/:videoId/', isAuthenticated, function(req, res, next){
    video.getVideo(res, req, escapeInput(req.params.videoId), database, function(){});
});


// get all the videos object given an creator's username
// curl -b cookie.txt http://192.168.1.107:5000/api/admin/videos/
app.get('/api/:creator/videos/', isAuthenticated, function(req, res, next){
    var creator = escapeInput(req.params.creator);
    if(creator === req.user.username){
        video.getAllVideosFromCreator(res, req, creator, database, function(){});
    }else{
        user.isSubscribed({creator: creator, subscriber:req.user.username}, database, function(subscribed){
            if (subscribed) return video.getAllVideosFromCreator(res, req, creator, database, function(){});
            return res.status(403).end("not a subscriber of creator: " + creator);
        });
    }
});


//

// add a subscriber
// curl -X POST -b cookie.txt http://192.168.1.107:5000/api/admin/addSub/asdf/
app.post('/api/:creator/addSub/:subscriber/', isAuthenticated, function(req, res, next){
    var creator = req.user.username;
    var subscriber = escape(req.params.subscriber);
    if(creator !== escape(req.params.creator)) return res.status(403).end("username mismatched");
    var data = {creator: creator, subscriber: subscriber};
    user.addSubscriber(data, database, function(err, userObj, info){
        if(err) return res.status(500).end(err);
        if(!userObj) return res.status(info.status).end(info.msg);
        return res.json("user " + userObj.username + " added as subscriber");
    });
}); 

// DELETE
