export type Language = 'ru' | 'en';

export interface Dictionary {
  nav: {
    features: string;
    howItWorks: string;
    pricing: string;
    security: string;
    faq: string;
    login: string;
    getStarted: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    desc: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statsTeam: string;
    statsRating: string;
    demoTaskTitle: string;
    demoTaskStatus: string;
    demoTaskDone: string;
    demoVelocity: string;
  };
  howItWorks: {
    badge: string;
    title: string;
    desc: string;
  };
  features: {
    badge: string;
    title: string;
    desc: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
    card5Title: string;
    card5Desc: string;
    card6Title: string;
    card6Desc: string;
  };
  security: {
    badge: string;
    title: string;
    desc: string;
    item1: string;
    item2: string;
    item3: string;
    item4: string;
  };
  pricing: {
    badge: string;
    title: string;
    desc: string;
    freeTitle: string;
    freeSub: string;
    freePrice: string;
    freePeriod: string;
    freeCta: string;
    freeFeatures: string[];
    proTitle: string;
    proSub: string;
    proBadge: string;
    proPrice: string;
    proPeriod: string;
    proCta: string;
    proFeatures: string[];
  };
  faq: {
    badge: string;
    title: string;
    items: { q: string; a: string }[];
  };
  footer: {
    copyright: string;
    status: string;
    login: string;
    register: string;
  };
  modal: {
    title: string;
    subtitle: string;
    freeNotice: string;
    close: string;
    launch: string;
    tabs: {
      kanbanTitle: string;
      kanbanDesc: string;
      kanbanBadge: string;
      commandTitle: string;
      commandDesc: string;
      commandBadge: string;
      rbacTitle: string;
      rbacDesc: string;
      rbacBadge: string;
      analyticsTitle: string;
      analyticsDesc: string;
      analyticsBadge: string;
    };
    bullets: {
      b1: string;
      b2: string;
      b3: string;
      b4: string;
    };
  };
  auth: {
    registerTitle: string;
    registerSubtitle: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
    submitRegister: string;
    hasAccount: string;
    signInLink: string;
    loginTitle: string;
    loginSubtitle: string;
    submitLogin: string;
    noAccount: string;
    createAccountLink: string;
    forgotPassword: string;
  };
  navigation: {
    dashboard: string;
    projects: string;
    tasks: string;
    team: string;
    analytics: string;
    settings: string;
    logout: string;
    admin: string;
    notifications: string;
  };
  dashboard: {
    welcome: string;
    systemStatus: string;
    newProject: string;
    newTask: string;
  };
  kanban: {
    columns: {
      todo: string;
      inProgress: string;
      inReview: string;
      done: string;
    };
    priority: {
      low: string;
      medium: string;
      high: string;
      urgent: string;
    };
    newTask: string;
    taskTitlePlaceholder: string;
    description: string;
    assignee: string;
    deadline: string;
    save: string;
    cancel: string;
    comments: string;
    addCommentPlaceholder: string;
    addCommentButton: string;
    delete: string;
    overdue: string;
  };
}

export const DICTIONARIES: Record<Language, Dictionary> = {
  ru: {
    nav: {
      features: 'Возможности',
      howItWorks: 'Как это работает',
      pricing: 'Тарифы',
      security: 'Безопасность',
      faq: 'FAQ',
      login: 'Войти',
      getStarted: 'Начать бесплатно',
    },
    hero: {
      badge: '• SPATIAL WORKSPACE • КИБЕР-СКОРОСТЬ • 100% RLS БЕЗОПАСНОСТЬ',
      title1: 'Ваши проекты.',
      title2: 'В новом измерении.',
      desc: 'Единая платформа управления задачами и командами нового поколения. Скорость Linear, гибкость Notion и кристальная глубина 3D-интерфейса.',
      ctaPrimary: 'Создать проект бесплатно →',
      ctaSecondary: 'Интерактивное демо',
      statsTeam: '500+ продуктовых команд',
      statsRating: 'Релизы в 3 раза быстрее',
      demoTaskTitle: 'Развернуть API шлюз v2',
      demoTaskStatus: 'В процессе',
      demoTaskDone: 'Завершено',
      demoVelocity: 'Скорость спринта',
    },
    howItWorks: {
      badge: 'Spatial Orbit 3D Architecture',
      title: 'Интерактивная орбита ваших задач',
      desc: 'Управляйте спринтами в трехмерном окружении. Наведите курсор на орбитальные карточки для тактильного отклика и детального фокуса.',
    },
    features: {
      badge: 'Возможности платформы',
      title: 'Все инструменты для скоростной разработки',
      desc: 'Современный стек технологий, созданный для продуктивности распределенных команд.',
      card1Title: '3D Spatial Kanban',
      card1Desc: 'Карточки с объемным неоновым срезом, наклоном по Z-оси и мгновенным Drag & Drop с Optimistic UI.',
      card2Title: 'Command Palette (Ctrl+K)',
      card2Desc: 'Мгновенный живой поиск по проектам и задачам, быстрое создание сущностей и переходы по разделам системы.',
      card3Title: 'RBAC и Инвайты',
      card3Desc: 'Разграничение ролей (Owner, Admin, Member, Viewer), приглашения по защищенным токенам и центр уведомлений.',
      card4Title: 'Телеметрия и Recharts',
      card4Desc: 'Интерактивная аналитика спринтов, скорость закрытия задач, динамика прироста и диаграммы загрузки.',
      card5Title: 'Next.js 15 • Turbopack',
      card5Desc: 'Асинхронные Server Actions, новый Proxy-стандарт, оптимизированная сборка и 60 FPS рендеринг.',
      card6Title: 'Supabase RLS Безопасность',
      card6Desc: 'Полноценная изоляция арендаторов на уровне строк базы данных PostgreSQL и надежная аутентификация через куки.',
    },
    security: {
      badge: 'Безопасность корпоративного уровня',
      title: 'Полный контроль доступа и защита данных',
      desc: 'Изолированная панель администратора (/admin), защита от случайной самоблокировки, детальный журнал аудита активности и строгое разграничение ролей.',
      item1: 'Защита от CSRF и XSS атак',
      item2: 'Supabase Row Level Security (RLS)',
      item3: 'Аудит действий в activity_logs',
      item4: 'Защищенные инвайт-токены',
    },
    pricing: {
      badge: 'Простые тарифы',
      title: 'Инвестируйте в скорость вашей команды',
      desc: 'Начните бесплатно без указания банковской карты. Переходите на PRO по мере роста.',
      freeTitle: 'FREE',
      freeSub: 'Базовый',
      freePrice: '$0',
      freePeriod: '/ навсегда',
      freeCta: 'Начать бесплатно',
      freeFeatures: [
        'До 3 активных проектов',
        'До 5 участников в команде',
        'Интерактивная Kanban-доска',
        'Базовая палитра команд (Ctrl+K)',
      ],
      proTitle: 'PRO',
      proSub: 'Профессиональный',
      proBadge: 'Популярный',
      proPrice: '$9',
      proPeriod: '/ месяц',
      proCta: 'Подключить PRO →',
      proFeatures: [
        'Неограниченное число проектов',
        'Неограниченное число участников',
        'Расширенная аналитика спринтов',
        'Приоритетная синхронизация в реальном времени',
        'Премиум 3D физика карточек',
      ],
    },
    faq: {
      badge: 'Часто задаваемые вопросы',
      title: 'Остались вопросы?',
      items: [
        {
          q: 'Чем NEXUS отличается от Trello или Linear?',
          a: 'NEXUS объединяет простоту Kanban-досок с глубоким 3D-пространственным дизайном, встроенной командной иерархией (RBAC), глобальной палитрой команд (Ctrl+K) и сквозной аналитикой спринтов в едином сверхбыстром интерфейсе.',
        },
        {
          q: 'Как обеспечивается безопасность данных?',
          a: 'Все данные изолированы с помощью Row Level Security (RLS) в PostgreSQL (Supabase), защищены асинхронными серверными сессиями, шифрованием при передаче и строгим аудитом действий в activity logs.',
        },
        {
          q: 'Можно ли использовать платформу бесплатно?',
          a: 'Да! Тариф FREE позволяет вести до 3 проектов, приглашать команду и полноценно использовать Kanban-доски без ограничений по времени.',
        },
        {
          q: 'Как работает подписка PRO?',
          a: 'Тариф PRO открывает неограниченное число воркспейсов, расширенную аналитику спринтов с прогнозированием выгорания, приоритетную синхронизацию и доступ к расширенным 3D-эффектам.',
        },
      ],
    },
    footer: {
      copyright: 'NEXUS Systems Inc. Все права защищены.',
      status: 'Все системы активны • 60 FPS',
      login: 'Войти',
      register: 'Регистрация',
    },
    modal: {
      title: 'Архитектура возможностей NEXUS',
      subtitle: 'Интерактивный обзор ключевых модулей системы',
      freeNotice: 'Доступно бесплатно на любом тарифе без привязки карты.',
      close: 'Закрыть',
      launch: 'Запустить платформу',
      tabs: {
        kanbanTitle: '3D Spatial Kanban',
        kanbanDesc: 'Интерактивная доска с плавной физикой перетаскивания, приоритетами задач и трекингом дедлайнов.',
        kanbanBadge: 'Realtime Sync',
        commandTitle: 'Command Palette (Ctrl+K)',
        commandDesc: 'Мгновенный глобальный поиск по проектам, исполнителям и быстрый запуск действий за миллисекунды.',
        commandBadge: 'Instant Navigation',
        rbacTitle: 'Team Roles & RBAC',
        rbacDesc: 'Изолированное разграничение прав доступа: Owner, Admin, Member, Viewer и инвайт-токены.',
        rbacBadge: 'Enterprise Security',
        analyticsTitle: 'Spatial Telemetry',
        analyticsDesc: 'Живая аналитика спринтов, диаграммы загрузки команды и метрики прогресса с Recharts.',
        analyticsBadge: 'Live Metrics',
      },
      bullets: {
        b1: 'Мгновенный отклик 60 FPS',
        b2: 'Бесшовная синхронизация Supabase',
        b3: 'Шифрование данных & RLS',
        b4: 'Dark Spatial Glassmorphism',
      },
    },
    auth: {
      registerTitle: "Создать аккаунт",
      registerSubtitle: "Управляйте проектами и командами на новом уровне с NEXUS",
      fullName: "Полное имя",
      username: "Имя пользователя (username)",
      email: "Рабочий Email",
      password: "Пароль",
      submitRegister: "Создать аккаунт NEXUS →",
      hasAccount: "Уже есть аккаунт?",
      signInLink: "Войти",
      loginTitle: "Вход в систему",
      loginSubtitle: "Введите данные для доступа в workspace",
      submitLogin: "Войти в аккаунт →",
      noAccount: "Нет аккаунта?",
      createAccountLink: "Зарегистрироваться",
      forgotPassword: "Забыли пароль?"
    },
    navigation: {
      dashboard: "Дашборд",
      projects: "Проекты",
      tasks: "Задачи",
      team: "Команда",
      analytics: "Аналитика",
      settings: "Настройки",
      logout: "Выйти",
      admin: "Админ-панель",
      notifications: "Уведомления"
    },
    dashboard: {
      welcome: "Добро пожаловать,",
      systemStatus: "Система активна",
      newProject: "+ Новый проект",
      newTask: "+ Создать задачу"
    },
    kanban: {
      columns: {
        todo: "К выполнению",
        inProgress: "В процессе",
        inReview: "На проверке",
        done: "Готово",
      },
      priority: {
        low: "Низкий",
        medium: "Средний",
        high: "Высокий",
        urgent: "Срочный",
      },
      newTask: "Новая задача",
      taskTitlePlaceholder: "Название задачи",
      description: "Описание",
      assignee: "Исполнитель",
      deadline: "Дедлайн",
      save: "Сохранить",
      cancel: "Отмена",
      comments: "Комментарии",
      addCommentPlaceholder: "Написать комментарий...",
      addCommentButton: "Отправить",
      delete: "Удалить",
      overdue: "Просрочено",
    },
  },
  en: {
    nav: {
      features: 'Features',
      howItWorks: 'How it works',
      pricing: 'Pricing',
      security: 'Security',
      faq: 'FAQ',
      login: 'Log in',
      getStarted: 'Get Started',
    },
    hero: {
      badge: '• SPATIAL WORKSPACE • CYBER VELOCITY • 100% RLS SECURITY',
      title1: 'Your projects.',
      title2: 'In a new dimension.',
      desc: 'Next-generation workspace for high-velocity teams. The raw speed of Linear, flexibility of Notion, and unmatched spatial cyber-glass depth.',
      ctaPrimary: 'Start Building Free →',
      ctaSecondary: 'Live Interactive Demo',
      statsTeam: '500+ product teams',
      statsRating: '3x faster release cycle',
      demoTaskTitle: 'Deploy API Gateway v2',
      demoTaskStatus: 'In Progress',
      demoTaskDone: 'Completed',
      demoVelocity: 'Sprint Velocity',
    },
    howItWorks: {
      badge: 'Spatial Orbit 3D Architecture',
      title: 'Interactive Orbit of Your Tasks',
      desc: 'Manage sprints in a three-dimensional environment. Hover over orbital cards for tactile response and granular focus.',
    },
    features: {
      badge: 'Platform Capabilities',
      title: 'All Tools for High-Velocity Shipping',
      desc: 'A modern technology stack engineered for maximum distributed team productivity.',
      card1Title: '3D Spatial Kanban',
      card1Desc: 'Cards with volumetric neon rim lighting, Z-axis tilt physics, and instant Drag & Drop with Optimistic UI.',
      card2Title: 'Command Palette (Ctrl+K)',
      card2Desc: 'Instant live search across projects and deliverables, quick entity creation, and rapid section jumps.',
      card3Title: 'RBAC & Team Invitations',
      card3Desc: 'Role hierarchy (Owner, Admin, Member, Viewer), token-secured invitations, and notification center.',
      card4Title: 'Telemetry & Recharts',
      card4Desc: 'Interactive sprint analytics, cycle velocity, influx dynamics, and workload distribution charts.',
      card5Title: 'Next.js 15 • Turbopack',
      card5Desc: 'Async Server Actions, modern Proxy convention, optimized production builds, and 60 FPS rendering.',
      card6Title: 'Supabase RLS Security',
      card6Desc: 'Tenant isolation at the PostgreSQL row level and robust cookie-based authentication.',
    },
    security: {
      badge: 'Enterprise-Grade Security',
      title: 'Granular Access Governance & Data Protection',
      desc: 'Isolated administrator portal (/admin), self-lockout prevention, detailed audit logs, and strict role segregation.',
      item1: 'Protection against CSRF and XSS attacks',
      item2: 'Supabase Row Level Security (RLS)',
      item3: 'Full activity trail in activity_logs',
      item4: 'Cryptographically signed invite tokens',
    },
    pricing: {
      badge: 'Transparent Pricing',
      title: "Invest in Your Team's Velocity",
      desc: 'Start free with no credit card required. Upgrade to PRO as your team scales.',
      freeTitle: 'FREE',
      freeSub: 'Starter',
      freePrice: '$0',
      freePeriod: '/ forever',
      freeCta: 'Get Started Free',
      freeFeatures: [
        'Up to 3 active projects',
        'Up to 5 team members',
        'Interactive Kanban boards',
        'Basic Command Palette (Ctrl+K)',
      ],
      proTitle: 'PRO',
      proSub: 'Professional',
      proBadge: 'Popular',
      proPrice: '$9',
      proPeriod: '/ month',
      proCta: 'Upgrade to PRO →',
      proFeatures: [
        'Unlimited projects',
        'Unlimited team members',
        'Advanced sprint analytics',
        'Priority real-time sync',
        'Premium 3D card physics',
      ],
    },
    faq: {
      badge: 'Frequently Asked Questions',
      title: 'Have Questions?',
      items: [
        {
          q: 'How does NEXUS differ from Trello or Linear?',
          a: 'NEXUS blends the simplicity of Kanban boards with deep 3D spatial design, native team hierarchy (RBAC), global command palette (Ctrl+K), and end-to-end sprint telemetry in a single ultra-fast interface.',
        },
        {
          q: 'How is data security handled?',
          a: 'All data is isolated with PostgreSQL Row Level Security (RLS) via Supabase, protected with async cookie sessions, in-transit encryption, and strict activity auditing.',
        },
        {
          q: 'Can I use the platform for free?',
          a: 'Yes! The FREE tier allows you to create up to 3 projects, invite team members, and fully utilize the Kanban board with no time limits.',
        },
        {
          q: 'How does the PRO subscription work?',
          a: 'The PRO plan unlocks unlimited workspaces, advanced sprint analytics with burndown forecasting, priority sync, and full 3D spatial dynamics.',
        },
      ],
    },
    footer: {
      copyright: 'NEXUS Systems Inc. All rights reserved.',
      status: 'All Systems Operational • 60 FPS',
      login: 'Log in',
      register: 'Register',
    },
    modal: {
      title: 'NEXUS Capabilities Architecture',
      subtitle: 'Interactive walkthrough of core system modules',
      freeNotice: 'Available for free on any plan with no credit card required.',
      close: 'Close',
      launch: 'Launch Platform',
      tabs: {
        kanbanTitle: '3D Spatial Kanban',
        kanbanDesc: 'Interactive board with smooth drag physics, task priorities, and deadline tracking.',
        kanbanBadge: 'Realtime Sync',
        commandTitle: 'Command Palette (Ctrl+K)',
        commandDesc: 'Instant global search for projects, assignees, and quick action execution in milliseconds.',
        commandBadge: 'Instant Navigation',
        rbacTitle: 'Team Roles & RBAC',
        rbacDesc: 'Isolated permission management: Owner, Admin, Member, Viewer, and invite tokens.',
        rbacBadge: 'Enterprise Security',
        analyticsTitle: 'Spatial Telemetry',
        analyticsDesc: 'Live sprint analytics, team workload diagrams, and progress metrics with Recharts.',
        analyticsBadge: 'Live Metrics',
      },
      bullets: {
        b1: 'Instant 60 FPS Response',
        b2: 'Seamless Supabase Sync',
        b3: 'Data Encryption & RLS',
        b4: 'Dark Spatial Glassmorphism',
      },
    },
    auth: {
      registerTitle: "Create an account",
      registerSubtitle: "Start managing projects and teams at scale with NEXUS",
      fullName: "Full Name",
      username: "Workspace Username",
      email: "Work Email",
      password: "Password",
      submitRegister: "Create NEXUS Account →",
      hasAccount: "Already have an account?",
      signInLink: "Sign in",
      loginTitle: "Welcome back",
      loginSubtitle: "Enter your credentials to access workspace",
      submitLogin: "Sign in to NEXUS →",
      noAccount: "Don't have an account?",
      createAccountLink: "Create an account",
      forgotPassword: "Forgot password?"
    },
    navigation: {
      dashboard: "Dashboard",
      projects: "Projects",
      tasks: "Tasks",
      team: "Team",
      analytics: "Analytics",
      settings: "Settings",
      logout: "Log out",
      admin: "Admin Panel",
      notifications: "Notifications"
    },
    dashboard: {
      welcome: "Welcome back,",
      systemStatus: "System Operational",
      newProject: "+ New Project",
      newTask: "+ Create Task"
    },
    kanban: {
      columns: {
        todo: "To Do",
        inProgress: "In Progress",
        inReview: "In Review",
        done: "Done",
      },
      priority: {
        low: "Low",
        medium: "Medium",
        high: "High",
        urgent: "Urgent",
      },
      newTask: "New Task",
      taskTitlePlaceholder: "Task Title",
      description: "Description",
      assignee: "Assignee",
      deadline: "Deadline",
      save: "Save",
      cancel: "Cancel",
      comments: "Comments",
      addCommentPlaceholder: "Write a comment...",
      addCommentButton: "Send",
      delete: "Delete",
      overdue: "Overdue",
    },
  },
};
