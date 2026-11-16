<script setup>
defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    options: { type: Array, required: true }, // [{ value, label }]
    placeholder: { type: String, default: 'Select…' },
    error: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
});

const model = defineModel({ type: String, default: '' });
</script>

<template>
    <div class="field">
        <label :for="id">{{ label }}</label>
        <select
            :id="id"
            v-model="model"
            :disabled="disabled"
            :aria-invalid="error ? 'true' : 'false'"
            :aria-describedby="error ? `${id}-error` : undefined"
        >
            <option value="" disabled>{{ placeholder }}</option>
            <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <span v-if="error" :id="`${id}-error`" class="field__error">{{ error }}</span>
    </div>
</template>
