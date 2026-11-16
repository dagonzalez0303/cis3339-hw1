<script setup>
import { onMounted, ref } from 'vue';
import PageHeader from '@/components/ui/PageHeader.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import CourseForm from '@/components/courses/CourseForm.vue';
import CourseTable from '@/components/courses/CourseTable.vue';
import { useCourseStore } from '@/stores/courses';
import { useNotificationStore } from '@/stores/notifications';

const courseStore = useCourseStore();
const notifications = useNotificationStore();

const pendingDelete = ref(null);
const deleting = ref(false);

async function confirmDelete() {
    const course = pendingDelete.value;
    deleting.value = true;
    try {
        const { enrollmentsRemoved } = await courseStore.deleteCourse(course.courseId);
        const extra = enrollmentsRemoved ? ` and ${enrollmentsRemoved} enrollment(s)` : '';
        notifications.success(`Deleted ${course.courseId}${extra}`);
    } catch (err) {
        notifications.error(err.message);
    } finally {
        deleting.value = false;
        pendingDelete.value = null;
    }
}

onMounted(courseStore.fetchCourses);
</script>

<template>
    <PageHeader title="Courses" subtitle="Add, view, and remove courses." />

    <div class="grid-2">
        <BaseCard title="Add a course">
            <CourseForm />
        </BaseCard>

        <BaseCard :title="`All courses (${courseStore.count})`">
            <LoadingSpinner v-if="courseStore.loading" label="Loading courses…" />
            <BaseAlert v-else-if="courseStore.error">{{ courseStore.error }}</BaseAlert>
            <EmptyState v-else-if="!courseStore.count" message="No courses yet. Add one using the form." />
            <CourseTable v-else :courses="courseStore.courses" @delete="pendingDelete = $event" />
        </BaseCard>
    </div>

    <ConfirmDialog
        :open="!!pendingDelete"
        :title="`Delete ${pendingDelete?.courseId ?? 'course'}?`"
        message="This also removes every student's enrollment in this course. This cannot be undone."
        :busy="deleting"
        @confirm="confirmDelete"
        @cancel="pendingDelete = null"
    />
</template>
