<template>
  <main class="main-container">
    <PostList :list="posts" @emit-data="onEmits" />
  </main>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import PostList from '@/components/PostList';
import { useRouter } from 'vue-router/dist/vue-router';

const router = useRouter();
const store = useStore();
const posts = computed(() => store.getters.posts);

const onEmits = function (item) {
  router.push({ name: 'post', params: { name: item.name } });
};
</script>
