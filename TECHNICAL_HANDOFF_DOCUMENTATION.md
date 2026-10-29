# PANA Institute — Website & LMS Master Technical & Administrative Documentation

**Document Version:** 2.0.0 (Comprehensive Operations Manual)  
**Target Audience:** PANA Institute Executive Board, IT Administrators, Engineering Team, Content Managers  
**Prepared By:** Technical Architecture & Lead Engineering Team  
**Date:** October 2026  

---

## 1. Executive Summary & Purpose

This manual is the master operational handbook and architectural reference for the **PANA Institute Website & Learning Management System (LMS)**. It is written to enable the internal PANA Institute administrative and technical teams to operate, configure, customize, and maintain every module of the platform without perpetual reliance on external developers.

---

## 2. Technology Stack & Platform Architecture

The platform uses a cloud-native, decoupled Single Page Application (SPA) architecture designed for high security, millisecond responsiveness, and scalability:

| Tier | Technology / Service | Operational Role |
| :--- | :--- | :--- |
| **Frontend UI** | **React 18 + TypeScript** | Strongly typed, reactive user interface components |
| **Bundler & Tooling** | **Vite** | Sub-second Hot Module Replacement (HMR) and optimized Rollup production builds |
| **Styling & Design System** | **Tailwind CSS + Radix UI (shadcn/ui)** | Accessible, mobile-responsive UI tokens and dark-mode styling |
| **Routing** | **React Router DOM v6** | Client-side routing with role-based Route Guards |
| **Animation Engine** | **Framer Motion** | Micro-interactions, lightboxes, and smooth transitions |
| **Backend & Database** | **Supabase (PostgreSQL 15)** | Relational database with Row-Level Security (RLS) and real-time listeners |
| **Authentication** | **Supabase Auth (GoTrue)** | Encrypted JWT sessions, role-based access (admin, instructor, student) |
| **Cloud Storage** | **Supabase Storage (S3-Compatible)** | Buckets for media, site assets, trainee galleries, and policy PDFs |
| **Rich Text Editor** | **React Quill** | Visual WYSIWYG editor for news articles, policies, and course lessons |
| **Document Generation** | **jsPDF / html2canvas** | Cryptographic certificate generation and automated PDF invoicing |
| **Payment Gateway** | **Paystack / Flutterwave** | Automated local and international card/bank transfer processing |

---

## 3. Environment Variables & Credentials Setup

All runtime secrets and service keys are managed via the `.env` file at the root of the project:

| Variable Name | Required | Description |
| :--- | :---: | :--- |
| `VITE_SUPABASE_URL` | **Yes** | Project endpoint URL (e.g. `https://xxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | **Yes** | Client public key constrained by PostgreSQL Row Level Security (RLS) |
| `VITE_PAYSTACK_PUBLIC_KEY` | Optional | Public key for course payment checkout (Paystack) |
| `VITE_APP_URL` | Optional | Canonical production URL (e.g. `https://pana-institute.com`) |

> [!IMPORTANT]
> Never place the Supabase `service_role` secret in the client `.env`. The `VITE_SUPABASE_ANON_KEY` is secure for public browsers because database access is governed strictly by Row-Level Security policies.

---

## 4. Production Deployment & Server Configuration

### Build Commands
```bash
# 1. Install dependencies
npm install

# 2. Local development server
npm run dev

# 3. Production build (creates optimized /dist folder)
npm run build

# 4. Preview production build locally
npm run preview
```

### SPA Routing Rule (Required on All Hosts)
Because routing is performed client-side, the server must rewrite all non-file traffic to `/index.html`:
* **Vercel (`vercel.json`):**
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
* **Netlify (`_redirects`):**
  ```text
  /*    /index.html   200
  ```
* **Nginx Server Block:**
  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```

---

## 5. Master Module Reference & How to Use Them

The PANA Institute Admin Dashboard (`/dashboard`) includes 18 specialized modules. Below is a detailed operational guide for each module:

```
Admin Modules Sitemap
├── 1. Dashboard Overview        (/dashboard)
├── 2. User Management           (/dashboard/users)
├── 3. Course Management         (/dashboard/courses)
├── 4. Course Categories         (/dashboard/course-categories)
├── 5. Image & Asset Management  (/dashboard/images)
├── 6. Team & Faculty Management (/dashboard/team)
├── 7. Payment Management        (/dashboard/payments)
├── 8. Invoices Management       (/dashboard/invoices)
├── 9. Venue Management          (/dashboard/venues)
├── 10. Message Management       (/dashboard/messages)
├── 11. Support Tickets          (/dashboard/support-tickets)
├── 12. Page Builder (CMS)       (/dashboard/pages)
├── 13. Navigation & Mega Menu   (/dashboard/navigation)
├── 14. Find & Replace System    (/dashboard/find-replace)
├── 15. Blog, News & Resources   (/dashboard/blog)
├── 16. Analytics & Intelligence (/dashboard/analytics)
├── 17. Testimonials Management  (/dashboard/testimonials)
└── 18. Settings & Configuration (/dashboard/settings)
```

---

### Module 1: Dashboard Overview (`/dashboard`)
* **Purpose:** The centralized executive command center displaying high-level operational statistics.
* **Key Capabilities:**
  - Real-time counts of total active students, published courses, and enrollment volume.
  - Recent user registrations and rapid jump-links to primary operational modules.
* **How to Use:**
  1. Access upon login to review platform activity.
  2. Use the shortcut cards to jump directly to courses, user inquiries, or invoices.

---

### Module 2: User Management (`/dashboard/users`)
* **Purpose:** Complete lifecycle management of all accounts across the Institute platform.
* **Key Capabilities:**
  - View all registered users (Students, Instructors, Corporate Delegates, Admins).
  - Role Assignment: Promote or demote users between `student`, `instructor`, and `admin`.
  - Search by name, email, or registration date.
  - Ban, suspend, or reactivate user accounts.
* **How to Use:**
  1. Use the search bar to locate a user by name or email.
  2. Click the action button on the user row to change their role or view their profile.
  3. To grant an instructor course-creation privileges, update their role to `instructor`.

---

### Module 3: Course Management (`/dashboard/courses`)
* **Purpose:** The core engine of the PANA Institute LMS curriculum.
* **Key Capabilities:**
  - Create and edit courses across all competency verticals.
  - Multi-week module and lesson builder (video lessons, reading modules, downloadable resources).
  - Pricing, discounts, delivery mode (Online, In-Person / Facility-Based, Hybrid), and scheduling.
  - Publish vs. Draft toggles.
* **How to Use:**
  1. Click **Create New Course** (`/dashboard/courses/new`).
  2. Enter course title, slug, category, difficulty level, and tuition pricing.
  3. Under **Curriculum Editor**, add Modules (e.g., *Module 1: Introduction to Valve Assembly*).
  4. Inside each module, add Lessons: assign video URLs, text instructions, or lesson files.
  5. Toggle to **Published** to make the course visible in the public course directory (`/courses`).

---

### Module 4: Course Categories (`/dashboard/course-categories`)
* **Purpose:** Classify and organize the curriculum catalog.
* **Key Capabilities:**
  - Manage the 13 competency verticals (e.g., Flow Measurement, Valve Technology, Instrumentation, Sustainability, Process Safety).
  - Assign category icons, badge colors, and SEO meta tags.
* **How to Use:**
  1. Click **Add Category**.
  2. Enter Category Name, code (e.g. `FM` for Flow Measurement), and description.
  3. Save to immediately update category filter pills on the public `/courses` page.

---

### Module 5: Image & Asset Management (`/dashboard/images`)
* **Purpose:** Central repository for all media uploaded across the website.
* **Key Capabilities:**
  - Direct upload to Supabase Storage (`site-images` bucket).
  - Categorization into Hero Banners, Facilities, Faculty, Trainee Activities, Logos, and Brochures.
  - Copy public image CDN URLs in one click.
  - Replace existing images globally without breaking component links.
* **How to Use:**
  1. Click **Upload Images**.
  2. Select category and choose images from your computer.
  3. Click **Copy URL** on any uploaded asset to use it across courses, banners, or blog posts.

---

### Module 6: Team & Faculty Management (`/dashboard/team`)
* **Purpose:** Public faculty, instructors, and executive leadership directory.
* **Key Capabilities:**
  - Add instructors, technical directors, and advisory board members.
  - Upload profile headshots, professional titles, biography, and credentials.
  - Reorder team display sequence.
* **How to Use:**
  1. Click **Add Member**.
  2. Enter full name, executive title (e.g. *Lead Flow Specialist*), bio, and portrait image.
  3. Toggle visibility ON to display on the public `/team` page.

---

### Module 7: Payment Management (`/dashboard/payments`)
* **Purpose:** Financial oversight and transaction auditing.
* **Key Capabilities:**
  - Log of all student and corporate course fee transactions.
  - Filter by transaction status (`successful`, `pending`, `failed`).
  - View payment gateway references (Paystack / Flutterwave), amount, date, and user details.
* **How to Use:**
  1. Review the payments table to confirm payment receipts.
  2. In the event of a bank transfer or manual corporate invoice settlement, admins can manually approve enrollment.

---

### Module 8: Invoice Management (`/dashboard/invoices`)
* **Purpose:** Formal billing generation for corporate clients and institutional sponsors.
* **Key Capabilities:**
  - Create professional invoices for corporate training cohorts.
  - Automatic invoice number generation, tax/VAT calculation, and due dates.
  - Instant PDF generation and download for client dispatch.
* **How to Use:**
  1. Click **Generate Invoice**.
  2. Select client/company, choose enrolled courses, and specify student headcount.
  3. Click **Download PDF** to export a branded PANA Institute invoice ready to email.

---

### Module 9: Venue & Facility Management (`/dashboard/venues`)
* **Purpose:** Physical campus, testing lab, and workshop location management.
* **Key Capabilities:**
  - Manage training facilities (e.g., Port Harcourt Center of Excellence, D-Line Lab, Abuja Office).
  - Set seating capacities, equipment lists (valve rigs, calibration benches), and physical addresses.
* **How to Use:**
  1. Add new facilities or update classroom capacity.
  2. Link venues to specific in-person course cohorts.

---

### Module 10: Message Management (`/dashboard/messages`)
* **Purpose:** Centralized inbox for public website contact inquiries.
* **Key Capabilities:**
  - Receives submissions from the Contact Us form (`/contact`).
  - Filter by unread, read, and archived.
  - View sender name, corporate organization, email, phone, and inquiry topic.
* **How to Use:**
  1. Check the messages list regularly for incoming corporate training requests.
  2. Click on a message to view the full brief and mark as read or replied.

---

### Module 11: Support Tickets (`/dashboard/support-tickets`)
* **Purpose:** Internal LMS student helpdesk and technical assistance.
* **Key Capabilities:**
  - Students submit tickets regarding course access, quiz issues, or certificate verification.
  - Ticket statuses: `Open`, `In Progress`, `Resolved`, `Closed`.
  - Admin reply thread and email notification dispatch.
* **How to Use:**
  1. Review open tickets submitted by students.
  2. Type a response and change status to `Resolved` upon solving the issue.

---

### Module 12: Page Builder (CMS) (`/dashboard/pages`)
* **Purpose:** Content Management System allowing full website edits without writing code.
* **Key Capabilities:**
  - **Static Pages:** Edit hero titles, subtitles, vision/mission statements, images, and contact addresses across core pages (`/about`, `/training-delivery`, `/consulting-services`, `/research-development`, `/sustainability-solutions`, `/global-engagements`, `/safety`, `/careers`, `/contact`, `/our-journey`).
  - **Dynamic Pages (`/p/:slug`):** Build completely custom landing pages by assembling pre-designed section blocks (Hero, Features, Stats, Testimonials, FAQ, CTA, Course Grids).
* **How to Use:**
  1. **To edit an existing page:** Find the page in the list and click **Edit**. Adjust the text in the form fields and click **Save Changes**.
  2. **To build a new page:** Click **Create New Page**, provide title and slug (e.g., `special-programme`), then add and reorder section blocks.
  3. Publish whenever ready.

---

### Module 13: Navigation & Mega Menu (`/dashboard/navigation`)
* **Purpose:** Configure website header menu links and footer navigation.
* **Key Capabilities:**
  - Reorder top navbar links.
  - Configure mega-menu columns, dropdown menus, and featured callout banners.
  - Manage footer link columns and legal links.
* **How to Use:**
  1. Adjust link labels, destinations (`href`), or icons.
  2. Click **Save Navigation** to instantly update the public site header.

---

### Module 14: Find & Replace System (`/dashboard/find-replace`)
* **Purpose:** Global text and brand terminology updater across the entire database.
* **Key Capabilities:**
  - Safely search for outdated terms (e.g. replacing legacy partner names, phone numbers, or email addresses) across all courses, pages, and blog posts simultaneously.
  - Preview all affected occurrences before committing the replacement.
* **How to Use:**
  1. Enter the search phrase (e.g., an old phone number).
  2. Enter the replacement phrase.
  3. Click **Preview Matches** to verify the list of affected rows.
  4. Click **Apply Global Replacement** to update all records safely.

---

### Module 15: Blog, News, Media & PDF Resources (`/dashboard/blog`)
* **Purpose:** Content hub for all public articles, media activity photo albums, and governance PDF documents.
* **Key Capabilities:**
  - **News & Press (`/news`):** Publish official press releases, milestones, and thought leadership articles with rich text formatting.
  - **Media Activities (`/media`):** Upload photo collections from workshops, site inspections, and graduation ceremonies into interactive photo albums with full-screen lightbox previews.
  - **Resources & Policies (`/resources`):** Upload official brochures, governance policies, charters, and compliance manuals in **PDF format** (up to 25MB) with download metrics.
* **How to Use:**
  1. Click **New Post** (`/dashboard/blog/new`).
  2. Enter Title and URL slug.
  3. Select Category:
     - Pick **News & Press** for articles.
     - Pick **Media & Gallery** to unlock the **Activity Photo Gallery** uploader.
     - Pick **Resources & Policies** to unlock the **PDF Document Attachment** card.
  4. For PDF uploads: Click **Browse PDF File**, select your PDF, and verify upload.
  5. Toggle **Published** to ON and click **Save Post**.

---

### Module 16: Analytics & Intelligence (`/dashboard/analytics`)
* **Purpose:** Platform traffic, enrollment metrics, and student engagement data.
* **Key Capabilities:**
  - Daily/weekly page views, visitor engagement, and popular landing pages.
  - Course enrollment conversion rates and top-performing training categories.
* **How to Use:**
  1. Check the charts to understand user demand and optimize marketing efforts.

---

### Module 17: Testimonials Management (`/dashboard/testimonials`)
* **Purpose:** Social proof and trainee reviews showcase.
* **Key Capabilities:**
  - Add graduate reviews, corporate client recommendations (e.g., Chevron, TotalEnergies, PE Energy), and partner quotes.
  - Include student photo, corporate position, company logo, and rating (1–5 stars).
* **How to Use:**
  1. Click **Add Testimonial**.
  2. Input trainee name, organization, testimonial quote, and rating.
  3. Toggle ON to display on the public homepage and course pages.

---

### Module 18: Settings & Configuration (`/dashboard/settings`)
* **Purpose:** Platform-wide system configuration.
* **Key Capabilities:**
  - Institution branding: update official name, logos (light/dark), favicon, and primary contact details.
  - Social media URLs: LinkedIn, Twitter/X, YouTube, Facebook links.
  - Maintenance Mode: Put the public site into a scheduled maintenance page while admins retain full dashboard access.
* **How to Use:**
  1. Update social links or contact emails as they evolve.
  2. Click **Save Settings** to persist changes globally.

---

## 6. Learning Management System (LMS) Workflows

### Student Enrollment Journey
1. A student registers at `/auth` and browses `/courses`.
2. They select a course and proceed through the checkout flow (`/payment/:courseId`).
3. Upon payment success (or admin manual enrollment), the course is instantly unlocked in the student's dashboard (`/dashboard/courses`).
4. The student accesses the modern Course Player (`/course/:id/learn`), watching lessons, downloading materials, and tracking completion.
5. Upon 100% completion, the system automatically generates an authenticated digital certificate verifiable at `/verify-certificate`.

### Certificate Verification
* Each certificate has a unique cryptographically generated Certificate ID.
* Any third-party employer or regulatory auditor can visit `/verify-certificate`, input the ID, and instantly confirm the student's name, course, completion date, and issuing authority.

---

## 7. Backup, Security & Maintenance Protocols

1. **Database Backups:** Automated daily backups are managed within the Supabase Cloud dashboard. Manual SQL dumps can be exported via `supabase db dump`.
2. **Access Security:** Ensure all administrative staff use strong, unique passwords. Enable two-factor authentication on the primary Supabase and Hosting accounts.
3. **Asset Protection:** Storage buckets are configured with read access for public website visitors and authenticated write access restricted strictly to administrators.
4. **Codebase Version Control:** The master codebase is version-controlled via Git. Any future modifications should be committed to feature branches before merging to main.

---

*End of Documentation — PANA Institute Engineering Team*
