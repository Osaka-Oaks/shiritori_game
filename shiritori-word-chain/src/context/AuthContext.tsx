import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  highScore: number;
  gamesPlayed: number;
  createdAt: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateHighScore: (score: number) => Promise<void>;
  incrementGamesPlayed: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create Firestore profile
        await syncUserProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const syncUserProfile = async (firebaseUser: FirebaseUser) => {
    const docPath = `users/${firebaseUser.uid}`;
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      } else {
        // Initialize new user profile
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Guest Player",
          highScore: 0,
          gamesPlayed: 0,
          createdAt: new Date() // Will convert to Firestore Timestamp or request.time in write
        };
        
        // Write profile document securely
        await setDoc(userRef, {
          ...newProfile,
          createdAt: new Date() // Firestore automatically serializes js Date objects
        });
        setProfile(newProfile);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Create new profile explicitly
    const docPath = `users/${firebaseUser.uid}`;
    try {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: displayName || email.split("@")[0],
        highScore: 0,
        gamesPlayed: 0,
        createdAt: new Date()
      };
      await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
      setProfile(newProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, docPath);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const updateHighScore = async (score: number) => {
    if (!user || !profile) return;
    if (score <= profile.highScore) return;

    const docPath = `users/${user.uid}`;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { highScore: score });
      setProfile(prev => prev ? { ...prev, highScore: score } : null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, docPath);
    }
  };

  const incrementGamesPlayed = async () => {
    if (!user || !profile) return;

    const docPath = `users/${user.uid}`;
    try {
      const userRef = doc(db, "users", user.uid);
      const updatedCount = profile.gamesPlayed + 1;
      await updateDoc(userRef, { gamesPlayed: updatedCount });
      setProfile(prev => prev ? { ...prev, gamesPlayed: updatedCount } : null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, docPath);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      login,
      signup,
      logout,
      loginWithGoogle,
      updateHighScore,
      incrementGamesPlayed
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
