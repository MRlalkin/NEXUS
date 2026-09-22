# ⚡ NEXUS — Next-Gen Spatial SaaS Workspace

<p align="center">
  <a href="https://nexus-lalkin.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Stripe-Subscriptions-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <b>🌐 <a href="#-english">English</a> | <a href="#-русский">Русский</a></b>
</p>

---

## 🇺🇸 English

### 🌟 Overview
**NEXUS** is a commercial-grade, full-stack SaaS platform designed for high-performance teams, software engineers, and product studios. Built with a spatial cyber-glass dark UI aesthetic, it bridges the gap between Trello, Linear, and Notion with zero interface compromise.

🔗 **Live Production URL**: [https://nexus-lalkin.vercel.app](https://nexus-lalkin.vercel.app)

### ✨ Core Features
- **3D Spatial Glassmorphism UI**: High-end dark theme (#0a0c10), multi-layered backdrop blurs, fluid Framer Motion animations.
- **Real-Time Kanban Board**: Drag-and-drop system powered by `@hello-pangea/dnd` with optimistic UI updates and instant PostgreSQL order synchronization.
- **Enterprise Multi-Tenant Security**: Strict PostgreSQL Row Level Security (RLS) policies completely eliminating IDOR and cross-tenant data leaks.
- **Stripe Monetization & Tier Enforcement**: Automated subscription life-cycle (FREE vs PRO), server-side project and task limit verification, webhook event handlers.
- **Granular RBAC**: 4 access roles per project (OWNER, ADMIN, MEMBER, VIEWER) with customizable permission barriers.
- **Global Command Palette (`Ctrl + K`)**: Instant keyboard-driven navigation, project switching, and quick task creation.
- **Interactive Analytics & Audit Trails**: Interactive metrics via Recharts and immutable activity logging (`activity_logs`).
- **Super-Admin Console**: Dedicated `/admin` suite for tenant oversight, user role elevation, and account moderation.

### 🏗️ Tech Stack
| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Actions, SSR) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS, Framer Motion, Lucide Icons |
| **Database & Auth** | Supabase (PostgreSQL 15, Auth SSR, Row Level Security) |
| **Billing** | Stripe (Checkout Sessions, Customer Portal, Webhooks) |
| **State & Drag-Drop**| `@hello-pangea/dnd`, React Transitions |
| **Deployment** | Vercel Edge Network |

### 🚀 Getting Started Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MRlalkin/NEXUS.git
   cd NEXUS
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and populate it with your credentials:
   ```bash
   cp .env.example .env.local
   ```
   *You will need keys from [Supabase](https://supabase.com/) and [Stripe](https://stripe.com/).*

4. **Initialize Supabase (Database)**:
   Ensure you run the schema setup in your Supabase SQL editor using `supabase/schema.sql` (if available) to set up tables, RLS policies, and triggers.

5. **Stripe Webhooks**:
   To test billing limits locally, run the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

6. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000).

---

## 🇷🇺 Русский

### 🌟 Обзор
**NEXUS** — это полнофункциональная SaaS-платформа коммерческого уровня, разработанная для высокопроизводительных команд, инженеров и продуктовых студий. Выполненная в эстетике spatial cyber-glass (многослойное темное стекло), она объединяет лучшие концепции Trello, Linear и Notion без компромиссов в интерфейсе.

🔗 **Рабочая версия проекта**: [https://nexus-lalkin.vercel.app](https://nexus-lalkin.vercel.app)

### ✨ Основные возможности
- **3D Spatial Glassmorphism UI**: Премиальная темная тема (#0a0c10), многослойные размытия, плавные анимации через Framer Motion.
- **Интерактивная Kanban-доска**: Drag-and-drop система на базе `@hello-pangea/dnd` с оптимистичными обновлениями интерфейса и мгновенной синхронизацией сортировки в PostgreSQL.
- **Enterprise Multi-Tenant Безопасность**: Строгие политики Row Level Security (RLS) в PostgreSQL, полностью исключающие IDOR-уязвимости и утечку данных между воркспейсами.
- **Монетизация через Stripe**: Автоматизированный жизненный цикл подписок (FREE против PRO), серверная проверка лимитов на проекты и задачи, обработчики вебхуков.
- **Глубокий RBAC**: 4 уровня доступа на проект (OWNER, ADMIN, MEMBER, VIEWER) с настраиваемыми барьерами разрешений.
- **Глобальная Command Palette (`Ctrl + K`)**: Мгновенная навигация с клавиатуры, переключение проектов и быстрое создание задач.
- **Интерактивная аналитика и аудит**: Интерактивные метрики через Recharts и неизменяемое логирование активности (`activity_logs`).
- **Super-Admin Консоль**: Изолированная панель `/admin` для глобального контроля платформы, управления ролями пользователей и модерации.

### 🏗️ Технологический стек
| Слой | Технологии |
| :--- | :--- |
| **Фреймворк** | Next.js 15 (App Router, Server Actions, SSR) |
| **Язык** | TypeScript 5 (Строгий режим) |
| **Стилизация** | Tailwind CSS, Framer Motion, Lucide Icons |
| **База Данных & Авторизация** | Supabase (PostgreSQL 15, Auth SSR, Row Level Security) |
| **Биллинг** | Stripe (Checkout Sessions, Customer Portal, Webhooks) |
| **Состояние & Drag-Drop**| `@hello-pangea/dnd`, React Transitions |
| **Деплой** | Vercel Edge Network |

### 🚀 Локальный запуск

1. **Клонируйте репозиторий**:
   ```bash
   git clone https://github.com/MRlalkin/NEXUS.git
   cd NEXUS
   ```

2. **Установите зависимости**:
   ```bash
   npm install
   ```

3. **Настройте переменные окружения**:
   Скопируйте `.env.example` в `.env.local` и укажите ваши ключи:
   ```bash
   cp .env.example .env.local
   ```
   *Вам понадобятся ключи от [Supabase](https://supabase.com/) и [Stripe](https://stripe.com/).*

4. **Инициализация БД (Supabase)**:
   Примените SQL-схему в вашем проекте Supabase через SQL-редактор, используя файл `supabase/schema.sql` (если доступен), чтобы создать таблицы, политики RLS и триггеры.

5. **Настройка Stripe Webhooks**:
   Для тестирования подписок и биллинга локально, запустите Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

6. **Запуск сервера для разработки**:
   ```bash
   npm run dev
   ```
   Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.
