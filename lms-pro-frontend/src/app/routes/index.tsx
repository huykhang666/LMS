import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/features/home/pages/HomePage';
import { CourseExplorePage } from '@/features/courses/pages/CourseExplorePage';
import { CourseDetailPage } from '@/features/courses/pages/CourseDetailPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';

// Route Guards
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { RequireRole } from '@/features/auth/components/RequireRole';

// Layout Shells
import { LearnerShell } from '@/shared/components/layout/LearnerShell';
import { AdminShell } from '@/shared/components/layout/AdminShell';

// Learner Pages
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { LearningPage } from '@/features/learning/pages/LearningPage';
import { MyNotesPage } from '@/features/notes/pages/MyNotesPage';

// Admin Pages
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage';
import { AdminCourseListPage } from '@/features/admin/pages/AdminCourseListPage';
import { AdminCourseFormPage } from '@/features/admin/pages/AdminCourseFormPage';
import { AdminCourseEditPage } from '@/features/admin/pages/AdminCourseEditPage';
import { AdminCourseContentPage } from '@/features/admin/pages/AdminCourseContentPage';
import { AdminUserListPage } from '@/features/admin/pages/AdminUserListPage';
import { AdminAnalyticsPage } from '@/features/admin/pages/AdminAnalyticsPage';

// Error Pages
import { Error403Page } from '@/features/auth/pages/Error403Page';
import { Error404Page } from '@/features/auth/pages/Error404Page';

export const router = createBrowserRouter([
  // ---- Public ----
  { path: '/', element: <HomePage /> },
  { path: '/courses', element: <CourseExplorePage /> },
  { path: '/courses/:slug', element: <CourseDetailPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // ---- Learner (Requires login) ----
  {
    path: '/app',
    element: (
      <RequireAuth>
        <LearnerShell />
      </RequireAuth>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'notes', element: <MyNotesPage /> },
    ],
  },
  
  // Learning page itself doesn't need LearnerShell as it uses custom learning layout
  {
    path: '/app/learn/:courseId/:lessonId',
    element: (
      <RequireAuth>
        <LearningPage />
      </RequireAuth>
    )
  },

  // ---- Admin (Requires admin role) ----
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <RequireRole role="admin">
          <AdminShell />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { path: '', element: <AdminDashboardPage /> },
      { path: 'courses', element: <AdminCourseListPage /> },
      { path: 'courses/new', element: <AdminCourseFormPage /> },
      { path: 'courses/:courseId/edit', element: <AdminCourseEditPage /> },
      { path: 'courses/:courseId/content', element: <AdminCourseContentPage /> },
      { path: 'users', element: <AdminUserListPage /> },
      { path: 'analytics', element: <AdminAnalyticsPage /> },
    ],
  },

  // ---- Error Handlers ----
  { path: '/403', element: <Error403Page /> },
  { path: '*', element: <Error404Page /> }
]);
export default router;
