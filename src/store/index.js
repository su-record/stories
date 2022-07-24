import { createStore } from 'vuex';
import state from './state';
import actions from './actions';
import mutations from '@/store/mutations';
import getters from '@/store/getters';

export default createStore({
  state,
  actions,
  mutations,
  getters,
});
