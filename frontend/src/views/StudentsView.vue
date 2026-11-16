<script setup>
import { computed, onMounted, ref } from 'vue';
import PageHeader from '@/components/ui/PageHeader.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import StudentForm from '@/components/students/StudentForm.vue';
import StudentSearch from '@/components/students/StudentSearch.vue';
import StudentTable from '@/components/students/StudentTable.vue';
import { useStudentStore } from '@/stores/students';
import { useNotificationStore } from '@/stores/notifications';

const studentStore = useStudentStore();
const notifications = useNotificationStore();

const pendingDelete = ref(null);
const deleting = ref(false);

const listTitle = computed(() =>
    studentStore.search ? `Results for “${studentStore.search}” (${studentStore.count})` : `All students (${studentStore.count})`
);

const emptyMessage = computed(() =>
    studentStore.search ? `No students match “${studentStore.search}”.` : 'No students yet. Add one using the form.'
);

async function confirmDelete() {
    const student = pendingDelete.value;
    deleting.value = true;
    try {
        const { enrollmentsRemoved } = await studentStore.deleteStudent(student.studentId);
        const extra = enrollmentsRemoved ? ` and ${enrollmentsRemoved} enrollment(s)` : '';
        notifications.success(`Deleted ${student.name}${extra}`);
    } catch (err) {
        notifications.error(err.message);
    } finally {
        deleting.value = false;
        pendingDelete.value = null;
    }
}

onMounted(() => studentStore.fetchStudents(''));
</script>

<template>
    <PageHeader title="Students" subtitle="Add, search, and remove students." />

    <div class="grid-2">
        <BaseCard title="Add a student">
            <StudentForm />
        </BaseCard>

        <BaseCard :title="listTitle">
            <StudentSearch
                :initial="studentStore.search"
                :loading="studentStore.loading"
                @search="studentStore.fetchStudents"
            />

            <LoadingSpinner v-if="studentStore.loading" label="Loading students…" />
            <BaseAlert v-else-if="studentStore.error">{{ studentStore.error }}</BaseAlert>
            <EmptyState v-else-if="!studentStore.count" :message="emptyMessage" />
            <StudentTable v-else :students="studentStore.students" @delete="pendingDelete = $event" />
        </BaseCard>
    </div>

    <ConfirmDialog
        :open="!!pendingDelete"
        :title="`Delete ${pendingDelete?.name ?? 'student'}?`"
        message="This also removes all of the student's course enrollments. This cannot be undone."
        :busy="deleting"
        @confirm="confirmDelete"
        @cancel="pendingDelete = null"
    />
</template>
