<template>
    <div>
        <div id="error">
            <div v-if="err.length > 0"> 
                <div>{{ err }}</div> 
                <button class="btn content-button" v-on:click="subscribe">Subscribe($3.00)</button>
            </div>
        </div>
        <div id="page-container">
            <h1><span id="user">{{ creator }}</span></h1>
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
                        <td><button class="btn content-button" v-on:click="loadVideo(video)">▶</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script>
import api from '@/services/api'

export default {
    data () {
        return {
            videoObjs:[],
            creator: '',
            err: ''
        }
    },
    created: function() {
        this.creator = this.$route.params.creator;
        this.getAllVideos();
    },
    methods: {
        getAllVideos: function(event) {
            let self = this;
            api().get('/api/' + this.$route.params.creator + '/videos')
            .then(response => {
                self.videoObjs = response.data.reverse();
            })
            .catch(function(e) {
                if (e.response) {
                    self.err = e.response.data;
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
            var video = document.createElement('div');
            document.getElementById("video-container").innerHTML = `
                <video width=1024 height=576 class="video-js vjs-default-skin video" controls autoplay>
                <source
                    src="${videoObj.url}"
                </video>
                <div id="about_video"> 
                    <div id="current_title">${videoObj.title}</div>
                    <div id="current_upDate">${this.convertDate(videoObj.uploadDate)}</div>
                    <br>
                    <div id="current_desc">${videoObj.description}</div>
                </div>
            `;
        },
        subscribe: function() {
            api().get('/api/payment/subscribe/' + this.creator)
            .then(response => {
                window.location.href = response.data;
            })
            .catch(function(e) {
                if (e.response) console.error(e.response.data);
            })
        }
    }
}
</script>


<style lang="css">

</style>

