import { useState } from 'react';
import { signInWithGoogle } from '../../lib/firebase';
import { motion } from 'motion/react';
import { LogIn, Sparkles, GraduationCap } from 'lucide-react';

export default function AuthOverlay() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      alert("Uh oh! Kuna issue na login. Jaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="z-10 w-full max-w-md p-8 sm:p-12 mx-4"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-6 rotate-3">
             <GraduationCap size={40} />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 leading-tight">STEM Rafiki</h1>
          <p className="text-slate-400 font-medium">Rafiki yako wa masomo, straight from Kenya! 🇰🇪</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="mt-1 text-emerald-400"><Sparkles size={20} /></div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Unlock <strong>localized analogies</strong>, code-switching explanations, and group projects for your curriculum.
              </p>
            </div>
          </div>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-white/5 disabled:opacity-50"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                Masomo Iende mzee! Login na Google
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-500 mt-6 px-8">
            By joining, you agree to level up your STEM skills and represent Kenya in the global innovation scene.
          </p>
        </div>
      </motion.div>

      {/* Floating Elements for vibe */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/4 right-[15%] text-emerald-500/20 pointer-events-none hidden lg:block"
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </motion.div>
    </div>
  );
}
