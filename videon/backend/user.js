// jshint esversion: 6
module.exports = (function(){
    "use strict";
    const crypto = require('crypto');
    const collectionName = "users";
    var user = {};

    function generateHash (password, salt){
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('base64');;
    }

    user.signUp = function(res, username, password, database, callback){
        // get the collection
        var collection = database.collection(collectionName);
        collection.findOne({_id: username}, function(err, userObj){
            if (err) {
                callback;
                return res.status(500).end(err);
            }
            if (userObj){
                callback
                return res.status(409).end("username " + username + " already exists\n");
            }
            // generate a hash, and salt the hash with the password
            var salt = crypto.randomBytes(16).toString('base64');
            var saltedHash = generateHash(password, salt);
            // add the user in
            collection.update({_id: username},{_id: username, saltedHash: saltedHash, salt: salt}, {upsert: true}, function(err){
                if (err) return res.status(500).end(err);
                callback;
                return res.json("user " + username + " signed up");
            });
        });
    }


    return user;
})();
