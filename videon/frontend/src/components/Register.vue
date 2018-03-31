<template>
    <div class="register-wrapper border border-light">
		<form class="form-register" @submit.prevent="register">
			<h2 class="form-register-heading">Register</h2>
			<input v-model="email" type="email" id="inputEmail" class="form-control" placeholder="Email" required autofocus>
            <input v-model="username" type="username" id="inputUsername" class="form-control" placeholder="Username" required>
			<input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>
            <input v-model="repassword" type="password" id="inputRePassword" class="form-control" placeholder="Re-Type Password" required>
			<p>Have an account? <a href='/login'>Login!</a></p>
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
			Common.redirect(self);
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

.register-wrapper {
  background: #fff;
  width: 50%;
  margin: 12% auto;
}

.form-register {
  width: 220px;
  padding: 10% 15px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.form-register .form-register-heading,
.form-register .checkbox {
  margin-bottom: 10px;
}
.form-register .checkbox {
  font-weight: normal;
}
.form-register .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-register .form-control:focus {
  z-index: 2;
}
.form-register input[type="email"], .form-register input[type="username"], .form-register input[type="password"] {
  width: 100%;
  margin-bottom: 10px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
</style>