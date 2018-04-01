<template>
    <div>
        <div v-if="user.isCreator">
            <h1>My Page</h1>
            <router-link :to="{name: 'Upload', params: {creator: user.username}}">
                <button class="btn content-button">Upload Video</button>
            </router-link>
            <div id="error"></div>
            <div id="page-container">
                <div id="video-container"></div>
                <h1>Videos</h1>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <td>Video Title</td>
                            <td>Date</td>
                        </tr>
                    </thead>
                <tbody v-if="videoObjs.length == 0" is="transition-group" name="fade">
                    <tr>
                        <td><div class="table-value">None</div></td>
                        <td><div class="table-value">None</div></td>
                    </tr>
                </tbody>
                <tbody v-else is="transition-group" name="fade">
                        <tr class="videos table-row" v-for="video in videoObjs" :key="video.url">
                            <td><div class="table-value">{{ video.title }}</div></td>
                            <td><div class="table-value">{{ convertDate(video.uploadDate) }}</div></td>
                            <td><button class="btn content-button" v-on:click="loadVideo(video)">Play</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-else>
            <h1>You are currently not a Creator, click below to pay the Creator fees !</h1>
            <button class="btn content-button" v-on:click="pay">Make Creator ($25.00)</button>
        </div>
  </div>
</template>
<script>

import api from '@/services/api'

export default {
    data() {
        return {
            user: {username: '', isCreator: null},
            videoObjs: []
        }
    },
    mounted: function() {
        this.getCurrentUser();
    },
    methods: {
        pay: function() {
            let self = this;
            api().get('/api/payment/makeCreator/')
            .then(response => {
                window.location.href = response.data;
            })
            .catch(function(e) {
                if (e.response) console.error(e.response.data);
            })
        },
        getCurrentUser: function() {
            let self = this;
            api().get('/currentUser')
            .then(response => {
                self.user = response.data;
                self.getAllVideos();
            })
            .catch(function(e) {
                if (e.response) console.error(e.response.data);
            })
        },
        getAllVideos: function() {
            api().get('/api/' + this.user.username + '/videos')
            .then(response => {
                this.videoObjs = response.data.reverse();
            })
            .catch(function(e) {
                if (e.response) {
                    document.getElementById("error").innerHTML =`
                    ${e.response.data}
                    <router-link><button class="btn content-button">Subscribe</div>
                    `;
                    document.getElementById("page-container").classList.add("hidden");
                }
            })
        },
        convertDate: function(initialDate) {
            var currentDate = new Date();
            var fromDate = new Date(initialDate);
            if (fromDate.getDate() === currentDate.getDate() && 
                fromDate.getMonth() === currentDate.getMonth() && 
                fromDate.getFullYear() === currentDate.getFullYear()) return "Today";
            currentDate = fromDate.toDateString();
            return currentDate.slice(currentDate.indexOf(' '), currentDate.length);
        },
        loadVideo: function(videoObj) {
            console.log(videoObj);
            var video = document.createElement('div');
            document.getElementById("video-container").innerHTML = `
                <video width=1024 height=576 class="video-js vjs-default-skin video" controls>
                <source
                    src="${videoObj.url}"
                    type="video/mp4">
                </video>
                <div id="about_video"> 
                    <div id="current_title">${videoObj.title}</div>
                    <div id="current_upDate">${this.convertDate(videoObj.uploadDate)}</div>
                    <br>
                    <div id="current_desc">${videoObj.description}</div>
                </div>
            `;
        }
    }
}
</script>


<style lang="css">


</style>
