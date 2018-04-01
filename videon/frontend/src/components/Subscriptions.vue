<template>
    <div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <td>Creator Name</td>
                </tr>
            </thead>
            <tbody v-if="creators.length == 0" is="transition-group" name="fade">
                <tr>
                    <td><div class="table-value">None</div></td>
                    <td><div class="table-value">None</div></td>
                </tr>
            </tbody>
            <tbody v-else is="transition-group" name="fade">
                <tr class="creator table-row" v-for="creator in creators" :key="creator">
                    <td><div class="table-value">{{ creator }}</div></td>
                    <td><router-link :to="{name: 'ViewCreator', params: { creator: creator }}" class="btn visit-page">➤</router-link></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import api from '@/services/api'

export default {
    data() {
        return {
            creators:[]
        }
    },
    created: function() {
        this.getCreators();
    },
    methods: {
        getCreators: function() {
            let self = this;
            api().get('/currentUser')
            .then(response => {
                var user = response.data.username;
                api().get('/api/'+user+'/creators')
                .then(response => {
                    self.creators = response.data;
                })
                .catch(function(e) {
                    if (e.response) console.error(e.response.data);
                })
            })
        }
    }
}
</script>
<style>

</style>
