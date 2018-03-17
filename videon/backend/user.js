// jshint esversion: 6
module.exports = (function(){
    "use strict";
    const crypto = require('crypto');
    const session = require('express-session');
    const collectionUsers = "users";
    const collectionSubs = "subscriptions";
    var user = {};

    const ERRMSG_ACCESS_DENIED = "access denied";


    function generateHash (password, salt){
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('base64');
    }

    function response(res, statusCode, ending, callback){
        callback();
        return res.status(statusCode).end(ending);
    }

//------------------------------------------------------------------------------------

    user.register = function(req, res, userInfo, database, callback){
        var username = userInfo.username;
        var password = userInfo.password;
        var email = userInfo.email;
        // get the collection
        var collection = database.collection(collectionUsers);
        collection.findOne({_id: username}, function(err, userObj){
            // error checking
            if (err) return response(res, 500, err, callback);
            if (userObj) return response(res, 409, "username " + username + " already exists\n", callback);
            
            // generate a hash, and salt the hash with the password
            var salt = crypto.randomBytes(16).toString('base64');
            var saltedHash = generateHash(password, salt);
            // add the user to database
            collection.update({_id: username},{_id: username, saltedHash: saltedHash, salt: salt, email: email, isCreator: false}, {upsert: true}, function(err){
                if (err) return response(res, 500, err, callback);
                callback();
                return res.json("user " + username + " signed up");
            });
        });
    }

    user.login = function(req, res, userInfo, database, callback){
        var username = userInfo.username;
        var password = userInfo.password;
        // get the collection
        var collection = database.collection(collectionUsers);
        collection.findOne({_id: username}, function(err, userObj){
            if(err) return response(res, 500, err, callback);
            if(!userObj) return response(res, 401, "user " + username + " not found", callback);
            if (userObj.saltedHash !== generateHash(password, userObj.salt)) return response(res, 401, ERRMSG_ACCESS_DENIED, callback);
            // start a session
            req.session.username = userObj._id;
            callback();
            //return res.redirect("/");
            return res.json("user " + username + " signed in");
        });
    }

    user.logout = function(req, res, cookie){
        req.session.destroy();
        res.setHeader('Set-Cookie', cookie.serialize('username', '', {
              path : '/', 
              maxAge: 60 * 60 * 24 * 7 
        }));
        return res.redirect("/");
    }

    user.getCreators = function(req, res, username, database, callback){
        var collection = database.collection(collectionSubs);
        collection.find({subscriber: username}, {fields:{creator:1, _id: 0}}).toArray(function(err, creators){
            if(err) return response(res, 500, err, callback);
            var creatorsLst = [];
            console.log(creators);
            creators.forEach(function(entry){
                creatorsLst.push(entry.creator);
            });
            callback();
            return res.json(creatorsLst);
        });
    }

    user.getSubscriber = function(req, res, username, database, callback){
        var collection = database.collection(collectionSubs);
        collection.find({creator: username}, {fields:{subscriber:1, _id: 0}}).toArray(function(err, subscribers){
            if(err) return response(res, 500, err, callback);
            var subscribersLst = [];
            console.log(subscribers);
            subscribers.forEach(function(entry){
                subscribersLst.push(entry.subscriber);
            });
            callback();
            return res.json(subscribersLst);
        });
    }

    user.addSubscriber = function(){
        
    }


    return user;
})();
