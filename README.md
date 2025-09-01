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

- Built with Supabase for authentication and database.
- Real-time updates using Supabase's real-time features.
- Secure file storage for course materials.

## Email Notifications

The platform uses [Resend](https://resend.com) for sending email notifications. The following emails are sent automatically:

- **Welcome Email**: Sent when a new user signs up
- **Password Reset**: Sent when a user requests a password reset
- **Course Enrollment**: Sent when a user enrolls in a course

### Email Templates

Email templates are defined in `src/services/emailService.ts` and can be customized as needed. The following templates are available:

- `welcome(name: string)`: Welcome email for new users
- `passwordReset(userName: string, resetLink: string)`: Password reset email
- `courseEnrollment(courseTitle: string, userName: string)`: Course enrollment confirmation

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
VITE_APP_URL=http://localhost:5173
VITE_RESEND_API_KEY=your_resend_api_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Backend

Built with Node.js + Supabase (authentication, data, and storage).

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
