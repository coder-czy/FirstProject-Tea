import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutations/mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isLogin: false,
        username: '',
        password: '',

        isPay: false,
        store: {},
        cart: [],
        orderType: 'takein',
        address: {},
        addresses: [],
        member: {},
        order: {},
        takingData: []
    },
    mutations: {

        [types.setLoginStatus](state, isLogin) {
            state.isLogin = isLogin
        },
        [types.SET_ORDER_TYPE](state, type) {
            state.orderType = type
        },
        [types.SET_MEMBER](state, member) {
            state.member = member
        },
        [types.SET_ADDRESS](state, address) {
            state.address = address
        },
        [types.SET_ADDRESSES](state, addresses) {
            state.addresses = addresses
        },
        [types.SET_STORE](state, store) {
            state.store = store
        },
        [types.SET_CART](state, cart) {
            state.cart = cart
        },
        [types.REMOVE_CART](state) {
            state.cart = []
        },
        [types.SET_ORDER](state, order) {
            state.order = order
        },
        [types.SET_PAY](state, isPay) {
            state.isPay = isPay
        },
        [types.SET_TakingData](state, takingData) {
            state.takingData = takingData
        },
    },


})