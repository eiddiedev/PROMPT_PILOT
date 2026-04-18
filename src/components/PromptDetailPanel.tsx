import React, { useState } from 'react';
import { PromptSeed } from '../../seed/promptSeeds';
import OptimizePanel from './OptimizePanel';

interface PromptDetailPanelProps {
  prompt: PromptSeed | null;
  isFavorite: boolean;
  onToggleFavorite: (() => void) | undefined;
}

export default function PromptDetailPanel({ 
  prompt, 
  isFavorite, 
  onToggleFavorite 
}: PromptDetailPanelProps) {
  const [showOptimize, setShowOptimize] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!prompt) {
    return (
      <div className="border border-line rounded-md p-4 h-full">
        <h3 className="font-mono text-sm uppercase mb-2">Prompt Details</h3>
        <p className="font-mono text-xs text-muted">
          Select a prompt to view details and optimization options.
        </p>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.prompt);
  };

  return (
    <div className="border border-line rounded-md p-4 h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-mono font-bold">{prompt.title}</h3>
        {onToggleFavorite && (
          <button 
            className="text-muted hover:text-accent transition-colors"
            onClick={onToggleFavorite}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <p className="font-mono text-xs text-muted mb-2">Scenario</p>
        <p className="font-mono text-sm">{prompt.scenario}</p>
      </div>
      
      <div className="mb-4">
        <p className="font-mono text-xs text-muted mb-2">Tags</p>
        <div className="flex flex-wrap gap-2">
          {prompt.tags.map(tag => (
            <span key={tag} className="source-badge">{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="font-mono text-xs text-muted mb-2">Prompt</p>
        <div className="border border-line rounded-md p-3 bg-bg">
          <pre className="font-mono text-xs whitespace-pre-wrap">{prompt.prompt.slice(0, 200)}...</pre>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="font-mono text-xs text-muted mb-2">Source</p>
        <a 
          href={prompt.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-mono text-xs text-accent hover:underline"
        >
          {prompt.sourceLabel}
        </a>
      </div>
      
      <div className="flex gap-2 mt-6">
        <button className="btn btn-outline flex-1" onClick={copyToClipboard}>
          Copy
        </button>
        <button 
          className="btn btn-accent flex-1"
          onClick={() => setShowOptimize(!showOptimize)}
        >
          {showOptimize ? 'Cancel' : 'Optimize'}
        </button>
      </div>
      
      {showOptimize && (
        <OptimizePanel 
          prompt={prompt}
          feedback={feedback}
          onFeedbackChange={setFeedback}
        />
      )}
    </div>
  );
}