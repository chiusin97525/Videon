<template>
  <div id="app">
    <div id="navbar" class="navbar hidden">
      <div class="route-container">
        <router-link class="routes" :to="{name: 'MainPage'}">Home</router-link>
      </div>
      
      <div id="creators" class="route-container">
        <!--a class="routes" href="/mypage">MyPage</a-->
        <router-link class="routes" :to="{name: 'MyPage'}">MyPage</router-link>
      </div>

      <div id="Subscriptions" class="route-container">
        <router-link class="routes" :to="{name: 'Subscriptions'}">Subscriptions</router-link>
      </div>

      <button id="logout-button" class="btn" v-on:click="logout">Logout</button>
    </div>
    <div class="container">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import Common from '@/services/common';


export default {
  name: 'App',
  data() {
    return {
      user: {username: '', isCreator: ''}
    }
  },
  methods: {
    redirect: function(event) {
			let self = this;
			Common.redirectLogin(self);
    },
    
    logout: function(event) {
      let self = this;
      Common.logout(self);
    }

  },
  mounted: function () {
    this.redirect();
  }
}
</script>

<style>

html {
  width: 100%;
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

a.routes:hover, a.routes:visited, a.routes:active, a.routes:link
{
    text-decoration: none;
    color: white;
}

.routes {
  color: white;
  text-decoration: none;
  font-size: 30px;
  cursor: pointer;
}

a.routes:hover {
  color: #C3073F;
}

.route-container {
  margin-top: auto;
  padding: 6px 15px 0px 15px;
  color: pink;
}

.route-container:hover {
  border-bottom: 4px solid #950740;
}

#logout-button {
  position: absolute;
  right: 0;
  margin: 10px 10px 10px 10px;
  height: 30px;
}


.navbar {
  height: 30px;
  width: 100%;
  background: #4E4E50;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  color: white;
  background:#1A1A1D;
  height: 30px;
  outline: none;
  border: none;
}

.btn:hover {
  background-color: #C3073F;
}

#error {
  color: red;
  padding: 10px 0px 0px 0px;
  font-size: 20px;
}

.hidden {
  visibility: hidden;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s
}

.fade-enter, .fade-leave-active {
  opacity: 0
}

.table-value {
    margin: 0 auto;
    padding: 5px 5px 5px 5px;
}

.table-row:hover {
  color: #C3073F;
}

.content-button {
    color: white;
    background-color: #4E4E50;
}

#current_title {
    font-size: 30px;
}

#current_upDate, #current_desc {
    font-size: 18spx;
}

#current_title, #current_upDate, #current_desc {
    color: #C3073F;
}

body {
    margin: 0;
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

/*CSS from https://paweljw.github.io/2017/09/vue.js-front-end-app-part-3-authentication/*/

.form-wrapper {
  background: #fff;
  width: 50%;
  margin: 12% auto;
}

.form-content {
  width: 220px;
  padding: 10% 15px;
  margin: 0 auto;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
}

.form-heading {
	color: #C3073F;
}

.form-content .form-heading,
.form-content .checkbox {
  margin-bottom: 10px;
}
.form-content .checkbox {
  font-weight: normal;
}
.form-content .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-content .form-control:focus {
  z-index: 2;
}
.form-content input[type="username"], .form-content input[type="password"]  {
	width: 100%;
  margin-bottom: 10px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

</style>
