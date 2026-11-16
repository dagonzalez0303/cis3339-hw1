<script setup>
import { computed, onMounted } from 'vue';
import PageHeader from '@/components/ui/PageHeader.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import EnrollmentForm from '@/components/enrollments/EnrollmentForm.vue';
import CourseRoster from '@/components/enrollments/CourseRoster.vue';
import { useStudentStore } from '@/stores/students';
import { useCourseStore } from '@/stores/courses';
import { useEnrollmentStore } from '@/stores/enrollments';

const studentStore = useStudentStore();
const courseStore = useCourseStore();
const enrollmentStore = useEnrollmentStore();

const loading = computed(() => studentStore.loading || courseStore.loading);
const loadError = computed(() => studentStore.error || courseStore.error);

onMounted(async () => {
    // Always load the full lists from the backend so the pickers are current
    await Promise.all([studentStore.fetchStudents(''), courseStore.fetchCourses()]);

    // Drop a remembered roster course that no longer exists, otherwise refresh it
    const stillExists = courseStore.courses.some((course) => course.courseId === enrollmentStore.rosterCourseId);
    enrollmentStore.fetchRoster(stillExists ? enrollmentStore.rosterCourseId : '');
});
</script>

<template>
    <PageHeader title="Enrollments" subtitle="Enroll students in courses and view class rosters." />

    <LoadingSpinner v-if="loading" label="Loading students and courses…" />
    <BaseAlert v-else-if="loadError">{{ loadError }}</BaseAlert>

    <div v-else class="grid-2">
        <BaseCard title="Enroll a student">
            <EmptyState
                v-if="!studentStore.count || !courseStore.count"
                message="You need at least one student and one course before you can enroll."
            >
                <p class="links">
                    <RouterLink v-if="!studentStore.count" to="/students">Add a student</RouterLink>
                    <RouterLink v-if="!courseStore.count" to="/courses">Add a course</RouterLink>
                </p>
            </EmptyState>
            <EnrollmentForm v-else />
        </BaseCard>

        <BaseCard title="Course roster">
            <EmptyState v-if="!courseStore.count" message="No courses yet." />
            <CourseRoster v-else />
        </BaseCard>
    </div>
</template>

<style scoped>
.links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 0.75rem 0 0;
}
</style>
