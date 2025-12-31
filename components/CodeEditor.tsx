
import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const CodeEditor: React.FC<Props> = ({ value, onChange, onAnalyze, isAnalyzing }) => {
  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
      <div className="flex items-center justify-between px-5 py-3 bg-slate-900/50 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <span className="text-[11px] font-mono text-slate-400 tracking-wider">script_todolist.py</span>
        </div>
        
        <button 
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`relative group px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            isAnalyzing 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
          }`}
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyse...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
              Lancer l'Analyse
            </div>
          )}
        </button>
      </div>
      
      <div className="relative flex-1 group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="absolute inset-0 w-full h-full p-8 bg-transparent text-slate-300 font-mono text-sm leading-relaxed focus:outline-none resize-none code-font"
          placeholder="# Écris ton code ici..."
        />
      </div>
    </div>
  );
};

export default CodeEditor;
