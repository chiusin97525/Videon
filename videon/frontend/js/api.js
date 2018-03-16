// jshint esversion: 6

var api = (function(){
    var module = {};

    /*
    User Object must contain at least the follow:
        _id : String 
        email : String
        isCreator: Boolean
    */
    module.register = function(email, username, password, callback) {
        // post ; {email: email, username:username, password:password}; something like /register
    };

    module.login = function(username, password, callback) {
        // post ; {username:username, password:password} ; something like /login
    };

    module.logout = function(callback) {
        // get ; nothing ; something like /logout/
    };

    module.getCreators = function(username, callback) {
        // get ; something like api/:username/creators
    };

    module.getSubscribers = function(username, callback) {
        // get ; something like api/:username/subscriptions
        // returns empty list if not a creator (?)
    };

    module.makeCreator = function(username, callback) {
        // post ; {username:username} ; something like api/creators/
    };

    module.addSubscriber = function(subscriber, creator, callback) {
        //
    };

    module.uploadVideo = function(username, video, callback) {
        // post ; {username:username}
    };

    module.getVideo = function(videoId, callback) {

    };

    module.getAllVideoObjects = function(username, callback) {

    };

    return module;
})();