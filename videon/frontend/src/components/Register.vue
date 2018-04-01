<template>
    <div class="form-wrapper border border-light">
		<form class="form-content" @submit.prevent="register">
			<h2 class="form-heading">Register</h2>
			<input v-model="email" type="email" id="inputEmail" class="form-control" placeholder="Email" required autofocus>
            <input v-model="username" type="username" class="form-control" placeholder="Username" required>
			<input v-model="password" type="password" class="form-control" placeholder="Password" required>
            <input v-model="repassword" type="password" class="form-control" placeholder="Re-Type Password" required>
			<p>Have an account? <router-link :to="{name: 'Login'}">Login!</router-link></p>
            <div id="error">{{ message }}</div>
			<button class="btn" type="submit">Register</button>
            
		</form>
    </div>
</template>

<script>
import Common from '@/services/common';
import Register from '@/services/register';

export default {
    name: 'Register',
	data () {
		return {
            email: '',
			username: '', 
            password: '',
            repassword: '',
			message: ''
		}
	},
	methods: {
        redirect: function(event) {
			let self = this;
			Common.redirectHome(self);
		},
        register: function(event) {
            var self = this;
            if (this.password !== this.repassword) {
                this.message = "Passwords do not match!";
                return;
            } else {
                Register.register(self, this.email, this.username, this.password);
            }
        }
    },
    mounted() {
        this.redirect();
    }
}
</script>

<style lang="css">
body {
  background: #1A1A1D;
}


.form-content input[type="email"], .form-content input[type="username"], .form-content input[type="password"] {
  width: 100%;
  margin-bottom: 10px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
</style>