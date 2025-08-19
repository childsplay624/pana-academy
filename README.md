PANA Academy LMS

An Educational Management System (EMS) designed for PANA Academy. This platform allows administrators, instructors, and students to manage courses, track progress, and interact in an engaging learning environment.

Features
Authentication & User Management

Secure sign-up and login with email/password or social providers.

Role-based access (Admin, Instructor, Student).

User profiles with customizable information.

Course Management

Create, edit, and organize courses.

Upload lessons, videos, and other learning materials.

Assign instructors to courses.

Enroll students manually or via registration codes.

Student Dashboard

Personalized dashboard showing enrolled courses.

Progress tracking for lessons and modules.

Collapsible and responsive sidebar for easy navigation.

Interactive charts for performance insights.

Instructor Dashboard

Manage assigned courses.

Upload and organize learning materials.

Monitor student progress and performance.

Admin Dashboard

Full control of users (students, instructors, admins).

Course approval and management.

Analytics and reports on platform usage.

Backend Integration

Built with a scalable backend supporting user authentication, course data storage, and analytics.

Real-time database for student progress and course updates.

Secure APIs for course, user, and content management.

Tech Stack

Frontend: React + Tailwind CSS (responsive and mobile-friendly design).

Backend: Node.js + Supabase (authentication, data, and storage).

Database: PostgreSQL (structured and scalable).

Installation

Clone the repository:

git clone https://github.com/yourusername/pana-academy-lms.git
cd pana-academy-lms


Install dependencies:

npm install


Set up environment variables in a .env file:

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key


Run the development server:

npm run dev

Roadmap

✅ Authentication (email/social login).

✅ Student, Instructor, Admin dashboards.

✅ Course creation & enrollment.

🚧 Quizzes & Assessments.

🚧 Certificates on course completion.

🚧 AI-driven recommendations for courses.

License

This project is licensed under the MIT License.
