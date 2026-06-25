import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';
import { queryClient } from '@/lib/queryClient';
import { useAuthListener } from '@/features/auth/hooks/useAuth';
import { useCourseStore, StoredCourse } from '@/store/courseStore';

const isMockMode = !import.meta.env.VITE_FIREBASE_API_KEY || 
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('Dummy') ||
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('dummy');

// Real-time hook to sync courses collection from Firestore
export function useCoursesSync() {
  const setCourses = useCourseStore((s) => s.setCourses);

  useEffect(() => {
    if (isMockMode) return;

    const unsubscribe = onSnapshot(
      collection(db, 'courses'),
      (snapshot) => {
        const coursesList: StoredCourse[] = [];
        snapshot.forEach((doc) => {
          coursesList.push({ ...doc.data(), id: doc.id } as StoredCourse);
        });
        setCourses(coursesList);
      },
      (error) => {
        console.error('Error syncing courses from Firestore:', error);
      }
    );

    return () => unsubscribe();
  }, [setCourses]);
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Listen to Auth State globally
  useAuthListener();

  // Sync courses with Firebase database in real-time
  useCoursesSync();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
