import { useState } from 'react';
import { Send, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg dark:shadow-slate-900/40 flex items-center gap-1 sm:gap-2 border border-slate-200 dark:border-slate-700 transition-colors">
      <button 
        className="p-2 sm:p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        title="Upload Image (Multimodal)"
      >
        <ImageIcon size={20} />
      </button>
      
      <input 
        type="text" 
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Uliza Rafiki swali..." 
        disabled={disabled}
        className="flex-1 px-1 sm:px-2 py-3 outline-none text-sm bg-transparent dark:text-white"
      />
      
      <button 
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className={`bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:bg-slate-400 text-white px-4 sm:px-6 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all active:scale-95`}
      >
        <span className="hidden xs:inline">Send</span>
        {disabled ? (
          <Sparkles size={16} className="animate-pulse" />
        ) : (
          <Send size={16} />
        )}
      </button>
    </div>
  );
}
