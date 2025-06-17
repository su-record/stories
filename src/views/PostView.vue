<template>
  <main class="main-container post-section">
    <!-- <header>post header</header> -->
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

store.dispatch('GET_POST_CONTENT', postInfo.value.path);
</script>

<style lang="scss">
.post-section {
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  
  table th,
  table td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
  }
  
  table th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  
  table tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  &-article {
    margin-bottom: 3rem;

    h2 {
      margin: 3rem 0 1rem;
      font-size: 2rem;

      &:first-child {
        margin-top: 0;
      }
    }

    h3 {
      margin: 2rem 0 1rem;
      font-size: 1.75rem;
    }

    h4 {
      margin: 1.5rem 0 0.5rem;
      font-size: 1.3rem;
    }

    & > p {
      margin-top: 0.5rem;
    }

    blockquote {
      margin: 0.5rem 0 0.75em;
      padding: 0.5rem 1rem;
      background-color: var(--bg-lightbray);
      border-left: 3px solid var(--bg-steelblue);
    }

    pre {
      margin: 0.5rem 0;
      padding: 0.5rem 1rem;
      background-color: var(--bg-gray);
    }

    code {
      padding: 0.1rem 0.2rem;
      background-color: var(--bg-gray);
      border-radius: 2px;
    }

    img {
      max-width: 100%;
      margin: 1rem 0;
      border: 1px solid var(--bg-gray);
    }

    a {
      color: var(--bg-steelblue);
      word-break: break-all;
      &:hover {
        text-decoration: underline;
      }
    }

    hr {
      margin: 4rem 0;
    }

    ul,
    ol {
      list-style: inherit;
    }

    li {
      margin: 0 0 1em 23px;
    }

    @include mobile {
      margin-bottom: 2rem;

      hr {
        margin: 2rem 0;
      }
    }
  }
}
</style>
