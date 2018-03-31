<template>
    <div>
        <h1>Welcome <span id="user">{{ user.username }}</span> !</h1>
        <h1>Creators</h1>
        <table class="table table-hover">
            <thead>
            <tr>
                <td>Creator Name</td>
                <td>Creator Page</td>
                <td>Subscribe</td>
            </tr>
            </thead>

            <tbody name="fade" is="transition-group">
                <tr class="creator table-row" v-for="creator in allCreators" :key="creator">
                    <td><div class="table-value">{{ creator }}</div></td>
                    <td><router-link :to="{name: 'ViewCreator', params: { creator: creator }}" class="btn visit-page">Visit Page</router-link></td>
                    <td class="not-subscribed" v-if="subscribedTo.indexOf(creator) == -1"><div class="table-value">Not Subscribed!</div></td>
                    <td class="subscribed" v-else><div class="table-value">Subscribed!</div></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
// imports
import api from '@/services/api'

export default {
    data() {
        return {
            user: {username: '', isCreator: null},
            allCreators: [],
            subscribedTo: []
        }
    },
    created: function() {
        this.getAllCreators();
    },
    methods: {
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
body {
    background: #1A1A1D;
}

h1 {
    color: white;
}

.table {
    margin: 0 auto;
    width: 70%;
    color: white;
}

td {
    background: #1A1A1D;
}

td:target {
    background: #1A1A1D;
}

thead {
    font-size: 36px;
}

#user {
    color:#C3073F
}

.subscribed {
    color: green;
}

.not-subscribed {
    color: red;
}

.visit-page {
    background-color: #4E4E50;
}
</style>
