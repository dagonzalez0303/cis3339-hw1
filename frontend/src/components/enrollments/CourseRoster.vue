<script setup>
import { computed, ref } from 'vue';
import SelectField from '@/components/ui/SelectField.vue';
import BaseAlert from '@/components/ui/BaseAlert.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
import { useCourseStore } from '@/stores/courses';
import { useEnrollmentStore } from '@/stores/enrollments';
import { useNotificationStore } from '@/stores/notifications';

const courseStore = useCourseStore();
const enrollmentStore = useEnrollmentStore();
const notifications = useNotificationStore();

const pendingRemove = ref(null);
const removing = ref(false);

const courseOptions = computed(() =>
    courseStore.courses.map((course) => ({ value: course.courseId, label: `${course.courseId} — ${course.name}` }))
);

// Selecting a course loads its roster
const selectedCourse = computed({
    get: () => enrollmentStore.rosterCourseId,
    set: (courseId) => enrollmentStore.fetchRoster(courseId),
});

async function confirmRemove() {
    const enrollment = pendingRemove.value;
    removing.value = true;
    try {
        await enrollmentStore.unenroll(enrollment);
        notifications.success(`Removed ${enrollment.student.name} from ${enrollment.course.courseId}`);
    } catch (err) {
        notifications.error(err.message);
    } finally {
        removing.value = false;
        pendingRemove.value = null;
    }
}
</script>

<template>
    <div>
        <SelectField
            id="roster-course"
            v-model="selectedCourse"
            label="Course"
            placeholder="Select a course to see its students"
            :options="courseOptions"
        />

        <div class="roster" aria-live="polite">
            <EmptyState v-if="!enrollmentStore.rosterCourseId" message="Select a course to list its enrolled students." />
            <LoadingSpinner v-else-if="enrollmentStore.loading" label="Loading roster…" />
            <BaseAlert v-else-if="enrollmentStore.error">{{ enrollmentStore.error }}</BaseAlert>
            <EmptyState v-else-if="!enrollmentStore.rosterCount" message="No students are enrolled in this course yet." />

            <template v-else>
                <p class="roster__count">
                    {{ enrollmentStore.rosterCount }} student{{ enrollmentStore.rosterCount === 1 ? '' : 's' }} enrolled
                </p>
                <div class="table-wrap">
                    <table class="table table--responsive">
                        <caption class="sr-only">Students enrolled in {{ enrollmentStore.rosterCourseId }}</caption>
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Student ID</th>
                                <th scope="col">Phone</th>
                                <th scope="col"><span class="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="enrollment in enrollmentStore.roster" :key="enrollment.id">
                                <td data-label="Name">{{ enrollment.student.name }}</td>
                                <td data-label="Student ID">{{ enrollment.student.studentId }}</td>
                                <td data-label="Phone">{{ enrollment.student.phone }}</td>
                                <td class="actions">
                                    <button
                                        type="button"
                                        class="btn btn--danger btn--sm"
                                        :aria-label="`Remove ${enrollment.student.name} from ${enrollment.course.courseId}`"
                                        @click="pendingRemove = enrollment"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </div>

        <ConfirmDialog
            :open="!!pendingRemove"
            :title="`Remove ${pendingRemove?.student.name ?? 'student'}?`"
            :message="`They will be unenrolled from ${pendingRemove?.course.courseId ?? 'this course'}. The student and course are not deleted.`"
            confirm-label="Remove"
            :busy="removing"
            @confirm="confirmRemove"
            @cancel="pendingRemove = null"
        />
    </div>
</template>

<style scoped>
.roster {
    margin-top: 1rem;
}

.roster__count {
    margin: 0 0 0.5rem;
    color: var(--color-muted);
    font-size: 0.9rem;
}
</style>
