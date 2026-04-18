import React from 'react';
import { PromptSeed } from '../../seed/promptSeeds';
import PromptCard from './PromptCard';

interface PromptGridProps {
  prompts: PromptSeed[];
  onSelectPrompt: (prompt: PromptSeed) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export default function PromptGrid({ 
  prompts, 
  onSelectPrompt, 
  favorites, 
  onToggleFavorite 
}: PromptGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {prompts.map(prompt => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onSelect={() => onSelectPrompt(prompt)}
          isFavorite={favorites.includes(prompt.id)}
          onToggleFavorite={() => onToggleFavorite(prompt.id)}
        />
      ))}
    </div>
  );
}