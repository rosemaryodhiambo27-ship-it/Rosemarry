import { useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Save, Sparkles, MessageSquare, ShieldCheck, RefreshCcw } from 'lucide-react';
import { SYSTEM_INSTRUCTION } from '../../lib/gemini';

interface SettingsProps {
  userProfile: any;
}

export default function Settings({ userProfile }: SettingsProps) {
  const [instructions, setInstructions] = useState(userProfile?.tutorInstructions || SYSTEM_INSTRUCTION);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!userProfile?.uid) return;
    setSaving(true);
    try {
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, {
        tutorInstructions: instructions,
        updatedAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userProfile.uid}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Rudi kwa default settings? Hii itafuta customizations zako.")) {
      setInstructions(SYSTEM_INSTRUCTION);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Tutor Settings</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Tune how Rafiki explains concepts to you. Add more Sheng, focus on specific topics, or change the teaching style.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                <Sparkles size={20} />
              </div>
              <span className="font-bold">Rafiki's Personality (Instructions)</span>
            </div>
            <button 
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <RefreshCcw size={12} /> Reset to Default
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="relative">
              <textarea 
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full h-80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Write instructions for your AI tutor here..."
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <div className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20">LIVE EDIT</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Rafiki follows safety guidelines automatically.</span>
              </div>
              
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                {saving ? (
                  <RefreshCcw size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    {success ? "Saved!" : "Save Instructions"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tip Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 p-6 rounded-2xl flex gap-4"
        >
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl h-fit text-indigo-600 shadow-sm">
            <MessageSquare size={24} />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">Pro Tip: Localize more!</h4>
            <p className="text-sm text-indigo-700 dark:text-indigo-400/80 leading-relaxed">
              Jaribu kuambia Rafiki atumie mifano ya neighborhood yako, ama aongeze Sheng ya "Mtaa yako". The more specific the instructions, the better the analogies!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
