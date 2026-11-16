<script setup>
import PageHeader from '@/components/ui/PageHeader.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
</script>

<template>
    <PageHeader title="Page not found" />
    <EmptyState message="The page you are looking for does not exist.">
        <RouterLink to="/students" class="btn btn--primary">Go to Students</RouterLink>
    </EmptyState>
</template>
