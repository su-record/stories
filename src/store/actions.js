import { getData } from '@/api';

export default {
  async GET_POSTS({ commit }) {
    const { data } = await getData('posts/index.json');
    console.log('### GET_POSTS ::', data);
    commit('SET_POSTS', data);
  },
  async GET_POST_CONTENT({ commit }, postPath) {
    console.log('### GET_POST_CONTENT ::', postPath);
    const { data } = await getData(`posts/${postPath}.md`);
    console.log('### GET_POST_CONTENT ::', postPath);
    commit('SET_POST_CONTENT', data);
  },
};
