export interface StepItem {
  title: string;
  detail: string;
}

export interface ModuleItem {
  id: string;
  num: string;
  title: string;
  url: string;
  category: string;
  badge: string;
  iconName: string;
  summary: string;
  prereqs: string;
  steps: StepItem[];
  tips: string;
}

export const MODULES_DATA: ModuleItem[] = [
  {
    id: "mod-1",
    num: "01",
    title: "Dashboard Overview",
    url: "/dashboard",
    category: "Executive Command",
    badge: "Core Metrics",
    iconName: "LayoutDashboard",
    summary: "Central executive command center summarizing student enrollment counts, active published courses, system traffic, and urgent operational notices.",
    prereqs: "Active Administrator account privileges.",
    steps: [
      {
        title: "Review Key Metric Widgets",
        detail: "Log in to inspect Total Students, Published Courses, Total Revenue, and Active Certificates at the top cards. All numbers update dynamically from Postgres."
      },
      {
        title: "Audit Live Activity Feeds",
        detail: "Scroll down to check recent student registrations, completed transactions, and freshly submitted contact messages requiring attention."
      },
      {
        title: "Execute Priority Actions",
        detail: "Use the quick-action shortcut buttons to directly launch new course authoring, create invoices, or jump to system settings."
      }
    ],
    tips: "Metric cards are recalculated dynamically against live PostgreSQL Supabase tables. Use this as your starting checkpoint each day."
  },
  {
    id: "mod-2",
    num: "02",
    title: "User Management",
    url: "/dashboard/users",
    category: "Security & Governance",
    badge: "Role Governance",
    iconName: "Users",
    summary: "Comprehensive user directory for inspecting, promoting, demoting, or suspending user accounts across Students, Instructors, Corporate Delegates, and Administrators.",
    prereqs: "Admin authorization to modify user roles and permissions.",
    steps: [
      {
        title: "Filter & Search Users",
        detail: "Navigate to User Management. Use the search input to filter users by full name or email address."
      },
      {
        title: "Inspect User Profiles",
        detail: "Click on any user record to review their registration date, email verification status, enrolled courses, and activity history."
      },
      {
        title: "Modify Account Role",
        detail: "Click the Role dropdown on the user row. Select between student, instructor, or admin to promote or reassign permissions."
      },
      {
        title: "Suspend or Ban Access",
        detail: "For security reviews, toggle the account status to Suspended to immediately revoke their JWT session and platform access."
      }
    ],
    tips: "When promoting an instructor, they instantly gain access to the Curriculum Builder and Lesson Editor without database restarts."
  },
  {
    id: "mod-3",
    num: "03",
    title: "Course Management (LMS)",
    url: "/dashboard/courses",
    category: "Curriculum & Learning",
    badge: "LMS Core",
    iconName: "BookOpen",
    summary: "Complete course builder and syllabus engine for authoring programs across all 13 industrial competency verticals.",
    prereqs: "Instructor or Admin privileges; course syllabus and lecture materials prepared.",
    steps: [
      {
        title: "Initiate Course Creation",
        detail: "Click the New Course button (/dashboard/courses/new) from the course catalog table."
      },
      {
        title: "Configure Primary Metadata",
        detail: "Enter the Course Title, custom URL slug, target Competency Category, course level (Beginner, Intermediate, Advanced), and duration in weeks."
      },
      {
        title: "Set Tuition & Delivery Model",
        detail: "Define the tuition fee (NGN / USD), discount pricing, and mode (Facility-Based, Online, or Blended Hybrid)."
      },
      {
        title: "Build Curriculum Modules",
        detail: "Under the Curriculum section, click Add Module (e.g., Module 1: Valve Actuation Principles). Inside each module, click Add Lesson."
      },
      {
        title: "Attach Media & Lesson Resources",
        detail: "For each lesson, paste YouTube/Vimeo video embed URLs or video files, add rich markdown lecture notes, and attach downloadable PDFs."
      },
      {
        title: "Publish to Catalog",
        detail: "Toggle status from Draft to Published and click Save Course. The course immediately renders in the public directory at /courses."
      }
    ],
    tips: "Draft courses remain completely invisible to students and search engines until explicitly toggled to Published."
  },
  {
    id: "mod-4",
    num: "04",
    title: "Course Category Management",
    url: "/dashboard/course-categories",
    category: "Curriculum & Taxonomy",
    badge: "Taxonomy",
    iconName: "Tag",
    summary: "Configure and manage the 13 competency verticals (Flow Measurement, Valve Technology, Instrumentation, Industrial Safety, etc.).",
    prereqs: "Admin role.",
    steps: [
      {
        title: "Access Categories Directory",
        detail: "Navigate to /dashboard/course-categories to view all active industry tracks."
      },
      {
        title: "Add New Competency Vertical",
        detail: "Click Add Category and provide the Category Name, unique slug, and short prefix code (e.g., FM for Flow Measurement)."
      },
      {
        title: "Set Visual Icon & Color Scheme",
        detail: "Assign a distinct icon identifier and color badge to help prospective students scan courses easily."
      },
      {
        title: "Save & Verify Filters",
        detail: "Click Save. The category filter pills on /courses and homepage navigation update immediately."
      }
    ],
    tips: "Always keep slugs lowercase and hyphenated (e.g. flow-measurement) so URL routes stay clean and SEO-friendly."
  },
  {
    id: "mod-5",
    num: "05",
    title: "Image & Asset Management",
    url: "/dashboard/images",
    category: "Content & Media",
    badge: "Cloud Storage",
    iconName: "ImageIcon",
    summary: "Central media asset manager with Supabase Storage integration for uploading and reusing imagery globally across the site.",
    prereqs: "Admin privileges; image files in JPG, PNG, or WebP format under 10MB.",
    steps: [
      {
        title: "Open Media Manager",
        detail: "Go to /dashboard/images. Filter existing assets by folder or tag (Hero, Facilities, Faculty, Labs)."
      },
      {
        title: "Upload High-Res Assets",
        detail: "Click Upload Image, select the target album/category, and drag files into the dropzone."
      },
      {
        title: "Copy CDN URLs",
        detail: "Click the Copy URL button on any uploaded asset card to copy the public Supabase CDN link to your clipboard."
      },
      {
        title: "Global Asset Replacement",
        detail: "When updating institutional photos, use the Replace function to update all pages referencing that asset without breaking URLs."
      }
    ],
    tips: "Use WebP or compressed JPGs to ensure optimal Largest Contentful Paint (LCP) performance for mobile visitors."
  },
  {
    id: "mod-6",
    num: "06",
    title: "Team & Faculty Management",
    url: "/dashboard/team",
    category: "Institutional Directory",
    badge: "Faculty",
    iconName: "Users",
    summary: "Public directory manager for institute directors, certified instructors, engineering fellows, and advisory board members.",
    prereqs: "Faculty biographies, designations, and portrait headshots.",
    steps: [
      {
        title: "Open Faculty Manager",
        detail: "Navigate to /dashboard/team to inspect current staff profiles."
      },
      {
        title: "Create New Member Profile",
        detail: "Click Add Member. Fill in Full Name, Professional Title (e.g. Lead Valve Specialist), and Academic/Industry Credentials."
      },
      {
        title: "Upload Headshot Portrait",
        detail: "Select a clean portrait photo (square 1:1 ratio recommended). The image uploads directly to the faculty bucket."
      },
      {
        title: "Enter Biography & Social Links",
        detail: "Provide a summary of their engineering background, LinkedIn profile URL, and corporate background (e.g. Shell, Total)."
      },
      {
        title: "Order & Publish",
        detail: "Set the display sequence priority and toggle Published ON. The profile appears at /team."
      }
    ],
    tips: "Designating faculty as Executive Board will place them at the top of the team directory."
  },
  {
    id: "mod-7",
    num: "07",
    title: "Payment Management",
    url: "/dashboard/payments",
    category: "Financial Operations",
    badge: "Gateway Auditing",
    iconName: "CreditCard",
    summary: "Comprehensive transaction ledger monitoring online payments, payment gateway callbacks, and manual approvals.",
    prereqs: "Admin access for financial reconciliations.",
    steps: [
      {
        title: "Review Transaction Logs",
        detail: "Open /dashboard/payments to inspect real-time transaction statuses across Paystack and Flutterwave."
      },
      {
        title: "Verify Payment Details",
        detail: "Click a transaction row to view the payment reference, gateway transaction ID, student email, course ID, and paid amount."
      },
      {
        title: "Filter by Gateway Status",
        detail: "Toggle filter tabs between Successful, Pending, and Failed to investigate disputed payments."
      },
      {
        title: "Manual Settlement Override",
        detail: "For corporate bank transfers, find the pending record and click Mark as Verified to instantly unlock student course access."
      }
    ],
    tips: "Every transaction record logs the gateway response JSON payload for troubleshooting discrepancies."
  },
  {
    id: "mod-8",
    num: "08",
    title: "Invoice Management",
    url: "/dashboard/invoices",
    category: "Corporate Billing",
    badge: "PDF Generator",
    iconName: "FileText",
    summary: "Generate formal corporate training invoices with automated VAT calculations, due dates, and instant PDF downloads.",
    prereqs: "Corporate client billing info and course attendee headcount.",
    steps: [
      {
        title: "Initiate Corporate Invoice",
        detail: "Navigate to /dashboard/invoices and click Create Invoice."
      },
      {
        title: "Enter Client Organization",
        detail: "Specify Company Name, corporate billing address, contact person, and tax ID."
      },
      {
        title: "Add Course Line Items",
        detail: "Select courses, input number of trainees, and specify unit price. The invoice auto-computes subtotals, VAT, and grand total."
      },
      {
        title: "Set Payment Terms",
        detail: "Select Issue Date and Due Date (e.g. Net 30), and add bank settlement instructions."
      },
      {
        title: "Export Official PDF",
        detail: "Click Generate & Download PDF. An official branded PANA invoice is downloaded ready to email to corporate procurement."
      }
    ],
    tips: "Invoices are saved in the database with status tracking (draft, sent, paid, overdue)."
  },
  {
    id: "mod-9",
    num: "09",
    title: "Venue & Facility Management",
    url: "/dashboard/venues",
    category: "Campus & Logistics",
    badge: "Facilities",
    iconName: "MapPin",
    summary: "Configure physical campuses, valve assembly workshops, flow calibration laboratories, and classroom capacities.",
    prereqs: "Facility location details, equipment lists, and seating limits.",
    steps: [
      {
        title: "Access Venues Directory",
        detail: "Go to /dashboard/venues to review campus centers (e.g. Port Harcourt Center of Excellence)."
      },
      {
        title: "Add New Training Facility",
        detail: "Click Add Venue. Input Venue Name, physical address, city, and state."
      },
      {
        title: "Specify Capacity & Rig Equipment",
        detail: "Enter maximum seating capacity and list specialized lab machinery (e.g., Hydrostatic Testing Bench, 10-Ton Crane)."
      },
      {
        title: "Link to Scheduled Cohorts",
        detail: "Assign this venue to in-person course schedules so enrolled trainees receive correct facility arrival instructions."
      }
    ],
    tips: "Adding Google Maps coordinates helps students easily navigate to physical facilities on training days."
  },
  {
    id: "mod-10",
    num: "10",
    title: "Message Management (Inbox)",
    url: "/dashboard/messages",
    category: "Communications",
    badge: "Inquiries",
    iconName: "Mail",
    summary: "Central administrative inbox capturing all contact inquiries, corporate RFPs, and public training consultation requests.",
    prereqs: "Admin permissions to view and triage customer communications.",
    steps: [
      {
        title: "Open Inquiries Inbox",
        detail: "Go to /dashboard/messages. Unread messages are marked with a notification badge."
      },
      {
        title: "Filter Inquiries",
        detail: "Filter by Category: General Inquiry, Corporate Training RFP, Admission Questions, or Facility Rental."
      },
      {
        title: "Read & Review Brief",
        detail: "Click on any message row to view sender full name, company designation, phone number, and detailed request message."
      },
      {
        title: "Triage & Update Status",
        detail: "Mark messages as In Progress, Replied, or Archived to keep institutional communications organized."
      }
    ],
    tips: "Respond promptly to corporate training RFPs to accelerate corporate sponsorship closures."
  },
  {
    id: "mod-11",
    num: "11",
    title: "Support Tickets",
    url: "/dashboard/support-tickets",
    category: "Student Support",
    badge: "Helpdesk",
    iconName: "MessageSquare",
    summary: "LMS technical support desk managing student inquiries regarding course player playback, quiz submissions, and certificate disputes.",
    prereqs: "Admin or instructor access.",
    steps: [
      {
        title: "Open Tickets Dashboard",
        detail: "Navigate to /dashboard/support-tickets to inspect open student queries."
      },
      {
        title: "View Ticket Context",
        detail: "Click on a ticket to review student details, affected course/lesson, and issue description."
      },
      {
        title: "Post Staff Reply",
        detail: "Type your response in the resolution box. If a lesson video link is fixed, provide instructions to the student."
      },
      {
        title: "Update Resolution Status",
        detail: "Change status from Open -> In Progress -> Resolved. An automated notification updates the student portal."
      }
    ],
    tips: "Resolving tickets within 24 hours dramatically increases student course completion rates."
  },
  {
    id: "mod-12",
    num: "12",
    title: "Page Builder / CMS",
    url: "/dashboard/pages",
    category: "Web Publishing",
    badge: "No-Code CMS",
    iconName: "Globe",
    summary: "Visual no-code content management system for custom modular landing pages and institutional static pages without writing code.",
    prereqs: "Admin role; page content, banners, and copywriting ready.",
    steps: [
      {
        title: "Access Page Builder",
        detail: "Go to /dashboard/pages to view all dynamic and static pages."
      },
      {
        title: "Edit Core Static Pages",
        detail: "Click Edit on Home (/), About Us (/about), Safety Policy (/safety), or Our Journey (/our-journey)."
      },
      {
        title: "Update Static Sections",
        detail: "Modify Mission, Vision, Safety statistics (LTI, Safe Manhours), and milestone timeline entries directly in clean form cards."
      },
      {
        title: "Build Dynamic Landing Pages",
        detail: "For new pages (/p/:slug), click Create Page. Add section blocks: Hero Banner, Features Grid, Stats Counter, Testimonials, CTA."
      },
      {
        title: "Reorder & Publish",
        detail: "Use the up/down arrows to reorder section sequence, toggle Published ON, and click Save Page."
      }
    ],
    tips: "All changes save to Supabase and render immediately without needing Vite redeployments."
  },
  {
    id: "mod-13",
    num: "13",
    title: "Navigation Menu Management",
    url: "/dashboard/navigation",
    category: "Site Structure",
    badge: "Header & Footer",
    iconName: "Globe",
    summary: "Configure primary header mega-menu links, dropdown categories, and footer resource link columns.",
    prereqs: "Admin privileges.",
    steps: [
      {
        title: "Open Navigation Editor",
        detail: "Navigate to /dashboard/navigation."
      },
      {
        title: "Manage Header Links",
        detail: "Add, edit, or remove top-level navbar items. Set navigation label, destination route (e.g. /safety), and open-in-new-tab setting."
      },
      {
        title: "Configure Dropdown Submenus",
        detail: "Nest child links under major groups like Media & Resources or Courses & Competencies."
      },
      {
        title: "Update Footer Columns",
        detail: "Rearrange footer categories: Quick Links, Academic Verticals, Legal & Safety, and Social Links."
      },
      {
        title: "Save Navigation State",
        detail: "Click Save Navigation to instantly push menu updates to all web visitors."
      }
    ],
    tips: "Always preview on mobile viewports to ensure header dropdowns remain clean and easy to tap."
  },
  {
    id: "mod-14",
    num: "14",
    title: "Find & Replace Tool",
    url: "/dashboard/find-replace",
    category: "Site Maintenance",
    badge: "Batch Refactoring",
    iconName: "Replace",
    summary: "Global institutional text replacement tool to update phone numbers, physical addresses, brand slogans, and emails across all database records.",
    prereqs: "Admin privileges; review target string carefully before executing.",
    steps: [
      {
        title: "Open Find & Replace",
        detail: "Navigate to /dashboard/find-replace."
      },
      {
        title: "Input Search String",
        detail: "Enter target text to find (e.g., an outdated phone number or former executive name)."
      },
      {
        title: "Input Replacement String",
        detail: "Enter the new text to replace it with."
      },
      {
        title: "Select Database Scopes",
        detail: "Choose target tables to search (Pages, Blog Posts, Course Descriptions, Site Settings)."
      },
      {
        title: "Preview Matches First",
        detail: "Click Find Matches to inspect matching records before any database changes occur."
      },
      {
        title: "Execute Batch Replacement",
        detail: "Verify list of changes and click Replace All. Confirm dialog to execute transactional updates safely."
      }
    ],
    tips: "Always run Find Matches first to verify exactly how many instances will be replaced."
  },
  {
    "id": "mod-15",
    num: "15",
    title: "Blog, Media & Resources (with PDFs)",
    url: "/dashboard/blog",
    category: "Editorial & Governance",
    badge: "PDF & News",
    iconName: "FileText",
    summary: "Publish institutional articles, industry news, photo galleries, and corporate PDF compliance documents & policies.",
    prereqs: "Admin role; article draft or PDF brochure (up to 25MB).",
    steps: [
      {
        title: "Open Blog & Media Hub",
        detail: "Go to /dashboard/blog and click New Post (/dashboard/blog/new)."
      },
      {
        title: "Select Target Section",
        detail: "In the Section dropdown, choose between News (/news), Media (/media), or Resources & Policies (/resources)."
      },
      {
        title: "Upload PDF Documents (For Resources & Policies)",
        detail: "When Resources & Policies is selected, the dedicated PDF Upload zone appears. Click Browse PDF File to upload brochures, compliance codes, or training calendars (up to 25MB)."
      },
      {
        title: "Compose Article Body",
        detail: "Use the rich React Quill WYSIWYG editor to format text, add subheaders, bullet lists, or embedded photos."
      },
      {
        title: "Set Cover Image & Tags",
        detail: "Upload a landscape featured image (16:9) and tag with keywords (e.g., Policy, ISO 9001, Safety)."
      },
      {
        title: "Publish & Verify",
        detail: "Toggle Published ON and click Save Post. PDFs immediately feature a download badge on /resources."
      }
    ],
    tips: "Posts under Resources & Policies render a clean download card with direct file size and instant browser viewing."
  },
  {
    id: "mod-16",
    num: "16",
    title: "Analytics & Intelligence",
    url: "/dashboard/analytics",
    category: "Performance Metrics",
    badge: "BI Analytics",
    iconName: "TrendingUp",
    summary: "Traffic trends, student enrollment conversion funnels, popular course rankings, and geographic interest tracking.",
    prereqs: "Admin privileges.",
    steps: [
      {
        title: "Open Analytics Dashboard",
        detail: "Navigate to /dashboard/analytics."
      },
      {
        title: "Set Date Range Filter",
        detail: "Select time window: Last 7 Days, Last 30 Days, Year-to-Date, or Custom Range."
      },
      {
        title: "Analyze Page Engagement",
        detail: "Examine page view charts for top landing pages (/courses, /safety, /resources)."
      },
      {
        title: "Evaluate Course Demand",
        detail: "Review most-viewed courses versus actual enrollment completions to optimize curriculum pricing and marketing."
      }
    ],
    tips: "Export analytics summaries to guide academic board reviews and annual training calendar planning."
  },
  {
    id: "mod-17",
    num: "17",
    title: "Testimonials Management",
    url: "/dashboard/testimonials",
    category: "Social Proof",
    badge: "Endorsements",
    iconName: "MessageSquareText",
    summary: "Curate student success reviews and corporate partner endorsements (Chevron, PE Energy, TotalEnergies, NLNG).",
    prereqs: "Student quotes, company affiliations, and client logos.",
    steps: [
      {
        title: "Access Testimonials Manager",
        detail: "Go to /dashboard/testimonials to review published social proof."
      },
      {
        title: "Add New Testimonial",
        detail: "Click Add Testimonial. Input Student/Executive Name, Company/Sponsor Name, and Job Title."
      },
      {
        title: "Input Quote & Star Rating",
        detail: "Paste testimonial text and assign rating (typically 5 Stars)."
      },
      {
        title: "Upload Headshot or Corporate Logo",
        detail: "Attach high-resolution photo or company emblem."
      },
      {
        title: "Set Homepage Feature Flag",
        detail: "Toggle Feature on Homepage to showcase in the primary landing page carousel, then click Save."
      }
    ],
    tips: "Featuring real corporate client logos (Total, Chevron, Shell) increases prospective student trust by over 40%."
  },
  {
    id: "mod-18",
    num: "18",
    title: "Settings & Global Configuration",
    url: "/dashboard/settings",
    category: "System Configuration",
    badge: "System Settings",
    iconName: "Settings",
    summary: "Institute-wide configurations including official branding logos, emergency contact phone numbers, social media links, and maintenance guard.",
    prereqs: "Admin master account.",
    steps: [
      {
        title: "Access Settings Panel",
        detail: "Navigate to /dashboard/settings."
      },
      {
        title: "Update Brand Assets",
        detail: "Upload primary light/dark mode institutional logos and favicon."
      },
      {
        title: "Configure Official Contact Details",
        detail: "Update Institute Email addresses (info@pana-academy.com, admissions@), physical campus address, and official WhatsApp hotline."
      },
      {
        title: "Update Social Media Channels",
        detail: "Configure official URLs for LinkedIn, Twitter/X, Facebook, and YouTube."
      },
      {
        title: "Toggle Scheduled Maintenance Mode",
        detail: "If undergoing database maintenance, toggle Maintenance Guard ON to display a polite maintenance landing page to public visitors while admins remain logged in."
      },
      {
        title: "Save Global Settings",
        detail: "Click Save Settings. Updates take effect instantaneously across headers, footers, and contact widgets."
      }
    ],
    tips: "Always double-check phone numbers in international format (e.g. +234...) so mobile tap-to-call works seamlessly."
  }
];
