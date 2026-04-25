import { Bell, Moon, Sun, Search, LogOut } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

interface HeaderProps {
  userProfile: any;
  isDarkMode: boolean;
}

export default function Header({ userProfile, isDarkMode }: HeaderProps) {
  const toggleTheme = async () => {
    if (userProfile?.uid) {
      try {
        const userRef = doc(db, 'users', userProfile.uid);
        await updateDoc(userRef, {
          themePreference: isDarkMode ? 'light' : 'dark'
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${userProfile.uid}`);
      }
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between flex-shrink-0 z-10 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold ${
              i === 1 ? 'bg-blue-100 text-blue-600' : 
              i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {i === 3 ? '+8' : 'SB'}
            </div>
          ))}
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">12 Study Buddies Online</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative">
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          <Bell size={20} />
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden xs:block">
            <p className="text-xs font-bold leading-tight">{userProfile?.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">ID: {userProfile?.studentId}</p>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
