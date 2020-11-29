export const routes = [{
        path: '/home',
        name: 'Home',
        component: () =>
            import ('../views/Home.vue')
    },
    {
        path: '/order',
        name: 'Order',
        component: () =>
            import ('../views/Order.vue')
    },
    {
        path: '/taking',
        name: 'Taking',
        component: () =>
            import ('../views/Taking.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () =>
            import ('../views/Profile.vue')

    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../views/Login.vue')
    },
    {
        path: '/address',
        name: 'Address',
        component: () =>
            import ('../views/Address.vue'),

        children: [{
                path: 'editAddress',
                name: 'EditAddress',
                component: () =>
                    import ('../components/address/EditAddress.vue')
            },
            {
                path: 'addAddress',
                name: 'AddAddress',
                component: () =>
                    import ('../components/address/AddAddress.vue')
            },
        ]
    },
    {
        path: '/attendance',
        name: 'Attendance',
        component: () =>
            import ('../views/Attendance.vue'),
        children: [{
            path: 'mallDetail',
            name: 'MallDetail',
            component: () =>
                import ('../components/attendance/MallDetail.vue')
        }, {
            path: 'exchangeRecord',
            name: 'ExchangeRecord',
            component: () =>
                import ('../components/attendance/ExchangeRecord.vue')
        }, {
            path: 'pointFlow',
            name: 'PointFlow',
            component: () =>
                import ('../components/attendance/PointsFlow.vue')
        }]
    }, {
        path: '/giftCards',
        name: 'GiftCards',
        component: () =>
            import ('../views/GiftCards.vue')
    },
    {
        path: '/userInfo',
        name: 'UserInfo',
        component: () =>
            import ('../components/profile/UserInfo.vue')
    },
    {
        path: '/myPackages',
        name: 'MyPackages',
        component: () =>
            import ('../components/profile/MyPackages.vue')
    },
    {
        path: '/packages',
        name: 'Packages',
        component: () =>
            import ('../components/home/Packages.vue')
    },
    {
        path: '/rechargeCards',
        name: 'RechargeCards',
        component: () =>
            import ('../components/profile/RechargeCards.vue')
    },
    {
        path: '/myOrder',
        name: 'MyOrder',
        component: () =>
            import ('../components/profile/MyOrder.vue'),
        children: [{
            path: 'orderDetail',
            name: 'OrderDetail',
            component: () =>
                import ('../components/profile/OrderDetail.vue')
        }]
    },
    {
        path: '/memberCode',
        name: 'MemberCode',
        component: () =>
            import ('../views/MemberCode.vue')
    },
    {
        path: '/levelBenefits',
        name: 'LevelBenefits',
        component: () =>
            import ('../components/profile/LevelBenefits.vue')
    },
    {
        path: '/services',
        name: 'Services',
        component: () =>
            import ('../components/services/Services.vue'),
        children: [{
            path: 'helpCenter',
            name: 'HelpCenter',
            component: () =>
                import ('../components/services/HelpCenter.vue')
        }]
    },
    {
        path: '/pay',
        name: 'Pay',
        component: () =>
            import ('../views/Pay.vue'),
        children: [{
            path: 'remark',
            name: 'Remark',
            component: () =>
                import ('../components/pay/Remark.vue')
        }]
    },
    {
        path: '/storeDetail',
        name: 'StoreDetail',
        component: () =>
            import ('../components/order/StoreDetail.vue')
    },
    {
        path: '/*',
        redirect: '/home'
    }

]