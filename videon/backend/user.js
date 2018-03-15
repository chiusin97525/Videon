// jshint esversion: 6
module.exports = (function(){
    "use strict";
    var user = {};

    user.signIn = function(username, password, db){
        console.log(username, password);
        console.log(db);
        return null;
    }


    return user;
})();
