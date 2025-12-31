
import React from 'react';
import { ProjectRequirement } from '../types';

interface Props {
  requirements: ProjectRequirement[];
  onToggle: (id: string) => void;
}

const RequirementList: React.FC<Props> = ({ requirements, onToggle }) => {
  const categories = {
    core: "Fonctionnalités Principales",
    technical: "Contraintes Techniques",
    bonus: "Bonus (Facultatif)"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Objectifs du Projet
      </h2>

      {(Object.keys(categories) as Array<keyof typeof categories>).map(cat => (
        <div key={cat} className="mb-6 last:mb-0">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            {categories[cat]}
          </h3>
          <div className="space-y-3">
            {requirements.filter(r => r.category === cat).map(req => (
              <div 
                key={req.id} 
                onClick={() => onToggle(req.id)}
                className={`group flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                  req.completed 
                    ? 'bg-emerald-50 border-emerald-100' 
                    : 'bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-white'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
                  req.completed 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'border-slate-300 group-hover:border-indigo-400'
                }`}>
                  {req.completed && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${req.completed ? 'text-emerald-700 font-medium' : 'text-slate-600'}`}>
                  {req.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequirementList;
