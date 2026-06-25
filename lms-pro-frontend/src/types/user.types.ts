import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  level: number;
  xp: number;
  streakDays: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  createdAt: Timestamp;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  avatarUrl?: string;
}
