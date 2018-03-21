/*jshint esversion: 6 */ 

(function(){
    "use strict";

    function insertUser (user) {
        var new_creator = document.createElement('div');
        new_creator.className = "user";
        new_creator.innerHTML = `
            <img src="media/default.jpg" class="profile_picture" alt="profile_picture">
            <div class="sidenav_text">${user}</div>
        `;

        new_creator.addEventListener('click', function(e) {
            loadCreatorPage(user);
        });

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
            <button id="upload_button" class="btn btnEffect">Upload</button>
            <button id="my_page_button" class="btn btnEffect">My Page</button>
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
                        <input type="submit" id="submit_video" class="btn btnEffect" value="Upload"/>
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
            loadCreatorPage(api.getCurrentUser());
        });
    }

    function loadCreatorPage(creator) {
        var content = document.getElementById("content");
        content.innerHTML = "";
        api.getAllVideoObjects(creator, function(err, videoObjs) {
            if (err) console.error(err);
            else {
                content.innerHTML = `
                    <div id="video_container"></div>
                    <div id="videos_list"></div>    
                `;
                videoObjs.forEach(insertVideoToContent);
            }
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
                <div id="${videoObj._id}" class="play_button"></div>
                <img src="media/temp.jpg" class="thumbnail" alt="test">
            </div>
            <div class="video_title">${videoObj.title}</div>
        `;
        list.appendChild(container);
        // add event listener for clicking on the play button
        document.getElementById(videoObj._id).addEventListener("click", function(e){
            var video_container = document.getElementById("video_container");
            video_container.innerHTML = `
            <video width=1280 height=720 class="video-js vjs-default-skin video" controls>
                <source
                    src="${videoObj.url}"
                    type="video/mp4">
            </video>
            <div id="about_video"> 
                <div id="current_title">${videoObj.title}</div>
                <div id="current_upDate">${convertDate(videoObj.uploadDate)}</div>
                <br>
                <div id="current_desc">${videoObj.description}</div>
            </div>
            `;
        });
    }

    function insertCreatorToContent (username, userCreatorList) {
        var creator = document.createElement('div');
        creator.class = "creator";
        creator.innerHTML = `
            <div class="creator">
                <div class="creator_name">${username}</div>
                <button class="visit_page btn btnEffect">Visit Page</button>
                <button id="${username}" class="subscribe btn btnEffect">Subscribe</button>
            </div>
        `;
        document.getElementById("content").appendChild(creator);
        if (userCreatorList.indexOf(username) != -1) {
            var button = document.getElementById(username);
            console.log(button);
            button.innerHTML = "Subscribed! ✓";
            button.disabled = true;
            button.style.color = "#00FF0E";
            button.classList.remove("btnEffect");
        }
        // -------------------------------TODO------------------------------- 
        // need to add event listeners for visit page and subscribe buttons
        /*document.getElementById(username).addEventListener("click", function(e){
            var current_user = api.getCurrentUser();
            api.addSubscriber(username, current_user, function(err) {
                if (err) console.error(err);
                else {
                    e.target.innerHTML = "Subscribed! ✓";
                    e.target.disabled = true;
                    e.target.style.color = "#00FF0E";
                    e.target.classList.remove("btnEffect");
                    refreshSubscriptions(current_user);
                }
            });
        });*/
    }

    function loadCreators() {
        api.getAllCreators(function(err, allCreators) {
            if (err) console.error(err);
            else {
                api.getCreators(api.getCurrentUser(), function(err, creatorList) {
                    if (err) console.error(err);
                    else {
                        var user = api.getCurrentUser();
                        var contentPage = document.getElementById("content");
                        contentPage.innerHTML = "";
                        //allCreators.forEach(insertCreatorToContent);
                        for (var i in allCreators) {
                            insertCreatorToContent(allCreators[i], creatorList);
                        }
                    }
                });
            }
        });
    }

    function convertDate(initialDate) {
        var currentDate = new Date();
        var fromDate = new Date(initialDate);
        if (fromDate.getDate() === currentDate.getDate() && 
            fromDate.getMonth() === currentDate.getMonth() && 
            fromDate.getFullYear() === currentDate.getFullYear()) return "Today";
        currentDate = fromDate.toDateString();
        return currentDate.slice(currentDate.indexOf(' '), currentDate.length);
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
