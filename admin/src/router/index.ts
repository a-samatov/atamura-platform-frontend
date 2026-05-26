import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/admin/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/applications' },
      { path: 'applications', name: 'Applications', component: () => import('../views/Applications.vue') },
      { path: 'applications/:id', name: 'ApplicationDetail', component: () => import('../views/ApplicationDetail.vue') },
      { path: 'news', name: 'News', component: () => import('../views/News.vue') },
      { path: 'news/create', name: 'NewsCreate', component: () => import('../views/NewsEditor.vue') },
      { path: 'news/:id/edit', name: 'NewsEdit', component: () => import('../views/NewsEditor.vue') },
      { path: 'reviews', name: 'Reviews', component: () => import('../views/Reviews.vue') },
      { path: 'videos', name: 'Videos', component: () => import('../views/Videos.vue') },
      { path: 'progress', name: 'Progress', component: () => import('../views/ProgressPhotos.vue') },
      { path: 'documents', name: 'Documents', component: () => import('../views/Documents.vue') },
      { path: 'jobs', name: 'Jobs', component: () => import('../views/Jobs.vue') },
      { path: 'managers', name: 'Managers', component: () => import('../views/Managers.vue') },
      { path: 'settings', name: 'Settings', component: () => import('../views/Settings.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/admin' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
})
