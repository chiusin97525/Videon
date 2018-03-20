// jshint esversion: 6
module.exports = (function(){
    "use strict";
    const crypto = require('crypto');
    const session = require('express-session');
    const collectionUsers = "users";
    const collectionSubs = "subscriptions";
    var user = {};

    const ERRMSG_ACCESS_DENIED = "access denied";
    const ERRMSG_USER_NOT_FOUND = "user not found";


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

    // user.login = function(req, res, userInfo, database, callback){
    //     var username = userInfo.username;
    //     var password = userInfo.password;
    //     // get the collection
    //     var collection = database.collection(collectionUsers);
    //     collection.findOne({_id: username}, function(err, userObj){
    //         if(err) return response(res, 500, err, callback);
    //         if(!userObj) return response(res, 401, "user " + username + " not found", callback);
    //         if (userObj.saltedHash !== generateHash(password, userObj.salt)) return response(res, 401, ERRMSG_ACCESS_DENIED, callback);
    //         // start a session
    //         req.session.username = userObj._id;
    //         callback();
    //         //return res.redirect("/");
    //         return res.json("user " + username + " signed in");
    //     });
    // }

    user.login = function(data, database, callback){
        var username = data.username;
        var password = data.password;
        // get the collection
        var collection = database.collection(collectionUsers);
        collection.findOne({_id: username}, function(err, userObj){
            if (err) return callback(err, userObj);
            if (!userObj || userObj.saltedHash !== generateHash(password, userObj.salt)){
                return callback(null, false, "incorrect username or password");
            }
            userObj.username = userObj._id;
            return callback(null, userObj, null);
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

    // returns an user object on success
    user.getUser = function(username, database, callback){
        var collection = database.collection(collectionUsers);
        collection.findOne({_id: username}, callback);
    }

    user.getCreators = function(req, res, data, database, callback){
        var collection = database.collection(collectionSubs);
        collection.find({subscriber: data.username}, {fields:{creator:1, _id: 0}}).toArray(function(err, creators){
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

    user.getSubscribers = function(req, res, data, database, callback){
        var collection = database.collection(collectionSubs);
        collection.find({creator: data.username}, {fields:{subscriber:1, _id: 0}}).toArray(function(err, subscribers){
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

    // manually add a user as subscriber without having the user to pay
    user.addSubscriber = function(req, res, data, database, callback){
        var subCollection = database.collection(collectionSubs);
        var userCollection = database.collection(collectionUsers);
        var subscriber = data.subscriber;
        var creator = data.creator;
        // check if there is such subscription already
        subCollection.findOne({_id: subscriber+"-"+creator}, function(err, subObj){
            if(err) return response(res, 500, err, callback);
            // if the user is already subscribed
            if(subObj) return response(res, 400, "user " + subscriber + " already subscribed", callback);
            // check if creator exists
            userCollection.findOne({_id: creator}, function(err, creatorObj){
                if(err) return response(res, 500, err, callback);
                // if no such user
                if(!creatorObj) return response(res, 404, "user " + creator + " not found", callback);
                // if the user is not a creator
                if(!creatorObj.isCreator) return response(res, 403, "Not a creator", callback);
                userCollection.findOne({_id: subscriber}, function(err, userObj){
                    if(err) return response(res, 500, err, callback);
                    if(!userObj) return response(res, 404, "user " + subscriber + " not found", callback);
                    var id = subscriber + "-" + creator;
                    subCollection.insert({_id: id, subscriber: subscriber, creator: creator}, function(err){
                        if(err) return response(res, 500, err, callback);
                        return res.json("user " + subscriber + " added as subscriber");
                    });
                });
            });
        });
    }

    user.isSubscribed = function(data, database){
        var subscriber = data.subscriber;
        var creator = data.creator;
        var subCollection = database.collection(collectionSubs);
        subCollection.findOne({_id: subscriber+"-"+creator}, function(err, result){
            if(!result) return false;
            return true;
        });
    }


    return user;
})();
