import Vue from 'vue';
import VueRouter from 'vue-router';
import login from '../pages/Login.vue'
import {Token_api} from '../api/apis.js'

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router= new VueRouter(
    {
        routes: [
            {
                path: '/',
                name: 'login',
                component: login
            },
            {
                path: '/index',
                name: 'index',
                component: () => import('../pages/Index.vue'),
                children: [
                    {
                        path: '/index/Home',
                        name: 'home',
                        component: () => import('../pages/index/Home.vue'), 
                        meta:{
                            bread:[ '首页'],
                            role:['super','normal']
                        }
                    },
                    {
                        path: '/index/Order',
                        name: 'order',
                        component: () => import('../pages/index/Order.vue'),
                        meta:{
                            bread:['首页', '订单列表'],
                            role:['super']
                        }
                    },
                    {
                        path: '/index/AddGoods',
                        name: 'AddGoods',
                        component: () => import('../pages/index/goods/AddGoods.vue'),
                        meta:{
                            bread:['首页', '商品添加'],
                            role:['super','normal']
                        }
                    },
                    {
                        path: '/index/Classification',
                        name: 'Classification',
                        component: () => import('../pages/index/goods/Classification.vue'),
                        meta:{
                            bread:['首页', '商品分类'],
                            role:['super','normal']
                        }
                    },
                    {
                        path: '/index/GoodsList',
                        name: 'GoodsList',
                        component: () => import('../pages/index/goods/GoodsList.vue'),
                        meta:{
                            bread:['首页', '商品列表'],
                            role:['super','normal']
                        }
                    },
                    {
                        path: '/index/Store',
                        name: 'Store',
                        component: () => import('../pages/index/Store.vue'),
                        meta:{
                            bread:['首页', '店铺管理'],
                            role:['super','normal']
                        }
                    },
                    {
                        path: '/index/Accadd',
                        name: 'Accadd',
                        component: () => import('../pages/index/Account/Accadd.vue'),
                        meta:{
                            bread:['首页', '账号添加'],
                            role:['super']
                        }
                    },
                    {
                        path: '/index/AccList',
                        name: 'AccList',
                        component: () => import('../pages/index/Account/AccList.vue'),
                        meta:{
                            bread:['首页', '账号列表'],
                            role:['super']
                        }
                    },
                    {
                        path: '/index/AccUpdate',
                        name: 'AccUpdate',
                        component: () => import('../pages/index/Account/AccUpdate.vue'),
                        meta:{
                            bread:['首页', '修改密码'],
                            role:['super']
                        }
                    },
                    {
                        path: '/index/GoodsMarket',
                        name: 'GoodsMarket',
                        component: () => import('../pages/index/market/GoodsMarket.vue'),
                        meta:{
                            bread:['首页', '商品统计'],
                            role:['super']
                        }
                    }, {
                        path: '/index/OrderMarket',
                        name: 'OrderMarket',
                        component: () => import('../pages/index/market/OrderMarket.vue'),
                        meta:{
                            bread:['首页', '订单统计'],
                            role:['super']
                        }
                    }, {
                        path: '/index/Person',
                        name: 'Person',
                        component: () => import('../pages/index/Person.vue'),
                        meta:{
                            bread:['首页', '个人中心'],
                            role:['super','normal']
                        }
                    }
                ]


            }
        ],
        
    }
);

//路由防卫及路由权限
router.beforeEach((to,from,next)=>{
    if(to.path!='/'){
        Token_api(localStorage.token).then(res=>{
            if(res.data.code==0){
                if(to.meta.role.includes(localStorage.role)){
                    next()
                }else{
                    next(from.path);
                }
            }else{
                next('/');
            }
        })
    }else{
        next();
    }
})
export default router;