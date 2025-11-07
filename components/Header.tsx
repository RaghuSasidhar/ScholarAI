import React from 'react';
import { GraduationCapIcon, MenuIcon } from './Icons';

interface HeaderProps {
    onToggleHistory: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleHistory }) => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleHistory}
            className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            aria-label="Toggle History Panel"
          >
              <MenuIcon className="w-6 h-6" />
          </button>
          <GraduationCapIcon className="w-8 h-8 text-indigo-400" />
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            AI Learning Assistant
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
