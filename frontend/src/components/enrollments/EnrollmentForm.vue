<script setup>
import { computed, ref } from 'vue';
import SelectField from '@/components/ui/SelectField.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import { useStudentStore } from '@/stores/students';
import { useCourseStore } from '@/stores/courses';
import { useEnrollmentStore } from '@/stores/enrollments';
import { useNotificationStore } from '@/stores/notifications';

const studentStore = useStudentStore();
const courseStore = useCourseStore();
const enrollmentStore = useEnrollmentStore();
const notifications = useNotificationStore();

const studentId = ref('');
const courseId = ref('');
const errors = ref({});
const formError = ref('');
const submitting = ref(false);

const studentOptions = computed(() =>
    studentStore.students.map((student) => ({ value: student.studentId, label: `${student.name} (${student.studentId})` }))
);
const courseOptions = computed(() =>
    courseStore.courses.map((course) => ({ value: course.courseId, label: `${course.courseId} — ${course.name}` }))
);

async function handleSubmit() {
    formError.value = '';
    errors.value = {};
    if (!studentId.value) errors.value.student = 'Select a student';
    if (!courseId.value) errors.value.course = 'Select a course';
    if (Object.keys(errors.value).length) return;

    submitting.value = true;
    try {
        const enrollment = await enrollmentStore.enroll(studentId.value, courseId.value);
        notifications.success(`Enrolled ${enrollment.student.name} in ${enrollment.course.courseId}`);
        studentId.value = '';
    } catch (err) {
        formError.value = err.message;
        // A student or course deleted elsewhere: refresh the choices
        if (err.status === 404) {
            studentStore.fetchStudents('');
            courseStore.fetchCourses();
        }
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <form class="form" novalidate @submit.prevent="handleSubmit">
        <BaseAlert v-if="formError">{{ formError }}</BaseAlert>

        <SelectField
            id="enroll-student"
            v-model="studentId"
            label="Student"
            placeholder="Select a student"
            :options="studentOptions"
            :error="errors.student"
        />

        <SelectField
            id="enroll-course"
            v-model="courseId"
            label="Course"
            placeholder="Select a course"
            :options="courseOptions"
            :error="errors.course"
        />

        <div>
            <button type="submit" class="btn btn--primary" :disabled="submitting">
                {{ submitting ? 'Enrolling…' : 'Enroll student' }}
            </button>
        </div>
    </form>
</template>
