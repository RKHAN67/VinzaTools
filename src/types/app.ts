export type ToolCategory = 'creative' | 'developer' | 'pdf' | 'image' | 'media' | 'text';

export type PageKey =
  | 'home'
  | 'tools'
  | 'themes'
  | 'team'
  | 'contact'
  | 'blog'
  | 'about'
  | 'policy'
  | 'terms'
  | 'cookies'
  | 'admin';

export type ContactTab = 'general' | 'tool' | 'feedback';

export type ShowcaseTab = 'all' | 'workflows' | 'organize' | 'optimize' | 'convert' | 'edit' | 'security' | 'intelligence';

export type ToolContext = {
  toolId: string;
  subAction?: string;
};

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: any;
  parentId?: string;
  subAction?: string;
}
