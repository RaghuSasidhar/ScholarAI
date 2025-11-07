
import React from 'react';
import { Message } from '../types';
import { UserIcon, GraduationCapIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

// A simple utility to render text with markdown-like bold and code blocks
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\n)/g).filter(part => part);

  return (
    <div className="text-base text-slate-300 whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="text-slate-100">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={index} className="bg-slate-900 text-cyan-400 rounded px-1.5 py-0.5 font-mono text-sm">{part.slice(1, -1)}</code>;
        }
        if (part === '\n') {
            return <br key={index} />;
        }
        // Replace markdown headers
        if (part.startsWith('# ')) return <h2 key={index} className="text-2xl font-bold mt-4 mb-2 text-slate-100">{part.substring(2)}</h2>
        if (part.startsWith('## ')) return <h3 key={index} className="text-xl font-bold mt-3 mb-1 text-slate-200">{part.substring(3)}</h3>
        if (part.startsWith('### ')) return <h4 key={index} className="text-lg font-bold mt-2 mb-1 text-slate-300">{part.substring(4)}</h3>
        
        // Replace markdown list items
        if (part.trim().startsWith('- ')) return <li key={index} className="ml-5 list-disc">{part.trim().substring(2)}</li>
        
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const avatar = isUser ? (
    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
      <UserIcon className="w-5 h-5 text-slate-300" />
    </div>
  ) : (
    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
      <GraduationCapIcon className="w-5 h-5 text-white" />
    </div>
  );

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && avatar}
      <div
        className={`max-w-2xl rounded-xl ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-slate-700 text-slate-200 rounded-bl-none'
        } ${message.imageUrl && !isUser ? 'overflow-hidden' : 'px-4 py-3'}`}
      >
        {message.imageUrl && !isUser && (
            <img 
                src={message.imageUrl} 
                alt={`Visual for ${message.text.substring(0, 30)}...`} 
                className="w-full h-auto object-cover"
            />
        )}
        <div className={message.imageUrl && !isUser ? 'p-4' : ''}>
            <FormattedText text={message.text} />
        </div>
      </div>
      {isUser && avatar}
    </div>
  );
};

export default ChatMessage;