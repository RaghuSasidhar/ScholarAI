
import React from 'react';
import { CubeIcon } from './Icons';

interface SuggestedTopicsProps {
  topics: string[];
  onTopicClick: (topic: string) => void;
}

const SuggestedTopics: React.FC<SuggestedTopicsProps> = ({ topics, onTopicClick }) => {
  return (
    <div className="mt-8 w-full">
      <h3 className="text-lg font-semibold text-slate-300 mb-4 text-center">Or try one of these suggestions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onTopicClick(topic)}
            className="group flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg text-left hover:bg-slate-700/50 transition-colors duration-200"
          >
            <div className="flex-shrink-0 p-2 bg-slate-700/50 rounded-md">
                <CubeIcon className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            </div>
            <span className="text-slate-300 group-hover:text-slate-100 transition-colors">{topic}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedTopics;
