import React from 'react';

interface ShellFrameProps {
  children: React.ReactNode;
}

export default function ShellFrame({ children }: ShellFrameProps) {
  return (
    <div className="shell-frame">
      {children}
    </div>
  );
}