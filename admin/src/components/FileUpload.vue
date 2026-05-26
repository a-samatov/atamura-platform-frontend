<template>
  <div class="file-upload">
    <div v-if="modelValue" class="file-upload__preview">
      <img v-if="isImage" :src="modelValue" alt="Preview" class="file-upload__img" />
      <div v-else class="file-upload__doc">
        <svg class="file-upload__doc-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span class="file-upload__doc-name">{{ basename }}</span>
      </div>
      <button type="button" class="file-upload__clear" @click="clear" aria-label="Remove">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 3L3 9M3 3l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </div>

    <label class="file-upload__btn" :class="{ 'is-invalid': isInvalid, 'file-upload__btn--loading': uploading }">
      <input ref="inputRef" type="file" :accept="accept" @change="handleFile" :disabled="uploading" />
      <span v-if="uploading" class="file-upload__spinner">
        <span class="spinner" style="width:14px;height:14px;border-width:2px;display:inline-block" />
        {{ t('uploading') }}
      </span>
      <span v-else>{{ modelValue ? t('change_file') : t('choose_file') }}</span>
    </label>

    <p v-if="uploadError" class="file-upload__error">{{ uploadError }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { api } from '../api'
import { useI18n } from '../i18n'

const props = defineProps<{
  modelValue: string
  accept?: string
  isInvalid?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { t } = useI18n()
const inputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')

const isImage = computed(() => /\.(jpg|jpeg|png|webp|gif)$/i.test(props.modelValue))
const basename = computed(() => props.modelValue.split('/').pop() || props.modelValue)

async function handleFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    emit('update:modelValue', res.data.url)
  } catch {
    uploadError.value = t('upload_error')
  } finally {
    uploading.value = false
    if (inputRef.value) inputRef.value.value = ''
  }
}

function clear() {
  emit('update:modelValue', '')
  if (inputRef.value) inputRef.value.value = ''
  uploadError.value = ''
}
</script>

<style scoped>
.file-upload { display: flex; flex-direction: column; gap: 8px; }

.file-upload__preview {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--gray-100);
  max-width: 100%;
}

.file-upload__img {
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  display: block;
}

.file-upload__doc {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--dark);
}

.file-upload__doc-name {
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-upload__clear {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,.45);
  color: #fff;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.file-upload__clear:hover { background: rgba(0,0,0,.7); }

.file-upload__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  background: var(--gray-50, #fafafa);
  color: var(--primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
  width: 100%;
}
.file-upload__btn:hover { border-color: var(--primary); background: var(--primary-light, #eff6ff); }
.file-upload__btn.is-invalid { border-color: var(--danger); color: var(--danger); }
.file-upload__btn--loading { opacity: .7; cursor: default; }
.file-upload__btn input { display: none; }

.file-upload__spinner { display: flex; align-items: center; gap: 6px; }
.file-upload__error { font-size: 12px; color: var(--danger); margin: 0; }
</style>
