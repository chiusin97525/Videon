/*jshint esversion: 6 */ 

(function(){
    "use strict";
    var user = null;

    function insertUser (username) {
        var new_creator = document.createElement('div');
        new_creator.className = "user";
        new_creator.innerHTML = `
            <img src="media/default.jpg" class="profile_picture" alt="profile_picture">
            <div class="sidenav_text">${username}</div>
        `;

        new_creator.addEventListener('click', function(e) {
            loadCreatorPage(username);
        });

        document.getElementById("subscriptions").appendChild(new_creator);
    }

    function refreshUser(username) {
        var container = document.getElementById("logged_in_container");
        var current_user = document.createElement('div');
        current_user.className = "user";
        current_user.id = "current_user";
        current_user.innerHTML = `
            <img src="media/default.jpg" class="profile_picture" alt="profile_picture">
            <div class="sidenav_text">${username}</div>
        `;
        container.appendChild(current_user);
        container.innerHTML += `
            <button id="upload_button" class="hidden btn btnEffect">Upload</button>
        `;
        document.getElementById("upload_button").addEventListener("click", function(e) {
            var content = document.getElementById("content");
            content.innerHTML = `
                <div id="upload_container" class="form_container">
                    <form id="upload_form" class method="post" enctype="multipart/form-data">
                        <div class="form_title">Upload</div>
                        <input type="text" id="video_title" class="form_element" name="title"/ placeholder="Video Title">
                        <input type="file" id="video_file" class="form_element" name="file"/>
                        <textarea id="video_description" class="form_element" rows=3 placeholder="Video Description"></textarea>
                        <input type="submit" id="submit_video" class="btn btnEffect" value="Upload"/>
                        <div id="verify_upload"></div>
                    </form>    
                </div>
            `;

            document.getElementById("submit_video").addEventListener("click", function(e) {
                e.preventDefault();
                var title = document.getElementById("video_title").value;
                var file = document.getElementById("video_file").files[0];
                var description = document.getElementById("video_description").value;
                api.uploadVideo(user, title, description, file, function(err) {
                    if (err) console.error(err);
                    else document.getElementById("verify_upload").innerHTML = "Video may take a few seconds to appear on creator page.";
                });
            });
        });

        // goes to current user's page
        document.getElementById("current_user").addEventListener("click", function(e) {
            api.getAllCreators(function(err, creators) {
                if (err) console.error(err);
                else {
                    if (creators.indexOf(user) != -1)  loadCreatorPage(user);
                    else makeCreatorPage();
                }
            })
        });
    }

    function makeCreatorPage () {
        var content = document.getElementById("content");
        content.innerHTML = `
            <button id="makeCreator" class="btn btnEffect">Make Creator</button>
        `;
        document.getElementById("makeCreator").addEventListener("click", function(e) {
            /*api.makeCreator(user, function(err) {
                if (err) console.error(err);
                else location.href = "/";
            });*/
        });
    }

    function loadCreatorPage(creator) {
        var content = document.getElementById("content");
        content.innerHTML = "";
        api.getAllVideoObjects(creator, function(err, videoObjs) {
            if (err) console.error(err);
            else {
                content.innerHTML = `
                    <header id="creator_title">${creator}</header>
                `;
                if (creator === user) {
                    content.innerHTML += `
                        <div id="add_sub_container">
                            <form id="add_sub_form">
                                <div id="add_sub_title">Add Subscriber</div>
                                <input type="text" id="sub_name" name="subscribers_name" placeholder="Subscriber's Name">
                                <div id="verify"></div>
                                <button id="submit_sub" class="btn btnEffect">Add Subscriber</button>
                            </form>
                        </div>
                    `;
                }
                content.innerHTML += `
                    <div id="video_container"></div>
                    <header>Videos</header>
                    <div id="videos_list"></div>    
                `;
                videoObjs.forEach(insertVideoToContent);
                if (creator === user) {
                    document.getElementById("submit_sub").addEventListener("click", function(e) {
                        e.preventDefault();
                        var subName = document.getElementById("sub_name").value;
                        api.addSubscriber(user, subName, function(err) {
                            if (err) document.getElementById("verify").innerHTML = err;
                            else {
                                document.getElementById("add_sub_form").reset();
                                document.getElementById("verify").innerHTML = subName + " has been added!";
                            }
                        });
                    });
                }
            }
        });
    }

    function refreshSubscriptions(username) {
        api.getCreators(username, function(err, creatorsList){
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

    function insertCreatorToContent (creatorName, userCreatorList) {
        var creator = document.createElement('div');
        creator.class = "creator";
        creator.innerHTML = `
            <div class="creator">
                <div class="creator_name">${creatorName}</div>
                <button class="visit_page btn btnEffect">Visit Page</button>
                <button id=${creatorName} class="subscribe btn btnEffect">Subscribe</button>
            </div>
        `;
        document.getElementById("content").appendChild(creator);
        if (userCreatorList.indexOf(creatorName) != -1) {
            var button = document.getElementById(creatorName);
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

        creator.addEventListener("click", function(e) {
            loadCreatorPage(creatorName);
        });
    }

    function loadCreators() {
        api.getAllCreators(function(err, allCreators) {
            if (err) console.error(err);
            else {
                api.getCreators(user, function(err, creatorList) {
                    if (err) console.error(err);
                    else {
                        var contentPage = document.getElementById("content");
                        contentPage.innerHTML = "";
                        var header = document.createElement("header");
                        header.innerHTML = "Creators";
                        contentPage.appendChild(header);
                        // shuffle list of creators and return the first 10
                        allCreators = allCreators.filter(function(creator) {return creator !== user;});
                        shuffle(allCreators);
                        allCreators = allCreators.slice(0,10);
                        for (var i in allCreators) {
                            insertCreatorToContent(allCreators[i], creatorList);
                        }
                    }
                });
            }
        });
    }

    /*Function from --> https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array */
    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
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
        api.getCurrentUser(function(err, currUser) {
            if (!currUser) {
                location.href = "/login.html";
            } else {
                user = currUser;
                refreshUser(user);
                refreshSubscriptions(user);
                loadCreators();
                api.getAllCreators(function(err, creators) {
                    if (err) console.error(err);
                    else {
                        if (creators.indexOf(user) != -1) document.getElementById("upload_button").classList.remove("hidden");
                        else document.getElementById("upload_button").classList.add("hidden");
                    }
                });
            }
        });

        document.getElementById("videon").addEventListener("click", function(e) {
            location.href = "/";
        });

        document.getElementById("logout_button").addEventListener("click", function(e) {
            api.logout(function(err){
                if (err) console.error(err);
                else {
                    user = null;
                    location.href = "/login.html";
                }
            });
        });
    });
}());
