<script setup>
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
});
</script>

<template>
    <div class="page-header">
        <h1>{{ title }}</h1>
        <p v-if="subtitle">{{ subtitle }}</p>
    </div>
</template>

<style scoped>
.page-header {
    margin-bottom: 1.5rem;
}

.page-header h1 {
    margin: 0 0 0.25rem;
    font-size: 1.75rem;
}

.page-header p {
    margin: 0;
    color: var(--color-muted);
}
</style>
