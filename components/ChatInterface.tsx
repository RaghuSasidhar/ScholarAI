
import React, { useState, useRef, useEffect } from 'react';
import { Message, Persona } from '../types';
import ChatMessage from './ChatMessage';
import { SendIcon, SparklesIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';
import { SUGGESTED_TOPICS } from '../constants';
import SuggestedTopics from './SuggestedTopics';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  selectedPersona: Persona;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage, selectedPersona }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [inputText]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl h-full mt-4 bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <SparklesIcon className="w-16 h-16 mb-4 text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-200">Welcome to LearnAI!</h2>
            <p className="max-w-md mt-2">
              Select your field, start a new chat, and ask me anything.
            </p>
            <SuggestedTopics 
              topics={SUGGESTED_TOPICS[selectedPersona]} 
              onTopicClick={onSendMessage}
            />
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
        {isLoading && (
          <div className="flex justify-start items-center p-4">
              <LoadingSpinner />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <form onSubmit={handleSubmit} className="flex items-end gap-3 bg-slate-900 rounded-xl p-2 border border-slate-600 focus-within:border-indigo-500 transition-colors">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none resize-none max-h-40"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-indigo-600 text-white rounded-lg p-2 disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
