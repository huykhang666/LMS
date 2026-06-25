import { useEffect } from 'react';
import { 
  onIdTokenChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/firestore';
import { useAuthStore } from '@/store/authStore';
import type { UserRole, AuthUser } from '@/types/user.types';

// Detect if Firebase config is dummy/mock
const isMockMode = !import.meta.env.VITE_FIREBASE_API_KEY || 
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('Dummy') ||
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('dummy');

// Preloaded mock accounts database
const MOCK_USERS_KEY = 'lms_users';
const CURRENT_USER_KEY = 'lms_current_user';

const DEFAULT_MOCK_USERS = [
  {
    uid: 'mock-uid-admin',
    email: 'admin@lms.pro',
    password: 'admin123',
    displayName: 'Quản trị viên',
    role: 'admin' as UserRole,
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'
  },
  {
    uid: 'mock-uid-user',
    email: 'user@lms.pro',
    password: 'user123',
    displayName: 'Học viên Demo',
    role: 'user' as UserRole,
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=user'
  }
];

function getMockUsers() {
  const data = localStorage.getItem(MOCK_USERS_KEY);
  if (!data) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(DEFAULT_MOCK_USERS));
    return DEFAULT_MOCK_USERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_MOCK_USERS;
  }
}

function saveMockUser(user: any) {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

export function useAuthListener() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    if (isMockMode) {
      // Mock session restoration
      const savedUserStr = localStorage.getItem(CURRENT_USER_KEY);
      if (savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          setUser(user);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    // Real Firebase listener
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        return;
      }
      
      try {
        const tokenResult = await firebaseUser.getIdTokenResult();
        const role = (tokenResult.claims.role as UserRole) ?? 'user';
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: role,
          avatarUrl: firebaseUser.photoURL || undefined,
        });

        // Sync to users collection in Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Học viên mới',
            email: firebaseUser.email || '',
            avatarUrl: firebaseUser.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + firebaseUser.uid,
            role: role,
            level: 1,
            xp: 0,
            streakDays: 0,
            lastActiveDate: '',
            createdAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error('Error syncing user profile:', error);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role: 'user',
          avatarUrl: firebaseUser.photoURL || undefined,
        });
      }
    });

    return unsubscribe;
  }, [setUser, setLoading]);
}

export function useAuthActions() {
  const setUser = useAuthStore((s) => s.setUser);

  const loginWithEmail = async (email: string, pass: string) => {
    if (isMockMode) {
      const users = getMockUsers();
      const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw { code: 'auth/user-not-found' };
      }
      if (user.password !== pass) {
        throw { code: 'auth/wrong-password' };
      }
      const authUser: AuthUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        avatarUrl: user.avatarUrl
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return;
    }

    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    if (isMockMode) {
      const users = getMockUsers();
      const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        throw { code: 'auth/email-already-in-use' };
      }

      const newUser = {
        uid: 'mock-uid-' + Date.now(),
        email: email,
        password: pass,
        displayName: name,
        role: 'user' as UserRole,
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + name
      };

      saveMockUser(newUser);

      const authUser: AuthUser = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl
      };

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, {
      displayName: name,
      photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + userCredential.user.uid,
    });
  };

  const loginWithGoogle = async () => {
    if (isMockMode) {
      const authUser: AuthUser = {
        uid: 'mock-uid-google',
        email: 'google-student@lms.pro',
        displayName: 'Google Học viên',
        role: 'user',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=google'
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return;
    }

    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (isMockMode) {
      localStorage.removeItem(CURRENT_USER_KEY);
      setUser(null);
      return;
    }

    await signOut(auth);
    setUser(null);
  };

  return {
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
  };
}
