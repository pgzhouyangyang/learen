import Vue from 'vue'
import Router from 'vue-router'
import Questions from '@/components/questions'
import Suiji from '@/components/suiji'
import Collect from '@/components/collect'
import Error from '@/components/error'
Vue.use(Router)

const router = new Router({
  routes: [
          {
            path: '/',
            redirect: '/questions'
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
            path: '/collect',
            name: "collect",
            component: Collect,
        },
        {
            path: '/error',
            name: "error",
            component: Error,
        }

  ]
})
// router.beforeEach((to, from, next) => {
//     if(window.__wxjs_environment === 'miniprogram') {
//         next();
//     } else {
//         next({
//             path: '/NotFound',
//
//         })
//     }
// })
export default router
