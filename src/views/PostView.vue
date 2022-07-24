<template>
  <main class="main-container post-section">
    <header>post header</header>
    <article class="post-section-article" v-html="postContent" />

    <VueUtterances repo="su-record/stories" issue-term="pathname" />
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import VueUtterances from 'vue-utterances';

const store = useStore();
const postInfo = computed(() => store.getters.postInfo);
const postContent = computed(() => store.getters.postContent);

store.dispatch('GET_POST_CONTENT', postInfo.value.name);
</script>
