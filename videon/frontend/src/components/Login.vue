<template>
	<div class="login-wrapper border border-light">
		<form class="form-login" @submit.prevent="login">
			<h2 class="form-login-heading">Login</h2>
			<input v-model="username" type="username" id="inputUsername" class="form-control" placeholder="Username" required autofocus>
			<input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>
			<p>Need an account? <a href='/register'>Register!</a></p>
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
			Common.redirect(self);
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

// CSS from https://paweljw.github.io/2017/09/vue.js-front-end-app-part-3-authentication/
<style lang="css">
body {
  background: #1A1A1D;
}

.login-wrapper {
  background: #fff;
  width: 50%;
  margin: 12% auto;
}

.form-login {
  width: 220px;
  padding: 10% 15px;
  margin: 0 auto;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
}
.form-login .form-login-heading,
.form-login .checkbox {
  margin-bottom: 10px;
}
.form-login .checkbox {
  font-weight: normal;
}
.form-login .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-login .form-control:focus {
  z-index: 2;
}
.form-login input[type="username"], .form-login input[type="password"]  {
	width: 100%;
  margin-bottom: 10px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
</style>