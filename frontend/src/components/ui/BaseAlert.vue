<script setup>
defineProps({
    type: { type: String, default: 'error', validator: (value) => ['error', 'success', 'info'].includes(value) },
});
</script>

<template>
    <div class="alert" :class="`alert--${type}`" :role="type === 'error' ? 'alert' : 'status'">
        <slot />
    </div>
</template>

<style scoped>
.alert {
    padding: 0.75rem 1rem;
    border-radius: var(--radius);
    border: 1px solid;
    margin-bottom: 1rem;
}

.alert--error {
    background: var(--color-danger-soft);
    border-color: var(--color-danger);
    color: var(--color-danger);
}

.alert--success {
    background: var(--color-success-soft);
    border-color: var(--color-success);
    color: var(--color-success);
}

.alert--info {
    background: var(--color-primary-soft);
    border-color: var(--color-primary);
    color: var(--color-primary);
}
</style>
