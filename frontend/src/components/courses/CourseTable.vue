<script setup>
defineProps({
    courses: { type: Array, required: true },
});

const emit = defineEmits(['delete']);
</script>

<template>
    <div class="table-wrap">
        <table class="table table--responsive">
            <caption class="sr-only">Courses</caption>
            <thead>
                <tr>
                    <th scope="col">Course ID</th>
                    <th scope="col">Course name</th>
                    <th scope="col"><span class="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="course in courses" :key="course.id">
                    <td data-label="Course ID" class="nowrap">{{ course.courseId }}</td>
                    <td data-label="Course name">{{ course.name }}</td>
                    <td class="actions">
                        <button
                            type="button"
                            class="btn btn--danger btn--sm"
                            :aria-label="`Delete ${course.courseId}`"
                            @click="emit('delete', course)"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.nowrap {
    white-space: nowrap;
}
</style>
