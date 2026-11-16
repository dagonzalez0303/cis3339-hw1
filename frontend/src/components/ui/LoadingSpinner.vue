<script setup>
defineProps({
    label: { type: String, default: 'Loading…' },
});
</script>

<template>
    <div class="loading" role="status">
        <span class="loading__spinner" aria-hidden="true"></span>
        <span>{{ label }}</span>
    </div>
</template>

<style scoped>
.loading {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1rem 0;
    color: var(--color-muted);
}

.loading__spinner {
    width: 1.1rem;
    height: 1.1rem;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
