import { useState, useEffect, useRef } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { askTutor } from '../../lib/gemini';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Boxes, Users, Clock, Share2 } from 'lucide-react';
import ARViewer from '../learning/ARViewer';

interface ChatInterfaceProps {
  userProfile: any;
}

export default function ChatInterface({ userProfile }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // For demo purposes, we use a single global conversation
  useEffect(() => {
    if (!userProfile?.uid) return;

    const q = query(
      collection(db, `users/${userProfile.uid}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${userProfile.uid}/messages`);
    });

    return () => unsubscribe();
  }, [userProfile]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !userProfile?.uid) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: serverTimestamp()
    };

    try {
      await addDoc(collection(db, `users/${userProfile.uid}/messages`), userMessage);
      
      setIsTyping(true);
      
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const aiResponse = await askTutor(text, history, userProfile?.tutorInstructions);

      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, `users/${userProfile.uid}/messages`), assistantMessage);
      
      // Award XP for interaction
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, {
        xp: increment(10)
      });

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userProfile.uid}/messages`);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 min-w-0">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500">
                <Zap size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Sasa {userProfile?.name}!</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Tunaanza na subject gani leo? Uliza Rafiki swali yoyote kuhusu STEM.
                </p>
              </div>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">R</div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex gap-1">
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}>.</motion.span>
                </div>
              </div>
            </div>
          )}
        </div>

        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
      </div>

      {/* Right Sidebar Widgets */}
      <div className="hidden lg:flex w-72 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 p-6 flex-col gap-6 overflow-y-auto custom-scrollbar transition-colors">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Zap size={14} className="text-orange-500" /> Live Challenge
          </h3>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 p-4 rounded-xl">
            <p className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-1">Refraction Quiz #4</p>
            <div className="flex items-center gap-2 text-[10px] text-orange-700 dark:text-orange-400 mb-3">
              <Clock size={10} /> <span>4:20 mins left</span>
              <span className="ml-auto text-emerald-600 dark:text-emerald-400">🔥 +50 XP</span>
            </div>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-bold transition-colors">
              Jump In
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Boxes size={14} className="text-indigo-500" /> Immersive Learning
          </h3>
          <div 
            onClick={() => setIsAROpen(true)}
            className="group relative cursor-pointer overflow-hidden rounded-xl h-28 bg-indigo-600 flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-95"
          >
            <div className="text-center z-10 p-4">
              <p className="text-white text-xs font-bold uppercase tracking-widest mb-1">VR Physics Lab</p>
              <p className="text-indigo-200 text-[10px]">Explore Light Reflection in 3D</p>
            </div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white">AR Enabled</div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Users size={14} className="text-blue-500" /> Collaboration
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium dark:text-slate-300">Alice is editing...</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Mutua (Offline)</span>
            </div>
            <button className="w-full mt-2 py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 text-[10px] font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors uppercase tracking-wider flex items-center justify-center gap-2">
              <Share2 size={12} /> Invite Buddy
            </button>
          </div>
        </div>
      </div>

      <ARViewer 
        isOpen={isAROpen} 
        onClose={() => setIsAROpen(false)} 
        topic="Refraction & Lenses"
      />
    </div>
  );
}
