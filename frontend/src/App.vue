<script setup>
import AppHeader from '@/components/layout/AppHeader.vue';
import ToastList from '@/components/ui/ToastList.vue';
</script>

<template>
    <a class="skip-link" href="#main">Skip to main content</a>
    <AppHeader />
    <main id="main" class="container" tabindex="-1">
        <RouterView />
    </main>
    <ToastList />
</template>
