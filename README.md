<div align="center">

# Atamura Platform — Frontend

Единая цифровая платформа для казахстанского застройщика **Atamura Group**.  
Восемь жилых комплексов в одной системе — публичный SSR-портал и административная панель.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859?style=flat-square&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-2.x-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.x-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)
[![CI](https://img.shields.io/github/actions/workflow/status/a-samatov/atamura-platform-frontend/ci.yml?label=CI&style=flat-square&logo=github-actions&logoColor=white)](https://github.com/a-samatov/atamura-platform-frontend/actions)

[🔗 Живое демо](https://atamura.qbix.kz) · [📋 Кейс проекта](https://studio.qbix.kz/cases/atamura-group/) · [📬 Контакт](mailto:4samatov@gmail.com)

</div>

---

> **💼 Репозиторий создан для демонстрации кода работодателям.**  
> Намеренно опубликована только фронтенд-часть проекта.  
> Бэкенд (Go + PostgreSQL + Redis), `.env`-файлы и инфраструктурные конфиги в репозиторий не включены.

---

## Структура репозитория

```
atamura-platform/
├── client/                   # Публичный SSR-портал — Nuxt 3
│   ├── composables/          # useHomeContent, usePhoneMask, useScrollReveal…
│   ├── components/sections/  # HeroSection, QuizSection, MapSection…
│   ├── pages/                # index.vue, en/index.vue, kz/index.vue
│   └── tests/                # Vitest (unit + component) + Playwright (E2E)
├── admin/                    # Административная панель — Vue 3 SPA
│   ├── src/
│   │   ├── locales/          # ru.ts · kk.ts · en.ts
│   │   ├── utils/labels.ts   # Переиспользуемые label-функции
│   │   ├── stores/auth.ts    # Pinia store — JWT + refresh
│   │   └── views/            # Applications, NewsEditor, Jobs…
│   └── tests/                # Vitest (unit + store) + Playwright (E2E)
└── .github/workflows/ci.yml  # GitHub Actions — параллельные unit → E2E
```

---

## Клиентская часть — Nuxt 3 SSR-портал

<div align="center">
<img src="/images/client.png" alt="Atamura Group — публичный сайт" width="100%" style="border-radius:8px" />
<sub>Главная страница — единый каталог всех жилых комплексов</sub>
</div>

### Стек

| | |
|---|---|
| **Framework** | Nuxt 3 (SSR + SSG гибрид) |
| **UI-слой** | Vue 3 Composition API, TypeScript |
| **Состояние** | Pinia |
| **Утилиты** | VueUse |
| **CSS** | Кастомные CSS-переменные (дизайн-система без UI-библиотек) |
| **Деплой** | Node.js контейнер, multi-stage Docker |

### Ключевые решения

- **Гибридный рендеринг** — SSR для новостей и вакансий (`/news/**`, `/careers/**`), SSG prerender для страниц ЖК и статики. Роутинг через `routeRules` в `nuxt.config.ts`.
- **Трёхъязычность RU / KZ / EN** — маршрутизация по URL-пути (`/`, `/kz`, `/en`), `hreflang` + `canonical` на каждой странице, `useHomeContent(locale)` как единый источник контента для всех трёх версий.
- **Prop-driven компоненты** — все секции (`HeroSection`, `QuizSection`, `MapSection`…) получают типизированный контент через props; нет захардкоженного текста внутри компонентов.
- **Квалификационный квиз** — многошаговый сбор данных о клиенте, ответы уходят менеджеру ещё до звонка. Маска телефона, валидация, `thank-you`-экран.
- **SEO** — `useSeoMeta`, Schema.org, динамический `sitemap.xml`, `robots.txt` через Nitro.
- **Lighthouse 95+** в продакшене.

---

## Административная панель — Vue 3 SPA

<div align="center">
<img src="/images/admin.png" alt="Atamura Admin — административная панель" width="100%" style="border-radius:8px" />
<sub>Управление заявками, контентом и командой</sub>
</div>

### Стек

| | |
|---|---|
| **Framework** | Vue 3 + Vite 5 |
| **UI-слой** | Composition API, TypeScript |
| **Состояние** | Pinia |
| **HTTP** | Axios + interceptors (auth, refresh) |
| **Роутинг** | Vue Router 4 |
| **i18n** | Собственный `useI18n` — RU / KK / EN, без сторонних библиотек |
| **Деплой** | nginx:alpine, multi-stage Docker |

### Ключевые решения

- **JWT + refresh без race condition** — единственный `refreshPromise` на уровне модуля дедуплицирует параллельные 401-ответы; все запросы ждут один refresh вместо того, чтобы отправлять несколько.
- **RBAC** — три уровня доступа: `manager`, `admin`, `super_admin` с изоляцией данных.
- **i18n без зависимостей** — `locales/ru.ts · kk.ts · en.ts` + тонкая обёртка `useI18n()`. Словари разнесены по файлам (по ~280 строк каждый), единый `i18n.ts` — 24 строки.
- **Разделение ответственности** — `useLabels()` инкапсулирует все label-функции (`jkLabel`, `typeLabel`, `statusLabel`, `statusClass`, `formatDate`), которые раньше дублировались в 6+ view-файлах.
- **XSS-защита в превью редактора** — `sanitizedPreview` computed через `DOMParser` снимает `<script>`, `<iframe>`, inline-обработчики событий и `javascript:`-атрибуты перед рендером `v-html`.
- **CRUD по всем сущностям** — заявки, новости, отзывы, видео, документы, вакансии, менеджеры, ЖК, планировки, прогресс строительства.
- **Реалтайм-уведомления** — новые заявки приходят в Telegram с полным контекстом клиента.

---

## Тестирование

Покрытие строится по пирамиде: быстрые unit-тесты (нет браузера) → тесты компонентов (JSDOM/happy-dom) → E2E (реальный браузер).

### Инструменты

| Слой | Инструмент | Применение |
|---|---|---|
| Unit | **Vitest** | Чистые функции, store, composables |
| Компоненты | **Vue Test Utils** + Vitest | QuizSection, NewsEditor |
| E2E | **Playwright** | Quiz-флоу, языковой переключатель, авторизация |
| CI | **GitHub Actions** | Запуск на каждый push и PR |

### Что покрыто и почему

**`admin/tests/unit/`**

```
utils/labels.test.ts   buildSlug, transliterate, useLabels (jkLabel, statusClass…)
i18n.test.ts           useI18n, setLocale, fallback RU→key для пустых locale
stores/auth.test.ts    login/logout/refreshToken — автомат состояний с моком axios
```

- `buildSlug` гарантирует, что кириллица в заголовках не попадёт в URL.
- auth-store тесты ловят ситуацию, когда logout не очищает localStorage.

**`client/tests/`**

```
unit/composables/useHomeContent.test.ts  Все 3 локали × все секции × кросс-локаль
unit/composables/formatPhone.test.ts     Маска: пустой ввод, частичный, обрезка
components/QuizSection.test.ts           Шаги, back-навигация, валидация, submit
```

- `useHomeContent` гарантирует структурную целостность: добавление нового поля в `ru` без `kk`/`en` немедленно сломает тест.
- Компонентный тест квиза покрывает всю UX-цепочку без поднятия Nuxt.

### Запуск тестов

```bash
# Unit-тесты (без браузера, ~секунды)
cd admin && npm test
cd client && npm test

# Unit-тесты с покрытием
cd admin && npm run test:coverage
cd client && npm run test:coverage

# E2E (нужен build)
cd client && npm run build && npm run test:e2e
cd admin  && npm run build && npm run test:e2e

# Интерактивный watch-режим при разработке
cd admin && npm run test:watch
cd client && npm run test:watch
```

E2E-тесты авторизации читают учётные данные из переменных окружения:

```bash
TEST_ADMIN_EMAIL=admin@example.com \
TEST_ADMIN_PASSWORD=secret \
npm run test:e2e
```

---

## CI/CD

GitHub Actions запускается на каждый `push` и `pull_request`.

```
push / PR
    │
    ├── unit-admin    ── npm test (Vitest, jsdom)
    ├── unit-client   ── npm test (Vitest, happy-dom)
    └── typecheck     ── vue-tsc + nuxi typecheck
            │
            ├── e2e-client  ── nuxt build → playwright (quiz, lang-switch)
            └── e2e-admin   ── vite build → playwright (login, applications)
```

- `unit-*` и `typecheck` запускаются параллельно — E2E стартуют только после их прохождения.
- `concurrency` отменяет устаревшие прогоны той же ветки.
- Playwright Traces и скриншоты загружаются как артефакты при падении.
- Секрет `TEST_ADMIN_PASSWORD` передаётся только в E2E-job, не доступен остальным шагам.

---

## Быстрый старт

```bash
# Клиентская часть
cd client
npm install
cp .env.example .env    # задать NUXT_PUBLIC_API_BASE
npm run dev             # http://localhost:3000

# Административная панель
cd admin
npm install
npm run dev             # http://localhost:5173
```

Полная инструкция по деплою с Docker и переменными окружения — в [кейсе проекта](https://studio.qbix.kz/cases/atamura-group/).

---

## Архитектура (схема)

```
Cloudflare CDN
      │
  nginx (TLS, gzip, cache-headers)
      │
  ┌───┴──────────────────┐
  │                      │
Nuxt 3 SSR           nginx:alpine
(client, :3000)      (admin SPA, :80)
  │                      │
  └──────────┬───────────┘
             │  /api/*
        Go + Fiber
             │
     PostgreSQL + Redis
```

Бэкенд и инфраструктура в репозиторий не включены. Полное описание — в [кейсе проекта](https://studio.qbix.kz/cases/atamura-group/).

---

## Автор

**Амандық Саматов**  
[GitHub](https://github.com/a-samatov) · [Email](mailto:4samatov@gmail.com) · [Кейс](https://studio.qbix.kz/cases/atamura-group/)

---

<div align="center">
<sub>Продакшн-проект · 2026 · Алматы, Казахстан</sub>
</div>
