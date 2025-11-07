
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Message, Persona, ChatSession } from './types';
import { fetchLearningResponse, generateRelatedImage } from './services/geminiService';
import { PERSONA_OPTIONS, SUPPORTED_LANGUAGES } from './constants';
import Header from './components/Header';
import PersonaSelector from './components/PersonaSelector';
import ChatInterface from './components/ChatInterface';
import HistoryPanel from './components/HistoryPanel';
import LanguageSelector from './components/LanguageSelector';

function App() {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona>(Persona.ENGINEER);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [error, setError] = useState<string | null>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load chat history from localStorage", e);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    } catch(e) {
        console.error("Failed to save chat history to localStorage", e);
    }
  }, [chatHistory]);

  const activeChatMessages = useMemo(() => {
    if (!currentChatId) return [];
    const activeChat = chatHistory.find(chat => chat.id === currentChatId);
    return activeChat ? activeChat.messages : [];
  }, [currentChatId, chatHistory]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    const userMessage: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
    
    let targetChatId = currentChatId;
    let newHistory = [...chatHistory];

    if (!targetChatId) {
      // Create a new chat session
      const newChat: ChatSession = {
        id: Date.now().toString(),
        title: inputText.length > 40 ? inputText.substring(0, 37) + '...' : inputText,
        persona: selectedPersona,
        messages: [userMessage],
        timestamp: Date.now(),
        language: selectedLanguage,
      };
      newHistory.unshift(newChat);
      targetChatId = newChat.id;
      setCurrentChatId(targetChatId);
    } else {
      // Add message to existing chat and move it to the top
      const chatIndex = newHistory.findIndex(c => c.id === targetChatId);
      if (chatIndex > -1) {
        const updatedChat = {
          ...newHistory[chatIndex],
          messages: [...newHistory[chatIndex].messages, userMessage],
          timestamp: Date.now(),
          persona: selectedPersona, // Ensure persona is updated if changed
          language: selectedLanguage, // Ensure language is updated if changed
        };
        newHistory.splice(chatIndex, 1);
        newHistory.unshift(updatedChat);
      }
    }
    setChatHistory(newHistory);

    try {
      const [aiResponseText, aiImageUrl] = await Promise.all([
          fetchLearningResponse(inputText, selectedPersona, selectedLanguage),
          generateRelatedImage(inputText, selectedLanguage)
      ]);
      
      const aiMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        text: aiResponseText, 
        sender: 'ai',
        imageUrl: aiImageUrl || undefined
      };
      
      setChatHistory(prev => {
        const finalHistory = [...prev];
        const chatIndex = finalHistory.findIndex(c => c.id === targetChatId);
        if (chatIndex > -1) {
          finalHistory[chatIndex].messages.push(aiMessage);
        }
        return finalHistory;
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Error: ${errorMessage}`);
      const aiErrorMessage: Message = { id: (Date.now() + 1).toString(), text: `Sorry, I encountered an error. Please try again.\n\nDetails: ${errorMessage}`, sender: 'ai' };
      
       setChatHistory(prev => {
        const finalHistory = [...prev];
        const chatIndex = finalHistory.findIndex(c => c.id === targetChatId);
        if (chatIndex > -1) {
          finalHistory[chatIndex].messages.push(aiErrorMessage);
        }
        return finalHistory;
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedPersona, selectedLanguage, currentChatId, chatHistory]);

  const handleSelectChat = (id: string) => {
    const chat = chatHistory.find(c => c.id === id);
    if (chat) {
      setCurrentChatId(id);
      setSelectedPersona(chat.persona);
      setSelectedLanguage(chat.language || 'English'); // Fallback for old chats
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setSelectedPersona(Persona.ENGINEER); // Reset to default
    setSelectedLanguage('English');
  };

  const handleDeleteChat = (id: string) => {
    setChatHistory(prev => prev.filter(c => c.id !== id));
    if (currentChatId === id) {
      handleNewChat();
    }
  };
  
  const handlePersonaChange = (persona: Persona) => {
      setSelectedPersona(persona);
      if (currentChatId) {
          // Update persona for the current chat session
          setChatHistory(prev => {
              const chatIndex = prev.findIndex(c => c.id === currentChatId);
              if (chatIndex > -1) {
                  const newHistory = [...prev];
                  newHistory[chatIndex] = { ...newHistory[chatIndex], persona: persona };
                  return newHistory;
              }
              return prev;
          });
      }
  };
  
  const handleLanguageChange = (language: string) => {
      setSelectedLanguage(language);
      if (currentChatId) {
          // Update language for the current chat session
          setChatHistory(prev => {
              const chatIndex = prev.findIndex(c => c.id === currentChatId);
              if (chatIndex > -1) {
                  const newHistory = [...prev];
                  newHistory[chatIndex] = { ...newHistory[chatIndex], language: language };
                  return newHistory;
              }
              return prev;
          });
      }
  };

  const toggleHistory = () => {
    setIsHistoryVisible(prev => !prev);
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {isHistoryVisible && (
        <HistoryPanel
          history={chatHistory}
          activeChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
      )}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onToggleHistory={toggleHistory} />
        <main className="flex-1 flex flex-col items-center w-full pt-4 pb-8 px-4 overflow-hidden">
          <div className="w-full max-w-4xl flex flex-col gap-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-300 text-center mb-2">
                      Who are you today?
                    </h2>
                    <PersonaSelector
                      personas={PERSONA_OPTIONS}
                      selectedPersona={selectedPersona}
                      onSelectPersona={handlePersonaChange}
                    />
                </div>
                 <div>
                    <h2 className="text-lg font-semibold text-slate-300 text-center mb-2">
                      Language
                    </h2>
                    <LanguageSelector
                        languages={SUPPORTED_LANGUAGES}
                        selectedLanguage={selectedLanguage}
                        onSelectLanguage={handleLanguageChange}
                    />
                </div>
             </div>
          </div>
          <ChatInterface
            messages={activeChatMessages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            selectedPersona={selectedPersona}
            key={currentChatId} // Force re-render on chat switch
          />
        </main>
      </div>
    </div>
  );
}

export default App;