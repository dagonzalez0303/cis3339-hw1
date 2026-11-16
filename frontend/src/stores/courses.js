import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/services/api';

// Shared course state: used by the Courses view and by the enrollment course pickers
export const useCourseStore = defineStore('courses', () => {
    const courses = ref([]);
    const loading = ref(false);
    const error = ref('');

    const count = computed(() => courses.value.length);

    async function fetchCourses() {
        loading.value = true;
        error.value = '';
        try {
            courses.value = await api.get('/courses');
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    // Throws ApiError so the form can show field-level messages
    async function addCourse(data) {
        const course = await api.post('/courses', data);
        courses.value = [...courses.value, course].sort((a, b) => a.courseId.localeCompare(b.courseId));
        return course;
    }

    async function deleteCourse(courseId) {
        const result = await api.delete(`/courses/${encodeURIComponent(courseId)}`);
        courses.value = courses.value.filter((course) => course.courseId !== courseId);
        return result;
    }

    return { courses, loading, error, count, fetchCourses, addCourse, deleteCourse };
});
