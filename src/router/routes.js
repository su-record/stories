export const routes = [
  {
    path: '/',
    name: 'MainView',
    component: () => import(/* webpackChunkName: "[request]" */ '../views/MainView.vue'),
  },
  {
    path: '/post/:name',
    name: 'post',
    component: () => import(/* webpackChunkName: "[request]" */ '../views/PostView.vue'),
  },
];
