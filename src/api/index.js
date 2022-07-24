import axios from 'axios';

const $axios = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

export const getData = path => $axios.get(path);
