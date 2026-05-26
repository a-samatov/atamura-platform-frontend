<template>
  <div class="admin-layout">

    <!-- ─── Sidebar ─────────────────────────────────────────────────────── -->
    <aside class="sidebar">
      <!-- Brand -->
      <div class="sidebar__brand">
        <div class="sidebar__logo">
          <img style="width:38px;height:38px;object-fit:contain;" alt="Logo" src="/favicon.ico" />
        </div>
        <div class="sidebar__brand-text">
          <span class="sidebar__brand-name">Atamura</span>
          <span class="sidebar__brand-sub">Admin Panel</span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="sidebar__nav">
        <p class="sidebar__section-label">{{ t('nav_section_main') }}</p>

        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="sidebar__link"
          :class="{ active: isActive(item.to) }"
        >
          <span class="sidebar__link-icon" v-html="item.icon" />
          <span class="sidebar__link-label">{{ item.label }}</span>
          <span v-if="item.badge" class="sidebar__badge">{{ item.badge }}</span>
        </RouterLink>
      </nav>

      <!-- Bottom -->
      <div class="sidebar__bottom">

        <!-- Language switcher -->
        <div class="sidebar__lang-wrap">
          <button class="sidebar__lang-btn" @click="langOpen = !langOpen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>{{ langLabels[locale] }}</span>
            <svg class="sidebar__lang-chevron" :class="{ open: langOpen }" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <Transition name="dropdown">
            <div v-if="langOpen" class="sidebar__lang-dropdown">
              <button
                v-for="l in (['ru', 'kk', 'en'] as const)"
                :key="l"
                class="sidebar__lang-option"
                :class="{ active: locale === l }"
                @click="selectLocale(l)"
              >
                <span class="sidebar__lang-option-label">{{ langLabels[l] }}</span>
                <svg v-if="locale === l" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:auto;color:#4dd9ec"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
            </div>
          </Transition>
        </div>

        <!-- User -->
        <div class="sidebar__user-row">
          <div class="sidebar__user-avatar">{{ userInitials }}</div>
          <div class="sidebar__user-info">
            <p class="sidebar__user-name">{{ auth.manager?.name || 'Admin' }}</p>
            <p class="sidebar__user-role">{{ auth.manager?.role || 'manager' }}</p>
          </div>
          <button class="sidebar__logout" @click="handleLogout" :title="t('logout')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>

        <!-- Credit -->
        <div class="sidebar__credit"><a class="a-link" href="https://studio.qbix.kz/" target="_blank" rel="noopener">{{ t('developed_by') }}</a></div>
      </div>
    </aside>

    <!-- ─── Main content ──────────────────────────────────────────────── -->
    <div class="admin-content">

      <!-- Page content -->
      <main class="admin-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useI18n } from '../i18n'

interface NavItem { to: string; label: string; icon: string; badge?: number }

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const { t, locale, setLocale } = useI18n()
const langOpen = ref(false)

const langLabels: Record<string, string> = { ru: 'Русский', kk: 'Қазақша', en: 'English' }

const selectLocale = (l: 'ru' | 'kk' | 'en') => { setLocale(l); langOpen.value = false }

const userInitials = computed(() => {
  const name = auth.manager?.name || 'A'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

const isAdmin = computed(() => {
  const role = auth.manager?.role
  return role === 'admin' || role === 'super_admin'
})

const navItems = computed<NavItem[]>(() => [
  {
    to: '/admin/applications',
    label: t('nav_applications'),
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  },
  {
    to: '/admin/news',
    label: t('nav_news'),
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z"/></svg>`,
  },
  {
    to: '/admin/reviews',
    label: t('nav_reviews'),
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
  {
    to: '/admin/videos',
    label: t('nav_videos'),
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  },
  {
    to: '/admin/progress',
    label: t('nav_progress'),
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  },
  {
    to: '/admin/documents',
    label: t('nav_documents'),
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  },
  {
    to: '/admin/jobs',
    label: t('nav_jobs'),
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
  },
  ...(isAdmin.value ? [{
    to: '/admin/managers',
    label: t('nav_managers'),
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  }] : []),
  {
    to: '/admin/settings',
    label: t('nav_settings'),
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  },
])

const isActive = (to: string) => route.path === to || (to !== '/admin' && route.path.startsWith(to))

const handleLogout = async () => {
  await auth.logout()
  router.push('/admin/login')
}

onMounted(() => { auth.fetchMe() })
</script>

<style scoped>
/* ─── Layout shell ──────────────────────────────────────────────────── */
.admin-layout { display: flex; min-height: 100vh; background: #f0f4f8; }

/* ─── Sidebar ────────────────────────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-width);
  background: #0d1b2a;
  color: white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  border-right: 1px solid rgba(255,255,255,0.05);
}

/* Brand */
.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 22px 20px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.sidebar__logo {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.sidebar__brand-name { font-size: 15px; font-weight: 800; color: white; letter-spacing: -0.03em; display: block; }
.sidebar__brand-sub  { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 500; letter-spacing: 0.02em; display: block; margin-top: 1px; }

/* Nav */
.sidebar__nav {
  flex: 1;
  padding: 18px 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow-y: auto;
}
.sidebar__nav::-webkit-scrollbar { width: 4px; }
.sidebar__nav::-webkit-scrollbar-track { background: transparent; }
.sidebar__nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

.sidebar__section-label {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.28);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 0 10px 10px;
}
.sidebar__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255,255,255,0.5);
  transition: all var(--transition);
  position: relative;
}
.sidebar__link:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
.sidebar__link.active {
  background: rgba(0, 116, 132, 0.25);
  color: #5ee8f8;
}
.sidebar__link.active .sidebar__link-icon { opacity: 1; color: #5ee8f8; }
.sidebar__link-icon { flex-shrink: 0; opacity: 0.55; display: flex; transition: opacity var(--transition); }
.sidebar__link:hover .sidebar__link-icon { opacity: 1; }
.sidebar__link-label { flex: 1; }
.sidebar__badge {
  background: var(--danger);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* Bottom section */
.sidebar__bottom {
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
}

/* Language switcher */
.sidebar__lang-wrap { padding: 10px 12px 4px; position: relative; }
.sidebar__lang-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 9px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.45);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
}
.sidebar__lang-btn:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.85); }
.sidebar__lang-chevron { transition: transform 0.2s ease; margin-left: auto; }
.sidebar__lang-chevron.open { transform: rotate(180deg); }

.sidebar__lang-dropdown {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 12px;
  right: 12px;
  background: #1a2d3e;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  z-index: 200;
}
.sidebar__lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 16px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all var(--transition);
}
.sidebar__lang-option:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
.sidebar__lang-option.active { color: #5ee8f8; }
.sidebar__lang-option-label { flex: 1; }

/* Dropdown transition */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.18s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(6px); }

/* User row */
.sidebar__user-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px 6px;
}
.sidebar__user-avatar {
  width: 34px;
  height: 34px;
  background: var(--primary);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
  color: white;
  letter-spacing: 0.02em;
}
.sidebar__user-info { min-width: 0; flex: 1; }
.sidebar__user-name { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sidebar__user-role { font-size: 11px; color: rgba(255,255,255,0.32); text-transform: capitalize; margin-top: 1px; }
.sidebar__logout {
  background: none;
  border: none;
  color: rgba(255,255,255,0.3);
  padding: 7px;
  border-radius: 7px;
  transition: all var(--transition);
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
}
.sidebar__logout:hover { color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.08); }

/* Amanix credit */
.sidebar__credit {
  font-size: 10.5px;
  text-align: center;
  padding: 8px 12px 16px;
  letter-spacing: 0.02em;
}

.sidebar__credit a {
  color: rgba(255,255,255,0.18);
}

.sidebar__credit a:hover {
  color: var(--gray-400);
}

.sidebar__credit span { color: rgba(255,255,255,0.32); font-weight: 600; }

/* ─── Content area ───────────────────────────────────────────────────── */
.admin-content {
  margin-left: var(--sidebar-width);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header-site-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-500);
  padding: 8px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  transition: all var(--transition);
  background: white;
  letter-spacing: -0.01em;
}
.header-site-link:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }

.admin-main { flex: 1; padding: 32px; }
</style>
