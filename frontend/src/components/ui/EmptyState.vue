<script setup>
defineProps({
    message: { type: String, required: true },
});
</script>

<template>
    <div class="empty">
        <p>{{ message }}</p>
        <slot />
    </div>
</template>

<style scoped>
.empty {
    padding: 1.5rem 1rem;
    text-align: center;
    color: var(--color-muted);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius);
}

.empty p {
    margin: 0;
}
</style>
