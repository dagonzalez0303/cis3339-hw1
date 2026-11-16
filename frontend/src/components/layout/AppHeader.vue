<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const links = [
    { to: '/students', label: 'Students' },
    { to: '/courses', label: 'Courses' },
    { to: '/enrollments', label: 'Enrollments' },
];

const menuOpen = ref(false);
const route = useRoute();

// Close the mobile menu after navigating
watch(() => route.path, () => {
    menuOpen.value = false;
});
</script>

<template>
    <header class="header">
        <div class="container header__inner">
            <RouterLink to="/" class="brand">
                <img src="/favicon.svg" alt="" width="28" height="28">
                <span>Student Management</span>
            </RouterLink>

            <button
                class="menu-toggle"
                type="button"
                :aria-expanded="menuOpen"
                aria-controls="main-nav"
                @click="menuOpen = !menuOpen"
            >
                <span class="sr-only">Toggle navigation</span>
                <span class="menu-toggle__bar" aria-hidden="true"></span>
            </button>

            <nav id="main-nav" class="nav" :class="{ 'nav--open': menuOpen }" aria-label="Main">
                <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav__link">
                    {{ link.label }}
                </RouterLink>
            </nav>
        </div>
    </header>
</template>

<style scoped>
.header {
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 10;
}

.header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 4rem;
    flex-wrap: wrap;
}

.brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--color-text);
    text-decoration: none;
}

.nav {
    display: flex;
    gap: 0.25rem;
}

.nav__link {
    padding: 0.5rem 0.9rem;
    border-radius: var(--radius);
    color: var(--color-muted);
    font-weight: 500;
    text-decoration: none;
}

.nav__link:hover {
    background: var(--color-bg);
    color: var(--color-text);
}

.nav__link.router-link-active {
    background: var(--color-primary-soft);
    color: var(--color-primary);
}

.menu-toggle {
    display: none;
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: transparent;
    cursor: pointer;
}

.menu-toggle__bar,
.menu-toggle__bar::before,
.menu-toggle__bar::after {
    display: block;
    width: 1.1rem;
    height: 2px;
    margin: 0 auto;
    background: var(--color-text);
    position: relative;
}

.menu-toggle__bar::before,
.menu-toggle__bar::after {
    content: '';
    position: absolute;
}

.menu-toggle__bar::before { top: -6px; }
.menu-toggle__bar::after { top: 6px; }

@media (max-width: 640px) {
    .menu-toggle {
        display: block;
    }

    .nav {
        display: none;
        flex-direction: column;
        width: 100%;
        padding-bottom: 0.75rem;
    }

    .nav--open {
        display: flex;
    }
}
</style>
