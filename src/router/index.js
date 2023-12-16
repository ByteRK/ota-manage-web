import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/switch',
    name: 'switch',
    component: () => import('../views/Switch.vue')
  },
  {
    path: '/manage/:id',
    name: 'manage',
    component: () => import('../views/Manage.vue')
  },
  { path: '/:catchAll(.*)', redirect: '/login' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


// 挂载路由导航守卫
router.beforeEach((to, form, next) => {
  // to去哪  form从哪来  next()放行  next('/index')强制跳转
  // const tokenStr = window.localStorage.getItem('coffee');       //本地空间
  const tokenStr = window.sessionStorage.getItem('coffee');  //会话空间
  if (tokenStr) {
    if (to.path === '/login') return next('/switch');
    return next();
  } else {
    if (to.path !== '/login') return next('/login');
    return next();
  }
})

export default router
