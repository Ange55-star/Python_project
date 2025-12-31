
import React, { useState, useCallback } from 'react';
import RequirementList from './components/RequirementList';
import CodeEditor from './components/CodeEditor';
import ChatInterface from './components/ChatInterface';
import { ProjectRequirement, ChatMessage, CodeAnalysis } from './types';
import { analyzePythonCode, getTutorHint } from './services/geminiService';

const INITIAL_REQUIREMENTS: ProjectRequirement[] = [
  { id: 'req_1', title: 'Boucle infinie', description: 'Utilise while True pour maintenir le programme ouvert.', category: 'core', completed: false },
  { id: 'req_2', title: 'Ajouter des tâches', description: 'Permet à l\'utilisateur d\'entrer de nouvelles tâches.', category: 'core', completed: false },
  { id: 'req_3', title: 'Lister les tâches', description: 'Affiche toutes les tâches enregistrées.', category: 'core', completed: false },
  { id: 'req_4', title: 'Utiliser des Dictionnaires', description: 'Chaque tâche doit être un dictionnaire (titre, statut).', category: 'technical', completed: false },
  { id: 'req_5', title: 'Gestion d\'erreurs', description: 'Gère les mauvais inputs sans faire planter le script.', category: 'technical', completed: false },
];

const STARTER_CODE = `# Bienvenue dans ton projet Python !
# Objectif : Créer une To-Do List interactive.

taches = []

while True:
    print("\\n--- MENU TO-DO LIST ---")
    print("1. Voir les tâches")
    print("2. Ajouter une tâche")
    print("3. Quitter")
    
    choix = input("Ton choix : ")
    
    if choix == "3":
        break
        
    # À toi de jouer !
`;

const App: React.FC = () => {
  const [requirements, setRequirements] = useState<ProjectRequirement[]>(INITIAL_REQUIREMENTS);
  const [code, setCode] = useState(STARTER_CODE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const reqList = requirements.map(r => `- ${r.id}: ${r.title}`).join('\n');
      const result = await analyzePythonCode(code, reqList);
      setAnalysis(result);
      
      setRequirements(prev => prev.map(req => ({
        ...req,
        completed: result.completedRequirementIds.includes(req.id)
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsChatLoading(true);
    try {
      const response = await getTutorHint(text, code, messages);
      setMessages(prev => [...prev, { role: 'model', text: response || "Je n'ai pas pu générer de réponse." }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Navbar */}
      <nav className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">PythonTo-Do <span className="text-indigo-600">Mentor</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Environnement d'Apprentissage</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Progression</p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-700 ease-out"
                  style={{ width: `${(requirements.filter(r => r.completed).length / requirements.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-indigo-600">
                {Math.round((requirements.filter(r => r.completed).length / requirements.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex gap-6 p-6 overflow-hidden">
        
        {/* Left: Requirements */}
        <aside className="w-80 flex-shrink-0">
          <RequirementList requirements={requirements} />
        </aside>

        {/* Center: Editor & Feedback */}
        <section className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 min-h-0">
            <CodeEditor 
              value={code} 
              onChange={setCode} 
              onAnalyze={handleAnalyze} 
              isAnalyzing={isAnalyzing} 
            />
          </div>
          
          {/* Analysis Feedback Panel */}
          {analysis && (
            <div className="h-48 bg-white border border-slate-200 rounded-2xl p-6 flex gap-8 shadow-sm">
              <div className="flex-1 space-y-3 overflow-y-auto">
                <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-rose-500"></div>
                  Erreurs détectées
                </h4>
                <ul className="space-y-1.5">
                  {analysis.errors.length === 0 ? (
                    <li className="text-xs text-slate-400 italic">Aucune erreur syntaxique trouvée.</li>
                  ) : (
                    analysis.errors.map((e, i) => <li key={i} className="text-xs text-slate-700 font-medium">• {e}</li>)
                  )}
                </ul>
              </div>
              <div className="w-px bg-slate-100"></div>
              <div className="flex-1 space-y-3 overflow-y-auto">
                <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                  Suggestions du Mentor
                </h4>
                <ul className="space-y-1.5">
                  {analysis.suggestions.map((s, i) => <li key={i} className="text-xs text-slate-700 font-medium">• {s}</li>)}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Right: AI Tutor Chat */}
        <aside className="w-96 flex-shrink-0">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isChatLoading} 
          />
        </aside>

      </main>
    </div>
  );
};

export default App;
