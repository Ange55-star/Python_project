
import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const CodeEditor: React.FC<Props> = ({ value, onChange, onAnalyze, isAnalyzing }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e293b] rounded-xl overflow-hidden shadow-xl border border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-xs font-mono text-slate-400 ml-4">main.py</span>
        </div>
        <button 
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            isAnalyzing 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 active:scale-95'
          }`}
        >
          {isAnalyzing ? (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {isAnalyzing ? 'Analyse...' : 'Analyser le Code'}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 w-full p-6 bg-transparent text-slate-100 font-mono text-sm leading-relaxed focus:outline-none resize-none code-font"
        placeholder="# Écrivez votre code Python ici...
# Exemple:
# tasks = []
# def add_task(title, description):
#     tasks.append({'titre': title, 'description': description, 'statut': 'En cours'})"
      />
    </div>
  );
};

export default CodeEditor;
