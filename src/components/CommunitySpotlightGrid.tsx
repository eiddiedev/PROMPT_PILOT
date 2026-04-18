import React from 'react';
import { CommunitySpotlight } from '../../seed/promptSeeds';

interface CommunitySpotlightGridProps {
  spotlights: CommunitySpotlight[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
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

export default function CommunitySpotlightGrid({ 
  spotlights, 
  favorites, 
  onToggleFavorite 
}: CommunitySpotlightGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {spotlights.map(spotlight => (
        <div key={spotlight.id} className="border border-line rounded-md p-4">
          <div className="flex justify-between items-start">
            <span className="source-badge">{getCategoryLabel(spotlight.category)}</span>
            <button 
              className="text-muted hover:text-accent transition-colors"
              onClick={() => onToggleFavorite(spotlight.id)}
            >
              {favorites.includes(spotlight.id) ? '★' : '☆'}
            </button>
          </div>
          <h3 className="font-mono font-bold mt-3 mb-2">{spotlight.title}</h3>
          <p className="font-mono text-xs text-muted mb-3">{spotlight.recommendedFor}</p>
          <p className="font-mono text-xs mb-4">{spotlight.comparisonSummary}</p>
          <div className="border-t border-line pt-3">
            <div className="flex justify-between items-center">
              <a 
                href={spotlight.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-xs text-accent hover:underline"
              >
                {spotlight.sourceLabel}
              </a>
              <span className="source-badge">Community</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}