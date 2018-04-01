<template>
    <div>
        <div class="upload-wrapper border border-light">
            <form id="upload-form" class="form-upload" method="post" enctype="multipart/form-data" @submit.prevent="upload">
                <div class="form-upload-heading">Upload</div>
                <span>*Can only upload videos with less than 10MB for now</span>
                <input type="text" v-model="title" id="video-title" class="form-control" name="title" placeholder="Video Title"/>
                <input type="file" id="video-file" class="form-control" name="file" accept="video/*"/>
                <textarea v-model="description" id="video-description" class="form-control" rows=3 placeholder="Video Description"></textarea>
                <input type="submit" id="submit-video" class="btn content-button" value="Upload"/>
                <div id="progress" class="hidden">
                    <div id="bar"></div>
                </div>
                <div id="error">
                </div>
            </form>    
        </div>
    </div>
</template>

<script>
import api from '@/services/api';

export default {
    data () {
        return {
            creator: '',
            title: '',
            description: '',
            progressValue: 0
        }
    },
    created: function() {
        this.creator = this.$route.params.creator;
    },
    methods: {
        updateBar: function(loaded, total) {
            var bar = document.getElementById('bar');
            if (loaded < total) {
                var percent = (loaded/total) * 100; 
                bar.style.width = percent + '%';
                bar.innerHTML = percent * 1 + '%';
            }else {
                bar.style.width = '100%';
                bar.innerHTML = `Sending to server...`;
            }
        },
        upload: function(event) {
            const data = new FormData();
            var file = document.getElementById("video-file").files[0];
            data.append('title', this.title);
            data.append('description', this.description);
            data.append('file', file);
            document.getElementById('progress').classList.remove('hidden');
            document.getElementById('submit-video').disabled = true;
            api().post('/api/' + this.creator + '/uploads', data, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        this.updateBar(progressEvent.loaded, progressEvent.total);
                    }
                }
            })
            .then(response => {
                var bar = document.getElementById('bar');
                bar.innerHTML = "Done"
                document.getElementById('submit-video').disabled = false;
                document.getElementById('upload-form').reset();
            })
            .catch(function(e) {
                if (e.response) {
                    document.getElementById('error').innerHTML = e.response.data;
                }
            })
        }
    }
}
</script>

<style>
#progress {
    margin-top: 30px;
    width: 100%;
    background-color: grey;
}

#bar {
    width: 0%;
    height: 30px;
    line-height: 30px;
    background-color: #4CAF50;
    text-align: center;
    color: white;
}

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
