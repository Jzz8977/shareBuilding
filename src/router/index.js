import Vue from 'vue'
import Router from 'vue-router'
import Details from '@/components/details'
import Attract from '@/components/attact'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: '/',
            redirect: '/index'
                // component: Details
        },
        {
            path: '/index',
            name: '/index',
            component: Details,
            meta: {
                title: '租赁房产详情'
            }
        },
        {
            path: '/attract',
            name: '/attract',
            component: Attract,
            meta: {
                title: '招商房产详情'
            }
        }
    ]
})