/**
 * courseStore.ts
 * ---------------------------------------------------------------------------
 * Zustand store with localStorage persistence for all course-related data.
 * This replaces all hardcoded mock data in the app; only admin-created
 * courses appear on the public-facing pages.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

/* ─── Domain types (lightweight, localStorage-friendly) ────────────────── */

export type CourseCategory =
  | 'math' | 'english' | 'programming' | 'it'
  | 'softskill' | 'certificate' | 'ai'
  | 'backend' | 'frontend' | 'devops';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface StoredLesson {
  id: string;
  title: string;
  order: number;
  durationLabel: string; // e.g. "15:24" or "Tài liệu"
  type: 'video' | 'pdf' | 'doc';
  videoUrl?: string;   // YouTube embed or Firebase download URL
  documentUrl?: string;
}

export interface StoredChapter {
  id: string;
  title: string;
  order: number;
  isVisible: boolean;
  lessons: StoredLesson[];
}

export interface StoredCourse {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  bannerUrl: string;
  category: CourseCategory;
  level: CourseLevel;
  status: CourseStatus;
  createdBy: string;          // uid of admin
  createdAt: string;          // ISO string
  updatedAt: string;          // ISO string
  chapters: StoredChapter[];
}

/* ─── Store state + actions ─────────────────────────────────────────────── */

interface CourseState {
  courses: StoredCourse[];
  setCourses: (courses: StoredCourse[]) => void;

  // CRUD – courses
  addCourse: (course: StoredCourse) => void;
  updateCourse: (id: string, patch: Partial<StoredCourse>) => void;
  deleteCourse: (id: string) => void;
  publishCourse: (id: string) => void;

  // CRUD – chapters
  addChapter: (courseId: string, chapter: StoredChapter) => void;
  updateChapter: (courseId: string, chapterId: string, patch: Partial<StoredChapter>) => void;
  deleteChapter: (courseId: string, chapterId: string) => void;
  reorderChapters: (courseId: string, chapters: StoredChapter[]) => void;

  // CRUD – lessons
  addLesson: (courseId: string, chapterId: string, lesson: StoredLesson) => void;
  updateLesson: (courseId: string, chapterId: string, lessonId: string, patch: Partial<StoredLesson>) => void;
  deleteLesson: (courseId: string, chapterId: string, lessonId: string) => void;

  // Selectors (handy helpers, not persisted)
  getCourse: (id: string) => StoredCourse | undefined;
  getCourseBySlug: (slug: string) => StoredCourse | undefined;
  getPublishedCourses: () => StoredCourse[];
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function now() {
  return new Date().toISOString();
}

const isMockMode = !import.meta.env.VITE_FIREBASE_API_KEY || 
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('Dummy') ||
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('dummy');

// Async helper to write course to Firestore in real-time
const syncCourseToFirestore = async (course: StoredCourse) => {
  if (isMockMode) return;
  try {
    await setDoc(doc(db, 'courses', course.id), course);
  } catch (err) {
    console.error('Error syncing course to Firestore:', err);
  }
};

// Async helper to delete course from Firestore in real-time
const deleteCourseFromFirestore = async (id: string) => {
  if (isMockMode) return;
  try {
    await deleteDoc(doc(db, 'courses', id));
  } catch (err) {
    console.error('Error deleting course from Firestore:', err);
  }
};

/* ─── Store ─────────────────────────────────────────────────────────────── */

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],

      setCourses: (courses) => set({ courses }),

      /* ── Course CRUD ── */
      addCourse: (course) => {
        set((s) => ({ courses: [...s.courses, course] }));
        syncCourseToFirestore(course);
      },

      updateCourse: (id, patch) =>
        set((s) => {
          const updatedCourses = s.courses.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: now() } : c
          );
          const updated = updatedCourses.find((c) => c.id === id);
          if (updated) syncCourseToFirestore(updated);
          return { courses: updatedCourses };
        }),

      deleteCourse: (id) => {
        set((s) => ({ courses: s.courses.filter((c) => c.id !== id) }));
        deleteCourseFromFirestore(id);
      },

      publishCourse: (id) =>
        set((s) => {
          const updatedCourses = s.courses.map((c) =>
            c.id === id ? { ...c, status: 'published' as CourseStatus, updatedAt: now() } : c
          );
          const updated = updatedCourses.find((c) => c.id === id);
          if (updated) syncCourseToFirestore(updated);
          return { courses: updatedCourses };
        }),


      /* ── Chapter CRUD ── */
      addChapter: (courseId, chapter) =>
        set((s) => {
          const updatedCourses = s.courses.map((c) =>
            c.id === courseId
              ? { ...c, chapters: [...c.chapters, chapter], updatedAt: now() }
              : c
          );
          const updated = updatedCourses.find((c) => c.id === courseId);
          if (updated) syncCourseToFirestore(updated);
          return { courses: updatedCourses };
        }),

      updateChapter: (courseId, chapterId, patch) =>
        set((s) => {
          const updatedCourses = s.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  updatedAt: now(),
                  chapters: c.chapters.map((ch) =>
                    ch.id === chapterId ? { ...ch, ...patch } : ch
                  ),
                }
              : c
          );
          const updated = updatedCourses.find((c) => c.id === courseId);
          if (updated) syncCourseToFirestore(updated);
          return { courses: updatedCourses };
        }),

      deleteChapter: (courseId, chapterId) =>
        set((s) => {
          const updatedCourses = s.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  updatedAt: now(),
                  chapters: c.chapters.filter((ch) => ch.id !== chapterId),
                }
              : c
          );
          const updated = updatedCourses.find((c) => c.id === courseId);
          if (updated) syncCourseToFirestore(updated);
          return { courses: updatedCourses };
        }),

      reorderChapters: (courseId, chapters) =>
        set((s) => {
          const updatedCourses = s.courses.map((c) =>
            c.id === courseId ? { ...c, chapters, updatedAt: now() } : c
          );
          const updated = updatedCourses.find((c) => c.id === courseId);
          if (updated) syncCourseToFirestore(updated);
          return { courses: updatedCourses };
        }),

      /* ── Lesson CRUD ── */
      addLesson: (courseId, chapterId, lesson) =>
        set((s) => {
          const updatedCourses = s.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  updatedAt: now(),
                  chapters: c.chapters.map((ch) =>
                    ch.id === chapterId
                      ? { ...ch, lessons: [...ch.lessons, lesson] }
                      : ch
                  ),
                }
              : c
          );
          const updated = updatedCourses.find((c) => c.id === courseId);
          if (updated) syncCourseToFirestore(updated);
          return { courses: updatedCourses };
        }),

      updateLesson: (courseId, chapterId, lessonId, patch) =>
        set((s) => {
          const updatedCourses = s.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  updatedAt: now(),
                  chapters: c.chapters.map((ch) =>
                    ch.id === chapterId
                      ? {
                          ...ch,
                          lessons: ch.lessons.map((l) =>
                            l.id === lessonId ? { ...l, ...patch } : l
                          ),
                        }
                      : ch
                  ),
                }
              : c
          );
          const updated = updatedCourses.find((c) => c.id === courseId);
          if (updated) syncCourseToFirestore(updated);
          return { courses: updatedCourses };
        }),

      deleteLesson: (courseId, chapterId, lessonId) =>
        set((s) => {
          const updatedCourses = s.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  updatedAt: now(),
                  chapters: c.chapters.map((ch) =>
                    ch.id === chapterId
                      ? { ...ch, lessons: ch.lessons.filter((l) => l.id !== lessonId) }
                      : ch
                  ),
                }
              : c
          );
          const updated = updatedCourses.find((c) => c.id === courseId);
          if (updated) syncCourseToFirestore(updated);
          return { courses: updatedCourses };
        }),

      /* ── Selectors ── */
      getCourse: (id) => get().courses.find((c) => c.id === id),
      getCourseBySlug: (slug) => get().courses.find((c) => c.slug === slug),
      getPublishedCourses: () => get().courses.filter((c) => c.status === 'published'),
    }),
    {
      name: 'lms-courses-v1', // localStorage key
    }
  )
);
