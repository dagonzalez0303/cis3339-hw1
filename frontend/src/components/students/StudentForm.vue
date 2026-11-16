<script setup>
import { reactive, ref } from 'vue';
import FormField from '@/components/ui/FormField.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import { useStudentStore } from '@/stores/students';
import { useNotificationStore } from '@/stores/notifications';
import { validateStudent } from '@/utils/validators';

const studentStore = useStudentStore();
const notifications = useNotificationStore();

const emptyForm = () => ({ name: '', studentId: '', phone: '', zip: '' });
const form = reactive(emptyForm());
const errors = ref({});
const formError = ref('');
const submitting = ref(false);

async function handleSubmit() {
    formError.value = '';
    errors.value = validateStudent(form);
    if (Object.keys(errors.value).length) return;

    submitting.value = true;
    try {
        const student = await studentStore.addStudent({
            name: form.name.trim(),
            studentId: form.studentId.trim(),
            phone: form.phone.trim(),
            zip: form.zip.trim(),
        });
        notifications.success(`Added ${student.name} (ID ${student.studentId})`);
        Object.assign(form, emptyForm());
    } catch (err) {
        errors.value = err.fields || {};
        if (err.status === 409) errors.value.studentId = err.message;
        formError.value = err.message;
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <form class="form" novalidate @submit.prevent="handleSubmit">
        <BaseAlert v-if="formError">{{ formError }}</BaseAlert>

        <FormField id="student-name" v-model="form.name" label="Name" :error="errors.name" autocomplete="name" required />

        <div class="form-row">
            <FormField
                id="student-id"
                v-model="form.studentId"
                label="Student ID"
                :error="errors.studentId"
                inputmode="numeric"
                placeholder="1001"
                required
            />
            <FormField
                id="student-zip"
                v-model="form.zip"
                label="ZIP code"
                :error="errors.zip"
                inputmode="numeric"
                autocomplete="postal-code"
                placeholder="77001"
                required
            />
        </div>

        <FormField
            id="student-phone"
            v-model="form.phone"
            label="Phone number"
            :error="errors.phone"
            type="tel"
            autocomplete="tel"
            placeholder="555-1234"
            required
        />

        <div>
            <button type="submit" class="btn btn--primary" :disabled="submitting">
                {{ submitting ? 'Adding…' : 'Add student' }}
            </button>
        </div>
    </form>
</template>
