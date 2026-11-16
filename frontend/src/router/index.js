import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', redirect: '/students' },
    {
        path: '/students',
        name: 'students',
        component: () => import('@/views/StudentsView.vue'),
        meta: { title: 'Students' },
    },
    {
        path: '/courses',
        name: 'courses',
        component: () => import('@/views/CoursesView.vue'),
        meta: { title: 'Courses' },
    },
    {
        path: '/enrollments',
        name: 'enrollments',
        component: () => import('@/views/EnrollmentsView.vue'),
        meta: { title: 'Enrollments' },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFoundView.vue'),
        meta: { title: 'Page not found' },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 }),
});

router.afterEach((to) => {
    document.title = `${to.meta.title} · Student Management System`;
});

export default router;
