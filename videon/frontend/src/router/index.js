import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
import Login from '@/components/Login'
import Register from '@/components/Register'
import ViewCreator from '@/components/ViewCreator'
import MyPage from '@/components/MyPage'
import Subscriptions from '@/components/Subscriptions'
import Upload from '@/components/Upload'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path:'/',
      name: 'MainPage',
      component: MainPage
    },
    {
    	path: '/login',
    	name: 'Login',
    	component: Login
    },
    {
    	path: '/register',
    	name: 'Register',
    	component: Register
    },
    {
      path:'/creator/:creator',
      name: 'ViewCreator',
      component: ViewCreator
    }, 
    {
      path:'/mypage',
      name: 'MyPage',
      component: MyPage
    },
    {
      path:'/subsciptions',
      name: 'Subscriptions',
      component: Subscriptions
    },
    {
      path:'/upload',
      name: 'Upload',
      component: Upload
    }
  ],
  mode: 'history',
  base: '/'
})
