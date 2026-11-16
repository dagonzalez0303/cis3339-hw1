import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/services/api';

// Shared student state: used by the Students view and by the enrollment student picker
export const useStudentStore = defineStore('students', () => {
    const students = ref([]);
    const loading = ref(false);
    const error = ref('');
    const search = ref('');

    const count = computed(() => students.value.length);

    async function fetchStudents(term = search.value) {
        search.value = term.trim();
        loading.value = true;
        error.value = '';
        try {
            const query = search.value ? `?search=${encodeURIComponent(search.value)}` : '';
            students.value = await api.get(`/students${query}`);
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    // Throws ApiError so the form can show field-level messages
    async function addStudent(data) {
        const student = await api.post('/students', data);
        await fetchStudents();
        return student;
    }

    async function deleteStudent(studentId) {
        const result = await api.delete(`/students/${encodeURIComponent(studentId)}`);
        students.value = students.value.filter((student) => student.studentId !== studentId);
        return result;
    }

    return { students, loading, error, search, count, fetchStudents, addStudent, deleteStudent };
});
