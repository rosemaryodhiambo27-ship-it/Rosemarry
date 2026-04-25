import { BookOpen, GraduationCap, FileText, Trophy, Settings, LayoutDashboard, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  userProfile: any;
  activeTab: 'chat' | 'dashboard' | 'settings';
  setActiveTab: (tab: 'chat' | 'dashboard' | 'settings') => void;
}

export default function Sidebar({ userProfile, activeTab, setActiveTab }: SidebarProps) {
  const nextLevelXp = userProfile?.level * 1000;
  const progress = (userProfile?.xp / nextLevelXp) * 100;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full flex-shrink-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-emerald-400">STEM Rafiki</h1>
        <p className="text-xs text-slate-400 mt-1">Rafiki Yako wa Masomo</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">My Curriculum</p>
          <button className="w-full flex items-center gap-3 px-3 py-2 bg-emerald-600 rounded-lg text-sm mb-1 text-left">
            <span className="w-2 h-2 bg-white rounded-full"></span> 
            {userProfile?.currentCurriculum} Grade 9
          </button>
        </div>

        <div className="px-4 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Learning Hub</p>
          
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'chat' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <MessageSquare size={16} /> Tutor Chat
          </button>

          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <LayoutDashboard size={16} /> Progress
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Settings size={16} /> Tutor Settings
          </button>

          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg text-sm">
            <BookOpen size={16} /> Biology (Anatomy)
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg text-sm">
            <GraduationCap size={16} /> Physics (K.C.S.E Focus)
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg text-sm">
            <FileText size={16} /> Past Papers (2018-2023)
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg text-sm">
            <Trophy size={16} /> Daily Challenges
          </a>
        </div>
      </nav>

      <div className="p-4 bg-slate-800 mx-4 mb-6 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold">Level {userProfile?.level} Scholar</span>
          <span className="text-xs text-emerald-400">{userProfile?.xp} XP</span>
        </div>
        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-emerald-500 h-1.5 rounded-full"
          />
        </div>
      </div>
    </aside>
  );
}
