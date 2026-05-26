<template>
  <div>
    <div class="page-actions">
      <RouterLink to="/admin/news" class="back-link">{{ t('back_to_news') }}</RouterLink>
      <div class="flex gap-2">
        <button class="btn btn-secondary" :disabled="saving" @click="saveAsDraft">{{ t('save_draft') }}</button>
        <button class="btn btn-primary" :disabled="saving" @click="saveAndPublish">
          {{ t('save_publish') }}
        </button>
      </div>
    </div>

    <div v-if="saved" class="alert alert-success mb-4">{{ t('saved_ok') }}</div>
    <div v-if="saveError" ref="saveErrorRef" class="alert alert-danger mb-4">{{ saveError }}</div>

    <div class="editor-layout">
      <div class="editor-main">
        <div class="card">
          <div class="card-body">
            <div class="form-group mb-4">
              <label class="form-label">{{ t('news_field_lang') }}</label>
              <select v-model="form.lang" class="form-control">
                <option value="ru">RU — Русский</option>
                <option value="kk">KK — Қазақша</option>
                <option value="en">EN — English</option>
              </select>
            </div>

            <div class="form-group mb-4">
              <label class="form-label" :class="{'is-invalid': fe.has('title')}">{{ t('news_field_title') }}</label>
              <input v-model="form.title" type="text" class="form-control" :class="{'is-invalid': fe.has('title')}" placeholder="Заголовок новости" @input="autoSlug" />
            </div>

            <div class="form-group mb-4">
              <label class="form-label">{{ t('news_field_seo_desc') }}</label>
              <textarea v-model="form.seo_description" class="form-control" rows="3" placeholder="SEO-описание для превью" />
            </div>

            <div class="form-group">
              <label class="form-label" :class="{'is-invalid': fe.has('content')}">{{ t('news_field_content') }}</label>
              <div class="editor-toolbar">
                <button type="button" class="toolbar-btn" @click="formatText('bold')" title="Жирный"><strong>B</strong></button>
                <button type="button" class="toolbar-btn" @click="formatText('italic')" title="Курсив"><em>I</em></button>
                <button type="button" class="toolbar-btn" @click="insertH2()" title="H2">H2</button>
                <button type="button" class="toolbar-btn" @click="insertH3()" title="H3">H3</button>
                <button type="button" class="toolbar-btn" @click="insertList()" title="Список">≡</button>
                <button type="button" class="toolbar-btn" @click="insertLink()" title="Ссылка"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></button>
                <div class="toolbar-divider" />
                <button type="button" class="toolbar-btn toolbar-btn--preview" :class="{ active: showPreview }" @click="showPreview = !showPreview">
                  {{ showPreview ? t('news_editor_btn') : t('news_preview') }}
                </button>
              </div>
              <textarea
                v-if="!showPreview"
                ref="editorRef"
                v-model="form.content"
                class="form-control editor-textarea"
                :class="{'is-invalid': fe.has('content')}"
                rows="20"
                placeholder="Текст статьи в HTML..."
              />
              <div v-else class="editor-preview prose" v-html="sanitizedPreview" />
            </div>
          </div>
        </div>
      </div>

      <aside class="editor-sidebar">
        <div class="card">
          <div class="card-header"><span class="card-title">{{ t('news_settings') }}</span></div>
          <div class="card-body">
            <div class="form-group mb-4">
              <label class="form-label" :class="{'is-invalid': fe.has('slug')}">{{ t('news_field_slug') }}</label>
              <input v-model="form.slug" type="text" class="form-control" :class="{'is-invalid': fe.has('slug')}" placeholder="news-article-slug" />
              <p class="form-hint">{{ t('news_slug_hint') }}{{ form.slug || '...' }}</p>
            </div>

            <div class="form-group mb-4">
              <label class="form-label">{{ t('news_field_tags') }}</label>
              <input v-model="tagsInput" type="text" class="form-control" :placeholder="t('news_tags_hint')" />
            </div>

            <div class="form-group mb-4">
              <label class="form-label">{{ t('news_field_cover') }}</label>
              <FileUpload v-model="form.cover_image" accept="image/*" />
            </div>

            <div class="form-group mb-4">
              <label class="form-label">{{ t('news_field_cover_alt') }}</label>
              <input v-model="form.cover_alt" type="text" class="form-control" placeholder="Описание изображения" />
            </div>

            <div class="form-group mb-4">
              <label class="form-label">{{ t('news_field_seo_title') }}</label>
              <input v-model="form.seo_title" type="text" class="form-control" placeholder="SEO заголовок" />
            </div>

            <div class="form-group mb-4">
              <label class="form-label">{{ t('news_field_jk') }}</label>
              <select v-model="form.jk_slug" class="form-control">
                <option value="">{{ t('jk_none') }}</option>
                <option value="atmosfera">{{ t('jk_atmosfera') }}</option>
              </select>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import DOMPurify from 'dompurify'
import { api } from '../api'
import { useI18n } from '../i18n'
import { transliterate } from '../utils/labels'
import FileUpload from '../components/FileUpload.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const editorRef = ref<HTMLTextAreaElement | null>(null)

const isNew = computed(() => !route.params.id)
const saving = ref(false)
const saved = ref(false)
const saveError = ref('')
const fe = ref(new Set<string>())
const saveErrorRef = ref<HTMLElement | null>(null)
const showPreview = ref(false)
const tagsInput = ref('')

function showSaveError(msg: string, fields: string[] = []) {
  saveError.value = msg
  fe.value = new Set(fields)
  nextTick(() => saveErrorRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
}

const form = ref({
  lang: 'ru' as 'ru' | 'kk' | 'en',
  title: '',
  slug: '',
  seo_description: '',
  content: '',
  cover_image: '',
  cover_alt: '',
  seo_title: '',
  jk_slug: '',
})

const sanitizedPreview = computed(() =>
  form.value.content ? DOMPurify.sanitize(form.value.content) : ''
)

onMounted(async () => {
  if (!isNew.value) {
    try {
      const res = await api.get(`/admin/news/${route.params.id}`)
      const a = res.data
      form.value = {
        lang: a.lang || 'ru',
        title: a.title,
        slug: a.slug,
        seo_description: a.seo_description || '',
        content: a.content || '',
        cover_image: a.cover_image || '',
        cover_alt: a.cover_alt || '',
        seo_title: a.seo_title || '',
        jk_slug: a.jk_slug || '',
      }
      tagsInput.value = (a.tags || []).join(', ')
    } catch {}
  }
})


const autoSlug = () => {
  if (!isNew.value) return
  form.value.slug = transliterate(form.value.title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

const buildPayload = () => {
  const tags = tagsInput.value
    ? tagsInput.value.split(',').map(s => s.trim()).filter(Boolean)
    : null
  return {
    ...form.value,
    tags,
    jk_slug: form.value.jk_slug || null,
    cover_image: form.value.cover_image || null,
    cover_alt: form.value.cover_alt || null,
    seo_title: form.value.seo_title || null,
    seo_description: form.value.seo_description || null,
  }
}

const save = async (publish = false) => {
  const errs = new Set<string>()
  if (!form.value.title) errs.add('title')
  if (!form.value.slug) errs.add('slug')
  if (!form.value.content) errs.add('content')
  if (errs.size > 0) { showSaveError(t('error_required'), [...errs]); return }
  saving.value = true
  saved.value = false
  saveError.value = ''
  fe.value = new Set()
  try {
    const payload = buildPayload()
    let articleId = route.params.id as string
    if (isNew.value) {
      const res = await api.post('/admin/news', payload)
      articleId = res.data.id
    } else {
      await api.put(`/admin/news/${articleId}`, payload)
    }
    if (publish) {
      await api.patch(`/admin/news/${articleId}/publish`)
    }
    saved.value = true
    if (isNew.value) {
      router.replace(`/admin/news/${articleId}/edit`)
    }
  } catch {
    showSaveError(t('error_save'))
  }
  saving.value = false
}

const saveAsDraft = () => save(false)
const saveAndPublish = () => save(true)

const formatText = (cmd: string) => {
  const ta = editorRef.value
  if (!ta) return
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const sel = form.value.content.slice(start, end)
  const tag = cmd === 'bold' ? 'strong' : 'em'
  const replacement = `<${tag}>${sel}</${tag}>`
  form.value.content = form.value.content.slice(0, start) + replacement + form.value.content.slice(end)
}

const insertH2 = () => { form.value.content += '\n<h2></h2>\n' }
const insertH3 = () => { form.value.content += '\n<h3></h3>\n' }
const insertList = () => { form.value.content += '\n<ul>\n  <li></li>\n</ul>\n' }
const insertLink = () => {
  const url = prompt('URL:')
  if (url) form.value.content += `<a href="${url}">текст</a>`
}
</script>

<style scoped>
.back-link { font-size: 13px; color: var(--gray-600); transition: color var(--transition); }
.back-link:hover { color: var(--primary); }
.editor-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
.editor-main { min-width: 0; }
.editor-toolbar { display: flex; gap: 4px; padding: 8px; background: var(--gray-100); border: 1px solid var(--border); border-bottom: none; border-radius: var(--radius) var(--radius) 0 0; flex-wrap: wrap; }
.toolbar-btn { padding: 4px 10px; border: 1px solid var(--border); border-radius: 3px; background: white; font-size: 12px; color: var(--dark); transition: all var(--transition); }
.toolbar-btn:hover, .toolbar-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
.toolbar-divider { width: 1px; background: var(--border); margin: 0 4px; }
.toolbar-btn--preview { margin-left: auto; background: var(--gray-100); }
.editor-textarea { border-radius: 0 0 var(--radius) var(--radius) !important; font-family: 'Courier New', monospace; font-size: 13px; resize: vertical; min-height: 400px; }
.editor-preview { border: 1px solid var(--border); border-radius: 0 0 var(--radius) var(--radius); padding: 16px; min-height: 400px; font-size: 14px; line-height: 1.7; }
.editor-preview :deep(h2) { font-size: 18px; font-weight: 700; margin: 20px 0 10px; }
.editor-preview :deep(h3) { font-size: 15px; font-weight: 700; margin: 16px 0 8px; }
.editor-preview :deep(p) { margin-bottom: 12px; }
.editor-preview :deep(ul) { padding-left: 20px; margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
@media (max-width: 900px) { .editor-layout { grid-template-columns: 1fr; } }
</style>
