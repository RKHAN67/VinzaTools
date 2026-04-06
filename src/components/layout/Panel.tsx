import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export const Panel = ({ children, className }: PanelProps) => {
  return <section className={`panel ${className || ''}`}>{children}</section>;
};
