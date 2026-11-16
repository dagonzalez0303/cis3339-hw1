import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/services/api';

// Roster state shared by the enrollment form and the course roster panel
export const useEnrollmentStore = defineStore('enrollments', () => {
    const rosterCourseId = ref('');
    const roster = ref([]);
    const loading = ref(false);
    const error = ref('');

    const rosterCount = computed(() => roster.value.length);

    async function fetchRoster(courseId = rosterCourseId.value) {
        rosterCourseId.value = courseId;
        roster.value = [];
        error.value = '';
        if (!courseId) return;

        loading.value = true;
        try {
            const enrollments = await api.get(`/enrollments?courseId=${encodeURIComponent(courseId)}`);
            // Ignore responses for a course the user has since navigated away from
            if (courseId === rosterCourseId.value) {
                roster.value = enrollments.sort((a, b) => a.student.name.localeCompare(b.student.name));
            }
        } catch (err) {
            if (courseId === rosterCourseId.value) error.value = err.message;
        } finally {
            if (courseId === rosterCourseId.value) loading.value = false;
        }
    }

    // Throws ApiError so the form can show the message (e.g. duplicate enrollment)
    async function enroll(studentId, courseId) {
        const enrollment = await api.post('/enrollments', { studentId, courseId });
        // Show the roster of the course the student was just added to
        await fetchRoster(courseId);
        return enrollment;
    }

    async function unenroll(enrollment) {
        await api.delete(`/enrollments/${enrollment.id}`);
        roster.value = roster.value.filter((item) => item.id !== enrollment.id);
    }

    return { rosterCourseId, roster, loading, error, rosterCount, fetchRoster, enroll, unenroll };
});
