<template>
    <div>
        <h1>Welcome <span id="user">{{ user.username }}</span> !</h1>
        <form id="search-form">
            <h2 class="form-heading-content">Find Creators</h2>
            <div>
                <input class="search-field" type="input" placeholder="Find a Creator">
                <input id="search-button" class="btn content-button" type="submit" value="Find">
            </div>
        </form>
        <table class="table table-hover">
            <thead>
            <tr>
                <td>Creator Name</td>
                <td>Creator Page</td>
                <td>Subscribe</td>
            </tr>
            </thead>
            <tbody v-if="allCreators.length == 0" is="transition-group" name="fade">
                <tr>
                    <td><div class="table-value">None</div></td>
                    <td><div class="table-value">None</div></td>
                </tr>
            </tbody>
            <tbody v-else is="transition-group" name="fade">
                <tr class="creator table-row" v-for="creator in allCreators" :key="creator">
                    <td><div class="table-value">{{ creator }}</div></td>
                    <td><router-link :to="{name: 'ViewCreator', params: { creator: creator }}" class="btn visit-page">Visit Page</router-link></td>
                    <td class="not-subscribed" v-if="subscribedTo.indexOf(creator) == -1"><div class="table-value">✘</div></td>
                    <td class="subscribed" v-else><div class="table-value">✔</div></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
// imports
import api from '@/services/api'
import Common from '@/services/common'

export default {
    data() {
        return {
            user: {username: '', isCreator: null},
            allCreators: [],
            subscribedTo: []
        }
    },
    created: function() {
        this.redirect();
        this.getAllCreators();
    },
    methods: {
        redirect: function(event) {
			let self = this;
			Common.redirectLogin(self);
        },
        getAllCreators: function(event) {
            api().get('/currentUser')
            .then(response => {
                this.user = response.data;
                api().get('/api/creators')
                .then(response => {
                    this.allCreators = this.shuffle(response.data);
                    var index = this.allCreators.indexOf(this.user.username);
                    if (index != -1) this.allCreators.splice(index, 1);
                    this.allCreators = this.allCreators.splice(0, 10);
                    api().get('/api/' + this.user.username + '/creators')
                    .then(response => {
                        console.log("hel");
                        this.subscribedTo = response.data;
                        console.log(response);
                    })
                    .catch(function(e) {
                        if (e.response) console.error(e.response.data);
                    })
                })
                .catch(function(e) {
                    if (e.response) console.error(e.response.data);
                })
            })
            .catch(e => {
                console.error("Not logged in");
            })
        },
        getCurrentUser: function(event) {
            api().get('/currentUser')
            .then(response => {
                user = response.data;
            }).catch(function(e) {
                console.error("Not logged in");
            })
        },
        /*Function from --> https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array */
        shuffle: function(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
    }
}

</script>

<style lang="css">

.form-heading-content {
    color: white;
}
.search-field {
    height: 30px;
    margin: 0 auto;
}

#search-form {
    margin: 0 auto;
    position: relative;
    justify-content: left;
}

#search-button {
    position: absolute;
    bottom: 0;
    margin: 0px 0px 0px 5px;
}
</style>
