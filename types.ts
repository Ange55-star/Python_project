
export enum TaskStatus {
  IN_PROGRESS = 'En cours',
  COMPLETED = 'Terminée'
}

export interface PythonTask {
  titre: string;
  description: string;
  statut: TaskStatus;
}

export interface ProjectRequirement {
  id: string;
  title: string;
  completed: boolean;
  category: 'core' | 'bonus' | 'technical';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CodeAnalysis {
  errors: string[];
  suggestions: string[];
  conceptsUsed: string[];
}
