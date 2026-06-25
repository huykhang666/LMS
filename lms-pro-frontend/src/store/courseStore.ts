/**
 * courseStore.ts
 * ---------------------------------------------------------------------------
 * Zustand store with localStorage persistence for all course-related data.
 * This replaces all hardcoded mock data in the app; only admin-created
 * courses appear on the public-facing pages.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

/* ─── Store ─────────────────────────────────────────────────────────────── */

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],

      /* ── Course CRUD ── */
      addCourse: (course) =>
        set((s) => ({ courses: [...s.courses, course] })),

      updateCourse: (id, patch) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: now() } : c
          ),
        })),

      deleteCourse: (id) =>
        set((s) => ({ courses: s.courses.filter((c) => c.id !== id) })),

      publishCourse: (id) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id === id ? { ...c, status: 'published', updatedAt: now() } : c
          ),
        })),

      /* ── Chapter CRUD ── */
      addChapter: (courseId, chapter) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id === courseId
              ? { ...c, chapters: [...c.chapters, chapter], updatedAt: now() }
              : c
          ),
        })),

      updateChapter: (courseId, chapterId, patch) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  updatedAt: now(),
                  chapters: c.chapters.map((ch) =>
                    ch.id === chapterId ? { ...ch, ...patch } : ch
                  ),
                }
              : c
          ),
        })),

      deleteChapter: (courseId, chapterId) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  updatedAt: now(),
                  chapters: c.chapters.filter((ch) => ch.id !== chapterId),
                }
              : c
          ),
        })),

      reorderChapters: (courseId, chapters) =>
        set((s) => ({
          courses: s.courses.map((c) =>
            c.id === courseId ? { ...c, chapters, updatedAt: now() } : c
          ),
        })),

      /* ── Lesson CRUD ── */
      addLesson: (courseId, chapterId, lesson) =>
        set((s) => ({
          courses: s.courses.map((c) =>
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
          ),
        })),

      updateLesson: (courseId, chapterId, lessonId, patch) =>
        set((s) => ({
          courses: s.courses.map((c) =>
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
          ),
        })),

      deleteLesson: (courseId, chapterId, lessonId) =>
        set((s) => ({
          courses: s.courses.map((c) =>
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
          ),
        })),

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
