<script setup>
defineProps({
    title: { type: String, default: '' },
});
</script>

<template>
    <section class="card">
        <header v-if="title || $slots.actions" class="card__header">
            <h2 v-if="title" class="card__title">{{ title }}</h2>
            <slot name="actions" />
        </header>
        <slot />
    </section>
</template>

<style scoped>
.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
    box-shadow: var(--shadow-sm);
    min-width: 0;
}

.card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
}

.card__title {
    margin: 0;
    font-size: 1.1rem;
}
</style>
