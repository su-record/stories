import { computed } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '@/router/routes';
import store from '../store';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const posts = computed(() => store.state.posts);

  store.commit('SET_POST_NAME', to.params.name);

  if (!posts.value.length) await store.dispatch('GET_POSTS');

  next();
});

export default router;
