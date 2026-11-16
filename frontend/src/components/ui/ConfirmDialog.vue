<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    open: { type: Boolean, default: false },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    confirmLabel: { type: String, default: 'Delete' },
    busy: { type: Boolean, default: false },
});

const emit = defineEmits(['confirm', 'cancel']);
const dialog = ref(null);

// Use the native <dialog> element for built-in focus trapping and Escape handling
watch(
    () => props.open,
    (open) => {
        if (open && !dialog.value.open) dialog.value.showModal();
        if (!open && dialog.value.open) dialog.value.close();
    },
    { flush: 'post' }
);
</script>

<template>
    <dialog ref="dialog" class="dialog" aria-labelledby="confirm-title" @cancel.prevent="emit('cancel')">
        <h2 id="confirm-title" class="dialog__title">{{ title }}</h2>
        <p v-if="message" class="dialog__message">{{ message }}</p>
        <div class="dialog__actions">
            <button type="button" class="btn btn--secondary" :disabled="busy" @click="emit('cancel')">Cancel</button>
            <button type="button" class="btn btn--primary" :disabled="busy" @click="emit('confirm')">
                {{ busy ? 'Working…' : confirmLabel }}
            </button>
        </div>
    </dialog>
</template>

<style scoped>
.dialog {
    width: min(26rem, calc(100% - 2rem));
    padding: 1.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    color: var(--color-text);
    box-shadow: var(--shadow);
}

.dialog::backdrop {
    background: rgb(0 0 0 / 45%);
}

.dialog__title {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
}

.dialog__message {
    margin: 0 0 1.5rem;
    color: var(--color-muted);
}

.dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}
</style>
