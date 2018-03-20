// jshint esversion: 6
var api = (function(){

    function send(method, url, data, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "] " + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        if (!data) xhr.send();
        else{
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }


    function sendFiles(method, url, data, callback){
        var formdata = new FormData();
        Object.keys(data).forEach(function(key){
            var value = data[key];
            formdata.append(key, value);
        });
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else {
                var res = JSON.parse(xhr.responseText);
                callback(null, res);
            }
        };
        xhr.open(method, url, true);
        xhr.send(formdata);
    }


    var module = {};

    /*
    User Object must contain at least the follow:
        _id : String 
        email : String
        isCreator: Boolean
    */

    module.getCurrentUser = function(){
        var l = document.cookie.split("username=");
        if (l.length > 1) return l[1];
        return null;
    }


    module.register = function(email, username, password, callback) {
        // post ; {email: email, username:username, password:password}; something like /register
        send("POST", '/register/', {email:email, username:username, password:password}, callback);
    };

    module.login = function(username, password, callback) {
        // post ; {username:username, password:password} ; something like /login
        send("POST", '/login/', {username:username, password:password}, callback);
    };

    module.logout = function(callback) {
        // get ; nothing ; something like /logout/
        send("GET", '/logout/', null, callback);
    };

    module.getCreators = function(username, callback) {
        // get ; something like api/:username/creators
        send("GET", '/api/' + username + '/creators/', null, callback);
    };

    module.getAllCreators = function(callback) {
        // get ; something like api/creators
        send("GET", '/api/creators', null, callback);
    };

    module.getSubscribers = function(username, callback) {
        // get ; something like api/:username/subscriptions
        // returns empty list if not a creator (?)
        send("GET", '/api/' + username + '/creators/', null, callback);
    };

    module.makeCreator = function(username, callback) {
        // post ; {username:username} ; something like api/creators/
        send("POST", '/api/creators/', {username:username}, callback);
    };

    module.addSubscriber = function(subscriber, creator, callback) {
        // change url to a better one later
        send("POST", '/api/', {subscriber: subscriber, creator:creator}, callback);
    };

    module.uploadVideo = function(username, title, description, video, callback) {
        // post ; 
        sendFiles("POST", '/api/' + username + '/uploads/', {title:title, description:description, file:video}, callback);
    };

    module.getVideo = function(videoId, callback) {

    };

    module.getAllVideoObjects = function(username, callback) {
        send("GET", '/api/' + username + '/videos/', null, callback);
    };

    return module;
})();