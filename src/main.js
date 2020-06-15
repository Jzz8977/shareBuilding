// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'vant/lib/index.css'

import { Lazyload, Swipe, SwipeItem, Cell, CellGroup, Tag, Loading, Notify, Icon } from 'vant'
Vue.use(require('vue-wechat-title'))

Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Lazyload)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Tag)
Vue.use(Loading)
Vue.use(Notify)
Vue.use(Icon)
Vue.config.productionTip = false
Vue.prototype.$notify = Notify
    // 注册时可以配置额外的选项
Vue.use(Lazyload, {
        lazyComponent: true
    })
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})