<script setup>
import { reactive, ref } from 'vue';
import FormField from '@/components/ui/FormField.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import { useCourseStore } from '@/stores/courses';
import { useNotificationStore } from '@/stores/notifications';
import { validateCourse } from '@/utils/validators';

const courseStore = useCourseStore();
const notifications = useNotificationStore();

const emptyForm = () => ({ courseId: '', name: '' });
const form = reactive(emptyForm());
const errors = ref({});
const formError = ref('');
const submitting = ref(false);

async function handleSubmit() {
    formError.value = '';
    errors.value = validateCourse(form);
    if (Object.keys(errors.value).length) return;

    submitting.value = true;
    try {
        const course = await courseStore.addCourse({ courseId: form.courseId.trim(), name: form.name.trim() });
        notifications.success(`Added ${course.courseId}: ${course.name}`);
        Object.assign(form, emptyForm());
    } catch (err) {
        errors.value = err.fields || {};
        if (err.status === 409) errors.value.courseId = err.message;
        formError.value = err.message;
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <form class="form" novalidate @submit.prevent="handleSubmit">
        <BaseAlert v-if="formError">{{ formError }}</BaseAlert>

        <FormField
            id="course-id"
            v-model="form.courseId"
            label="Course ID"
            :error="errors.courseId"
            hint="Saved in uppercase, e.g. CIS 3339"
            placeholder="CIS 3339"
            required
        />

        <FormField
            id="course-name"
            v-model="form.name"
            label="Course name"
            :error="errors.name"
            placeholder="Enterprise Applications Development"
            required
        />

        <div>
            <button type="submit" class="btn btn--primary" :disabled="submitting">
                {{ submitting ? 'Adding…' : 'Add course' }}
            </button>
        </div>
    </form>
</template>
