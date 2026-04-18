import React from 'react';
import { PromptSeed } from '../../seed/promptSeeds';

interface PromptCardProps {
  prompt: PromptSeed;
  onSelect: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'codegen': return 'Code Gen';
    case 'debug': return 'Debug';
    case 'study': return 'Study';
    case 'interview': return 'Interview';
    default: return category;
  }
};

export default function PromptCard({ 
  prompt, 
  onSelect, 
  isFavorite, 
  onToggleFavorite 
}: PromptCardProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.prompt);
  };

  return (
    <div className="prompt-card cursor-pointer" onClick={onSelect}>
      <div className="flex justify-between items-start">
        <span className="source-badge">{getCategoryLabel(prompt.category)}</span>
        <button 
          className="text-muted hover:text-accent transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <h3 className="font-mono font-bold mt-3 mb-2">{prompt.title}</h3>
      <p className="font-mono text-xs text-muted mb-4">{prompt.summary}</p>
      <div className="flex justify-between items-center">
        <div className="data-row">
          <span>Tags: {prompt.tags.slice(0, 2).join(', ')}{prompt.tags.length > 2 ? '...' : ''}</span>
        </div>
        <button 
          className="text-xs font-mono text-muted hover:text-accent transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard();
          }}
        >
          Copy
        </button>
      </div>
    </div>
  );
}