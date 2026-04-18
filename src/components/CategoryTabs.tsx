import React from 'react';

type PromptCategory = "codegen" | "debug" | "study" | "interview" | 'all';

interface CategoryTabsProps {
  selectedCategory: PromptCategory;
  onCategoryChange: (category: PromptCategory) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const categories: { value: PromptCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'codegen', label: 'Code Gen' },
  { value: 'debug', label: 'Debug' },
  { value: 'study', label: 'Study' },
  { value: 'interview', label: 'Interview' },
];

export default function CategoryTabs({ 
  selectedCategory, 
  onCategoryChange, 
  searchTerm, 
  onSearchChange 
}: CategoryTabsProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-8">
      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <button
            key={category.value}
            className={`category-tab ${selectedCategory === category.value ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className="w-full md:w-64">
        <input
          type="text"
          placeholder="Search prompts..."
          className="w-full px-3 py-2 border border-line rounded-md font-mono text-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}