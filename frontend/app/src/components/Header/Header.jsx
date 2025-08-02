import React from 'react';
import { GithubIcon, BrainCircuitIcon } from 'lucide-react';
import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <GithubIcon className="icon-large" />
          <span className="header-title">GitAbsorber</span>
        </div>
        <div className="header-right">
          <BrainCircuitIcon className="icon-small" />
          <span>Powered by AI</span>
        </div>
      </div>
    </header>
  );
}
