<script setup>
import { computed } from 'vue';

// Extra attributes (type, placeholder, required, …) go on the <input>, not the wrapper
defineOptions({ inheritAttrs: false });

const props = defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    error: { type: String, default: '' },
    hint: { type: String, default: '' },
});

const model = defineModel({ type: String, default: '' });

const describedBy = computed(() =>
    [props.hint && `${props.id}-hint`, props.error && `${props.id}-error`].filter(Boolean).join(' ') || undefined
);
</script>

<template>
    <div class="field">
        <label :for="id">{{ label }}</label>
        <input
            :id="id"
            v-model="model"
            v-bind="$attrs"
            :aria-invalid="error ? 'true' : 'false'"
            :aria-describedby="describedBy"
        >
        <span v-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</span>
        <span v-if="error" :id="`${id}-error`" class="field__error">{{ error }}</span>
    </div>
</template>
