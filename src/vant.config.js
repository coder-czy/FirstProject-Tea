import { Toast, Empty, Icon, Swipe, SwipeItem, Form, Button, Field, SwipeCell, Dialog, Switch, Step, Steps, Tab, Tabs, DatetimePicker, Popup, Area } from 'vant'

const vants = [Toast, Empty, Icon, Swipe, SwipeItem, Form, Button, Field, SwipeCell, Dialog, Switch, Step, Steps, Tab, Tabs, DatetimePicker, Popup, Area]

export default {
    /**
     * Vue.use 方法会自动调用install函数
     * Install Vant Component plugin
     * @param Vue
     */
    install(Vue) {
        vants.forEach(Component => {
            Vue.use(Component)
        })
    }

}