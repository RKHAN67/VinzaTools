import React from 'react';

interface PageHeroProps {
  children: React.ReactNode;
  className?: string;
}

export const PageHero = ({ children, className }: PageHeroProps) => {
  return <section className={`page-hero ${className || ''}`}>{children}</section>;
};
