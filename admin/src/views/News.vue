<template>
  <div>
    <div class="page-actions">
      <h1 class="page-title" style="margin-bottom: 0">{{ t('news_title') }}</h1>
      <div class="flex gap-2">
        <select v-model="filterLang" class="form-control" style="width: auto">
          <option value="">{{ t('news_all_langs') }}</option>
          <option value="ru">RU</option>
          <option value="kk">KK</option>
          <option value="en">EN</option>
        </select>
        <RouterLink to="/admin/news/create" class="btn btn-primary">
          {{ t('news_add') }}
        </RouterLink>
      </div>
    </div>

    <div class="card">
      <template v-if="loading">
        <div v-for="i in 6" :key="i" class="skeleton-row">
          <div style="flex:2;display:flex;flex-direction:column;gap:6px">
            <div class="skeleton skeleton-cell" style="width:70%"></div>
            <div class="skeleton skeleton-cell-sm" style="width:35%"></div>
          </div>
          <div class="skeleton skeleton-cell" style="width:40px;height:22px;border-radius:12px"></div>
          <div class="skeleton skeleton-cell" style="width:80px;height:22px;border-radius:12px"></div>
          <div class="skeleton skeleton-cell" style="width:80px"></div>
          <div class="skeleton skeleton-cell" style="width:140px;height:30px;border-radius:8px"></div>
        </div>
      </template>

      <table v-else-if="filtered.length" class="table">
        <thead>
          <tr>
            <th>{{ t('news_col_title') }}</th>
            <th>{{ t('news_col_lang') }}</th>
            <th>{{ t('news_col_status') }}</th>
            <th>{{ t('news_col_date') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in filtered" :key="article.id">
            <td>
              <span class="article-title">{{ article.title }}</span>
              <br><span class="text-muted text-sm">/news/{{ article.slug }}</span>
            </td>
            <td><span class="badge badge-gray">{{ article.lang?.toUpperCase() }}</span></td>
            <td>
              <span v-if="article.published" class="badge badge-success">{{ t('published') }}</span>
              <span v-else class="badge badge-warning">{{ t('draft') }}</span>
            </td>
            <td class="text-muted text-sm">{{ formatDate(article.created_at) }}</td>
            <td>
              <div class="flex gap-2">
                <RouterLink :to="`/admin/news/${article.id}/edit`" class="btn btn-secondary btn-sm">{{ t('edit') }}</RouterLink>
                <button
                  v-if="!article.published"
                  class="btn btn-primary btn-sm"
                  @click="publishArticle(article)"
                >{{ t('publish') }}</button>
                <button class="btn btn-danger btn-sm" @click="deleteArticle(article)">{{ t('delete') }}</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>{{ t('news_empty') }}</p>
        <RouterLink to="/admin/news/create" class="btn btn-primary">{{ t('create') }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../api'
import { useI18n } from '../i18n'
import type { NewsArticle } from '../types'

const { t } = useI18n()

const articles = ref<NewsArticle[]>([])
const loading = ref(true)
const filterLang = ref('')

const filtered = computed(() =>
  filterLang.value ? articles.value.filter(a => a.lang === filterLang.value) : articles.value
)

const fetchNews = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/news?limit=200')
    articles.value = res.data.data || []
  } catch {}
  loading.value = false
}

onMounted(fetchNews)

const publishArticle = async (article: NewsArticle) => {
  try {
    await api.patch(`/admin/news/${article.id}/publish`)
    article.published = true
  } catch {}
}

const deleteArticle = async (article: NewsArticle) => {
  if (!confirm(`${t('news_delete_confirm')} «${article.title}»?`)) return
  try {
    await api.delete(`/admin/news/${article.id}`)
    articles.value = articles.value.filter(a => a.id !== article.id)
  } catch {}
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU')
</script>

<style scoped>
.article-title { font-weight: 500; color: var(--dark); }
</style>
