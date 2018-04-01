<template>
	<div class="form-wrapper border border-light">
		<form class="form-content" @submit.prevent="login">
			<h2 class="form-heading">Login</h2>
			<input v-model="username" type="username" class="form-control" placeholder="Username" required autofocus>
			<input v-model="password" type="password" class="form-control" placeholder="Password" required>
			<p>Need an account? <router-link :to="{name: 'Register'}">Register!</router-link></p> 
			<div id="error">{{ message }}</div>
			<button class="btn" type="submit">Login</button>
		</form>
  </div>
</template>

<script>
import Common from '@/services/common';
import Login from '@/services/login';

export default {
	
	name: 'Login',
	data () {
		return {
			username: '', 
			password: '',
			message: ''
		}
	},
	methods: {
		redirect: function(event) {
			let self = this;
			Common.redirectHome(self);
		},

		login: function(event) {
			let self = this;
			Login.login(self, this.username, this.password);
		}
	},
	mounted (){ 
		this.redirect();
	}
}
</script>

<style lang="css">
body {
  background: #1A1A1D;
}

.form-content input[type="username"], .form-content input[type="password"]  {
	width: 100%;
  margin-bottom: 10px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
</style>