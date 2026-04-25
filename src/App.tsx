/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ChatInterface from './components/chat/ChatInterface';
import Dashboard from './components/dashboard/Dashboard';
import Settings from './components/settings/Settings';
import AuthOverlay from './components/auth/AuthOverlay';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'settings'>('chat');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          const newProfile = {
            uid: user.uid,
            name: user.displayName || 'Scholar',
            email: user.email,
            level: 1,
            xp: 0,
            currentCurriculum: 'CBC',
            themePreference: 'light',
            studentId: Math.floor(1000 + Math.random() * 9000).toString(),
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, newProfile);
          setUserProfile(newProfile);
        } else {
          setUserProfile(userSnap.data());
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for profile changes (XP etc)
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data());
          setIsDarkMode(doc.data().themePreference === 'dark');
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <AuthOverlay />;
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'text-slate-800 bg-slate-50'}`}>
      <Sidebar userProfile={userProfile} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header userProfile={userProfile} isDarkMode={isDarkMode} />
        
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ChatInterface userProfile={userProfile} />
              </motion.div>
            ) : activeTab === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <Dashboard userProfile={userProfile} />
              </motion.div>
            ) : activeTab === 'settings' ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <Settings userProfile={userProfile} />
              </motion.div>
            ) : (
              <div />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
