import React from 'react';

interface BeforeAfterDiffProps {
  before: string;
  after: string;
}

export default function BeforeAfterDiff({ before, after }: BeforeAfterDiffProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border border-line rounded-md p-3 bg-bg">
        <h6 className="font-mono text-xs uppercase mb-2 text-muted">Before</h6>
        <pre className="font-mono text-xs whitespace-pre-wrap max-h-32 overflow-auto">{before}</pre>
      </div>
      <div className="border border-line rounded-md p-3 bg-bg">
        <h6 className="font-mono text-xs uppercase mb-2 text-accent">After</h6>
        <pre className="font-mono text-xs whitespace-pre-wrap max-h-32 overflow-auto">{after}</pre>
      </div>
    </div>
  );
}