import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import { routes } from './routes'

const originalPush = VueRouter.prototype.replace;

VueRouter.prototype.replace = function push(location) {


    // 
    return originalPush.call(this, location).catch(err => err)

}

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
    // 
    // to: Route: 即将要进入的目标 路由对象
    // from: Route: 当前导航正要离开的路由
    // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。

    const nextRoute = ['Taking', 'Profile'];
    let isLogin = router.app.$options.store.state.isLogin // 是否登录
        // 
        // 未登录状态；当路由到nextRoute指定页时，跳转至login
        // 
    if (nextRoute.indexOf(to.name) >= 0) {
        if (!isLogin) {
            router.push({ name: 'Login' })
        }
    }
    // 已登录状态；当路由到login时，跳转至home 
    if (to.name === 'Login') {
        if (isLogin) {
            router.push({ name: 'Home' });
        }
    }
    next();
});

export default router