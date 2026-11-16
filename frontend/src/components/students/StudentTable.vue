<script setup>
defineProps({
    students: { type: Array, required: true },
});

const emit = defineEmits(['delete']);
</script>

<template>
    <div class="table-wrap">
        <table class="table table--responsive">
            <caption class="sr-only">Students</caption>
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Student ID</th>
                    <th scope="col">Phone</th>
                    <th scope="col">ZIP</th>
                    <th scope="col"><span class="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="student in students" :key="student.id">
                    <td data-label="Name">{{ student.name }}</td>
                    <td data-label="Student ID">{{ student.studentId }}</td>
                    <td data-label="Phone">{{ student.phone }}</td>
                    <td data-label="ZIP">{{ student.zip }}</td>
                    <td class="actions">
                        <button
                            type="button"
                            class="btn btn--danger btn--sm"
                            :aria-label="`Delete ${student.name}`"
                            @click="emit('delete', student)"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
