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
            <button id="upload_button" class="btn">Upload</button>
            <button id="my_page_button" class="btn">My Page</button>
        `;
        document.getElementById("upload_button").addEventListener("click", function(e) {
            // ---------TODO--------------
            // need an api function to get user object and check if they're creator in order to go to uploading page
            var content = document.getElementById("content");
            content.innerHTML = `
                <div id="upload_container" class="form_container">
                    <form id="upload_form" class method="post" enctype="multipart/form-data">
                        <div class="form_title">Upload</div>
                        <input type="text" id="video_title" class="form_element" name="title"/ placeholder="Video Title">
                        <input type="file" id="video_file" class="form_element" name="file"/>
                        <textarea id="video_description" class="form_element" rows=3 placeholder="Video Description"></textarea>
                        <input type="submit" id="submit_video" class="btn" value="Upload"/>
                    </form>    
                </div>
            `;

            document.getElementById("submit_video").addEventListener("click", function(e) {
                e.preventDefault();
                var title = document.getElementById("video_title").value;
                var file = document.getElementById("video_file").files[0];
                var description = document.getElementById("video_description").value;
                var username = api.getCurrentUser();
                api.uploadVideo(username, title, description, file, function(err) {
                    if (err) console.error(err);
                    else console.log("upload success");
                });
            });
        });

        document.getElementById("my_page_button").addEventListener("click", function(e) {
            var content = document.getElementById("content");
            content.innerHTML = "";
            api.getAllVideoObjects(api.getCurrentUser(), function(err, videoObjs) {
                if (err) console.error(err);
                else {
                    content.innerHTML = `
                        <div id="video_container"></div>
                        <div id="videos_list"></div>    
                    `;
                    //var videoObjs = [{title:"Hellodsaklnfkasdjfbnlkasjbflkasdjbfaskljdfbnlkjasdbflkbajbsdflkajsbdf"}, {title:"World!"}];
                    videoObjs.forEach(insertVideoToContent);
                }
            });
        });
    }

    function refreshSubscriptions(user) {
        api.getCreators(user, function(err, creatorsList){
            if (err) console.error(err);
            else {
                var subscriptions = document.getElementById("subscriptions");
                subscriptions.innerHTML = "";
                creatorsList.forEach(insertUser);
            }
        });
    }

    function insertVideoToContent (videoObj) {
        var list = document.getElementById("videos_list");
        var container = document.createElement('div');
        container.className = "select_video_container";
        container.innerHTML = `
            <div class="select_video">
                <div class="play_button"></div>
                <img src="media/temp.jpg" class="thumbnail" alt="test">
            </div>
            <div class="video_title">${videoObj.title}</div>
        `;


        list.appendChild(container);
        // add event listener for clicking on the play button
    }

    function insertCreatorToContent (username) {
        var creator = document.createElement('div');
        creator.class = "creator";
        creator.innerHTML = `
            <div class="creator">
                <div class="creator_name">${username}</div>
                <button class="visit_page btn">Visit Page</button>
                <button class="subscribe btn">Subscribe</button>
            </div>
        `;
        document.getElementById("content").appendChild(creator);
        // -------------------------------TODO------------------------------- 
        // need to add event listeners for visit page and subscribe buttons
        document.querySelector(".subscribe").addEventListener("click", function(e){
            var current_user = api.getCurrentUser();
            api.addSubscriber(current_user, username, function(err) {
                if (err) console.error(err);
                else {
                    e.srcElement.innerHTML = "Subscribed!";
                    e.srcElement.disabled = true;
                }
            });
        });
    }

    function loadCreators() {
        api.getAllCreators(function(err, allCreators) {
            if (err) console.error(err);
            else {

                var user = api.getCurrentUser();
                var contentPage = document.getElementById("content");
                contentPage.innerHTML = "";
                allCreators.forEach(insertCreatorToContent);

            }
        });
    }

    window.addEventListener('load', function(){
        var user = api.getCurrentUser();
        if (user == "" || !user) {
            location.href = "/login.html";
        } else {
            refreshUser(user);
            refreshSubscriptions(user);
            loadCreators();
        }

        document.getElementById("logout_button").addEventListener("click", function(e) {
            api.logout(function(err){
                if (err) console.error(err);
                else location.href = "/login.html";
            });
        });
    });
}());
