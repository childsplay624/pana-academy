# PANA Academy — Technical Learning & Competency Management System

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-grade Educational Management System (EMS) and Learning Management System (LMS) purpose-built for **PANA Institute / PE Energy Academy**. The platform delivers practical, ISO-aligned industrial training across Sub-Saharan Africa, covering turbomachinery, instrumentation, power systems, valves, flow measurement, and asset integrity.

---

## 🚀 Key Highlights & Capabilities

### 🎓 Industrial Course Catalog & Taxonomy
- **10 Core Engineering Domains**: Hierarchical categorization across Power & Drives, Valves & Actuation, Instrumentation, Process Control, Metering, and Asset Integrity.
- **Automated Catalog Coding**: Auto-generates course codes (`PD01`, `VA01`, `IN01`, etc.) mapped to domain numbering and subcategories.
- **Standards & Compliance Alignment**: Syllabus tagging for international engineering standards (API 617, API 614, ASME PTC 10, ISO 18436, IEC 61508, etc.).
- **OEM Technology Mapping**: Maps equipment drills to technology partners (Baker Hughes, Siemens Energy, ITT Goulds, Emerson, Schlumberger, etc.).

### 🖥️ High-Fidelity Course Experience (Udemy-Grade UI)
- **Interactive Dark Hero**: Course code badge, award pill, last updated stamp, and ISO/API verification micro-cards.
- **Interactive Syllabus Accordion**: Expandable/collapsible module sections, topic duration badges, and instant lesson modal previews with resource descriptions.
- **Industrial Metadata Cards**: Dedicated sections for *Who Should Attend (Target Audience)*, *Practical Work & Laboratory Drills*, and *Requirements & Prerequisites*.
- **Live Scheduling & Venue Logistics**: Physical venue maps, cohort commencement dates, daily session hours, and corporate facility delivery proposals.
- **Sticky Pricing Card**: Live enrollment CTA, currency formatting, downloadable resource counts, and qualification award badges.

### 🛠️ Comprehensive Course Management Suite
- **Basic Information**: Title, domain, subcategory, assigned instructor, level, duration, and price.
- **Media Library & Image Uploader**: Direct image upload to public Supabase storage buckets (`course-images`) with fallback handling.
- **Curriculum & Module Builder**: Add, order, and edit modules and lessons (videos, quizzes, technical documents, and free previews).
- **Industrial Specifications Editor**: Visual tag and array editors with bulk paste support for standards, OEM partners, practical drills, and learning outcomes.
- **Onsite & Hybrid Venue Management**: Integrated venue picker, capacity limits, parking instructions, and hotel accommodation guidance.

### 🔐 Security & Role-Based Access Control (RBAC)
- **Role Permissions**: Strict isolation between **Admins**, **Instructors**, and **Students / Corporate Delegates**.
- **PostgreSQL Row Level Security (RLS)**: Enforced database policies preventing unauthorized course modifications or cross-tenant data leakage.
- **Payment Verification**: Paystack, bank transfer verification, automated invoice generation, and conditional enrollment gates.

---

## 🏗️ Technology Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict typing) |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/) |
| **Icons & Animations** | [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL 15 + RLS + GoTrue Auth) |
| **Storage** | Supabase Storage (`course-images`, `site-images`, `certificates`) |
| **Transactional Email** | [Resend](https://resend.com/) API |
| **PDF Generation** | [jsPDF](https://github.com/parallax/jsPDF) (Invoicing & Certificates) |

---

## 📁 Repository Structure

```text
pana-academy-main/
├── .agents/                 # AI Assistant skills & Postgres best-practice guides
├── public/                  # Static assets & brand media
├── scripts/                 # Utility scripts (db-push, migration runners)
├── src/
│   ├── components/
│   │   ├── admin/           # Admin forms, wizards & media pickers
│   │   ├── course/          # Course video players & learning interfaces
│   │   ├── course-management/# CourseEditor, ModuleManager, LessonManager
│   │   ├── payment/         # Paystack & manual payment integrations
│   │   └── ui/              # shadcn/ui design system components
│   ├── hooks/               # Custom hooks (useAuth, usePlatformSettings, etc.)
│   ├── integrations/
│   │   └── supabase/        # Supabase client & generated database types
│   ├── pages/
│   │   ├── admin/           # Administrative control centers & analytics
│   │   ├── course/          # CourseDetails, CoursePlayer, BrowseCatalog
│   │   └── dashboard/       # Student and instructor portals
│   ├── services/            # API services (courseService, enrollmentService, etc.)
│   └── types/               # TypeScript interfaces and domain schemas
├── supabase/
│   ├── functions/           # Supabase Edge Functions (Deno / TypeScript)
│   └── migrations/          # Declarative PostgreSQL schema migrations
├── tailwind.config.ts       # Tailwind CSS design tokens
├── tsconfig.json            # TypeScript compiler configuration
└── vite.config.ts           # Vite build pipeline & module aliases
```

---

## ⚡ Quickstart & Development

### 1. Prerequisites
- **Node.js**: `v18.x` or `v20.x` recommended
- **npm** or **bun**
- A **Supabase** project instance (Cloud or Local CLI)

### 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/childsplay624/pana-academy.git
cd pana-academy

# Install packages
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Application Host
VITE_API_BASE_URL=http://localhost:5173

# Supabase Credentials
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Payment Gateways (Optional for local testing)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxx

# Transactional Email (Optional)
VITE_RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

### 4. Database Setup & Migrations

All schema definitions, RLS policies, and seed data live in `supabase/migrations/`:

```bash
# Using Supabase CLI to apply migrations
supabase db push

# Or run individual migrations directly via your Supabase SQL editor:
# 20270101000000_course_domains_subcategories.sql
# 20270101000001_seed_domains_and_subcategories.sql
# 20270101000002_add_course_industrial_metadata.sql
# 20270101000003_seed_course_pd01.sql
```

### 5. Run the Local Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or the next available port).

---

## 🧪 Quality Assurance & Build Commands

```bash
# Run TypeScript typecheck without emitting output
npx tsc --noEmit

# Run ESLint linter
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔐 Database Schema & Security Principles

1. **Row Level Security (RLS)**:
   - Public courses are readable by all authenticated and unauthenticated visitors (`status = 'published'`).
   - Draft and review courses are visible only to the assigned instructor and platform administrators.
   - Enrollment progress and invoices are strictly restricted to the owning student profile (`auth.uid() = user_id`).
2. **Defensive Defaults**:
   - Course prices, durations, and student counts use explicit defaults to avoid null pointer exceptions across user interfaces.
   - Foreign keys enforce cascade constraints to maintain referential integrity across modules and lessons.

---

## 📄 License

This software is licensed under the [MIT License](LICENSE).
PANA Academy © 2026. All rights reserved.
