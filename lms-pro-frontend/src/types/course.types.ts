import type { Timestamp } from 'firebase/firestore';

export type CourseCategory =
  | 'math' | 'english' | 'programming' | 'it'
  | 'softskill' | 'certificate' | 'ai'
  | 'backend' | 'frontend' | 'devops';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl: string;
  bannerUrl: string;
  category: CourseCategory;
  level: CourseLevel;
  totalChapters: number;
  totalLessons: number;
  totalDurationSeconds: number;
  status: CourseStatus;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  totalLessons: number;
  totalDurationSeconds: number;
  isVisible: boolean;
  quizId: string | null;
}

export interface Section {
  id: string;
  title: string;
  order: number;
  isVisible: boolean;
}

export type VideoStatus = 'uploading' | 'processing' | 'ready' | 'failed';

export interface LessonVideo {
  storagePath: string;
  downloadUrl: string;
  status: VideoStatus;
  sizeBytes: number;
  uploadedAt: Timestamp;
}

export interface LessonDocument {
  id: string;
  type: 'pdf' | 'word' | 'pptx' | 'link' | 'exercise';
  title: string;
  url: string;
  sizeBytes?: number;
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  durationSeconds: number;
  video: LessonVideo | null;
  documents: LessonDocument[];
  quizId: string | null;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  chapterId: string;
  title: string;
  questions: QuizQuestion[];
  passScore: number;
}
