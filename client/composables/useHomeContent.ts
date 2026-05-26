// ─── Types ────────────────────────────────────────────────────────────────────
import type { Locale } from '~/composables/useLocale'

export interface Slide { heading: string; sub: string; img: string; alt: string }
export interface BenefitItem { title: string; desc: string }
export interface Project { href: string; name: string; img: string; imgAlt: string; status: string; meta: string; desc: string; tags: string[] }
export interface WhyCard { title: string; desc: string }
export interface ProcessStep { title: string; desc: string }
export interface QuizQuestion { question: string; opts: string[] }
export interface MapMarker { lat: number; lng: number; title: string; description: string }

export interface HeroContent { eyebrow: string; slides: Slide[]; btnPrimary: string; btnSecondary: string }
export interface BenefitsContent { items: [BenefitItem, BenefitItem, BenefitItem, BenefitItem] }
export interface AboutContent { label: string; heading: string; paragraphs: [string, string]; cta: string; ctaLink: string; imgAlt: string; badgeText: string }
export interface JkContent { label: string; heading: string; desc: string; ctaText: string; projects: Project[] }
export interface StatsContent { eyebrow: string; stats: [{ unit: string; label: string }, { unit: string; label: string }, { unit: string; label: string }, { unit: string; label: string }] }
export interface WhyContent { label: string; heading: string; cards: [WhyCard, WhyCard, WhyCard, WhyCard] }
export interface ProcessContent { label: string; heading: string; desc: string; steps: [ProcessStep, ProcessStep, ProcessStep, ProcessStep] }
export interface QuizContent {
  label: string; heading: string; desc: string
  questions: QuizQuestion[]
  nameLabel: string; namePlaceholder: string
  phoneLabel: string; phoneError: string
  contactPrompt: string
  submitBtn: string; submittingBtn: string; backBtn: string
  thankTitle: string; thankDesc: string
  defaultName: string
  stepPrefix: string; stepOf: string
  lastStepText: string; submittedText: string
}
export interface MapContent { label: string; heading: string; desc: string; markers: MapMarker[] }
export interface PartnersContent { label: string; heading: string; desc: string; ctaText: string; ctaLink: string; listLabel: string; banks: Array<{ name: string }> }
export interface ReviewsContent { label: string; heading: string; desc: string; lang: string }
export interface NewsContent { label: string; heading: string; allText: string; allLink: string; lang: string }

export interface HomeContent {
  hero: HeroContent
  benefits: BenefitsContent
  about: AboutContent
  jk: JkContent
  stats: StatsContent
  why: WhyContent
  process: ProcessContent
  quiz: QuizContent
  map: MapContent
  partners: PartnersContent
  reviews: ReviewsContent
  news: NewsContent
}

// ─── Shared data (locale-independent) ────────────────────────────────────────

const MAP_MARKERS: MapMarker[] = [
  { lat: 43.255340, lng: 76.957853, title: 'Отдел продаж на Толе би',     description: 'г. Алматы, ул. Толе би, 12' },
  { lat: 43.328407, lng: 77.019172, title: 'Отдел продаж ЖК Атмосфера',  description: 'г. Алматы, мкр. Нуршашкан, ул. Алатау' },
  { lat: 43.182382, lng: 76.816449, title: 'Отдел продаж на Жандосова',   description: 'Ул. Жандосова 54 (БЦ UKO House)' },
  { lat: 43.364445, lng: 77.124499, title: 'Отдел продаж Аура',           description: 'с. Тузусай, Талгарский р-н, ул. Сырым Датулы, 100а' },
  { lat: 43.429439, lng: 77.025712, title: 'Отдел продаж Bravo',          description: 'п. Отечен Батыр, ул. Жансугурова 109' },
  { lat: 43.392038, lng: 77.024813, title: 'Отдел продаж ЖК Discovery',   description: 'Алматинская обл., Талгарский р-н, мкр. Жана Куат' },
]

const BANKS = [
  { name: 'Halyk Bank' },
  { name: 'Kaspi Bank' },
  { name: 'Jusan Bank' },
  { name: 'Freedom Bank' },
  { name: 'БЦК' },
]

// ─── Russian content ──────────────────────────────────────────────────────────

const RU: HomeContent = {
  hero: {
    eyebrow: 'Atamura Group · Алматы',
    btnPrimary: 'Смотреть ЖК',
    btnSecondary: 'Подобрать квартиру',
    slides: [
      { heading: 'Строим дома, в которых хочется жить', sub: 'Жилые комплексы бизнес-класса с продуманной инфраструктурой и современными планировками в Алматы', img: '/images/atamura3.webp', alt: 'ЖК Атмосфера — фасад жилого комплекса' },
      { heading: 'Прозрачность на каждом этапе', sub: 'Фотоотчёты о ходе строительства каждые две недели. Вы контролируете каждый шаг', img: '/images/atamura4.webp', alt: 'Ход строительства жилого комплекса' },
      { heading: 'Ипотека и рассрочка от застройщика', sub: 'Партнёрская ипотека от 5 банков. Рассрочка на выгодных условиях без переплат', img: '/images/atamura5.webp', alt: 'Квартиры в Алматы с ипотекой' },
    ],
  },
  benefits: {
    items: [
      { title: '14 лет на рынке',         desc: 'С 2010 года — без срывов сроков' },
      { title: 'Полная прозрачность',     desc: 'Фотоотчёты каждые две недели' },
      { title: 'Качество строительства',  desc: 'Только сертифицированные материалы' },
      { title: 'Ипотека от 5 банков',     desc: 'Halyk, Kaspi, Jusan, Freedom, БЦК' },
    ],
  },
  about: {
    label: 'О компании',
    heading: 'Строим с 2010 года',
    paragraphs: [
      'Atamura Group основана с единственной целью — создавать качественное жильё бизнес-класса в Алматы. За 14 лет мы построили и сдали 8 жилых комплексов, ни разу не нарушив сроков сдачи.',
      'Мы строим на собственные средства без перекрёстного финансирования между проектами, что гарантирует устойчивость каждого объекта независимо от рыночной конъюнктуры.',
    ],
    cta: 'О компании',
    ctaLink: '/about',
    imgAlt: 'Жилой комплекс Atamura Group в Алматы',
    badgeText: 'сданных\nобъектов',
  },
  jk: {
    label: 'Наши проекты',
    heading: 'Жилые комплексы',
    desc: 'Бизнес-класс с авторской архитектурой и развитой инфраструктурой',
    ctaText: 'Подробнее',
    projects: [
      { href: '/jk/atmosfera', name: 'ЖК Атмосфера', img: '/images/atamura3.webp', imgAlt: 'ЖК Атмосфера — жилой комплекс в Алматы', status: 'Строится', meta: 'г. Алматы · Бизнес-класс · Сдача IV кв. 2026', desc: 'Жилой комплекс с авторской архитектурой, закрытой территорией и панорамными видами на горы Алматы', tags: ['Панорамные виды', 'Закрытая территория'] },
      { href: '/jk/keruen',    name: 'ЖК Keruen',    img: '/images/keruen1.png',    imgAlt: 'ЖК Keruen — жилой комплекс в Алматы',    status: 'Строится', meta: 'г. Алматы · Бизнес-класс · Сдача IV кв. 2026', desc: 'Жилой комплекс, созданный по современным архитектурным стандартам с акцентом на безопасность и комфорт', tags: ['Панорамные виды', 'Закрытая территория'] },
      { href: '/jk/aqsai',    name: 'Aqsai Resort',  img: '/images/aqsai1.jpeg',    imgAlt: 'Aqsai Resort — жилой комплекс в Алматы',    status: 'Строится', meta: 'г. Алматы · Бизнес-класс · Сдача IV кв. 2026', desc: 'Современный малоэтажный микрорайон в предгорьях Алматы с полной инфраструктурой и центральным бульваром', tags: ['Паркинг', 'Закрытая территория'] },
    ],
  },
  stats: {
    eyebrow: 'Atamura в цифрах',
    stats: [
      { unit: 'лет', label: 'на рынке недвижимости Алматы' },
      { unit: 'ЖК',  label: 'построено и сдано в эксплуатацию' },
      { unit: '+',   label: 'семей выбрали наши квартиры' },
      { unit: '%',   label: 'соблюдение сроков сдачи' },
    ],
  },
  why: {
    label: 'Наши принципы',
    heading: 'Почему выбирают Atamura',
    cards: [
      { title: 'Надёжность',       desc: 'Ни одного срыва сроков за 14 лет. Все обязательства перед дольщиками выполнены точно в срок.' },
      { title: 'Прозрачность',     desc: 'Регулярные фото- и видеоотчёты о ходе строительства. Вы видите каждый этап работ в режиме реального времени.' },
      { title: 'Гарантийный сервис', desc: 'Гарантийное обслуживание каждого сданного объекта. Любые недостатки устраняем за наш счёт.' },
      { title: 'Гибкие условия',   desc: 'Ипотека от 5 банков-партнёров, рассрочка от застройщика и индивидуальные условия для каждого покупателя.' },
    ],
  },
  process: {
    label: 'Как мы работаем',
    heading: 'Путь к вашей квартире',
    desc: 'Сопровождаем вас на каждом шаге — от первого звонка до получения ключей',
    steps: [
      { title: 'Консультация',       desc: 'Бесплатная консультация по телефону или в офисе продаж. Ответим на все вопросы о проекте.' },
      { title: 'Выбор квартиры',    desc: 'Подбираем планировку под ваш бюджет и пожелания. Показываем 3D-туры и виды из окон.' },
      { title: 'Оформление сделки', desc: 'Безопасная сделка с юридическим сопровождением. Помогаем с ипотекой и документами.' },
      { title: 'Получение ключей',  desc: 'Сдача объекта точно в срок. Гарантийное обслуживание 3 года после заселения.' },
    ],
  },
  quiz: {
    label: 'Персональный подбор',
    heading: 'Не знаете с чего начать?',
    desc: 'Ответьте на 5 вопросов — мы подберём лучший вариант квартиры и рассчитаем ипотечные условия под ваши возможности',
    questions: [
      { question: 'Какой тип квартиры вас интересует?', opts: ['Студия', '1 комната', '2 комнаты', '3 комнаты', '4+ комнат'] },
      { question: 'Какой у вас бюджет?',                opts: ['До 20 млн ₸', '20–35 млн ₸', '35–50 млн ₸', 'Свыше 50 млн ₸'] },
      { question: 'Нужна ипотека?',                     opts: ['Да, интересует', 'Нет, оплата наличными', 'Рассрочка от застройщика'] },
      { question: 'Когда планируете переехать?',        opts: ['Как можно скорее', 'До конца года', 'В течение года', 'Просто смотрю'] },
      { question: 'Для кого выбираете квартиру?',       opts: ['Для семьи', 'Для себя', 'Как инвестицию'] },
    ],
    nameLabel: 'Ваше имя', namePlaceholder: 'Иван',
    phoneLabel: 'Телефон', phoneError: 'Укажите телефон',
    contactPrompt: 'Готово! Оставьте контакты — мы свяжемся в течение 15 минут',
    submitBtn: 'Отправить заявку', submittingBtn: 'Отправка…', backBtn: 'Назад',
    thankTitle: 'Заявка отправлена!', thankDesc: 'Наш менеджер свяжется с вами в течение 15 минут в рабочее время',
    defaultName: 'Не указано',
    stepPrefix: 'Вопрос', stepOf: 'из',
    lastStepText: 'Последний шаг', submittedText: 'Заявка отправлена',
  },
  map: {
    label: 'Расположение',
    heading: 'Наши объекты в Алматы',
    desc: 'Удобное расположение с развитой транспортной инфраструктурой',
    markers: MAP_MARKERS,
  },
  partners: {
    label: 'Ипотека',
    heading: 'Банки-партнёры',
    desc: 'Оформите ипотеку на выгодных условиях через наших партнёров',
    ctaText: 'Условия ипотеки', ctaLink: '/mortgage',
    listLabel: 'Банки-партнёры',
    banks: BANKS,
  },
  reviews: { label: 'Доверие', heading: 'Отзывы жителей', desc: 'Более 1 200 семей уже живут в наших домах', lang: 'ru' },
  news:    { label: 'Актуально', heading: 'Последние новости', allText: 'Все новости', allLink: '/news', lang: 'ru' },
}

// ─── English content ──────────────────────────────────────────────────────────

const EN: HomeContent = {
  hero: {
    eyebrow: 'Atamura Group · Almaty',
    btnPrimary: 'View Projects',
    btnSecondary: 'Find an Apartment',
    slides: [
      { heading: "Building homes you'll love to live in", sub: 'Business-class residential complexes with thoughtful infrastructure and modern layouts in Almaty', img: '/images/atamura3.webp', alt: 'Atmosfera — residential complex facade' },
      { heading: 'Full transparency at every stage', sub: 'Photo reports on construction progress every two weeks. You control every step', img: '/images/atamura4.webp', alt: 'Construction progress at residential complex' },
      { heading: 'Mortgage and installment plans', sub: 'Partner mortgage from 5 banks. Flexible installment plans with no overpayment', img: '/images/atamura5.webp', alt: 'Apartments in Almaty with mortgage options' },
    ],
  },
  benefits: {
    items: [
      { title: '14 years on the market',   desc: 'Since 2010 — zero missed deadlines' },
      { title: 'Full transparency',        desc: 'Photo reports every two weeks' },
      { title: 'Construction quality',     desc: 'Only certified materials used' },
      { title: 'Mortgage from 5 banks',    desc: 'Halyk, Kaspi, Jusan, Freedom, BCK' },
    ],
  },
  about: {
    label: 'About Us',
    heading: 'Building since 2010',
    paragraphs: [
      'Atamura Group was founded with a single goal — to create quality business-class housing in Almaty. Over 14 years we have built and delivered 8 residential complexes without ever missing a deadline.',
      'We build with our own funds without cross-financing between projects, guaranteeing the stability of every development regardless of market conditions.',
    ],
    cta: 'About the Company',
    ctaLink: '/en/about',
    imgAlt: 'Atamura Group residential complex in Almaty',
    badgeText: 'delivered\nprojects',
  },
  jk: {
    label: 'Our Projects',
    heading: 'Residential Complexes',
    desc: 'Business class with signature architecture and developed infrastructure',
    ctaText: 'Learn More',
    projects: [
      { href: '/en/jk/atmosfera', name: 'Atmosfera',    img: '/images/atamura3.webp', imgAlt: 'Atmosfera — residential complex in Almaty',    status: 'Under Construction', meta: 'Almaty · Business Class · Q4 2026 delivery', desc: 'A residential complex with signature architecture, secured grounds and panoramic views of the Almaty mountains', tags: ['Panoramic views', 'Secured grounds'] },
      { href: '/en/jk/keruen',    name: 'Keruen',       img: '/images/keruen1.png',    imgAlt: 'Keruen — residential complex in Almaty',       status: 'Under Construction', meta: 'Almaty · Business Class · Q4 2026 delivery', desc: 'A modern residential complex designed with cutting-edge architectural solutions for maximum comfort and safety', tags: ['Panoramic views', 'Secured grounds'] },
      { href: '/en/jk/aqsai',    name: 'Aqsai Resort', img: '/images/aqsai1.jpeg',    imgAlt: 'Aqsai Resort — residential complex in Almaty', status: 'Under Construction', meta: 'Almaty · Business Class · Q4 2026 delivery', desc: 'A modern low-rise microdistrict in the foothills of Almaty with full infrastructure and a central boulevard', tags: ['Parking', 'Secured grounds'] },
    ],
  },
  stats: {
    eyebrow: 'Atamura by the Numbers',
    stats: [
      { unit: 'years', label: 'in the Almaty real estate market' },
      { unit: 'RC',    label: 'built and delivered' },
      { unit: '+',     label: 'families chose our apartments' },
      { unit: '%',     label: 'compliance with delivery deadlines' },
    ],
  },
  why: {
    label: 'Our Principles',
    heading: 'Why Choose Atamura',
    cards: [
      { title: 'Reliability',        desc: 'Zero missed deadlines in 14 years. Every commitment to buyers fulfilled exactly on time.' },
      { title: 'Transparency',       desc: 'Regular photo and video progress reports. You can see every stage of construction in real time.' },
      { title: 'Warranty Service',   desc: 'Warranty coverage for every completed project. We fix any defects at our own expense.' },
      { title: 'Flexible Terms',     desc: 'Mortgage from 5 partner banks, developer installment plans and individual terms for every buyer.' },
    ],
  },
  process: {
    label: 'How we work',
    heading: 'Your path to a new home',
    desc: 'We guide you at every step — from the first call to receiving the keys',
    steps: [
      { title: 'Consultation',        desc: 'Free consultation by phone or at our sales office. We answer all questions about the project.' },
      { title: 'Apartment Selection', desc: 'We find the right layout for your budget and preferences. 3D tours and window views included.' },
      { title: 'Signing the Deal',    desc: 'Secure transaction with legal support. We assist with mortgage paperwork and documentation.' },
      { title: 'Receiving the Keys',  desc: 'On-time delivery, guaranteed. 3-year warranty service after move-in.' },
    ],
  },
  quiz: {
    label: 'Personal Selection',
    heading: 'Not sure where to start?',
    desc: "Answer 5 questions — we'll find the best apartment option and calculate mortgage terms tailored to your budget",
    questions: [
      { question: 'What type of apartment are you looking for?', opts: ['Studio', '1 bedroom', '2 bedrooms', '3 bedrooms', '4+ bedrooms'] },
      { question: 'What is your budget?',                        opts: ['Up to 20M ₸', '20–35M ₸', '35–50M ₸', 'Over 50M ₸'] },
      { question: 'Do you need a mortgage?',                     opts: ["Yes, I'm interested", 'No, cash payment', 'Developer installment plan'] },
      { question: 'When do you plan to move?',                   opts: ['As soon as possible', 'By end of year', 'Within a year', 'Just browsing'] },
      { question: 'Who are you buying for?',                     opts: ['For my family', 'For myself', 'As an investment'] },
    ],
    nameLabel: 'Your name', namePlaceholder: 'John',
    phoneLabel: 'Phone', phoneError: 'Please enter your phone number',
    contactPrompt: "Done! Leave your contact details — we'll reach out within 15 minutes",
    submitBtn: 'Submit', submittingBtn: 'Sending…', backBtn: 'Back',
    thankTitle: 'Application sent!', thankDesc: 'Our manager will contact you within 15 minutes during business hours',
    defaultName: 'Not specified',
    stepPrefix: 'Question', stepOf: 'of',
    lastStepText: 'Last step', submittedText: 'Application sent',
  },
  map: {
    label: 'Location',
    heading: 'Our Projects in Almaty',
    desc: 'Convenient location with developed transport infrastructure',
    markers: MAP_MARKERS,
  },
  partners: {
    label: 'Mortgage',
    heading: 'Partner Banks',
    desc: 'Get a mortgage on favourable terms through our banking partners',
    ctaText: 'Mortgage Terms', ctaLink: '/en/mortgage',
    listLabel: 'Partner banks',
    banks: BANKS,
  },
  reviews: { label: 'Trust', heading: 'Resident Reviews', desc: 'Over 1,200 families already live in our homes', lang: 'en' },
  news:    { label: 'Latest', heading: 'Recent News', allText: 'All News', allLink: '/en/news', lang: 'en' },
}

// ─── Kazakh content ───────────────────────────────────────────────────────────

const KK: HomeContent = {
  hero: {
    eyebrow: 'Atamura Group · Алматы',
    btnPrimary: 'ЖК қарау',
    btnSecondary: 'Пәтер таңдау',
    slides: [
      { heading: 'Біз ыңғайлы үйлер саламыз', sub: 'Алматыдағы бизнес-класс тұрғын үй кешендері — сауатты инфрақұрылымымен және заманауи жоспарлауымен', img: '/images/atamura3.webp', alt: 'ЖК Атмосфера — тұрғын үй кешенінің фасады' },
      { heading: 'Әрбір кезеңде ашықтық', sub: 'Екі аптада бір рет фотоесептер. Объектінің әрбір қадамын өзіңіз бақылайсыз', img: '/images/atamura4.webp', alt: 'Тұрғын үй кешенінің құрылыс барысы' },
      { heading: 'Ипотека және бөліп төлеу', sub: '5 серіктес банктен ипотека. Қолайлы шарттармен бөліп төлеу мүмкіндігі', img: '/images/atamura5.webp', alt: 'Алматыда пәтерге ипотека' },
    ],
  },
  benefits: {
    items: [
      { title: '14 жыл нарықта',       desc: '2010 жылдан бастап — мерзімсіз' },
      { title: 'Толық ашықтық',        desc: 'Екі аптада бір фотоесеп' },
      { title: 'Құрылыс сапасы',       desc: 'Тек сертификатталған материалдар' },
      { title: '5 банктен ипотека',    desc: 'Halyk, Kaspi, Jusan, Freedom, БЦК' },
    ],
  },
  about: {
    label: 'Компания туралы',
    heading: '2010 жылдан бастап саламыз',
    paragraphs: [
      'Atamura Group жалғыз мақсатпен — Алматыда бизнес-класс сапалы тұрғын үй салу үшін құрылды. 14 жыл ішінде 8 тұрғын үй кешенін тапсырдық, бірде де мерзімді бұзбадық.',
      'Жобалар арасында өзара қаржыландырусыз, өз қаражатымызбен саламыз — бұл нарық жағдайына қарамастан әрбір объектінің тұрақтылығын қамтамасыз етеді.',
    ],
    cta: 'Компания туралы',
    ctaLink: '/kz/about',
    imgAlt: 'Алматыдағы Atamura Group тұрғын үй кешені',
    badgeText: 'тапсырылған\nобъект',
  },
  jk: {
    label: 'Біздің жобалар',
    heading: 'Тұрғын үй кешендері',
    desc: 'Авторлық сәулетпен және дамыған инфрақұрылыммен бизнес-класс',
    ctaText: 'Толығырақ',
    projects: [
      { href: '/kz/jk/atmosfera', name: 'Атмосфера',    img: '/images/atamura3.webp', imgAlt: 'ЖК Атмосфера — Алматыдағы тұрғын үй кешені',    status: 'Салынуда', meta: 'Алматы · Бизнес-класс · 2026 жыл IV тоқсан', desc: 'Авторлық сәулетпен, жабық аумақпен және Алматы тауларына панорамалық көрінісімен тұрғын үй кешені', tags: ['Панорамалық көрініс', 'Жабық аумақ'] },
      { href: '/kz/jk/keruen',    name: 'Keruen',        img: '/images/keruen1.png',    imgAlt: 'ЖК Keruen — Алматыдағы тұрғын үй кешені',       status: 'Салынуда', meta: 'Алматы · Бизнес-класс · 2026 жыл IV тоқсан', desc: 'Максималды жайлылық пен қауіпсіздікті қамтамасыз ететін озық сәулеттік шешімдермен жобаланған заманауи тұрғын үй кешені', tags: ['Панорамалық көрініс', 'Жабық аумақ'] },
      { href: '/kz/jk/aqsai',    name: 'Aqsai Resort',  img: '/images/aqsai1.jpeg',    imgAlt: 'Aqsai Resort — Алматыдағы тұрғын үй кешені', status: 'Салынуда', meta: 'Алматы · Бизнес-класс · 2026 жыл IV тоқсан', desc: 'Алматының тау бөктеріндегі толық инфрақұрылымы және орталық бульвары бар заманауи аз қабатты шағын аудан', tags: ['Паркинг', 'Панорамалық көрініс'] },
    ],
  },
  stats: {
    eyebrow: 'Atamura сандармен',
    stats: [
      { unit: 'жыл', label: 'Алматы жылжымайтын мүлік нарығында' },
      { unit: 'ЖК',  label: 'салынып, пайдалануға берілді' },
      { unit: '+',   label: 'отбасы біздің пәтерді таңдады' },
      { unit: '%',   label: 'тапсыру мерзімдерін сақтау' },
    ],
  },
  why: {
    label: 'Біздің принциптер',
    heading: 'Неге Atamura таңдайды',
    cards: [
      { title: 'Сенімділік',      desc: '14 жылда бірде де мерзімді бұзбадық. Барлық міндеттемелер дольщиктер алдында уақытында орындалды.' },
      { title: 'Ашықтық',        desc: 'Құрылыс барысы туралы тұрақты фото және бейне есептер. Жұмыстың әрбір кезеңін нақты уақытта көресіз.' },
      { title: 'Кепілдік сервис', desc: 'Тапсырылған әрбір объектіге кепілдік қызмет. Кез келген кемшіліктерді өз есебімізден жоямыз.' },
      { title: 'Икемді шарттар', desc: '5 серіктес банктен ипотека, застройщиктен бөліп төлеу және әрбір сатып алушыға жеке шарттар.' },
    ],
  },
  process: {
    label: 'Қалай жұмыс жасаймыз',
    heading: 'Пәтерге дейінгі жол',
    desc: 'Бірінші қоңыраудан бастап кілт алғанға дейін — әрбір қадамда қасыңыздамыз',
    steps: [
      { title: 'Кеңес',             desc: 'Телефон арқылы немесе сату кеңсесінде тегін кеңес. Жоба туралы барлық сұрақтарға жауап береміз.' },
      { title: 'Пәтер таңдау',     desc: 'Бюджетіңіз бен қалауларыңызға сай жоспарлауды таңдаймыз. 3D-тур мен терезелерден ашылатын көріністі көрсетеміз.' },
      { title: 'Мәмілені ресімдеу', desc: 'Заңдық қолдаумен қауіпсіз мәміле. Ипотека мен құжаттарды рәсімдеуге көмектесеміз.' },
      { title: 'Кілт алу',         desc: 'Объектіні дәл мерзімінде тапсыру. Қоныс аударғаннан кейін 3 жыл кепілдік қызмет.' },
    ],
  },
  quiz: {
    label: 'Жеке іріктеу',
    heading: 'Қайдан бастарыңды білмейсіз бе?',
    desc: '5 сұраққа жауап беріңіз — біз ең жақсы нұсқаны таңдап, мүмкіндіктеріңізге сай ипотека шарттарын есептейміз',
    questions: [
      { question: 'Қандай пәтер түрін қалайсыз?', opts: ['Студия', '1 бөлме', '2 бөлме', '3 бөлме', '4+ бөлме'] },
      { question: 'Бюджетіңіз қандай?',            opts: ['20 млн ₸ дейін', '20–35 млн ₸', '35–50 млн ₸', '50 млн ₸ жоғары'] },
      { question: 'Ипотека керек пе?',             opts: ['Иә, қызықтырады', 'Жоқ, қолма-қол ақша', 'Застройщиктен бөліп төлеу'] },
      { question: 'Қашан көшпексіз?',             opts: ['Мүмкіндігінше тез', 'Жыл аяғына дейін', 'Бір жыл ішінде', 'Жай қарастырып жүрмін'] },
      { question: 'Кім үшін таңдайсыз?',          opts: ['Отбасы үшін', 'Өзім үшін', 'Инвестиция ретінде'] },
    ],
    nameLabel: 'Атыңыз', namePlaceholder: 'Айдар',
    phoneLabel: 'Телефон', phoneError: 'Телефонды көрсетіңіз',
    contactPrompt: 'Дайын! Байланыс ақпаратыңызды қалдырыңыз — 15 минут ішінде хабарласамыз',
    submitBtn: 'Өтінім жіберу', submittingBtn: 'Жіберілуде…', backBtn: 'Артқа',
    thankTitle: 'Өтінім жіберілді!', thankDesc: 'Менеджеріміз жұмыс уақытында 15 минут ішінде хабарласады',
    defaultName: 'Көрсетілмеген',
    stepPrefix: 'Сұрақ', stepOf: '/',
    lastStepText: 'Соңғы қадам', submittedText: 'Өтінім жіберілді',
  },
  map: {
    label: 'Орналасу',
    heading: 'Алматыдағы біздің объектілер',
    desc: 'Дамыған көлік инфрақұрылымымен ыңғайлы орналасуы',
    markers: MAP_MARKERS,
  },
  partners: {
    label: 'Ипотека',
    heading: 'Серіктес банктер',
    desc: 'Серіктестеріміз арқылы тиімді шарттармен ипотека ресімдеңіз',
    ctaText: 'Ипотека шарттары', ctaLink: '/kz/mortgage',
    listLabel: 'Серіктес банктер',
    banks: BANKS,
  },
  reviews: { label: 'Сенім', heading: 'Тұрғындардың пікірлері', desc: '1 200-ден астам отбасы біздің үйлерде тұрады', lang: 'kk' },
  news:    { label: 'Өзекті', heading: 'Соңғы жаңалықтар', allText: 'Барлық жаңалықтар', allLink: '/kz/news', lang: 'kk' },
}

// ─── Export ───────────────────────────────────────────────────────────────────

const CONTENT: Record<Locale, HomeContent> = { ru: RU, en: EN, kk: KK }

export function useHomeContent(locale: Locale): HomeContent {
  return CONTENT[locale]
}
