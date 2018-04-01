<template>
    <div>
        <h1>Welcome <span id="user">{{ user.username }}</span> !</h1>
        <form id="search-form">
            <h2 class="form-heading-content">Find Creators</h2>
            <div>
                <form @submit.prevent="findCreator">
                    <input v-model="search" class="search-field" type="input" placeholder="Find a Creator">
                    <input id="search-button" class="btn content-button" type="submit" value="Find">
                </form>
            </div>
        </form>
        <table class="table table-hover">
            <thead>
            <tr>
                <td>Creator Name</td>
                <td>Creator Page</td>
                <td>Subscribed</td>
            </tr>
            </thead>
            <tbody is="transition-group" name="fade">
                <tr class="creator table-row" v-if="visibleCreators.length > 0" v-for="creator in visibleCreators" :key="creator">
                    <td><div class="table-value">{{ creator }}</div></td>
                    <td><router-link :to="{name: 'ViewCreator', params: { creator: creator }}" class="btn visit-page">Visit Page</router-link></td>
                    <td class="not-subscribed" v-if="subscribedTo.indexOf(creator) == -1"><div class="table-value">✘</div></td>
                    <td class="subscribed" v-else><div class="table-value">✔</div></td>
                </tr>
                <tr v-else>
                    <td><div class="table-value">None</div></td>
                    <td><div class="table-value">None</div></td>
                    <td><div class="table-value">None</div></td>
                </tr>
            </tbody>
            <!--tbody v-else is="transition-group" name="fade">
                <tr>
                    <td><div class="table-value">None</div></td>
                    <td><div class="table-value">None</div></td>
                    <td><div class="table-value">None</div></td>
                </tr>
            </tbody-->
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
            visibleCreators: [],
            subscribedTo: [],
            search: ''
        }
    },
    created: function() {
        this.redirect();
        this.getAllCreators();
    },
    methods: {
        findCreator: function() {
            if (this.search.length > 0) {
                if (this.allCreators.indexOf(this.search) == -1) {
                    this.visibleCreators = [];
                }
                else {
                    this.visibleCreators = [];
                    this.visibleCreators.push(this.search);
                }
            } else {
                this.refreshCreators();
            }

        },
        redirect: function(event) {
			let self = this;
			Common.redirectLogin(self);
        },
        getAllCreators: function(event) {
            let self = this;
            api().get('/currentUser')
            .then(response => {
                this.user = response.data;
                api().get('/api/creators')
                .then(response => {
                    self.allCreators = this.shuffle(response.data);
                    var index = this.allCreators.indexOf(this.user.username);
                    if (index != -1) this.allCreators.splice(index, 1);
                    this.visibleCreators = this.allCreators.slice(0).splice(0, 10);
                    api().get('/api/' + this.user.username + '/creators')
                    .then(response => {
                        this.subscribedTo = response.data;
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
                this.user = response.data;
            }).catch(function(e) {
                console.error("Not logged in");
            })
        },
        refreshCreators: function() {
            this.visibleCreators = this.shuffle(this.allCreators).slice(0).splice(0, 10);
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
