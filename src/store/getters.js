export default {
  posts(state) {
    return state.posts;
  },
  postInfo(state) {
    return state.posts.find(post => post.name === state.postName);
  },
  postContent(state) {
    return state.postContent;
  },
};
