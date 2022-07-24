import { getData } from '@/api';

export default {
  async GET_POSTS({ commit }) {
    const { data } = await getData('posts/index.json');
    commit('SET_POSTS', data);
  },
  async GET_POST_CONTENT({ commit }, postPath) {
    const { data } = await getData(postPath);
    commit('SET_POST_CONTENT', data);
  },
};
