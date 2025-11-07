
import React from 'react';
import { ChatSession } from '../types';
import { PlusIcon, TrashIcon, HistoryIcon } from './Icons';

interface HistoryPanelProps {
  history: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, activeChatId, onSelectChat, onNewChat, onDeleteChat }) => {
  return (
    <div className="flex flex-col bg-slate-800 w-64 h-screen border-r border-slate-700 p-2">
      <div className="flex items-center justify-between p-2 mb-2">
         <div className="flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-200">History</h2>
         </div>
        <button
            onClick={onNewChat}
            className="p-2 rounded-md text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            aria-label="New Chat"
          >
            <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {history.map(chat => (
          <div key={chat.id} className="group relative">
            <button
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-md truncate text-sm transition-colors ${
                activeChatId === chat.id
                  ? 'bg-indigo-600/50 text-white'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <div className="font-medium">{chat.title}</div>
              <div className={`text-xs ${activeChatId === chat.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                {chat.persona}
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
              aria-label="Delete Chat"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
