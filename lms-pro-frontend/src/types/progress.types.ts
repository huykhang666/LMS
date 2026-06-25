import type { Timestamp } from 'firebase/firestore';

export interface LessonProgress {
  userId: string;
  courseId: string;
  chapterId: string;
  lessonId: string;
  videoWatchedSeconds: number;
  videoDurationSeconds: number;
  isCompleted: boolean;
  completedAt: Timestamp | null;
  updatedAt: Timestamp;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  enrolledAt: Timestamp;
  lastAccessedAt: Timestamp;
  completionPercent: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  courseId: string;
  chapterId: string;
  score: number;
  correctCount: number;
  totalCount: number;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
  attemptedAt: Timestamp;
}

export interface Note {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  content: string;
  timestampInVideo: number | null;
  createdAt: Timestamp;
}

// Progress map keyed by lessonId
export type ProgressMap = Record<string, LessonProgress>;
