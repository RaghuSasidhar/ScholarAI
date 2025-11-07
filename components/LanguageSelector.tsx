
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, GlobeIcon } from './Icons';

interface LanguageSelectorProps {
  languages: string[];
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, selectedLanguage, onSelectLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (language: string) => {
    onSelectLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
          text-lg font-semibold border-2 bg-slate-800/50 border-slate-600 text-slate-300
          hover:bg-slate-700/50 hover:border-slate-500
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <GlobeIcon className="w-6 h-6" />
          <span>{selectedLanguage}</span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute z-20 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden animate-fade-in-down"
          role="listbox"
        >
          <ul className="max-h-60 overflow-y-auto">
            {languages.map((lang) => (
              <li key={lang}>
                <button
                  onClick={() => handleSelect(lang)}
                  className={`
                    flex items-center w-full text-left gap-3 px-4 py-3 transition-colors duration-150
                    text-slate-300 hover:bg-slate-700/50 text-base
                    ${selectedLanguage === lang ? 'bg-indigo-600/30' : ''}
                  `}
                  role="option"
                  aria-selected={selectedLanguage === lang}
                >
                  <GlobeIcon className="w-5 h-5" />
                  <span>{lang}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LanguageSelector;