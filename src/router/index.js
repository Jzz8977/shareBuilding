import Vue from 'vue'
import Router from 'vue-router'
import Details from '@/components/details'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: '/',
            redirect: '/index',
            // component: Details
        },
        {
            path: '/index',
            name: '/index',
            component: Details
        }
    ]
})