import { motion, AnimatePresence } from 'motion/react';
import { X, Box, Rotate3d, Maximize2 } from 'lucide-react';

interface ARViewerProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: string;
}

export default function ARViewer({ isOpen, onClose, topic = "Refraction of Light" }: ARViewerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-md"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-1">AR Learning Session</h2>
            <h3 className="text-white text-2xl font-bold">{topic}</h3>
          </div>

          <div className="relative w-full max-w-2xl aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border-2 border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
             {/* Simulated 3D Scene */}
             <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 to-transparent"></div>
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #ffffff1a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
             </div>

             <motion.div 
               animate={{ 
                 rotateY: [0, 360],
                 y: [0, -10, 0]
               }}
               transition={{ 
                 rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                 y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
               }}
               className="relative z-10 text-emerald-400"
               style={{ perspective: '1000px' }}
             >
                <div className="w-32 h-32 border-4 border-emerald-400 rounded-lg flex items-center justify-center bg-emerald-500/10">
                   <Box size={64} />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-4 bg-black/40 blur-lg rounded-full"></div>
             </motion.div>

             <div className="absolute bottom-6 left-6 flex gap-4">
                <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-bold hover:bg-white/20 transition-colors">
                   <Rotate3d size={14} /> Rotate
                </button>
                <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-bold hover:bg-white/20 transition-colors">
                   <Maximize2 size={14} /> Zoom
                </button>
             </div>

             <div className="absolute top-6 left-6 text-white/40 text-[10px] items-center gap-2 flex uppercase font-bold tracking-widest">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Analyzing Environment...
             </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6 w-full max-w-2xl">
            <div className="bg-white/5 p-4 rounded-2xl">
              <p className="text-white/40 text-[10px] font-bold uppercase mb-1">Index of Refraction</p>
              <p className="text-white font-mono text-xl">1.33</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl">
              <p className="text-white/40 text-[10px] font-bold uppercase mb-1">Angle of Incidence</p>
              <p className="text-white font-mono text-xl">45°</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl">
              <p className="text-white/40 text-[10px] font-bold uppercase mb-1">Status</p>
              <p className="text-emerald-400 font-mono text-xl">CONNECTED</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
