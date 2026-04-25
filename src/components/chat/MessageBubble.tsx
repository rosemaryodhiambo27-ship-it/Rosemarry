import { motion } from 'motion/react';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: any;
  key?: string | number;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.role === 'assistant';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 text-xs font-bold ${isAI ? 'bg-emerald-500' : 'bg-blue-500'}`}>
        {isAI ? <Bot size={16} /> : 'K'}
      </div>
      <div className={`max-w-[85%] sm:max-w-md p-4 rounded-2xl shadow-sm border ${
        isAI 
          ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-tl-none text-slate-700 dark:text-slate-200' 
          : 'bg-blue-600 border-blue-500 text-white rounded-tr-none shadow-md'
      }`}>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        {message.timestamp && (
          <div className={`text-[10px] mt-2 opacity-60 ${isAI ? 'text-slate-400' : 'text-blue-100'} text-right`}>
            {new Date(message.timestamp?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
