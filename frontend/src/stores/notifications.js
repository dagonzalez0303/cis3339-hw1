import { ref } from 'vue';
import { defineStore } from 'pinia';

// App-wide toast messages, so any view or store can report success or failure
export const useNotificationStore = defineStore('notifications', () => {
    const items = ref([]);
    let nextId = 1;

    function dismiss(id) {
        items.value = items.value.filter((item) => item.id !== id);
    }

    function notify(message, type = 'success', timeout = 4000) {
        const id = nextId++;
        items.value.push({ id, message, type });
        if (timeout) {
            setTimeout(() => dismiss(id), timeout);
        }
    }

    return {
        items,
        dismiss,
        success: (message) => notify(message, 'success'),
        error: (message) => notify(message, 'error', 6000),
    };
});
