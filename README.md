# NEXUS SaaS Platform

Welcome to NEXUS, a cutting-edge "Spatial 3D Cyber-Glass Workspace" built for high-performance teams.

## 🏗 Architecture & Tech Stack
NEXUS is built on a modern, highly scalable stack:
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (with custom Cyber-Glass UI aesthetics)
- **Database & Auth:** Supabase (PostgreSQL, Authentication, strict Row Level Security)
- **Payments:** Stripe SDK for seamless subscription management
- **Data Visualization:** Recharts for telemetry and analytics
- **Interactivity:** `@hello-pangea/dnd` for fluid Kanban drag-and-drop

## 🚀 Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-org/nexus.git
cd nexus
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the provided example file:
```bash
cp .env.example .env.local
```
Fill in `.env.local` with your Supabase and Stripe API keys.

### 4. Database Setup (Supabase)
Apply the SQL schema to your Supabase project. The full schema is located at `supabase/schema.sql` (or run it via the Supabase Dashboard SQL Editor). This includes tables, policies (RLS), and triggers.

### 5. Stripe Webhooks Setup
To test Stripe payments locally, forward webhook events to your local server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the generated webhook secret and paste it into `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### 6. Run the application
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🧪 Acceptance Testing Scenarios

Please verify the following scenarios to ensure core logic is functioning correctly:

1. **Security & IDOR Protection:**
   - Attempt to open a project you do not have access to by manually changing the project ID in the URL (`/dashboard/projects/[id]`). Supabase RLS and Server Actions should intercept and redirect you.
2. **FREE Tier Limits:**
   - On a `FREE` account, attempt to create a 3rd project. The system should block the creation and display an upgrade prompt.
3. **Stripe Payments (PRO Tier):**
   - Upgrade a `FREE` account using the Stripe test card (`4242 4242 4242 4242`). Verify that the `subscription_tier` changes to `PRO` and advanced analytics unlock.
4. **Kanban Drag-and-Drop:**
   - Move a task across columns in a project board. Refresh the page to verify the state was synchronously updated in the PostgreSQL database.
5. **Command Palette:**
   - Press `Ctrl + K` (or `Cmd + K`) anywhere in the app to open the global search. Test the live project/task search and language switching (RU/EN).
6. **Admin Isolation:**
   - Log in as a standard `USER` and attempt to access `/admin`. You should be redirected. Log in as an `ADMIN` to verify access to metrics and user management.

---

## 🔑 Test Accounts

You can use the following pre-configured test accounts for evaluation (Password for all accounts: `TestPassword123!` or use Magic Link):

- **Admin Account (Full Platform Access):**
  - `admin@nexus-saas.com`
- **User A (PRO Subscriber):**
  - `ivan@nexus-saas.com`
- **User B (FREE Tier):**
  - `anna@nexus-saas.com`
