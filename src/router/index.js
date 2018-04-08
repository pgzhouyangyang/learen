import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Questions from '@/components/questions'
import Suiji from '@/components/suiji'
import Test from '@/components/test'
Vue.use(Router)

export default new Router({
  routes: [
        {
            path: '/',
            redirect: "/home"
        },
        {
          path: '/home',
          component: Home,
        },
        {
          path: '/questions',
          name: "questions",
          component: Questions,
        },
        {
          path: '/suiji',
          name: "suiji",
          component: Suiji,
        },
        {
          path: '/test',
          name: "test",
          component: Test,
        }

  ]
})
