<template>
  <ul class="post-list">
    <li
      class="post-list-item"
      v-for="item in list"
      :key="item.title"
      @click="emitClick(item)"
    >
      <h3>{{ item.title }}</h3>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  list: Array,
});

const emit = defineEmits(['emitData']);
const emitClick = function (item) {
  emit('emitData', item);
};
</script>
