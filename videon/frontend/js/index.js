/*jshint esversion: 6 */ 

(function(){
    "use strict";

    window.addEventListener('load', function(){
        if (api.getCurrentUser() == "") {
            location.href = "/login.html";
        } else {
            console.log("Welcome " + api.getCurrentUser());
        }
    });
}());
