import React from 'react';

export default function HeroHeadline() {
  return (
    <div className="mt-8">
      <h1 className="hero-title">PROMPT_ARCHIVE</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <p className="font-mono text-sm">
            A structured workspace for managing and optimizing prompts for coding and learning scenarios.
            Save, compare, and improve your prompts with community-tested structures.
          </p>
        </div>
        <div className="border border-line rounded-md p-4">
          <h3 className="font-mono text-sm uppercase mb-2">Weekly Highlight</h3>
          <p className="font-mono text-xs mb-3">Bug 根因定位助手</p>
          <p className="font-mono text-xs text-muted">
            Turn error logs and code snippets into actionable debugging steps with structured analysis.
          </p>
        </div>
      </div>
    </div>
  );
}