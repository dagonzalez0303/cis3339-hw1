<script setup>
import { ref } from 'vue';

const props = defineProps({
    initial: { type: String, default: '' },
    loading: { type: Boolean, default: false },
});

const emit = defineEmits(['search']);
const term = ref(props.initial);

function clear() {
    term.value = '';
    emit('search', '');
}
</script>

<template>
    <form class="search" role="search" @submit.prevent="emit('search', term)">
        <label for="student-search" class="sr-only">Search by name or student ID</label>
        <input id="student-search" v-model="term" type="search" placeholder="Search by name or student ID">
        <button type="submit" class="btn btn--primary" :disabled="loading">Search</button>
        <button v-if="initial" type="button" class="btn btn--secondary" @click="clear">Clear</button>
    </form>
</template>

<style scoped>
.search {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.search input {
    flex: 1 1 12rem;
    min-width: 0;
    padding: 0.6rem 0.75rem;
    font: inherit;
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
}
</style>
