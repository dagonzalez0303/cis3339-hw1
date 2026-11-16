<script setup>
import { useNotificationStore } from '@/stores/notifications';

const notifications = useNotificationStore();
</script>

<template>
    <div class="toasts" aria-live="polite">
        <TransitionGroup name="toast">
            <div
                v-for="item in notifications.items"
                :key="item.id"
                class="toast"
                :class="`toast--${item.type}`"
                :role="item.type === 'error' ? 'alert' : 'status'"
            >
                <span>{{ item.message }}</span>
                <button type="button" class="toast__close" aria-label="Dismiss" @click="notifications.dismiss(item.id)">
                    ×
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.toasts {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    left: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    pointer-events: none;
    z-index: 50;
}

.toast {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 24rem;
    padding: 0.75rem 0.75rem 0.75rem 1rem;
    border-radius: var(--radius);
    color: #fff;
    box-shadow: var(--shadow);
    pointer-events: auto;
}

.toast--success { background: var(--color-success); }
.toast--error { background: var(--color-danger); }

.toast__close {
    border: 0;
    background: transparent;
    color: inherit;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
}

.toast-enter-active,
.toast-leave-active { transition: all 0.2s ease; }

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(0.5rem);
}
</style>
