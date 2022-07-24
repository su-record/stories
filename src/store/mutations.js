import { mdToHtmlConverter } from '@/utils';

export default {
  SET_POSTS(state, payload) {
    state.posts = payload;
  },
  SET_POST_NAME(state, payload) {
    state.postName = payload;
  },
  SET_POST_CONTENT(state, payload) {
    console.log('### SET_POST_CONTENT', payload);
    state.postContent = mdToHtmlConverter(payload);
  },
};
