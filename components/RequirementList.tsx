
import React from 'react';
import { ProjectRequirement, Category } from '../types';

interface Props {
  requirements: ProjectRequirement[];
}

const RequirementList: React.FC<Props> = ({ requirements }) => {
  const categories: Record<Category, string> = {
    core: "Fonctionnalités",
    technical: "Contraintes",
    bonus: "Extensions"
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          Progression du Projet
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {(Object.keys(categories) as Category[]).map(cat => (
          <div key={cat} className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{categories[cat]}</h3>
            <div className="space-y-2">
              {requirements.filter(r => r.category === cat).map(req => (
                <div 
                  key={req.id} 
                  className={`group p-3 rounded-xl border transition-all ${
                    req.completed 
                      ? 'bg-emerald-50 border-emerald-100' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      req.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                    }`}>
                      {req.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${req.completed ? 'text-emerald-900' : 'text-slate-700'}`}>
                        {req.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{req.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequirementList;
