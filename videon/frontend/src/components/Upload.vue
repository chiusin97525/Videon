<template>
    <div>
        <div class="upload-wrapper border border-light">
            <form id="upload-form" class="form-upload" method="post" enctype="multipart/form-data" @submit.prevent="upload">
                <div class="form-upload-heading">Upload</div>
                <input type="text" id="video-title" class="form-control" name="title" placeholder="Video Title"/>
                <input type="file" id="video-file" class="form-control" name="file"/>
                <textarea id="video-description" class="form-control" rows=3 placeholder="Video Description"></textarea>
                <input type="submit" id="submit-video" class="btn content-button" value="Upload"/>
                <div id="verify_upload"></div>
            </form>    
        </div>
    </div>
</template>

<script>
import api from '@/services/api';

export default {
    data () {
        return {
            creator: ''
        }
    },
    created: function() {
        this.creator = this.$route.params.creator;
    },
    methods: {
        upload: function() {
            const data = new FormData();
            var title = document.getElementById("video-title").value;
            var file = document.getElementById("video-file").files[0];
            var description = document.getElementById("video-description").value;
            data.append('title', title);
            data.append('description', description);
            data.append('file', file);
            api().post('/api/' + this.creator + '/uploads', data)
            .then(response => {
                this.$router.push('/mypage');
            })
            .catch(function(e) {
                if (e.response) {
                    document.getElementById('verify_upload').innerHTML = e.response.data;
                }
            })
        }
    }
}
</script>

<style>
.upload-wrapper {
  background: #fff;
  width: 70%;
  margin: 12% auto;
}

.form-upload {
  width: 400px;
  padding: 10% 15px;
  margin: 0 auto;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
}

.form-upload-heading {
    color: #C3073F;
    font-size: 36px;
}

.form-upload .form-upload-heading,
.form-upload .checkbox {
  margin-bottom: 10px;
}
.form-upload .checkbox {
  font-weight: normal;
}
.form-upload .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-upload .form-control:focus {
  z-index: 2;
}
.form-upload input[type="text"], .form-upload input[type="file"], .form-upload textarea  {
  width: 100%;
  margin-bottom: 10px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
