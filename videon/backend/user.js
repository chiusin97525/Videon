// jshint esversion: 6
module.exports = (function(){
    "use strict";
    const crypto = require('crypto');
    const collectionName = "users";
    var user = {};

    const ERRMSG_ACCESS_DENIED = "access denied";


    function generateHash (password, salt){
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('base64');;
    }

    function response(res, statusCode, ending, callback){
        callback;
        return res.status(statusCode).end(ending);
    }

//------------------------------------------------------------------------------------

    user.register = function(res, req, userInfo, database, callback){
        var username = userInfo.username;
        var password = userInfo.password;
        var email = userInfo.email;
        // get the collection
        var collection = database.collection(collectionName);
        collection.findOne({_id: username}, function(err, userObj){
            // error checking
            if (err) return response(res, 500, err, callback);
            if (userObj) return response(res, 409, "username " + username + " already exists\n", callback);
            
            // generate a hash, and salt the hash with the password
            var salt = crypto.randomBytes(16).toString('base64');
            var saltedHash = generateHash(password, salt);
            // add the user to database
            collection.update({_id: username},{_id: username, saltedHash: saltedHash, salt: salt, email: email}, {upsert: true}, function(err){
                if (err) return response(res, 500, err, callback);
                callback;
                return res.json("user " + username + " signed up");
            });
        });
    }


    user.login = function(res, req, userInfo, database, callback){
        var username = userInfo.username;
        var password = userInfo.password;
        // get the collection
        var collection = database.collection(collectionName);
        collection.findOne({_id: username}, function(err, userObj){
            if(err) return response(res, 500, err, callback);
            if(!userObj) return response(res, 401, "user " + username + " not found", callback);
            if (userObj.saltedHash !== generateHash(password, userObj.salt)) return response(res, 401, ERRMSG_ACCESS_DENIED, callback);
            req.session.username = user._id;
            return res.redirect("/");
        });
    }




    return user;
})();
