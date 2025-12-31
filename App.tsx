
import React, { useState, useEffect, useCallback } from 'react';
import RequirementList from './components/RequirementList';
import CodeEditor from './components/CodeEditor';
import ChatInterface from './components/ChatInterface';
import { ProjectRequirement, ChatMessage, CodeAnalysis } from './types';
import { analyzePythonCode, getTutorHint } from './services/geminiService';

const INITIAL_REQUIREMENTS: ProjectRequirement[] = [
  { id: '1', title: 'Menu interactif (While True)', completed: false, category: 'core' },
  { id: '2', title: 'Ajouter une tâche (Input + List)', completed: false, category: 'core' },
  { id: '3', title: 'Afficher les tâches (Boucle For)', completed: false, category: 'core' },
  { id: '4', title: 'Marquer comme terminée', completed: false, category: 'core' },
  { id: '5', title: 'Supprimer une tâche', completed: false, category: 'core' },
  { id: '6', title: 'Utiliser des Dictionnaires (clé/valeur)', completed: false, category: 'technical' },
  { id: '7', title: 'Gérer les erreurs (Try/Except ou If)', completed: false, category: 'technical' },
  { id: '8', title: 'Recherche par mot-clé', completed: false, category: 'bonus' },
  { id: '9', title: 'Trier par statut', completed: false, category: 'bonus' },
  { id: '10', title: 'Compter les tâches terminées', completed: false, category: 'bonus' },
];

const DEFAULT_CODE = `# Projet: To-Do List Interactive
# Objectif: Gérer une liste de tâches via console

taches = []

def menu():
    print("\\n1. Ajouter une tâche")
    print("2. Afficher les tâches")
    print("3. Terminer une tâche")
    print("4. Supprimer une tâche")
    print("5. Quitter")

while True:
    menu()
    choix = input("Choisissez une option: ")
    
    if choix == "5":
        print("Au revoir!")
        break
    
    # Ajoutez votre code ici...
`;

function App() {
  const [requirements, setRequirements] = useState<ProjectRequirement[]>(INITIAL_REQUIREMENTS);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);

  const toggleRequirement = (id: string) => {
    setRequirements(prev => prev.map(req => 
      req.id === id ? { ...req, completed: !req.completed } : req
    ));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzePythonCode(code);
      setAnalysis(result);
      
      // Auto-update requirements based on AI findings (heuristic)
      setRequirements(prev => prev.map(req => {
        const found = result.conceptsUsed.some(c => 
          c.toLowerCase().includes(req.title.toLowerCase().split(' ')[0])
        );
        return found ? { ...req, completed: true } : req;
      }));
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const tutorResponse = await getTutorHint(text, code, []);
      const aiMsg: ChatMessage = { role: 'model', text: tutorResponse || "Désolé, j'ai eu un problème pour répondre." };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat error", err);
      setMessages(prev => [...prev, { role: 'model', text: "Erreur technique lors de la communication avec le tuteur." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Python To-Do Mentor</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Interactive Learning Platform</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={`https://picsum.photos/seed/${i+10}/64/64`} alt="" />
            ))}
          </div>
          <div className="h-8 w-[1px] bg-slate-200"></div>
          <button 
            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Réinitialiser
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 bg-slate-50">
        
        {/* Left Sidebar: Requirements */}
        <div className="w-1/4 min-w-[300px] flex flex-col gap-6">
          <div className="flex-1 overflow-hidden">
            <RequirementList requirements={requirements} onToggle={toggleRequirement} />
          </div>
          
          {/* Progress Card */}
          <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-200">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-indigo-100">Progression Globale</span>
              <span className="text-2xl font-bold">
                {Math.round((requirements.filter(r => r.completed).length / requirements.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-indigo-800 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(requirements.filter(r => r.completed).length / requirements.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Center: Editor & Analysis */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1">
            <CodeEditor 
              value={code} 
              onChange={setCode} 
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>
          
          {/* Analysis Results */}
          {analysis && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Résultats de l'Analyse
                </h3>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded">Dernière mise à jour: à l'instant</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                    Bugs et Erreurs ({analysis.errors.length})
                  </h4>
                  <ul className="space-y-2">
                    {analysis.errors.length === 0 ? (
                      <li className="text-sm text-slate-500 italic">Aucune erreur détectée. Beau travail !</li>
                    ) : (
                      analysis.errors.map((err, i) => (
                        <li key={i} className="text-sm text-rose-600 flex gap-2">
                          <span className="font-bold">•</span> {err}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    Suggestions ({analysis.suggestions.length})
                  </h4>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((sug, i) => (
                      <li key={i} className="text-sm text-emerald-600 flex gap-2">
                        <span className="font-bold">•</span> {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Chat */}
        <div className="w-1/4 min-w-[320px]">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isChatLoading} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;
