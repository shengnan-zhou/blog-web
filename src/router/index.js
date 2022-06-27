import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home.vue')
  },
  {
    path: '/',
    name: 'About',
    component: () => import('@/views/about.vue')
  }
];


const router = new VueRouter({
  mode: 'hash',
  routes
});

export default router;
