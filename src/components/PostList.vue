<template>
  <ul class="post-list">
    <li
      class="post-list-item"
      v-for="item in list"
      :key="item.title"
      @click="emitClick(item)"
      :style="gradientColor(0.2, colorGenerator)"
    >
      <h3>{{ item.title }}</h3>
      <time>{{ new Date(item.date).toDateString() }}</time>
      <p>{{ item.description }}</p>
    </li>
  </ul>
</template>

<script setup>
import { gradientColor, colorGenerator } from '@/utils';

const props = defineProps({
  list: Array,
});

const emit = defineEmits(['emitData']);
const emitClick = function (item) {
  emit('emitData', item);
};
</script>

<style scoped lang="scss">
.post-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  &-item {
    flex: 0 1 calc((100% - (0.75rem * 4)) / 5);
    padding: 0.75rem 1rem;
    text-align: right;
    border: 1px solid #dfdfdf;
    border-radius: 5px;
    transition: box-shdow 0.1s, transform 0.1s;

    &:hover {
      box-shadow: var(--all-shodow);
      transform: translate(-1px, -2px);
    }

    h3 {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 150px;
      text-align: center;
      word-break: keep-all;
    }

    time {
      font-size: 0.9rem;
    }

    p {
      margin-top: 0.5rem;
      text-align: left;
      font-size: 0.9rem;
      word-break: keep-all;
    }

    @include tabletS {
      flex-basis: calc((100% - (0.75rem * 3)) / 4);
    }

    @include mobile {
      flex-basis: calc((100% - (0.75rem * 2)) / 3);
    }

    @include mobileXs {
      flex-basis: calc((100% - (0.75rem * 1)) / 2);
    }
  }
}
</style>
