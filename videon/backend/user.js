// jshint esversion: 6
module.exports = (function(){
    "use strict";
    const crypto = require('crypto');
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

//------------------------------------------------------------------------------------

    user.register = function(data, database, callback){
        var username = data.username;
        var password = data.password;
        var email = data.email;
        // get the collection
        var collection = database.collection(collectionUsers);
        collection.findOne({_id: username}, function(err, userObj){
            // error checking
            if (err) return callback(err, null, null);
            if (userObj) return callback(null, null, {status:409, msg: "username " + username + " already exists\n"});
            // generate a hash, and salt the hash with the password
            var salt = crypto.randomBytes(16).toString('base64');
            var saltedHash = generateHash(password, salt);
            // add the user to database
            collection.update({_id: username},{_id: username, saltedHash: saltedHash, salt: salt, email: email, isCreator: false}, {upsert: true}, function(err, result){
                if (err) return callback(err, null, null);
                result.username = username;
                return callback(null, result, null);
            });
        });
    }

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

    // returns an user object on success
    user.getUser = function(username, database, callback){
        var collection = database.collection(collectionUsers);
        collection.findOne({_id: username}, callback);
    }


    user.getAllCreators = function(req, res, database, callback) {
        var collection = database.collection(collectionUsers);
        collection.find({isCreator: true}).toArray(function(err, creators) {
            if (err) return callback(err, null, null);
            var creatorsLst = [];
            creators.forEach(function(entry){
                creatorsLst.push(entry._id);
            });
            return callback(null, creatorsLst, null);
        });
    }

    user.getCreators = function(data, database, callback){
        var collection = database.collection(collectionSubs);
        collection.find({subscriber: data.username}, {fields:{creator:1, _id: 0}}).toArray(function(err, creators){
            if(err) return callback(err, null, null);
            var creatorsLst = [];
            creators.forEach(function(entry){
                creatorsLst.push(entry.creator);
            });
            return callback(null, creatorsLst, null);
        });
    }

    user.getSubscribers = function(data, database, callback){
        var collection = database.collection(collectionSubs);
        collection.find({creator: data.username}, {fields:{subscriber:1, _id: 0}}).toArray(function(err, subscribers){
            if(err) return callback(err, null, null);
            var subscribersLst = [];
            subscribers.forEach(function(entry){
                subscribersLst.push(entry.subscriber);
            });
            return callback(null, subscribersLst, null);
        });
    }

    // manually add a user as subscriber without having the user to pay
    user.addSubscriber = function(data, database, callback){
        var subCollection = database.collection(collectionSubs);
        var userCollection = database.collection(collectionUsers);
        var subscriber = data.subscriber;
        var creator = data.creator;
        // check if there is such subscription already
        subCollection.findOne({_id: subscriber+"-"+creator}, function(err, subObj){
            if(err) return callback(err, null, null);
            // if the user is already subscribed
            if(subObj) return callback(null, null, {status:400, msg: "user " + subscriber + " already subscribed"})
            // check if creator exists
            userCollection.findOne({_id: creator}, function(err, creatorObj){
                if(err) return callback(err, null, null);
                // if no such user
                if(!creatorObj) return callback(null, null, {status: 400, msg:"user " + creator + " not found"});
                // if the user is not a creator
                if(!creatorObj.isCreator) return callback(null, null, {status:403, msg:"Not a creator"});
                userCollection.findOne({_id: subscriber}, function(err, userObj){
                    if(err) return callback(err, null, null);
                    if(!userObj) return callback(null, null, {status:404, msg:"user " + subscriber + " not found"});
                    var id = subscriber + "-" + creator;
                    subCollection.insert({_id: id, subscriber: subscriber, creator: creator}, function(err){
                        if(err) callback(err, null, null);
                        return callback(null, {username: subscriber}, null);
                    });
                });
            });
        });
    }

    user.isSubscribed = function(data, database, callback){
        var subscriber = data.subscriber;
        var creator = data.creator;
        var subCollection = database.collection(collectionSubs);
        subCollection.findOne({subscriber: subscriber, creator:creator}, function(err, result){
            if(!result) return callback(false);
            return callback(true);
        });
    }

    user.makeCreator = function(data, database, callback){
        var username = data.username;
        console.log(username);
        if (!username) return callback("no user", null, null);
        var userCollection = database.collection(collectionUsers);
        userCollection.update({_id:username}, {"$set":{isCreator: true}}, function(err, result){
            if(err) return callback(err, null, null);
            return callback(null, null, null);
        });

    }

    


    return user;
})();
