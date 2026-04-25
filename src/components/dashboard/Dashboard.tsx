import { Trophy, Star, Target, TrendingUp, BookOpen, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  userProfile: any;
}

export default function Dashboard({ userProfile }: DashboardProps) {
  const subjects = [
    { name: 'Mathematics', progress: 65, color: 'bg-blue-500', icon: Target },
    { name: 'Biology', progress: 40, color: 'bg-emerald-500', icon: BookOpen },
    { name: 'Physics', progress: 85, color: 'bg-purple-500', icon: TrendingUp },
    { name: 'Chemistry', progress: 20, color: 'bg-orange-500', icon: Star },
  ];

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Statistics Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rank</p>
              <p className="text-xl font-bold uppercase">Silver Scholar</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Star size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total XP</p>
              <p className="text-xl font-bold">{userProfile?.xp || 0} Points</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Target size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Streak</p>
              <p className="text-xl font-bold">5 Days 🔥</p>
            </div>
          </motion.div>
        </div>

        {/* Subject Progress */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Subject Mastery</h2>
            <button className="text-xs font-semibold text-emerald-500 hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map((sub, idx) => (
              <motion.div 
                key={sub.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${sub.color} bg-opacity-10 text-opacity-100`}>
                      <sub.icon size={18} className={sub.color.replace('bg-', 'text-')} />
                    </div>
                    <span className="font-bold text-sm">{sub.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{sub.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                    className={`${sub.color} h-full rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Level Up Milestones */}
        <section className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Kenya Science Expo 2026</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-md">Join other scholars from across the country in the biggest virtual science fair. Submit your group projects by May 15th!</p>
            <button className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-xl text-sm font-bold transition-all transform hover:scale-105">
              Learn More
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-2xl -ml-10 -mb-10"></div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block">
             <Trophy size={120} className="text-emerald-500/20" />
          </div>
        </section>

      </div>
    </div>
  );
}
