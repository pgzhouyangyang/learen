import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        query: {
            size: 20
        },
        token: "",
    },
    mutations: {
        getQuery(state) {
            if(router.currentRoute.query.authentication) {
                state.token = router.currentRoute.query.authentication
            }
            if(router.currentRoute.query.skillItem) {
                state.query.skillItem = router.currentRoute.query.skillItem
            }
            if(router.currentRoute.query.skillLevel) {
                state.query.skillLevel = router.currentRoute.query.skillLevel
            }
            if(router.currentRoute.query.type) {
                state.query.type = router.currentRoute.query.type
            }
            if(router.currentRoute.query.index) {
                state.query.index = router.currentRoute.query.index
            }
        }
    }
})
