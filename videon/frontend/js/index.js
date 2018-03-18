/*jshint esversion: 6 */ 

(function(){
    "use strict";

    function insertUser (curr_user) {
        var new_creator = document.createElement('div');
        new_creator.class = "user";
        /*var avatar = document.createElement('img');
        avatar.src ="media/default.jpg";
        avatar.class="profile_picture";
        avatar.alt = "profile_picture";
        var username = document.createElement('div');
        username.class = "sidenav_text";
        username.innerHTML = `${curr_user}`;*/
        new_creator.innerHTML = `
            <div class="user">
                <img src="media/default.jpg" class="profile_picture" alt="profile_picture">
                <div class="sidenav_text">${curr_user}</div>
            </div>
        `;
        document.getElementById("subscriptions").appendChild(new_creator);
    }

    function refreshUser(username) {
        var current_user = document.getElementById("logged_in_container");
        current_user.innerHTML = "";
        current_user.innerHTML = `
            <div class="user">
                <img src="media/default.jpg" class="profile_picture" alt="profile_picture">
                <div class="sidenav_text">${username}</div>
            </div>
        `;
    }

    function refreshSubscriptions(user) {
        api.getCreators(user, function(err, creatorsList){
            if (err) console.error(err);
            else {
                console.log(creatorsList);
                var subscriptions = document.getElementById("subscriptions");
                subscriptions.innerHTML = "";
                creatorsList.forEach(insertUser);
            }
        });
    }

    window.addEventListener('load', function(){
        var user = api.getCurrentUser();
        if (user == "") {
            location.href = "/login.html";
        } else {
            console.log(user);
            refreshUser(user);
            refreshSubscriptions(user);
        }

        document.getElementById("logout_button").addEventListener("click", function(e) {
            api.logout(function(err){
                if (err) console.error(err);
                else location.href = "/login.html";
            });
        });
    });
}());
