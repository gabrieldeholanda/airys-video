import { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  UserCredential
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserService } from '../services/user.service';
import type { User, UserType } from '../types/user';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: UserType) => Promise<UserCredential>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    if (user?.uid) {
      const data = await UserService.getUserById(user.uid);
      setUserData(data);
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        setUser(currentUser);
        await refreshUserData();
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    await refreshUserData();
  };

  const signUp = async (email: string, password: string, userType: UserType) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = result;

    await UserService.createUser(user.uid, {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || email.split('@')[0],
      userType,
      isEmailVerified: user.emailVerified,
      photoURL: user.photoURL || undefined,
      lastLoginAt: new Date()
    });

    await refreshUserData();
    return result;
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const { user } = result;

    const existingUser = await UserService.getUserById(user.uid);
    if (!existingUser) {
      const [firstName, ...lastNameParts] = (user.displayName || '').split(' ');
      const lastName = lastNameParts.join(' ');

      await UserService.createUser(user.uid, {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        userType: 'personal',
        isEmailVerified: user.emailVerified,
        photoURL: user.photoURL || undefined,
        lastLoginAt: new Date(),
        personalDetails: {
          firstName: firstName || '',
          lastName: lastName || '',
          email: user.email || '',
        }
      });
    } else {
      await UserService.updateUserProfile(user.uid, {
        lastLoginAt: new Date()
      });
    }

    await refreshUserData();
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    logout,
    googleSignIn,
    resetPassword,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 