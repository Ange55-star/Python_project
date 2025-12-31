
export type Category = 'core' | 'technical' | 'bonus';

export interface ProjectRequirement {
  id: string;
  title: string;
  completed: boolean;
  category: Category;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CodeAnalysis {
  errors: string[];
  suggestions: string[];
  conceptsUsed: string[];
  completedRequirementIds: string[];
}
