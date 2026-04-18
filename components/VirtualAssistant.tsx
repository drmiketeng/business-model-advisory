import React, { useState, useRef, useEffect } from 'react';
import { getAssistantResponse } from '../services/geminiService';

interface VirtualAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const VirtualAssistant: React.FC<VirtualAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if(isOpen && messages.length === 0) {
        setIsLoading(true);
        setTimeout(() => {
            setMessages([{role: 'model', text: "Hello! I'm the Business Model Assistant. How can I help you with questions about the Corporate Turnaround Centre?"}]);
            setIsLoading(false);
        }, 500)
    }
  }, [isOpen, messages.length])

  if (!isOpen) {
    return null;
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const history = messages.map(msg => ({ role: msg.role, parts: msg.text}));
        const responseText = await getAssistantResponse(history, input);
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col h-[70vh]">
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-slate-800">Business Model Assistant</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-sm ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-slate-200 text-slate-800">
                    <span className="animate-pulse">...</span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>
        <footer className="p-4 border-t">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 200))}
              className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ask about the centre..."
              maxLength={200}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-slate-400">
              Send
            </button>
          </form>
          <p className="text-xs text-slate-400 text-right mt-1">{input.length}/200</p>
        </footer>
      </div>
    </div>
  );
};

export default VirtualAssistant;
