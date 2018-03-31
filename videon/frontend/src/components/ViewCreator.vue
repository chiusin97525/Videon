<template>
    <div>
        <div id="error"></div>
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

                <tbody is="transition-group" name="fade">
                    <tr class="videos table-row" v-for="video in videoObjs" :key="video.url">
                        <td><div class="table-value">{{ video.title }}</div></td>
                        <td><div class="table-value">{{ convertDate(video.uploadDate) }}</div></td>
                        <td><button class="btn content-button" v-on:click="loadVideo(video)">Play</button></td>
                        <!--td><router-link :to="{name: 'ViewCreator', params: { creator: creator }}" class="btn">Visit Page</router-link></td-->
                        <!--td><button class="btn btn-danger" v-on:click="deleteItem(item._id)">Delete</button></td-->
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
            creator: ''
        }
    },
    created: function() {
        this.creator = this.$route.params.creator;
        this.getAllVideos();
    },
    methods: {
        getAllVideos: function() {
            api().get('/api/' + this.$route.params.creator + '/videos')
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

