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
> Намеренно опубликована только фронтенд-часть.  
> Бэкенд (Go + PostgreSQL + Redis) находится в приватном репозитории — подключается автоматически через GitHub Actions при запуске E2E-тестов.  
> `.env`-файлы и инфраструктурные конфиги в репозиторий не включены.

---

## Структура репозитория

```
atamura-platform/
├── client/                        # Публичный SSR-портал — Nuxt 3
│   ├── assets/css/                # CSS-переменные, reset, глобальные стили
│   ├── components/
│   │   ├── common/                # AppHeader, AppFooter, AppModal, FloatContact…
│   │   ├── sections/              # HeroSection, QuizSection, MapSection…
│   │   ├── forms/                 # ApplicationForm, QuizForm, PlanForm
│   │   ├── kz/, en/               # Локализованные варианты форм
│   │   └── news/, map/            # NewsCard, YandexMap
│   ├── composables/               # useHomeContent, usePhoneMask, useApplicationForm,
│   │                              #   useQuizForm, useLocale, useSanitize…
│   ├── constants/contact.ts       # Единый источник контактного телефона
│   ├── pages/
│   │   ├── index.vue, jk/…        # RU — главная, страницы ЖК, новости, вакансии
│   │   ├── kz/                    # KZ-версия (полностью независимая структура)
│   │   └── en/                    # EN-версия (полностью независимая структура)
│   ├── server/routes/             # sitemap.xml, robots.txt, прокси API и uploads
│   ├── stores/ui.ts               # Модальные окна, мобильное меню
│   └── tests/
│       ├── unit/composables/      # useHomeContent, useApplicationForm, useQuizForm,
│       │                          #   useLocale, usePhoneMask (formatPhone + validatePhone)
│       ├── unit/stores/           # useUiStore
│       ├── components/            # QuizSection (Vue Test Utils)
│       └── e2e/                   # quiz, language-switch (Playwright)
│
├── admin/                         # Административная панель — Vue 3 SPA
│   └── src/
│       ├── locales/               # ru.ts · kk.ts · en.ts (~280 строк каждый)
│       ├── utils/labels.ts        # jkLabel, typeLabel, statusLabel, buildSlug…
│       ├── stores/auth.ts         # Pinia — JWT + refresh token
│       ├── views/                 # Applications, NewsEditor, Jobs, Reviews…
│       └── tests/
│           ├── unit/              # i18n, labels/slug, auth store (включая fetchMe)
│           └── e2e/               # login, applications (Playwright)
│
└── .github/workflows/ci.yml       # GitHub Actions — unit → typecheck → E2E
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

- **Гибридный рендеринг** — SSR для новостей и вакансий, SSG prerender для страниц ЖК и статики. Роутинг через `routeRules` в `nuxt.config.ts`.
- **Трёхъязычность без i18n-библиотеки** — маршрутизация по URL-пути (`/`, `/kz`, `/en`), `hreflang` + `canonical` на каждой странице. Подробнее ниже.
- **Prop-driven компоненты** — все секции (`HeroSection`, `QuizSection`, `MapSection`…) получают типизированный контент через props. Захардкоженного текста внутри компонентов нет.
- **XSS-защита** — `useSanitize()` на базе DOMPurify фильтрует HTML из API перед вставкой через `v-html` в статьях новостей. Список разрешённых тегов и атрибутов — в `useSanitize.ts`.
- **Квалификационный квиз** — многошаговый сбор данных о клиенте. Локализованные вопросы для каждого языка, ответы уходят менеджеру до звонка.
- **SEO** — `useSeoMeta`, Schema.org, динамический `sitemap.xml` (новости + вакансии), `robots.txt` через Nitro server routes.
- **Единая точка контакта** — телефон и адрес вынесены в `constants/contact.ts`, импортируются везде без дублирования.

---

## Подход к мультиязычности

В проекте используется **файловая маршрутизация по языку** (`/`, `/kz/`, `/en/`) вместо `@nuxtjs/i18n`. Это осознанный выбор.

Каждая языковая версия живёт в своих файлах независимо. Это позволяет для любой локали изменить структуру страницы, переставить секции или добавить уникальный блок, не затрагивая остальные языки. При общем i18n-роутинге все локали вынуждены иметь одинаковую структуру — здесь этого ограничения нет.

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
| **HTTP** | Axios + interceptors (авторизация, refresh) |
| **Роутинг** | Vue Router 4 |
| **i18n** | Собственный `useI18n` — RU / KK / EN, без сторонних библиотек |
| **Деплой** | nginx:alpine, multi-stage Docker |

### Ключевые решения

- **JWT + refresh без race condition** — единственный `refreshPromise` на уровне модуля дедуплицирует параллельные 401-ответы. Все запросы ждут один refresh вместо того, чтобы запускать несколько.
- **i18n без зависимостей** — `locales/ru.ts · kk.ts · en.ts` + тонкая обёртка `useI18n()`. Словари разнесены по файлам (~280 строк каждый), сам `i18n.ts` — 24 строки.
- **Разделение ответственности** — `useLabels()` инкапсулирует все функции работы с метками (`jkLabel`, `typeLabel`, `statusLabel`, `statusClass`, `formatDate`). Ни один view не занимается форматированием самостоятельно.
- **XSS-защита в превью редактора** — `sanitizedPreview` через `DOMParser` убирает `<script>`, `<iframe>`, inline-обработчики и `javascript:`-ссылки перед рендером `v-html`.
- **CRUD по всем сущностям** — заявки, новости, отзывы, видео, документы, вакансии, менеджеры, планировки, прогресс строительства.
- **Реалтайм-уведомления** — новые заявки приходят в Telegram с полным контекстом клиента.

---

## Тестирование

Покрытие строится по пирамиде: быстрые unit-тесты → тесты компонентов → E2E с реальным браузером.

### Инструменты

| Слой | Инструмент | Применение |
|---|---|---|
| Unit | **Vitest** | Чистые функции, store, composables |
| Компоненты | **Vue Test Utils** + Vitest | QuizSection |
| E2E | **Playwright** | Quiz-флоу, языковой переключатель, авторизация |
| CI | **GitHub Actions** | Каждый push и PR, E2E с реальным бэкендом |

### Что и почему покрыто

**`admin/tests/unit/`**

| Файл | Что проверяет |
|---|---|
| `utils/labels.test.ts` | `transliterate`, `buildSlug` (кириллица→латиница, усечение, спецсимволы), `useLabels` (jkLabel, typeLabel, statusClass, formatDate) |
| `i18n.test.ts` | Переключение локали, корректные переводы в RU/KK/EN, возврат ключа для неизвестных строк |
| `stores/auth.test.ts` | `login` / `logout` / `refreshToken` / `fetchMe` — полный автомат состояний с моком axios |

**`client/tests/unit/`**

| Файл | Что проверяет |
|---|---|
| `composables/useHomeContent.test.ts` | Все 3 локали × все секции страницы × кросс-локаль консистентность |
| `composables/useApplicationForm.test.ts` | `submit`, `error`, `reset`; locale-aware сообщения об ошибках на трёх языках |
| `composables/useQuizForm.test.ts` | `selectOption`, переходы по шагам, прогресс, `submitContact`, payload, `reset` |
| `composables/useLocale.test.ts` | Определение языка по URL: `/kz/*` → `kk`, `/en/*` → `en`, всё остальное → `ru` |
| `composables/formatPhone.test.ts` | Маска (`formatPhone`): пустой ввод, частичный, KZ-формат, обрезка до 15 цифр; валидация (`validatePhone`): все коды ошибок |
| `stores/useUiStore.test.ts` | `openModal` / `closeModal` (тип, данные, состояние), `toggleMobileMenu`, `closeMobileMenu` |

**`client/tests/components/`**

| Файл | Что проверяет |
|---|---|
| `QuizSection.test.ts` | Шаги квиза, back-навигация, валидация телефона, submit, экран благодарности, прогресс-бар |

**`client/tests/e2e/` и `admin/tests/e2e/`**

| Файл | Что проверяет |
|---|---|
| `quiz.spec.ts` | Полный сценарий: вопросы → контактная форма → отправка → экран спасибо |
| `language-switch.spec.ts` | `lang`-атрибут, `canonical`, `hreflang`, контент и локаль-специфичные ссылки на трёх языках |
| `login.spec.ts` | Auth guard, форма входа, неверные данные, успешный логин |
| `applications.spec.ts` | Таблица/пустое состояние, фильтр статусов, live-индикатор |

**Почему именно это покрыто, а не всё подряд:**

- `useHomeContent` ловит структурные несоответствия между локалями — добавишь поле в `ru` без `kk`/`en`, тест упадёт немедленно.
- `useApplicationForm` и `useQuizForm` проверяют locale-aware сообщения об ошибках на трёх языках — не только happy path.
- `useLocale` гарантирует корректное определение языка из URL без завязки на роутер Nuxt.
- auth-store тесты ловят ситуацию, когда `logout` не очищает localStorage, или `fetchMe` падает молча вместо обновления профиля.
- Презентационные компоненты (`HeroSection`, `StatsSection`, `AboutSection`) намеренно не покрыты unit-тестами — они не содержат логики, и их поведение проверяет E2E.

### Запуск тестов

```bash
# Unit-тесты (без браузера, ~секунды)
cd admin  && npm test
cd client && npm test

# С отчётом о покрытии
cd admin  && npm run test:coverage
cd client && npm run test:coverage

# E2E (нужен build + запущенный бэкенд)
cd client && npm run build && npm run test:e2e
cd admin  && npm run build && npm run test:e2e

# Watch-режим при разработке
cd admin  && npm run test:watch
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
                                    │
                              Go backend (приватный репо)
                              поднимается через docker-compose.ci.yml
                              healthcheck → старт Playwright
```

**Детали пайплайна:**

- `unit-*` и `typecheck` запускаются параллельно. E2E стартует только после их прохождения.
- `concurrency` отменяет устаревшие прогоны той же ветки.
- **E2E работает с реальным бэкендом** — Go API поднимается из приватного репозитория через `docker-compose.ci.yml` с `healthcheck`. Playwright стартует только после того, как база данных и API полностью готовы — без `sleep` и гонок по времени.
- Playwright Traces и скриншоты загружаются как артефакты при падении.
- Секрет `TEST_ADMIN_PASSWORD` передаётся только в E2E-job через GitHub Secrets.

> **Бэкенд-репозиторий приватный**, но при необходимости могу предоставить доступ или показать отдельные части (Go, PostgreSQL-миграции, Docker Compose).  
> Напишите на [4samatov@gmail.com](mailto:4samatov@gmail.com).

---

## Быстрый старт

```bash
# Клиентская часть
cd client
npm install
cp .env.example .env    # задать NUXT_PUBLIC_API_BASE и NUXT_PUBLIC_SITE_URL
npm run dev             # http://localhost:3000

# Административная панель
cd admin
npm install
npm run dev             # http://localhost:5173
```

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
