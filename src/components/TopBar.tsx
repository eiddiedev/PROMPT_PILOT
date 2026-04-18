import React from 'react';

export default function TopBar() {
  return (
    <div className="flex justify-between items-center border-b border-line pb-4">
      <div className="font-display text-xl font-bold uppercase">
        PromptPilot / Trae Prompt Lab
      </div>
      <div className="flex gap-4">
        <nav className="hidden md:flex gap-6">
          <a href="#" className="font-mono text-sm hover:text-accent">Library</a>
          <a href="#" className="font-mono text-sm hover:text-accent">Community</a>
          <a href="#" className="font-mono text-sm hover:text-accent">About</a>
        </nav>
        <button className="btn btn-accent">OPEN LIBRARY</button>
      </div>
    </div>
  );
}